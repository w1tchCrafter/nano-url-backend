import mongoose from "mongoose";

export default async function connectDatabase(uri) {
    mongoose.connect(uri);
}