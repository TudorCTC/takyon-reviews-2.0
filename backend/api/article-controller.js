import ArticleDAO from "../dao/articleDAO.js"

export default class ArticleController {
    static async apiGetArticles(req, res, next) {
        const articlesPerPage = req.query.articlesPerPage ? parseInt(req.query.articlesPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        try {
            const {articles, totalNumArticles} = await ArticleDAO.getArticles({articlesPerPage, page});

            let response = {
                articles: articles,
                page: page,
                entries_per_page: articlesPerPage,
                total_results: totalNumArticles,
            };
            res.json(response);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }

    static async apiGetArticleByTitle(req, res, next) {
        const articleTitle = req.params.articleTitle.replace(/-/g, ' ') || {};

        try {
            let article = await ArticleDAO.getArticleByTitle(articleTitle);
            if (!article) {
                res.status(500).json({error: "Not Found"});
                return;
            }
            console.log(article[0]);
            res.json(article[0]);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error : e});
        }
    }

    static async apiPostArticle(req, res, next) {
        const title = req.body.title;
        const text = req.body.text;
        console.log(title);
        console.log(text);
        const date = new Date();

        try {
            const articleResponse = ArticleDAO.addArticle(
                title,
                text,
                date,
            );

            res.json({status: "success"});
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }
}