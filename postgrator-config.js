require('dotenv').config();
// const pg = require("pg"); pg.defaults.ssl = true;

module.exports = {
    "migrationsDirectory": "migrations",
    "driver": "pg",
    "connectionString": process.env.DATABASE_URL,

}