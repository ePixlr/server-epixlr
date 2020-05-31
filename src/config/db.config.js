const config = {
    db: {
        type: 'mongoose',
        host: 'node-shard-00-00-af9wr.mongodb.net',
        port: 27017,
        username: process.env.MONGOOSE_USERNAME,
        password: process.env.MONGOOSE_PASSWORD,
        database: 'joynul-abdin',
    }
};

module.exports = config;