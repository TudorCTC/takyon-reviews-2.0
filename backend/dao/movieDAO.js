import mongodb from "mongodb";
import axios from "axios";

const ObjectId = mongodb.ObjectId;
let movies

export default class MovieDAO {
    static async injectDB(conn) {
        if (movies) {
            return;
        }

        try {
            movies = await conn.db(process.env.TAKREVIEWS_NS).collection("movies");
        } catch (e) {
            console.error(`Unable to establish a collection handle in moviesDAO: ${e}`);
        }
    }

    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("title" in filters) {
                query = {$text: {$search: filters["title"] } };
            } else if ("genre" in filters) {
                query = {"genres": filters["genre"]};
            }
        }

        let cursor

        try {
            cursor = await movies.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }

        const displayCursor = cursor.limit(moviesPerPage).skip(page * moviesPerPage);
        try {
            var moviesList = await displayCursor.toArray();
            console.log(moviesList);
            const totalNumMovies = await movies.countDocuments(query);

            return { moviesList, totalNumMovies }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }
    }

    static async getMovieById(id) {
        let query = {_id: new ObjectId(id)};
        
        try {
            return await movies.findOne(query);
        } catch (e) {
            console.error(`Unable to retrieve the specified movie, ${e}`);
            throw e;
        }
    }

    static async getGenres() {
        let genres = [];
        try {
            let genresRequest = await movies.aggregate([
                {
                  '$project': {
                    '_id': 0, 
                    'allGenres': {
                      '$setUnion': '$genres'
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$allGenres'
                  }
                }, {
                  '$group': {
                    '_id': 0, 
                    'genres': {
                      '$addToSet': '$allGenres'
                    }
                  }
                }
              ]).next();
            console.log(genresRequest);
            return genresRequest;
        } catch (e) {
            console.error(`Unable to get genres, ${e}`);
            return genres;
        }
    }

    static async addMovie(movieTitle, userRating) {
        
        var movieDoc = {};
        let omdbData = axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${movieTitle}`)
            .then((response) => {
                console.log(response.data);
                try {
                    movieDoc = {
                        title: response.data.Title,
                        year: response.data.Year,
                        runtime: response.data.Runtime,
                        director: response.data.Director,
                        genres: response.data.Genre.split(", ", 4),
                        imdb_rating: parseFloat(response.data.imdbRating),
                        my_rating: userRating,
                        poster: response.data.Poster,
                    }

                    return movies.insertOne(movieDoc);
                } catch (e) {
                    console.log(`Unable to add movie to the database, ${e}`);
                    return {error: e};
                }
            })
            .catch((e) => {
                console.error(`Unable to contact OMDB API, ${e}`);
                return {error : e};
            });
    }
}