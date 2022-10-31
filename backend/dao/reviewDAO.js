import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

let reviewList

export default class ReviewDAO {
    static async injectDB(conn) {
        if (reviewList) {
            return;
        }

        try {
            reviewList = await conn.db(process.env.TAKREVIEWS_NS).collection("reviews");
        } catch (e) {
            console.error(`Unable to establish collection handle in ReviewDAO, ${e}`);
        }
    }

    static async getReviews({
        page = 0,
        reviewsPerPage = 0,
    } = {}) {
        let cursor = await reviewList.find();
        const displayCursor = cursor.limit(reviewsPerPage).skip(page * reviewsPerPage);

        try {
            const reviews = await displayCursor.toArray();
            const totalNumReviews = await reviewList.countDocuments();

            return {reviews, totalNumReviews};
        } catch (e) {
            console.error(`Unable to retrieve articles, ${e}`);
            return {reviews: [], totalNumReviews: 0};
        }
    }

    static async getReviewByTitle(movieTitle) {
        let query = {"movie_title" : movieTitle};

        try {
            return await reviewList.find(query).toArray();
        } catch (e) {
            console.log(`Unable to retrieve specified review, ${e}`);
            throw e;
        }
    }

    static async addReview(movieId, movieTitle, review, date) {
        try {
            const reviewDoc = {
                movie_id: ObjectId(movieId),
                movie_title: movieTitle,
                text: review,
                date: date
            }

            return await reviewList.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error : e };
        }
    }
}