import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MovieDAO from "./dao/movieDAO.js";
import ReviewDAO from "./dao/reviewDAO.js";
import CommentDAO from "./dao/commentDAO.js";
import ArticleDAO from "./dao/articleDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.TAKREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true, 
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await MovieDAO.injectDB(client);
        await ReviewDAO.injectDB(client);
        await CommentDAO.injectDB(client);
        await ArticleDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    });