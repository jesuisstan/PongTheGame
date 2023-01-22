const http = require('http');

const server = http.createServer((req, res) => {
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
})

server.listen(process.env.BACKEND_PORT || 3080);

console.log('Server running at http://127.0.0.1:3080/');
