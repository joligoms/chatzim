import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import express, { json } from 'express';
import { RawData, WebSocket } from 'ws';
// import db from './src/db/database';

const { env } = process;

type ClientMessage = {
    type: string;
    data: Record<string, any>;
};

const app = express();
const router = express.Router();

app.use(cors({
    origin: env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200
}));
app.use(json());
app.use('/api', router);

router.get('/online-users', (_, res) => res.json({ count: wss.clients.size}));

const port = env.API_PORT;

const server = http.createServer();
const wss = new WebSocket.Server({
    server, perMessageDeflate: false
});

const clients = new Map<WebSocket, string>();
wss.on('connection', (wClient, req) => {
    const connectionData = new URLSearchParams(req.url?.split('?')[1] || '');

    const clientName = connectionData.get('username');
    if (!clientName) return;
    const clientHash = Math.random().toString(36).substring(2, 15);
    clients.set(wClient, clientHash);
    const clientColor = connectionData.get('selected-color');

    const getMessage = (message: RawData) => {
        try {
            return JSON.parse(message.toString()) as Record<string, any>
        } catch (err) {
            return null;
        }
    };

    // Send hash handshake
    wClient.send(JSON.stringify({
        type: 'handshake',
        data: { hash: clientHash }
    }));


    // Notify other users the connected user has joined
    wss.clients.forEach((client) => {
        if (client === wClient || client.readyState !== WebSocket.OPEN) return;
        client.send(JSON.stringify({
            type: 'user-joined',
            data: {
                username: clientName,
                color: clientColor,
                at: (new Date).getTime(),
            }
        }));
    })

    wClient.on('message', (message) => {
        // const messageData: ClientMessage = JSON.parse(message.toString());
        const msg = getMessage(message);
        if (!msg) return;
        const clientHash = clients.get(wClient);
        if (clientHash !== msg.hash) return;

        wss.clients.forEach((client) => {
            if (client === wClient || client.readyState !== WebSocket.OPEN) return;

            let data = {};
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

    wClient.on('close', () => {
        wss.clients.forEach((client) => {
            if (client === wClient || client.readyState !== WebSocket.OPEN) return;
            client.send(JSON.stringify({
                type: 'user-left',
                data: {'username': clientName, 'color': clientColor, at: (new Date).getTime()}}
            ));
        });
    });
});

server.listen(env.API_PORT, () => console.log('server is up!'));
