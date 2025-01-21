const { Sequelize } = require("sequelize");
const dotenv = require('dotenv').config()

let db = null

if(process.env.DB_CONNECTION_METHOD === 'PARAMETER') {
    db = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS, 
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            dialectModule: process.env.DB_DIALECT === 'postgres'
                ? require('pg')
                : require('mysql2')
            ,
            logging: false,
            timezone: process.env.DB_TIMEZONE,
            port: process.env.DB_PORT,
            pool: process.env.DB_POOL
        }
    )
}else{
    db = new Sequelize(process.env.DB_URL,
        {
            dialect: process.env.DB_DIALECT,
            dialectModule: process.env.DB_DIALECT === 'postgres'
                ? require('pg')
                : require('mysql2')
            ,
            logging: false,
            timezone: process.env.DB_TIMEZONE
        }
    )
}

console.log(`[DATABASE]: Connecting to database..`)

db.authenticate().then(() => {
    if(process.env.DB_CONNECTION_METHOD === 'PARAMETER') {
        console.log(`[DATABASE]: Database is connected to ${process.env.DB_HOST} named '${process.env.DB_NAME}'`)
    }else{
        console.log(`[DATABASE]: Database is connected to ${process.env.DB_URL}`)
    }
})

console.log(`[DATABASE]: Synchronizing database...`)

db.sync({ alter: true }).then(() => {
    console.log(`[DATABASE]: Database has been synced!`)
})

module.exports = db