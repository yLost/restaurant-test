/**
 * Source code in https://github.com/simonh1000/angular-http-server
 * Made by simonh1000
 */

const fs = require("fs");
const path = require("path");
const mime = require("mime");
const http = require("http");
const opn = require("opn");

const argv = require("minimist")(process.argv.slice(2));

// Pre-process arguments
const basePath = path.resolve('./dist/site');
const baseHref = argv.baseHref ? argv.baseHref : '';
const rootFile = argv.rootFile ? argv.rootFile : 'index.html';
const port = 4001;

const NO_PATH_FILE_ERROR_MESSAGE =
    `Error: rootFile ${rootFile} could not be found in the specified path `;

// if using config file, load that first
if (argv.config) {
    let configPath;
    if (path.isAbsolute(argv.config)) {
        configPath = argv.config;
    } else {
        configPath = path.join(process.cwd(), argv.config);
    }
    const getConfig = require(configPath);
    let config;
    if (typeof getConfig === "function") {
        config = getConfig(argv);
    } else {
        config = getConfig;
    }
    // supplement argv with config, but CLI args take precedence
    argv = Object.assign(config, argv);
}

// As a part of the startup - check to make sure we can accessrootFile 
returnDistFile();

// Start with/without https
let server = http.createServer(requestListener);
start();

function start() {
    server.listen(port, function () {
        if (argv.open == true || argv.o) {
            opn("http://localhost:" + port);
        }
        return console.log("Listening on " + port);
    });
}

// HELPERS

function requestListener(req, res) {
    // Add CORS header if option chosen
    if (argv.cors) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Method", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "authorization, content-type"
        );
        // When the request is for CORS OPTIONS (rather than a page) return just the headers
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }
    }

    const safeFullFileName = getFilePathFromUrl(req.url, basePath, { baseHref });

    fs.stat(safeFullFileName, function (err, stats) {
        let fileBuffer;
        if (!err && stats.isFile()) {
            fileBuffer = fs.readFileSync(safeFullFileName);
            let ct = mime.lookup(safeFullFileName);
            res.writeHead(200, { "Content-Type": ct });
        } else {
            fileBuffer = returnDistFile();
            res.writeHead(200, { "Content-Type": "text/html" });
        }

        res.write(fileBuffer);
        res.end();
    });
}


function returnDistFile() {
    let distPath;

    try {
        distPath = path.join(basePath, rootFile);
        return fs.readFileSync(distPath);
    } catch (e) {
        console.warn(NO_PATH_FILE_ERROR_MESSAGE + "%s", basePath);
        process.exit(1);
    }
}

/**
 * Safely get the path for a file in the project directory, or reject by returning "dummy"
 *
 * @param {string} url
 * @param {string} basePath - absolute path to base directory
 * @param {object} [pathLib=path] - path library, override for testing
 * @return {string} - will return 'dummy' if the path is bad
 */
function getFilePathFromUrl(url, basePath, { pathLib = path, baseHref = '' } = {}) {
    if (!basePath) {
        throw new Error('basePath must be specified');
    }
    if (!pathLib.isAbsolute(basePath)) {
        throw new Error(`${basePath} is invalid - must be absolute`);
    }

    // we are not interested in query params
    // TODO also filter out hash routes
    let relativePath = url.split('?')[0];

    if (relativePath.indexOf('../') > -1) {
        // any path attempting to traverse up the directory should be rejected
        return 'dummy';
    }

    if (baseHref) {
        if (relativePath.startsWith('/' + baseHref)) {
            relativePath = relativePath.substr(baseHref.length + 1)
        } else {
            return 'dummy'
        }
    }

    const absolutePath = pathLib.join(basePath, relativePath);
    if (
        !absolutePath.startsWith(basePath) || // if the path has broken out of the basePath, it should be rejected
        absolutePath.endsWith(pathLib.sep) // only files (not folders) can be served
    ) {
        return 'dummy';
    }

    return absolutePath;
}