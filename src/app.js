import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import linkModel from "./linkModel.js";
import { createLink, isReachable } from "./shortener.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

app.get("/:link", (req, res) => {
    const shortened = req.params.link;

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
    const { original } = req.body;

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

                    newLink.save();
                    res.json(newLink);
                } catch(err) {
                    res.status(500).json({"error": err});
                    console.error(err);
                }
            } else {
                res.status(200).json(doc);
                res.end();
            }
        })
        .catch(err => {
            res.status(500).json({"error": "server error"});
            console.error(err);
        });
});

app.post("/delete", (req, res) => {});

export default app;