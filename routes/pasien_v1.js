const { Router } = require("express");
const { error_handler } = require("../libs/error_handler");
const { upload_image } = require("../libs/multer_handler");
const table_function = require("../database/table_function");

const pasien_v1 = Router({
    strict: true
})

pasien_v1.route('/data/layanan-spesialisasi/:id')
    .get(async (req, res) => {
        try {
            const id = req.params.id

            const response = await table_function.v1.layanan_spesialisasi.get_by_id(id)

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

pasien_v1.route('/data/antrean')
    .get(async (req, res) => {
        const userdata = req.userdata_pasien

        const response = await table_function.v1.antrean.get_by_fk_dt_pasien(userdata['id'])

        if(!response.success) {
            return error_handler(res, response)
        }

        return res.status(200).json({
            data: response.data
        })
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await table_function.v1.antrean.create(payload)

            console.log(response)
            console.log(payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            res.status(200).json({
                message: 'Berhasil membuat reservasi!',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id
            const payload = req.body.payload

            const response = await table_function.v1.antrean.update(id, payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200)
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.query.id

            const response = await table_function.v1.antrean.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200)
        } catch (error) {
            error_handler(res, error)
        }
    })

pasien_v1.route('/profil')
    .get(async (req, res) => {
        try {
            const userdata = req.userdata_pasien

            return res.status(200).json({
                data: userdata
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

pasien_v1.route('/foto-profil')
    .put(async (req, res) => {
        try {
            await upload_image.single('foto_profil_pasien')(req, res, async (err) => {
                try {
                    if (err) {
                        return error_handler(res, err);
                    }
    
                    // Validate if the file is missing
                    if (!req.file) {
                        return res.status(400).json({
                            success: false,
                            message: 'No image uploaded! Please upload an image.'
                        });
                    }
    
                    const { mimetype, buffer } = req.file;
                    const userdata = req.userdata_pasien;
                    console.log(userdata)
    
                    // Update admin profile photo
                    const response = await table_function.v1.pasien.put(userdata['id'], {
                        foto: buffer,
                        foto_mimetype: mimetype
                    });
    
                    if (!response.success) {
                        return error_handler(res, response);
                    }
    
                    return res.status(200).json({
                        success: true,
                        message: 'Berhasil mengubah foto profil!',
                        data: response.data
                    });
                } catch (error) {
                    return error_handler(res, error);
                }
            })

            console.log('a')
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    })

pasien_v1.route('/data/jadwal-dokter-umum')
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

module.exports = pasien_v1