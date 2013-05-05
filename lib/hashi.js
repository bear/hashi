var http = require('http');

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

        });
    });

    self.listener.listen(port);
};

module.exports = hashi;
