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

        const { reviews, totalNumReviews } = await ReviewDAO.getReviews({page, reviewsPerPage});

        let response = {
            reviews: reviews,
            page: page,
            entries_per_page: reviewsPerPage,
            total_results: totalNumReviews,
        }
        console.log(reviews);
        res.json(response);
    }

    static async apiGetReviewByTitle(req, res, next) {
        const movieTitle = req.params.movieTitle.replace(/-/g, ' ') || {};
        console.log(movieTitle);

        try {
            let review = await ReviewDAO.getReviewByTitle(movieTitle);
            if (!review) {
                res.status(500).json({error: "Not found"});
                return;
            }
            console.log(review[0]);
            res.json(review[0]);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error : e.message});
        }
    }
}