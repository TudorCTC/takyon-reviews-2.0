import ReviewDAO from "../dao/reviewDAO.js"

export default class ReviewController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const movieTitle = req.body.movie_title;
            const review = req.body.text;
            const date = new Date();
            console.log(req.body);

            const reviewResponse = await ReviewDAO.addReview(
                movieId,
                movieTitle,
                review,
                date,
            );
            
            res.json({status: "success"});
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetReviews(req, res, next) {
        const reviewsPerPage = req.query.reviewsPerPage? parseInt(req.query.reviewsPerPage, 10) : 20;
        const page = req.query.page? parseInt(req.query.page, 10) : 0;

        const { reviewList, totalNumReviews } = await MovieDAO.getMovies({page, reviewsPerPage});

        let response = {
            reviews: reviewList,
            page: page,
            filters: filters,
            entries_per_page: reviewsPerPage,
            total_results: totalNumReviews,
        }
        res.json(response);
    }

    static async apiGetReviewByTitle(req, res, next) {
        const movieTitle = req.params.movieTitle || {};

        try {
            let review = await ReviewDAO.getReviewByTitle(movieTitle);
            if (!review) {
                res.status(500).json({error: "Not found"});
                return;
            }
            res.json(review);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error : e.message});
        }
    }
}