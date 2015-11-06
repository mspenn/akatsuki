/**
 * Created by v_chenqianming on 2015/11/4.
 */

var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    mime = require("./mime"),
    util = require('util');

var BUFFER_FACTOR = 4;
var BUFFER_SIZE = 1024 * 1024;
var PARTIAL_CODE = 206;

function Transfer(req, resp) {
    this.req = req;
    this.resp = resp;
}

/**
 * [@description](/user/description) calculation breakpoint
 * [@param](/user/param) {string} Range get breakpoint info in http request header£¬
 * default as undefined if not set£¬format£¨range: bytes=010101-£©
 * [@return](/user/return) {integer} startPos the position to read start with
 */
Transfer.prototype._calStartPosition = function (Range) {
    var startPos = 0;
    if (typeof Range != 'undefined') {
        var startPosMatch = /^bytes=([0-9]+)-$/.exec(Range);
        if (startPosMatch && startPosMatch.length > 1)
            startPos = Number(startPosMatch[1]);
    }
    return startPos;
}

/**
 * [@description](/user/description) config response header
 * [@param](/user/param) {object} Config header configuration (start pos & total size included)
 */
Transfer.prototype._configHeader = function (config) {
    var startPos = config.startPos,
        fileSize = config.fileSize,
        resp = this.resp;
    //if (startPos != 0) {
    //    resp.setHeader('Accept-Range', 'bytes');
    //} else {
    resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + (fileSize - 1) + '/' + fileSize);
    //}
    resp.writeHead(PARTIAL_CODE, 'Partial Content', {
        'Content-Type': mime.lookupExtension(path.extname(this.fileName)),
        'Content-Length': fileSize - startPos,
    });
}

/**
 * [@description](/user/description) init configuration
 * [@param](/user/param) {string} filePath
 * [@param](/user/param) {function} down callback function when downloading
 */
Transfer.prototype._init = function (filePath, down) {
    var config = {};
    var self = this;
    self.fileName = filePath;
    fs.stat(filePath, function (error, state) {
        if (error)
            throw error;

        config.fileSize = state.size;
        var range = self.req.headers.range;
        config.startPos = self._calStartPosition(range);
        self.config = config;
        self._configHeader(config);
        down();
    });
}

/**
 * [@description](/user/description) return whether buffer is full
 * [@return](/user/return) {boolean}
 */
Transfer.prototype._isBufferFull = function () {
    return this.bufferedLength >= BUFFER_FACTOR * BUFFER_SIZE;
}

/**
 * [@description](/user/description) pipe big file as stream and send binary data
 * [@param](/user/param) {string} filePath target file to be send
 */
Transfer.prototype.trans = function (filePath) {
    var self = this;
    self.bufferedLength = 0;
    fs.exists(filePath, function (exist) {
        if (exist) {
            self._init(filePath, function () {
                var config = self.config
                var resp = self.resp;
                var fReadStream = fs.createReadStream(filePath, {
                    encoding: 'binary',
                    bufferSize: BUFFER_SIZE,
                    start: config.startPos,
                    end: config.fileSize
                });
                //fReadStream.pipe(resp);
                fReadStream.on('data', function (chunk) {
                    self.bufferedLength += chunk.length;
                    if (!resp.write(chunk, 'binary') || self._isBufferFull()) {
                        fReadStream.pause();
                    }
                });
                fReadStream.on('end', function () {
                    resp.end();
                });
                resp.on('drain', function () {
                    if (fReadStream.isPaused() && !self._isBufferFull()) {
                        self.bufferedLength = 0;
                        fReadStream.resume();
                    }
                });
                resp.on('close', function () {
                    fReadStream.close();
                });
            });
        } else {
            console.log('File Not Found!');
            //throw "FileNotFoundException:" + filePath;
            return;
        }
    });
}

module.exports = Transfer;