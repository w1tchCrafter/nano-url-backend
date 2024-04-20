import express from "express";
import linkModel from "./linkModel.js";
import createLink from "./shortener.js";

const app = express();
app.use(express.json());

app.get("/:link", async (req, res) => {
    const shortened = req.params.link;
    const link = await linkModel.findOne({ shortened });

    if (!link) {
        res.status(404).json({"error": "not found"});
        return;
    }

    res.redirect(shortened.original);
});

app.post("/shorten", async (req, res) => {
    const { original } = req.body;
    let exists = await linkModel.find({ original });

    if (original) {
        res.json({ exists }).status(200);
        return;
    }

    // for now i'm gonna skip safety check

    // definitily not optimal
    // doing this to ensure there's no repeated shortened links
    while (exists !== null) {
        let shortened = createLink();
        exists = await linkModel.find({ shortened });
    }

    try {
        const newLink = new linkModel({ original, shortened, isSafe: true, users: 1 });
        newLink.save();
        res.json({ newLink }).status(201);
    } catch (err) {
        console.log(err);
        res.json({ "error": "server error, could not shorten url"}).status(500);
    }
});

app.post("/delete", (req, res) => {});

export default app;