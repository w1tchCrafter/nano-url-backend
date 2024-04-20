import app from "./app.js";

async function main() {
    app.listen(3000, () => console.log("Server listening..."));
}

main();