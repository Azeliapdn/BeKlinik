const express = require('express')
const cors = require('cors')
const admin_v1 = require('../routes/admin_v1')
const auth_v1 = require('../routes/auth_v1')
const pasien_v1 = require('../routes/pasien_v1')
const public_v1 = require('../routes/public_v1')
const { middleware } = require('../mid_handlers')
const dotenv = require('dotenv').config()
const path = require('path')

const port = process.env.PORT || 8080
const app = express()

app.use(cors({
    origin: process.env.CORS_URL 
        ? `${process.env.CORS_URL}`.includes(' ') 
            ? `${process.env.CORS_URL}`.split(' ')
            : `${process.env.CORS_URL}`
        : ['*']
    ,
    methods: process.env.CORS_METHODS
        ? `${process.env.CORS_METHODS}`.includes(' ') 
            ? `${process.env.CORS_METHODS}`.split(' ')
            : `${process.env.CORS_METHODS}`
        : ['*']
}))

app.use(express.urlencoded({ extended: true, limit: '50mb'}))
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/v1/auth', auth_v1)
app.use('/v1/public', public_v1)
app.use('/v1/pasien', middleware.api.key, middleware.api.pasien_only, pasien_v1)
app.use('/v1/admin', middleware.api.key, middleware.api.admin_only, admin_v1)

app.use((req, res, next) => {
    return res.status(404).json({
        message: 'Route is not found',
        route: `${req.method} ${req.url}`
    })
})

app.listen(port, () => {
    console.log(`[API]: Server is listening on ${port}`)
})