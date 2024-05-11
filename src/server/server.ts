import 'dotenv/config';
import express, { json } from 'express';
import { RawData, WebSocket } from 'ws';
// import db from './src/db/database';

const { env } = process;

type ClientMessage = {
    type: string;
    data: Record<string, any>;
};

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map<WebSocket, string>();
wss.on('connection', (wClient, req) => {
    const connectionData = new URLSearchParams(req.url?.split('?')[1] || '');
    console.log(connectionData);

    const clientName = connectionData.get('username');
    if (!clientName) return;
    const clientHash = Math.random().toString(36).substring(2, 15);
    clients.set(wClient, clientHash);
    const clientColor = connectionData.get('selected-color');

    wClient.send(JSON.stringify({
        type: 'handshake',
        data: { hash: clientHash }
    }));

    const getMessage = (message: RawData) => {
        try {
            return JSON.parse(message.toString()) as Record<string, any>
        } catch (err) {
            return null;
        }
    };

    wss.clients.forEach((client) => {
        if (client === wClient || client.readyState !== WebSocket.OPEN) return;
        client.send(JSON.stringify({
            type: 'user-joined',
            data: {
                username: clientName,
                joined_at: (new Date).getTime(),
                color: clientColor
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
            client.send(JSON.stringify({ type: 'user-left', data: {'username': clientName}}));
        });
    });
});

const app = express();
const router = express.Router();

app.use(json());
app.use('/api', router);

router.get('/online-users', (_, res) => res.json({ count: wss.clients.size}));

const port = env.API_PORT;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
