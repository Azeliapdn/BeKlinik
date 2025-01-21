
const jwt_handler = require('./libs/jwt_handler')
const { error_handler } = require('./libs/error_handler')
const table_function = require('./database/table_function')

exports.middleware = {
    api: {
        key: async (req, res, next) => {
            try {
                const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]

                if(!token) {
                    return res.status(403).json({
                        message: 'Authorization Bearer Token is Required'
                    })
                }

                const response_jwt = jwt_handler.verify(token)

                if(!response_jwt.success) {
                    if(response_jwt.message === 'jwt malformed') {
                        return res.status(403).json({
                            message: 'Tampaknya anda menggunakan token yang salah, silahkan login ulang atau hubungi Administrator'
                        })
                    }
                    return error_handler(res, response_jwt)
                }

                if(response_jwt.data.status === 'admin') {
                    req.userdata_admin = response_jwt.data
                }else{
                    req.userdata_pasien = response_jwt.data
                }

                next()

            } catch (error) {
                return res.status(500).json({
                    message: error?.message,
                    debug: error?.stack
                })                
            }
        },
        admin_only: async (req, res, next) => {
            try {
                const userdata = req.userdata_admin

                if(!userdata) {
                    return res.status(403).json({
                        message: 'Akses di tolak. Hubungi Administrator!'
                    })
                }

                const response_new_userdata = await table_function.v1.admin.get_by_id(userdata['id'])

                if(!response_new_userdata.success) {
                    return error_handler(res, response_new_userdata)
                }

                const new_userdata = response_new_userdata.data

                if(!new_userdata['aktif']) {
                    return res.status(403).json({
                        message: 'Tampaknya akun anda sudah dinonaktifkan, silahkan login ulang'
                    })
                }

                req.userdata_admin = new_userdata

                next()

            } catch (error) {
                error_handler(res, error)
            }
        },
        pasien_only: async (req, res, next) => {
            try {
                const userdata = req.userdata_pasien

                if(!userdata) {
                    return res.status(403).json({
                        message: 'Akses di tolak. Hubungi Administrator!'
                    })
                }

                const response_new_userdata = await table_function.v1.pasien.get_by_id(userdata['id'])

                if(!response_new_userdata.success) {
                    return error_handler(res, response_new_userdata)
                }

                const new_userdata = response_new_userdata.data

                if(!new_userdata['aktif']) {
                    return res.status(403).json({
                        message: 'Tampaknya akun anda sudah dinonaktifkan, silahkan login ulang'
                    })
                }

                req.userdata_pasien = new_userdata

                next()

            } catch (error) {
                error_handler(res, error)
            }
        }
    }
}