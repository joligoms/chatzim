"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var ws_1 = require("ws");
// import db from './src/db/database';
var env = process.env;
var wss = new ws_1.WebSocket.Server({ port: 8080 });
var clients = new Map();
wss.on('connection', function (wClient, req) {
    var _a;
    var connectionData = new URLSearchParams(((_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?')[1]) || '');
    var clientName = connectionData.get('username');
    if (!clientName)
        return;
    var clientHash = Math.random().toString(36).substring(2, 15);
    clients.set(wClient, clientHash);
    var clientColor = connectionData.get('selected-color');
    var getMessage = function (message) {
        try {
            return JSON.parse(message.toString());
        }
        catch (err) {
            return null;
        }
    };
    // Send hash handshake
    wClient.send(JSON.stringify({
        type: 'handshake',
        data: { hash: clientHash }
    }));
    // Notify other users the connected user has joined
    wss.clients.forEach(function (client) {
        if (client === wClient || client.readyState !== ws_1.WebSocket.OPEN)
            return;
        client.send(JSON.stringify({
            type: 'user-joined',
            data: {
                username: clientName,
                color: clientColor,
                at: (new Date).getTime(),
            }
        }));
    });
    wClient.on('message', function (message) {
        // const messageData: ClientMessage = JSON.parse(message.toString());
        var msg = getMessage(message);
        if (!msg)
            return;
        var clientHash = clients.get(wClient);
        if (clientHash !== msg.hash)
            return;
        wss.clients.forEach(function (client) {
            if (client === wClient || client.readyState !== ws_1.WebSocket.OPEN)
                return;
            var data = {};
            switch (msg.type) {
                case 'send-message':
                    data = {
                        type: 'recieved-message',
                        data: {
                            username: clientName,
                            text: msg.data.text,
                            sent_at: (new Date).getTime(),
                            color: clientColor
                        }
                    };
                    break;
                case 'send-typing':
                    data = {
                        type: 'user-typing',
                        data: {
                            username: clientName,
                            color: clientColor,
                            isTyping: msg.data.isTyping,
                        }
                    };
                    break;
                default:
                    data = msg;
                    break;
            }
            client.send(JSON.stringify(data));
        });
    });
    wClient.on('close', function () {
        wss.clients.forEach(function (client) {
            if (client === wClient || client.readyState !== ws_1.WebSocket.OPEN)
                return;
            client.send(JSON.stringify({
                type: 'user-left',
                data: { 'username': clientName, 'color': clientColor, at: (new Date).getTime() }
            }));
        });
    });
});
var app = (0, express_1.default)();
var router = express_1.default.Router();
app.use((0, express_1.json)());
app.use('/api', router);
router.get('/online-users', function (_, res) { return res.json({ count: wss.clients.size }); });
var port = env.API_PORT;
app.listen(port, function () {
    console.log('server is listening on port ' + port);
});
