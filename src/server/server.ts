import 'dotenv/config';
import express, { json } from 'express';
import { WebSocket } from 'ws';
// import db from './src/db/database';

const { env } = process;

const app = express();
const router = express.Router();

app.use(json());
app.use('/api', router);

router.get('/', (_, res) => res.send('Hello'));

const wss = new WebSocket.Server({ port: 8008 });

wss.on('connection', (wClient) => {
    console.log('Client connected');

    wClient.on('message', (message) => {
        console.log('Client message: ', message);
        wss.clients.forEach((client) => {
            console.log(client.readyState);
            if (client === wClient || client.readyState !== WebSocket.OPEN) return;
            client.send('Someone sent: ' + message);
        });
    });

    wClient.on('close', () => {
        wss.clients.forEach((client) => {
            if (client === wClient || client.readyState !== WebSocket.OPEN) return;
            client.send('User left.');
        });
    });
});

const port = env.API_PORT;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
