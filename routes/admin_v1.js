const { Router, response } = require("express");
const table_function = require("../database/table_function");
const { error_handler } = require("../libs/error_handler");
const { upload_image } = require("../libs/multer_handler");

const admin_v1 = Router({
    strict: true
})

admin_v1.route('/data/admin')
    .get(async (req, res) => {
        try {
            const response = await table_function.v1.admin.get_all()

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            return error_handler(res, error)            
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await table_function.v1.admin.create(payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(400).json({
                        message: 'Akun sudah terdaftar, silahkan gunakan kredensial lain!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id

            const response = await table_function.v1.admin.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil menghapus data admin',
                data: response.data,
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id
            const payload = req.body.payload

            const response = await table_function.v1.admin.update(id, payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil mengubah data admin',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/pasien')
    .get(async (req, res) => {
        try {
            const response = await table_function.v1.pasien.get_all()

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
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await table_function.v1.pasien.create(payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        message: 'Data Pasien sudah ada!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil menambahkan data pasien',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const payload = req.body.payload
            const id = req.body.id

            const response = await table_function.v1.pasien.put(id, payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        message: 'Terdapat kredensial akun yang sama, silahkan ganti menjadi kredensial yang berbeda'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil mengubah data pasien',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id

            const response = await table_function.v1.pasien.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil menghapus data pasien',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/layanan-spesialisasi')
    .get(async (req, res) => {
        try {

            let response = null

            const { per_page, page, name, id } = req.query

            if(id) {
                response = await table_function.v1.layanan_spesialisasi.get_by_id(id)
            }else{
                response = await table_function.v1.layanan_spesialisasi.get_all(per_page || 999, page || 1, name)
            }

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'berhasil menampilakan seluruh layanan spesialis',
                data: response.data,
                hasNext: response.hasNext
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            upload_image.single('foto_layanan_spesialisasi')(req, res, async (err) => {
                try {
                    if (err) {
                        return error_handler(res, err);
                    }
    
                    if (!req.file) {
                        return res.status(400).json({
                            success: false,
                            message: 'Kamu perlu menambahkan foto pada foto_layanan_spesialis'
                        })
                    }
    
                    const { mimetype, buffer } = req.file;
    
                    const payload = {
                        ...req.body,
                        jam_selesai: req.body['jam_selesai'] === 'null' ? null : req.body['jam_selesai'],
                        hari_selesai: req.body['hari_selesai'] === 'null' ? null : req.body['hari_selesai'],
                        foto: buffer,
                        foto_mimetype: mimetype
                    };
    
                    const response = await table_function.v1.layanan_spesialisasi.create(payload);
    
                    if (!response.success) {
                        return error_handler(res, response);
                    }
    
                    return res.status(200).json({
                        success: true,
                        message: 'Berhasil menambahkan data layanan spesialisasi',
                        data: {
                            id: response.data.id,
                            nama: response.data.nama,
                            aktif: response.data.aktif,
                            jam_mulai: response.data.jam_mulai,
                            jam_selesai: response.data.jam_selesai,
                            hari_mulai: response.data.hari_mulai,
                            hari_selesai: response.data.hari_selesai,
                            updatedAt: response.data.updatedAt,
                            createdAt: response.data.createdAt,
                            foto_status: 'Foto berhasil diunggah' // Konfirmasi upload foto tanpa mengembalikan datanya
                        }
                    })
                } catch (error) {
                    error_handler(res, error);
                }
            })
        } catch (error) {
            error_handler(res, error);
        }
    })
    
    .put(async (req, res) => {
        try {
            upload_image.single('foto_layanan_spesialisasi')(req, res, async (err) => {
                try {
                    if(err) {
                        return error_handler(res, err)
                    }

                    let payload = req.body.payload || req.body
                    let id = req.body.id || req.query.id


                    if(req.file) {
                        payload = {
                            ...payload,
                            jam_selesai: payload['jam_selesai'] === 'null' ? null : payload['jam_selesai'],
                            hari_selesai: payload['hari_selesai'] === 'null' ? null : payload['hari_selesai'],
                            foto: req.file.buffer,
                            foto_mimetype: req.file.mimetype,
                            aktif: payload['aktif'] === 'true' ? true : false
                        }
                    }else{
                        payload = {
                            ...payload,
                            jam_selesai: payload['jam_selesai'] === 'null' ? null : payload['jam_selesai'],
                            hari_selesai: payload['hari_selesai'] === 'null' ? null : payload['hari_selesai'],
                            aktif: payload['aktif'] === 'true' ? true : false
                        }
                    }

                    const response = await table_function.v1.layanan_spesialisasi.update(id, payload)

                    if(!response.success) {
                        return error_handler(res, response)
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Berhasil mengubah data layanan spesialisasi',
                        data: response.data,
                        updated_data: payload
                    })
                } catch (error) {
                    error_handler(res, error)
                }
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = await req.body.id

            const response = await table_function.v1.layanan_spesialisasi.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus data layanan spesialisasi',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/foto/layanan-spesialisasi/:id')
    .put( async (req, res) => {
        try {
            upload_image.single('foto_layanan_spesialisasi')(req, res, async (err) => {
                try {
                    const id = req.params.id

                    if(err) {
                        return error_handler(res, err)
                    }

                    if(!id) {
                        return res.status(404).json({
                            message: 'Please specify layanan spesialisasi id'
                        })
                    }

                    if(!req.file) {
                        return res.status(404).json({
                            message: 'No file uploaded or invalid file type'
                        })
                    }

                    const { mimetype, buffer } = req.file

                    const response = await table_function.v1.layanan_spesialisasi.update(id, {
                        foto: buffer,
                        foto_mimetype: mimetype
                    })

                    if(!response.success) {
                        return error_handler(res, error)
                    }

                    return res.status(200).json({
                        message: 'Berhasil menyimpan foto layanan spesialisasi'
                    })
                } catch (error) {
                    
                }
            })
            
            return res.status(403).json({
                message: 'You need to upload image to foto_layanan_spesialisasi'
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/dokter')
    .get(async (req, res) => {
        try {

            let response = null

            const { per_page, page, name, id } = req.query

            if(id) {
                response = await table_function.v1.dokter.get_by_id(id)
            }else{
                response = await table_function.v1.dokter.get_all(per_page || 999, page || 1, name)
            }

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data,
                hasNext: response.hasNext
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = await req.body

            const response = await table_function.v1.dokter.create(payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        message: 'Data tersebut sudah ada sebelumnya!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menambahkan data dokter',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const payload = await req.body.payload || req.body
            const id = await req.body.id || req.query.id

            const response = await table_function.v1.dokter.update(id, payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        success: false,
                        message: 'Data tersebut sudah ada sebelumnya!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengubah data dokter',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = await req.body.id

            const response = await table_function.v1.dokter.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus data dokter',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/dokter-umum')
    .get(async (req, res) => {
        try {

            let response = null

            const { per_page, page, name, id } = req.query

            if(id) {
                response = await table_function.v1.dokter_umum.get_by_id(id)
            }else{
                response = await table_function.v1.dokter_umum.get_all(per_page || 999, page || 1, name)
            }

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                data: response.data,
                hasNext: response.hasNext
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = await req.body

            const response = await table_function.v1.dokter_umum.create(payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        success: false,
                        message: 'Data tersebut sudah ada sebelumnya!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menambahkan data dokter umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const payload = await req.body.payload || req.body
            const id = await req.body.id || req.query.id

            const response = await table_function.v1.dokter_umum.update(id, payload)

            if(!response.success) {
                if(response.message === 'Validation error') {
                    return res.status(403).json({
                        success: false,
                        message: 'Data tersebut sudah ada sebelumnya!'
                    })
                }
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengubah data dokter_umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = await req.body.id

            const response = await table_function.v1.dokter_umum.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus data dokter_umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/jadwal-dokter-spesialis')
    .get(async (req, res) => {
        try {
            let response = null

            const { per_page, page, waktu, id } = req.query

            if(id) {
                response = await table_function.v1.jadwal_dokter_spesialis.get_by_id(id)
            }else{
                response = await table_function.v1.jadwal_dokter_spesialis.get_all(per_page || 999, page || 1, waktu)
            }

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                data: response.data,
                hasNext: response.hasNext
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = await req.body

            const response = await table_function.v1.jadwal_dokter_spesialis.create(payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menambahkan data jadwal dokter spesialis',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const payload = await req.body.payload || req.body
            const id = await req.body.id || req.query.id

            const response = await table_function.v1.jadwal_dokter_spesialis.update(id, payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengubah data jadwal dokter spesialis',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = await req.body.id

            const response = await table_function.v1.jadwal_dokter_spesialis.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus data jadwal dokter spesialis',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/data/jadwal-dokter-umum')
    .get(async (req, res) => {
        try {

            const { per_page, page, waktu, id } = req.query
            let response = null

            if(id) {
                response = await table_function.v1.jadwal_dokter_umum.get_by_id(id)
            }else{
                response = await table_function.v1.jadwal_dokter_umum.get_all(per_page || 999, page || 1, waktu)
            }

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                data: response.data,
                hasNext: response.hasNext
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await table_function.v1.jadwal_dokter_umum.create(payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menambahkan jadwal dokter umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const id = req.body.id || req.query.id
            const payload = req.body.payload || req.body
            
            const response = await table_function.v1.jadwal_dokter_umum.update(id, payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengubah jadwal dokter umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id
            
            const response = await table_function.v1.jadwal_dokter_umum.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus jadwal dokter umum',
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    
admin_v1.route('/data/antrean')
    .get(async (req, res) => {
        try {
            let response = null
            const { is_today, tanggal_awal, tanggal_akhir, per_page, page, name } = req.query

            if(is_today === 'true') {
                response = await table_function.v1.antrean.get_today( per_page, page, name)
            }else if(tanggal_awal) {
                response = await table_function.v1.antrean.get_by_date(tanggal_awal, tanggal_akhir,  per_page, page, name)
            }else{
                response = await table_function.v1.antrean.get_all(per_page, page, name)
            }

            if(!response.success) {
                console.log(response)
                return error_handler(res, response)
            }

            return res.status(200).json({
                data: response.data
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .post(async (req, res) => {
        try {
            const payload = req.body

            const response = await table_function.v1.antrean.create(payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                message: 'Berhasil menambahkan data antrean',
                data: response.data,
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .put(async (req, res) => {
        try {
            const payload = req.body.payload || req.body
            const id = req.body.id || req.query.id

            const response = await table_function.v1.antrean.update(id, payload)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengubah data antrean',
                data: response.data,
            })
        } catch (error) {
            error_handler(res, error)
        }
    })
    .delete(async (req, res) => {
        try {
            const id = req.body.id || req.query.id

            const response = await table_function.v1.antrean.delete(id)

            if(!response.success) {
                return error_handler(res, response)
            }

            return res.status(200).json({
                success: true,
                message: 'Berhasil menghapus data antrean',
                data: response.data,
            })
        } catch (error) {
            error_handler(res, error)
        }
    })


admin_v1.route('/profil')
    .get(async (req, res) => {
        try {
            const userdata = req.userdata_admin

            return res.status(200).json({
                data: userdata
            })
        } catch (error) {
            error_handler(res, error)
        }
    })

admin_v1.route('/foto-profil')
    .get(async (req, res) => {
        try {
            const userdata = req.userdata_admin

            const response = await table_function.v1.admin.get_foto_by_id(userdata['id'])

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
    .put(async (req, res) => {
        try {
            upload_image.single('foto_profil_admin')(req, res, async (err) => {
                try {

                    if (err) {
                        return error_handler(res, err);
                    }

    
                    // Validate if the form is empty
                    if (!req.file && (!req.body || Object.keys(req.body).length === 0)) {
                        return res.status(400).json({
                            success: false,
                            message: 'The form is empty. Please provide an image or additional data.'
                        });
                    }
    
                    // Validate if the file is missing
                    if (!req.file) {
                        return res.status(400).json({
                            success: false,
                            message: 'No image uploaded! Please upload an image.'
                        });
                    }
    
                    const { mimetype, buffer } = req.file;
                    const userdata = req.userdata_admin;
    
                    // Update admin profile photo
                    const response = await table_function.v1.admin.update(userdata['id'], {
                        foto: buffer,
                        foto_mimetype: mimetype
                    });
    
                    if (!response.success) {
                        return error_handler(res, response);
                    }
    
                    return res.status(200).json({
                        success: true,
                        message: 'Berhasil mengubah foto profil admin!',
                        data: response.data
                    });
                } catch (error) {
                    error_handler(res, error);
                }
            });

            res.status(403).json({
                message: 'You need to upload image to foto_profil_admin'
            })
        } catch (error) {
            error_handler(res, error);
        }
    });
    

module.exports = admin_v1