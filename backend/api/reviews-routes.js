import express from "express";
import ArticleController from "./article-controller.js"
import CommentController from "./comment-controller.js";
import MovieController from "./movie-controller.js";
import ReviewController from "./review-controller.js";

const router = express.Router();

// get movie list, genres, individual movie, add movie
router.route("/movies-list").get(MovieController.apiGetMovies);
router.route("/movies-list/genres").get(MovieController.apiGetMovieGenres);
router.route("/movies-list/:id").get(MovieController.apiGetMovieById);
router.route("/movies-list").post(MovieController.apiPostMovie);

// get review list, individual review, add review
router.route("/reviews").get(ReviewController.apiGetReviews);
router.route("/reviews/:movieTitle").get(ReviewController.apiGetReviewByTitle);
router.route("/reviews").post(ReviewController.apiPostReview);

// get article list, individual article, add article
router.route("/articles").get(ArticleController.apiGetArticles);
router.route("/articles/:articleTitle").get(ArticleController.apiGetArticleByTitle);
router.route("/articles").post(ArticleController.apiPostArticle);

// get comments
router.route("/comments/:postId").get(CommentController.apiGetCommentsByPostId);
router.route("/comments").post(CommentController.apiPostComment);

export default router