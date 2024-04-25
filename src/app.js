import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import linkModel from "./linkModel.js";
import { createLink, isReachable, setCookieValue, deleteCookieValue } from "./shortener.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(cookieParser());

app.get("/:shortened", (req, res) => {
    const { shortened } = req.params;
    const whitelist = /^[A-Za-z0-9_-]+$/;

    if (!whitelist.test(shortened)) {
        res.status(400).json({"error":"bad request"});
        return;
    }
    
    linkModel.findOne({ shortened })
        .then(doc => {
            if (doc) res.redirect(doc.original);
            else res.status(404).json({"error": "not found"});
        })
        .catch(err => {
            res.status(500).json({"error": "server error"});
            res.end();
            console.error(err);
        });
});

app.post("/shorten", (req, res) => {
    const { original, cookie } = req.body;

    linkModel.findOne({ original })
        .then(async doc => {
            if (!doc) {
                try {
                    let isvalid = await isReachable(original);

                    if (!isvalid) {
                        res.status(400).json({ "error": "host is unreachable"})
                        res.end();
                        return;
                    }

                    let shortened = createLink();
                    let newLink = new linkModel({ original, shortened, isSafe: true, users: 1 });

                    await newLink.save();
                    if (cookie) setCookieValue(req, res, {original, shortened});
                    res.json(newLink);
                } catch(err) {
                    res.status(500).json({"error": err});
                    console.error(err);
                }
            } else {
                let { shortened } = doc;
                if (cookie) setCookieValue(req, res, {original, shortened});
                res.status(200).json(doc);
                res.end();
            }
        })
        .catch(err => {
            res.status(500).json({"error": "server error"});
            console.error(err);
        });
});


app.post("/delete", (req, res) => {
    const { shortened } = req.body;
    deleteCookieValue(req, res, shortened);
});

export default app;