import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

let articleList

export default class ArticleDAO {
    static async injectDB(conn) {
        if (articleList) {
            return;
        }

        try {
            articleList = await conn.db(process.env.TAKREVIEWS_NS).collection("articles");
        } catch (e) {
            console.error(`Unable to establish a collection handle in articleDAO, ${e}`);
        }
    }

    static async getArticles({
        page = 0,
        articlesPerPage = 20,
    } = {}){
        let cursor = articleList;
        const displayCursor = cursor.limit(articlesPerPage).skip(page * articlesPerPage);

        try {
            const articles = await displayCursor.toArray();
            const totalNumArticles = await articleList.countDocuments();

            return {articles, totalNumArticles};
        } catch (e) {
            console.error(`Unable to retrieve articles, ${e}`);
            return {articles: [], totalNumArticles: 0};
        }
    }

    static async getArticleByTitle(title) {
        let query = {$text: {$search: title}};

        try {
            return await articleList.find(query);
        } catch (e) {
            console.log(`Unable to retrieve specified article, ${e}`);
            throw e;
        }
    }

    static async addArticle(title, body, date) {
        const articleDoc = {
            title: title,
            text: body,
            date: date
        };

        try {
            return await articleList.insertOne(articleDoc);
        } catch (e) {
            console.error(`Unable to post article, ${e}`);
            return {error : e};
        }
    }
}