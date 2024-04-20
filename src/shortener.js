import { createHash } from "crypto";

export default function createLink(input) {
    const hash = createHash("sha256").update(input).digest();
    const base64 = Buffer.from(hash, "utf-8").toString("base64");

    return base64.slice(0, 4).toString();
}
