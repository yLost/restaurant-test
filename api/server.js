const http = require("http");
const port = process.env.PORT || 80;

const { init, app } = require("./app.js");

async function main() {
    await init();
    const server = http.createServer(app);
    server.listen(port, () => console.log(`[Server] Running at port: ${port}`));
}

main();