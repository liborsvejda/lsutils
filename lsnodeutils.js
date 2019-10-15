const http = require("http");
const url = require("url");
const fs = require("fs");

exports.fileRequested = function(res, req) {
    let q = url.parse(req.url, true);
    let fileName = q.pathname;
    console.log(`fileName=${fileName}`);
    if (fileName == "/") {
        fileName = "/index.html";
    }
    if (fileName.lastIndexOf(".") < 0 || fileName.lastIndexOf(".") < fileName.length - 6) { //pozadavek nema priponu souboru
        return false;
    }
    if (fileName.charAt(0) === '/') {
        fileName = fileName.substr(1);
    }
    if (!fs.existsSync(fileName)) {
        console.log("### not exists");
        // res.writeHead(404);
        // res.end();
        return false;
    }
    let contentType = "application/octet-stream";
    if (fileName.toLowerCase().endsWith(".html")) {
        contentType = "text/html";
    } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else if (fileName.toLowerCase().endsWith(".png")) {
        contentType = "image/png";
    } else if (fileName.toLowerCase().endsWith(".pdf")) {
        contentType = "application/pdf"
    };
    let file = fs.createReadStream(fileName);
    file.on('open', function () {
        res.writeHead(200, {'Content-Type': contentType});
        file.pipe(res);
    });
    file.on('end', function () {
        res.end();
    });
    file.on('error', function () {
        console.log("### error");
        res.writeHead(500);
        res.end();
    });
    return true;
}

