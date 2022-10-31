import CommentDAO from "../dao/commentDAO.js";

export default class CommentController {
    static async apiPostComment(req, res, next) {
        try {
            const postId = req.body.postId;
            const name = req.body.name;
            const comment = req.body.comment;
            const date = new Date();

            const commentResponse = await CommentDAO.addComment(
                postId,
                name,
                comment,
                date,
            );

            res.json({status: "success"});
        } catch (e) {
            console.log(`api, ${e}`);
            res.json(500).json({error : e});
        }
    }

    static async apiGetCommentsByPostId(req, res, next) {
        let postId = req.params.postId || {};
        console.log(postId);
        try {
            let comments = await CommentDAO.getCommentsByPostId(postId);
            console.log(comments);
            res.json(comments);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }
}