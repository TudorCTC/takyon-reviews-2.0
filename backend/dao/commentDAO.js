import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let comments

export default class CommentDAO {
    static async injectDB(conn) {
        if (comments) {
            return;
        }

        try {
            comments = await conn.db(process.env.TAKREVIEWS_NS).collection("comments");
        } catch (e) {
            console.error(`Unable to establish collection handle in commentDAO, ${e}`);
        }
    }

    static async getCommentsByPostId(postId) {
        let query = {post_id: new ObjectId(postId)};

        try {
            return await comments.find(query);
        } catch (e) {
            console.error(`Unable to retrieve comments for the specified post, ${e}`);
            throw e;
        }
    }

    static async addComment(postId, username, comment, date) {
        const commentDoc = {
            post_id: postId,
            name: username,
            text: comment,
            date: date
        }
        
        try {
            return await comments.insertOne(commentDoc);
        } catch (e) {
            console.error(`Unable to add comment, ${e}`);
            throw e;
        }
    }
}