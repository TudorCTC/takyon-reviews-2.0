import MovieDAO from "../dao/movieDAO.js"

export default class MovieController {
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage? parseInt(req.query.moviesPerPage, 10) : 20;
        const page = req.query.page? parseInt(req.query.page, 10) : 0;
        
        let filters = {};
        if (req.query.genre) {
            filters.genre = req.query.genre;
        }

        const { moviesList, totalNumMovies } = await MovieDAO.getMovies({filters, page, moviesPerPage});

        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        console.log(moviesList);
        console.log(totalNumMovies);
        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};
            let movie = await MovieDAO.getMovieById(id);
            if (!movie) {
                res.status(500).json({error : "Not Found"});
                return;
            }
            console.log(movie);
            res.json(movie);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error : e});
        }
    }

    static async apiGetMovieGenres(req, res, next) {
        try {
            let genres = await MovieDAO.getGenres();
            res.json(genres);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error : e});
        }
    }

    static async apiPostMovie(req, res, next) {
        const movieTitle = req.body.movie_title;
        const rating = req.body.rating;

        try {
            const movieResponse = await MovieDAO.addMovie(
                movieTitle,
                rating
            );

            res.json({status: "success"});
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }
}