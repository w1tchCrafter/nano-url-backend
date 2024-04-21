import { nanoid } from "nanoid";
import { get } from "https";

export function createLink() {
    return nanoid(5);
}

export async function isReachable(url) {
    return new Promise((resolve, reject) => {
        get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) resolve(true);
            else resolve(false);
        })
        .on("error", (err) => {
            reject(err);
        });
    });
}
