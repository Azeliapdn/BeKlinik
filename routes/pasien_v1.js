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
    try {
        const userdata = req.userdata_pasien;

        if (!userdata || !userdata.id) {
            return res.status(400).json({
                success: false,
                message: "ID pasien tidak ditemukan dalam sesi."
            })
        }

        const response = await table_function.v1.antrean.get_by_fk_dt_pasien(userdata.id);

        if (!response.success || !response.data || response.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data antrean tidak ditemukan untuk pasien ini."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data antrean berhasil ditampilkan.",
            data: response.data
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data antrean.",
            error: error.message
        })
    }
})

.post(async (req, res) => {
    try {
        const payload = req.body;

        const response = await table_function.v1.antrean.create(payload);

        console.log(response);
        console.log(payload);

        if (!response.success) {
            return error_handler(res, response);
        }

        res.status(200).json({
            message: 'Berhasil membuat reservasi!',
            success: true, 
            data: response.data
        });
    } catch (error) {
        error_handler(res, error);
    }
})


.put(async (req, res) => {
    try {
        const userdata = req.userdata_pasien; // Data pasien dari session/auth
        const payload = req.body; // Data yang dikirim dari frontend

        if (!userdata || !userdata.id) {
            return res.status(400).json({
                success: false,
                message: "ID pasien tidak ditemukan dalam sesi"
            });
        }

        if (!payload || Object.keys(payload).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Data yang dikirim tidak boleh kosong"
            });
        }

        // Ambil data antrean berdasarkan ID pasien
        const antrean = await table_function.v1.antrean.get_by_fk_dt_pasien(userdata.id);

        if (!antrean.success || antrean.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Reservasi tidak ditemukan untuk pasien ini"
            })
        }

        // Cek apakah status masih dalam "proses"
        const reservasi = antrean.data[0]; // Ambil data pertama
        if (reservasi.status !== "proses") {
            return res.status(400).json({
                success: false,
                message: "Reservasi tidak dapat dibatalkan karena statusnya bukan 'proses'"
            })
        }

        // Update status menjadi "dibatalkan"
        const updateResponse = await table_function.v1.antrean.update(userdata.id, { status: "dibatalkan" });

        if (!updateResponse.success || updateResponse.data.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Gagal membatalkan reservasi"
            })
        }

        // Ambil kembali data terbaru setelah pembatalan
        const updatedData = await table_function.v1.antrean.get_by_fk_dt_pasien(userdata.id);

        return res.status(200).json({
            success: true,
            message: "Reservasi berhasil dibatalkan",
            data: updatedData.data // Mengembalikan data terbaru
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat membatalkan reservasi",
            error: error.message
        })
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
                message: 'Berhasil menghapus data antrean',
                data: response.data,
            })
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