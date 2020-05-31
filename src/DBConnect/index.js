const mongoose = require("mongoose");
const config = require('../config/db.config')

const { db: { host, port, database, username, password } } = config;
const connectionString = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&replicaSet=Node-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true`;

const connect = async () => {
    await mongoose.connect(
        connectionString,
        { useUnifiedTopology: true, useNewUrlParser: true },
        function (err, db) {
            if (!err) console.log("DataBase is connected.");
            else console.log(err);
        }
    );
};

module.exports = connect;
