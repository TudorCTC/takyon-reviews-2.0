import express from "express"
import cors from "cors"
import router from "./api/reviews-routes.js"

const app = express();

app.use(cors());
app.use(express.json())

// specify the routes
app.use("/api/takyon-reviews", router);
app.use("*", (req, res) => res.status(404).json({ error: "not found"}));

export default app