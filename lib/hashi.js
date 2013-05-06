var http = require('http'),
    qs   = require('querystring');

var error       = JSON.stringify({ message: 'error' }),
    ok          = JSON.stringify({ message: 'ok' }),
    errorLength = error.length,
    okLength    = ok.length;

function isJSON(obj) {
    var json;
    try {
        JSON.parse(obj);
        json = true;
    } catch (e) {
        json = false;
    }
    return json;
}

var hashi = exports.hashi = function (port, callback) {
    if (!(this instanceof hashi)) return new hashi(port, callback);
    var self = this;
    self.port = port;
    self.callback = callback;
    
    self.listener = http.createServer(function (req, res) {
        var bufs = [],
            buflen = 0,
            bufpos = 0,
            buffer;

        if ( req.method.toLowerCase() !== 'post' || 
             req.headers['x-github-event'] !== 'push' ) {
            return res.end(error);
        }

        req.on('data', function (chunk) {
            bufs.push(chunk);
            buflen += chunk.length;
        });

        req.on('end', function (chunk) {
            buffer = new Buffer(buflen);
            bufs.forEach(function (buf) {
                buf.copy(buffer, bufpos);
                bufpos += buf.length;
            });

            // Github posted as a form, so let's parse it and get the JSON out
            if (!isJSON(buffer)) 
                buffer = qs.parse(buffer.toString()).payload;
            var payload = JSON.parse(buffer);

            callback(null, payload);
            // if (payload.repository.url === self.sites[id]) {
            //     callback(null, payload);
            // } else {
            //     callback(new Error('Posted URL does not match configuration'));
            // }
            res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': okLength });
            res.end(ok);

        });
    });

    self.listener.listen(port);
};  

module.exports = hashi;
