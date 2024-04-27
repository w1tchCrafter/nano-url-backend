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
    })
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * @param { import("express").Request } req
 * @param { import("express").Response } res
 * @returns { void }
 */
// export function setCookieValue(req, res, data) {
//   const cookie = req.cookies.nanourl ? JSON.parse(req.cookies.nanourl) : [];
//   cookie.push(data);
//   const updatedData = JSON.stringify(cookie);

//   console.log(updatedData);
//   res.cookie("nanourl", updatedData, { httpOnly: true, secure: false });
// }

/**
 * @param { import("express").Request } req
 * @param { import("express").Response } res
 * @returns { void }
 */
// export function deleteCookieValue(req, res, data) {
//   const cookie = req.cookies.nanourl ? JSON.parse(req.cookies.nanourl) : [];

//   if (cookie.length === 0) {
//     res.status(400).json({ "error": "you have no saved links" });
//     return;
//   }

//   const indexToDelete = cookie.findIndex((i) => i.shortened === data);
//   if (indexToDelete !== -1) cookie.splice(indexToDelete, 1);

//   const updatedData = JSON.stringify(cookie);
//   console.log(updatedData);
//   res.status(200).cookie("nanourl", updatedData, {
//     httpOnly: true,
//     secure: false,
//   }).end();
// }
