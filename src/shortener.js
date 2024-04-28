import { nanoid } from "nanoid";
import { get } from "https";

export function createLink() {
  return nanoid(5);
}

/**
 * @param {string} url
 * @returns { Promise<boolean> }
 */
export async function isReachable(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) resolve(true);
      else resolve(false);
    }).on("error", (err) => {
      reject(err);
    });
  });
}
