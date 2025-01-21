const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()


const jwt_handler = {
    generate: (
        payload,
        options = {
            algorithm: 'HS512',
            expiresIn: '3d'
        }
    ) => {
        try {
            const token = jwt.sign(payload, process.env.JWT_SIGNATURE, {
                ...options
            })

            return {
                success: true,
                data: token
            }
        } catch (error) {
            return {
                success: false,
                message: error?.message || error?.error,
                debug: error?.stack
            }
        }
    },
    verify: (token) => {
        try {
            const data = jwt.verify(token, process.env.JWT_SIGNATURE, {
                algorithms: ['HS512']
            })

            return {
                success: true,
                data
            }
        } catch (error) {
            return {
                success: false,
                message: error?.message || error?.error,
                debug: error?.stack
            }
        }
    }
}

module.exports = jwt_handler