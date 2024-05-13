import { MongoClient, ServerApiVersion } from "mongodb";

const { env } = process;
const dbName = env.DB_NAME as string;
const dbPassword = encodeURIComponent(env.DB_PASSWORD as string);
const dbConnection = (env.DB_CONNECTION as string).replace('<password>', dbPassword);
const client = new MongoClient(dbConnection, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
    } finally {
        await client.close();
    }

    return client.db(dbName);
}

let db = run();

export default db;
