require('dotenv').config();
const pg = require("pg"); pg.defaults.ssl = true;
module.exports = {
    "migrationsDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.nextTick.DATABASE_URL,
}