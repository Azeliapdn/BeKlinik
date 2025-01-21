const { Router } = require("express");
const table_function = require("../database/table_function");
const { error_handler } = require("../libs/error_handler");
const path = require('path')

const public_v1 = Router({
    strict: true
})

public_v1.route('/data/layanan-spesialisasi')
    .get(async (req, res) => {
        try {
            const response = await table_function.v1.layanan_spesialisasi.get_all()

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

public_v1.route('/data/jadwal-dokter-umum')
    .get(async (req, res) => {
        try {
            const response = await table_function.v1.jadwal_dokter_umum.get_all()

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

public_v1.route('/data/jadwal-dokter-spesialis')
    .get(async (req, res) => {
        try {
            const response = await table_function.v1.jadwal_dokter_spesialis.get_all()

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

public_v1.route('/pasien/foto-profil/:id')
    .get(async (req, res) => {
        try {
            const id = req.params.id

            const response = await table_function.v1.pasien.get_foto_by_id(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            res.setHeader('Content-Disposition', `inline; filename="foto_pasien"`);
            res.setHeader('Content-Type', response.data.foto_mimetype);
            res.send(response.data.foto)
        } catch (error) {
            error_handler(res, error)
        }
    })

public_v1.route('/admin/foto-profil/:id')
    .get(async (req, res) => {
        try {
            const id = req.params.id

            const response = await table_function.v1.admin.get_foto_by_id(id)

            if(!response.success) {
                return error_handler()
            }

            res.setHeader('Content-Disposition', `inline; filename="foto_admin"`);
            res.setHeader('Content-Type', response.data.foto_mimetype);
            res.send(response.data.foto)
        } catch (error) {
            error_handler(res, error)
        }
    })

public_v1.route('/layanan-spesialisasi/foto/:id')
    .get(async (req, res) => {
        try {
            const id = req.params.id

            const response = await table_function.v1.layanan_spesialisasi.get_by_id(id)

            if(!response.success) {
                return error_handler(res, response)
            }
            
            res.setHeader('Content-Disposition', `inline; filename="foto_layanan_spesialisasi"`);
            if(response.data.foto !== null) {
                res.setHeader('Content-Type', response.data.foto_mimetype);
                res.send(response.data.foto)
            }else{
                const file = path.join(__dirname, '../public', 'img', 'layanan-spesialisasi-no-img.jpg')
                res.setHeader('Content-Type', 'image/jpeg');
                res.sendFile(file)
            }

            
        } catch (error) {
            error_handler(res, error)
        }
    })

module.exports = public_v1