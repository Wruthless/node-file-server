const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

function serve(rootDirectory, port) {
    let server = new http.Server();
    server.listen(port);
    console.log("Listning on port ", port);

    // Handles the requests.
    server.on("request", (request, response) => {
        let endpoint = url.parse(request.url).pathname;

        // Debugging endpoint, send back request.
        if(endpoint === "/test/mirror") {
            // Set Response header
            response.setHeader("Content-Type", "text/plain; charset=UTF-8");
            // Statuc code
            response.writeHead(200);
            // Repond with request first.
            response.write(`${request.method} ${request.url} HTTP/${
                request.httpVersion
            }\r\n`);

            // Ouput the request headers.
            let headers = request.rawHeaders;
            for (let i = 0; i < headers.length; i+=2) {
                response.write(`${headers[i]}: ${headers[i+1]}\r\n`);
            }

            response.write("\r\n");

            // Copy request body to the response body, use a pipe since
            // both are streams.
            request.pipe(response);
        } else {
            // Map endpoint
            let filename = endpoint.substring(1);
            // Disable directory traversal.
            filename = filename.replace(/\.\.\//g, "");
            // Absolute to relative path conversion.
            filename = path.resolve(rootDirectory, filename);

            // File type definitions
            let type;
            switch(path.extname(filename)) {
                case ".html":
                case ".htm": type = "text/html"; break;
                case ".js": type = "text/javascript"; break;
                case ".css": type = "text/css"; break;
                case ".png": type = "image/png"; break;
                case ".txt": type = "text/plain"; break;
                default:    type = "application/octet-stream"; break
            }

            let stream = fs.createReadStream(filename);
            stream.once("readable", () => {
                response.setHeader("Content-Type", type);
                response.writeHead(200);
                stream.pipe(response);
            });

            stream.on("error", (err) => {
                response.setHeader("Content-Type", "text/plain; charset=UTF-8");
                response.writeHead(404);
                response.end(err.message);
            });
        }
    });
}

serve(process.argv[2] || "./serve", parseInt(process.argv[3]) || 8000);