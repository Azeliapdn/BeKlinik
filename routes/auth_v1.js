const { Router } = require("express");
const { error_handler } = require("../libs/error_handler");
const table_function = require("../database/table_function");
const jwt_handler = require("../libs/jwt_handler");

const auth_v1 = Router({
    strict: true
})

.post('/admin/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const response = await table_function.v1.admin.login(username, password)

        if(!response.success) {
            return error_handler(res, response)
        }

        const response_jwt = jwt_handler.generate(response.data)

        if(!response_jwt.success) {
            return error_handler(res, response_jwt)
        }

        return res.status(200).json({
            message: 'Berhasil login',
            data: response_jwt.data,
            status: 'admin'
        })
    } catch (error) {
        error_handler(res, error)
    }
})

.post('/pasien/login', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const response = await table_function.v1.pasien.login(username, password)

        if(!response.success) {
            return error_handler(res, response)
        }

        const response_jwt = jwt_handler.generate(response.data)

        if(!response_jwt.success) {
            return error_handler(res, response_jwt)
        }

        return res.status(200).json({
            message: 'Berhasil login',
            data: response_jwt.data,
            status: 'user'
        })
    } catch (error) {
        error_handler(res, error)
    }
})

.post('/pasien/register', async (req, res) => {
    try {
        const nama = req.body.nama
        const username = req.body.username
        const password = req.body.password

        const response = await table_function.v1.pasien.create({
            nama, username, password
        })

        if(!response.success) {
            if(response.message === 'Validation error') {
                return res.status(400).json({
                    message: 'Akun tersebut sudah ada, silahkan gunakan kredensial yang lain!'
                })
            }
            return error_handler(res, response)
        }

        return res.status(200).json({
            message: 'Berhasil registrasi pasien',
            data: response.data
        })
    } catch (error) {
        error_handler(res, error)
    }
})

module.exports = auth_v1