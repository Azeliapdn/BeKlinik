const { Op } = require("sequelize")
const { DT_ADMIN, DT_PASIEN, DT_DOKTER, DT_LAYANAN_SPESIALISASI, DT_JADWAL_DOKTER_UMUM, DT_ANTREAN, DT_DOKTER_UMUM } = require("./tables")
const dayjs = require("dayjs")
const { date_handler } = require("../libs/date_handler")

const change_hari = (hari_mulai, hari_selesai) => {
    let result = '-'

    if(hari_mulai === 'Senin' && hari_selesai === 'Minggu') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Selasa' && hari_selesai === 'Senin') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Rabu' && hari_selesai === 'Selasa') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Kamis' && hari_selesai === 'Rabu') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Jumat' && hari_selesai === 'Kamis') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Sabtu' && hari_selesai === 'Jumat') {
        return 'Setiap Hari'
    }

    if(hari_mulai === 'Minggu' && hari_selesai === 'Sabtu') {
        return 'Setiap Hari'
    }

    if(hari_mulai !== null) {
        result = hari_mulai
    }

    if(hari_selesai !== null) {
        result = `${result} - ${hari_selesai}`
    }

    return result
}

const change_jam = (jam_mulai, jam_selesai) => {
    let result = "-";

    if (jam_mulai && jam_selesai) {
        // Parse the time strings into hours and minutes
        const [startHour, startMinute] = jam_mulai.split(":").map(Number);
        const [endHour, endMinute] = jam_selesai.split(":").map(Number);

        // Calculate the total minutes difference
        let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

        // If totalMinutes is negative, add 24 hours (1440 minutes)
        if (totalMinutes < 0) {
            totalMinutes += 1440; // 24 hours in minutes
        }

        // Check if the total time equals 24 hours
        if (totalMinutes >= 1380) {
            return "24 jam";
        }

        // Return the formatted time range
        result = `${jam_mulai} - ${jam_selesai}`;
    } else if (jam_mulai) {
        result = `${jam_mulai} - Selesai`;
    }

    return result;
};



const table_function = {
    v1: {
        admin: {
            get_all: async () => {
                try {
                    const data = await DT_ADMIN.findAll({
                        raw: true
                    })

                    

                    return {
                        success: true,
                        data: data.map(({foto, ...v}) => v)
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error.stack
                    }                
                }
            },
            create: async (payload) => {
                try {
                    let data = null
                    if(Array.isArray(payload)) {
                        data = await DT_ADMIN.bulkCreate(payload)
                    }else{
                        data = await DT_ADMIN.create(payload)
                    }                 

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
            },
            update: async (id, payload) => {
                try {
                    let data = null
                    if(Array.isArray(id)) {
                        data = await DT_ADMIN.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_ADMIN.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null
                    if(Array.isArray(id)) {
                        data = await DT_ADMIN.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_ADMIN.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            login: async (username, password) => {
                try {
                    const data = await DT_ADMIN.findOne({
                        raw: true,
                        
                        where: {
                            [Op.and]: [
                                {
                                    username
                                },
                                {
                                    password
                                }
                            ]
                        }
                    })

                    if(!data) {
                        return {
                            success: false,
                            message: 'Username atau Password tidak ditemukan!'
                        }
                    }

                    const { foto, ...new_data } = data

                    if(!new_data['aktif']) {
                        return {
                            success: false,
                            message: 'Akun anda sedang dinonaktifkan, silahkan hubungi Administrator'
                        }
                    }



                    return {
                        success: true,
                        data: {
                            ...new_data,
                            status: 'admin'
                        }
                    }

                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_ADMIN.findOne({
                        raw: true,
                        where: {
                            id
                        }
                    })

                    if(!data) {
                        return {
                            success: false,
                            message: 'Data Admin tidak ditemukan'
                        }
                    }

                    const { foto, ...new_data } = data

                    return {
                        success: true,
                        data: {
                            ...new_data,
                            status: 'admin'
                        }
                    }

                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_foto_by_id: async (id) => {
                try {
                    const data = await DT_ADMIN.findOne({
                        raw: true,
                        where: {
                            id
                        }
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
        },
        pasien: {
            get_all: async () => {
                try {
                    const data = await DT_PASIEN.findAll({
                        raw: true
                    })

                    return {
                        success: true,
                        data: data.map(({foto, ...v}) => v)
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null
                    if(Array.isArray(payload)) {
                        data = await DT_PASIEN.bulkCreate(payload)
                    }else{
                        data = await DT_PASIEN.create(payload)
                    }

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
            },
            put: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_PASIEN.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_PASIEN.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_PASIEN.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_PASIEN.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            login: async (username, password) => {
                try {
                    const data = await DT_PASIEN.findOne({
                        raw: true,
                        where: {
                            [Op.and]: [
                                {
                                    username
                                },
                                {
                                    password
                                }
                            ]
                        }
                    })

                    if(!data) {
                        return {
                            success: false,
                            message: 'Username atau Password tidak ditemukan'
                        }
                    }

                    const { foto, ...new_data } = data

                    if(!new_data.aktif) {
                        return {
                            success: false,
                            message: 'Akun anda sedang dinonaktifkan, silahkan hubungi Administrator'
                        }
                    }

                    return {
                        success: true,
                        data: {
                            ...new_data,
                            status: 'pasien'
                        }
                    }

                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_PASIEN.findOne({
                        raw: true,
                        where: {
                            id
                        }
                    })

                    if(!data) {
                        return {
                            success: false,
                            message: 'Data Pasien tidak ditemukan'
                        }
                    }

                    const { foto, ...new_data } = data

                    return {
                        success: true,
                        data: {
                            ...new_data,
                            status: 'pasien'
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_foto_by_id: async (id) => {
                try {
                    const data = await DT_PASIEN.findOne({
                        raw: true,
                        where: {
                            id
                        }
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
        },
        dokter: {
            get_all: async (per_page = 10, page = 1, name) => {
                try {
                    const data = await DT_DOKTER.findAll({
                        raw: true,
                        include: [
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            }
                        ]
                    })

                    console.log(name)

                    const updated_data = data.map(({foto, ...v}) => v).map(v => ({
                        id: v['id'],
                        spesialisasi: v['fk_dt_layanan_spesialisasi'] && v['DT_LAYANAN_SPESIALISASI.nama'],
                        id_spesialisasi: v['fk_dt_layanan_spesialisasi'] && v['DT_LAYANAN_SPESIALISASI.id'],
                        nama: v['nama'],
                        aktif: v['aktif']
                    }))

                    const filtered_data = name
                        ?   updated_data.filter(v => 
                            v['nama'].toLowerCase().includes(name.toLowerCase()) ||
                            (v.spesialisasi && v['spesialisasi'].toLowerCase().includes(name.toLowerCase()))
                        )
                        : updated_data

                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    return {
                        success: true,
                        data: filtered_data.slice(startIndex, endIndex),
                        hasNext: endIndex < filtered_data.length
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_DOKTER.bulkCreate(payload)
                    }else{
                        data = await DT_DOKTER.create(payload)
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_DOKTER.findOne({
                        raw: true,
                        where: {
                            id
                        },
                        include: [
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            }
                        ]
                    })

                    const updated_data = {
                        id: data['id'],
                        spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.nama'],
                        id_spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.id'],
                        nama: data['nama'],
                        aktif: data['aktif']

                    }

                    return {
                        success: true,
                        data: updated_data
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            }
        },
        dokter_umum: {
            get_all: async (per_page = 10, page = 1, name) => {
                try {
                    const data = await DT_DOKTER_UMUM.findAll({
                        raw: true
                    })

                    const updated_data = data.map(({foto, ...v}) => v).map(v => ({
                        id: v['id'],
                        nama: v['nama'],
                        aktif: v['aktif']
                    }))

                    const filtered_data = name
                        ?   updated_data.filter(v => 
                                v['nama'].toLowerCase().includes(name.toLowerCase()
                            )
                        )
                        : updated_data

                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    return {
                        success: true,
                        data: filtered_data.slice(startIndex, endIndex),
                        hasNext: endIndex < filtered_data.length
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_DOKTER_UMUM.bulkCreate(payload)
                    }else{
                        data = await DT_DOKTER_UMUM.create(payload)
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER_UMUM.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER_UMUM.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER_UMUM.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER_UMUM.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_DOKTER_UMUM.findOne({
                        raw: true,
                        where: {
                            id
                        },
                        include: [
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'SENIN_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'SELASA_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'RABU_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'KAMIS_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'JUMAT_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'SABTU_BY'
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM,
                                as: 'MINGGU_BY'
                            },
                        ]
                    })

                    const updated_data = {
                        // id: data['id'],
                        // spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.nama'],
                        // id_spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.id'],
                        // nama: data['nama'],
                        // aktif: data['aktif']
                        ...data
                    }

                    return {
                        success: true,
                        data: updated_data
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            }
        },
        layanan_spesialisasi: {
            get_all: async (per_page = 10, page = 1, name) => {
                try {
                    const data = await DT_LAYANAN_SPESIALISASI.findAll({
                        raw: true
                    })

                    const updated_data = data.map(({foto, ...v}) => v).map(v => ({
                        id: v['id'],
                        nama: v['nama'],
                        hari: change_hari(v['hari_mulai'], v['hari_selesai']),
                        waktu: change_jam(v['jam_mulai'], v['jam_selesai']),
                        aktif: v['aktif']
                    }))

                    const filtered_data = name
                        ?   updated_data.filter(v => 
                            v['nama'].toLowerCase().includes(name.toLowerCase())
                        )
                        : updated_data

                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    return {
                        success: true,
                        data: filtered_data.slice(startIndex, endIndex),
                        hasNext: endIndex < filtered_data.length
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_LAYANAN_SPESIALISASI.bulkCreate(payload)
                    }else{
                        data = await DT_LAYANAN_SPESIALISASI.create(payload)
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_LAYANAN_SPESIALISASI.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_LAYANAN_SPESIALISASI.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_LAYANAN_SPESIALISASI.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_LAYANAN_SPESIALISASI.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_LAYANAN_SPESIALISASI.findOne({
                        raw: true,
                        where: {
                            id
                        }
                    })

                    if(!data) {
                        return {
                            success: false,
                            message: 'Data Layanan Spesialisasi tidak ditemukan'
                        }
                    }

                    return {
                        success: true,
                        data: {
                            ...data,
                            id: data['id'],
                            nama: data['nama'],
                            jam_mulai: data['jam_mulai'],
                            jam_selesai: data['jam_selesai'],
                            hari: change_hari(data['hari_mulai'], data['hari_selesai']),
                            waktu: change_jam(data['jam_mulai'], data['jam_selesai']),
                            aktif: data['aktif']
                        }
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            }
        },
        jadwal_dokter_spesialis: {
            get_all: async (per_page = 10, page = 1, waktu) => {
                try {
                    const data = await DT_DOKTER.findAll({
                        raw: true,
                        include: [
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            }
                        ]
                    })

                    const updated_data = data.map(({foto, ...v}) => v).map(v => ({
                        id: v['id'],
                        id_spesialisasi: v['fk_dt_layanan_spesialisasi'] && v['DT_LAYANAN_SPESIALISASI.id'],
                        spesialisasi: v['fk_dt_layanan_spesialisasi'] && v['DT_LAYANAN_SPESIALISASI.nama'],
                        nama: v['nama'],
                        waktu: v['fk_dt_layanan_spesialisasi'] 
                            && change_jam(v['DT_LAYANAN_SPESIALISASI.jam_mulai'], v['DT_LAYANAN_SPESIALISASI.jam_selesai'])
                        ,
                        hari: v['fk_dt_layanan_spesialisasi'] 
                            && change_hari(v['DT_LAYANAN_SPESIALISASI.hari_mulai'], v['DT_LAYANAN_SPESIALISASI.hari_selesai'])
                        ,
                        aktif: v['aktif']
                    }))

                    console.log(waktu)

                    const filtered_data = waktu
                        ?   updated_data.filter(v => 
                            v['waktu'] ? v['waktu'].includes(waktu) : true
                        )
                        : updated_data

                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    return {
                        success: true,
                        data: filtered_data.slice(startIndex, endIndex),
                        hasNext: endIndex < filtered_data.length
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_DOKTER.bulkCreate(payload)
                    }else{
                        data = await DT_DOKTER.create(payload)
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_DOKTER.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_DOKTER.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_DOKTER.findOne({
                        raw: true,
                        where: {
                            id
                        },
                        include: [
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            }
                        ]
                    })

                    const updated_data = {
                        id: data['id'],
                        spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.nama'],
                        id_spesialisasi: data['fk_dt_layanan_spesialisasi'] && data['DT_LAYANAN_SPESIALISASI.id'],
                        nama: data['nama'],
                        waktu: data['fk_dt_layanan_spesialisasi'] 
                            && change_jam(data['DT_LAYANAN_SPESIALISASI.jam_mulai'], data['DT_LAYANAN_SPESIALISASI.jam_selesai'])
                        ,
                        hari: data['fk_dt_layanan_spesialisasi'] 
                            && change_hari(data['DT_LAYANAN_SPESIALISASI.hari_mulai'], data['DT_LAYANAN_SPESIALISASI.hari_selesai'])
                        ,
                        aktif: data['aktif']
                    }

                    return {
                        success: true,
                        data: updated_data
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            }
        },
        jadwal_dokter_umum: {
            get_all: async (per_page = 10, page = 1, waktu) => {
                try {
                    const data = await DT_JADWAL_DOKTER_UMUM.findAll({
                        raw: true,
                        include: [
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SENIN_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SELASA_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'RABU_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'KAMIS_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'JUMAT_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SABTU_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'MINGGU_BY'
                            },
                        ]
                    })

                    const updated_data = data.map(v => ({
                        id: v['id'],
                        waktu: change_jam(v['jam_mulai'], v['jam_selesai']),
                        senin_by_dokter_id: v['senin_by_fk_dt_dokter_umum'],
                        senin_by_dokter_nama: v['senin_by_fk_dt_dokter_umum'] && v['SENIN_BY.nama'],
                        selasa_by_dokter_id: v['selasa_by_fk_dt_dokter_umum'],
                        selasa_by_dokter_nama: v['selasa_by_fk_dt_dokter_umum'] && v['SELASA_BY.nama'],
                        rabu_by_dokter_id: v['rabu_by_fk_dt_dokter_umum'],
                        rabu_by_dokter_nama: v['rabu_by_fk_dt_dokter_umum'] && v['RABU_BY.nama'],
                        kamis_by_dokter_id: v['kamis_by_fk_dt_dokter_umum'],
                        kamis_by_dokter_nama: v['kamis_by_fk_dt_dokter_umum'] && v['KAMIS_BY.nama'],
                        jumat_by_dokter_id: v['jumat_by_fk_dt_dokter_umum'],
                        jumat_by_dokter_nama: v['jumat_by_fk_dt_dokter_umum'] && v['JUMAT_BY.nama'],
                        sabtu_by_dokter_id: v['sabtu_by_fk_dt_dokter_umum'],
                        sabtu_by_dokter_nama: v['sabtu_by_fk_dt_dokter_umum'] && v['SABTU_BY.nama'],
                        minggu_by_dokter_id: v['minggu_by_fk_dt_dokter_umum'],
                        minggu_by_dokter_nama: v['minggu_by_fk_dt_dokter_umum'] && v['MINGGU_BY.nama'],
                    }))

                    const filtered_data = waktu
                        ?   updated_data.filter(v => 
                            v['waktu'] ? v['waktu'].includes(waktu) : true
                        )
                        : updated_data

                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    return {
                        success: true,
                        data: filtered_data.slice(startIndex, endIndex),
                        hasNext: endIndex < filtered_data.length
                    }

                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_JADWAL_DOKTER_UMUM.bulkCreate(payload)
                    }else{
                        data = await DT_JADWAL_DOKTER_UMUM.create(payload)
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_JADWAL_DOKTER_UMUM.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_JADWAL_DOKTER_UMUM.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null
                    if(Array.isArray(id)){
                        data = await DT_JADWAL_DOKTER_UMUM.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_JADWAL_DOKTER_UMUM.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            get_by_id: async (id) => {
                try {
                    const data = await DT_JADWAL_DOKTER_UMUM.findOne({
                        where: {
                            id
                        },
                        raw: true,
                        include: [
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SENIN_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SELASA_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'RABU_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'KAMIS_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'JUMAT_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'SABTU_BY'
                            },
                            {
                                model: DT_DOKTER_UMUM,
                                as: 'MINGGU_BY'
                            },
                        ]
                    })

                    const updated_data = {
                        id: data['id'],
                        waktu: change_jam(data['jam_mulai'], data['jam_selesai']),
                        senin_by_dokter_id: data['senin_by_fk_dt_dokter_umum'],
                        senin_by_dokter_nama: data['senin_by_fk_dt_dokter_umum'] && data['SENIN_BY.nama'],
                        selasa_by_dokter_id: data['selasa_by_fk_dt_dokter_umum'],
                        selasa_by_dokter_nama: data['selasa_by_fk_dt_dokter_umum'] && data['SELASA_BY.nama'],
                        rabu_by_dokter_id: data['rabu_by_fk_dt_dokter_umum'],
                        rabu_by_dokter_nama: data['rabu_by_fk_dt_dokter_umum'] && data['RABU_BY.nama'],
                        kamis_by_dokter_id: data['kamis_by_fk_dt_dokter_umum'],
                        kamis_by_dokter_nama: data['kamis_by_fk_dt_dokter_umum'] && data['KAMIS_BY.nama'],
                        jumat_by_dokter_id: data['jumat_by_fk_dt_dokter_umum'],
                        jumat_by_dokter_nama: data['jumat_by_fk_dt_dokter_umum'] && data['JUMAT_BY.nama'],
                        sabtu_by_dokter_id: data['sabtu_by_fk_dt_dokter_umum'],
                        sabtu_by_dokter_nama: data['sabtu_by_fk_dt_dokter_umum'] && data['SABTU_BY.nama'],
                        minggu_by_dokter_id: data['minggu_by_fk_dt_dokter_umum'],
                        minggu_by_dokter_nama: data['minggu_by_fk_dt_dokter_umum'] && data['MINGGU_BY.nama'],
                    }

                    return {
                        success: true,
                        data: updated_data
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            }
        },
        antrean: {
            get_all: async (per_page = 10, page = 1, name) => {
                try {
                    const data = await DT_ANTREAN.findAll({
                        raw: true,
                        include: [
                            {
                                model: DT_PASIEN
                            },
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM
                            }
                        ],
                        order: [
                            ['tanggal', 'DESC'],
                            ['waktu', 'ASC']
                        ]
                    })

                    const updated_data = data.map(v => ({
                        id: v['id'],
                        fk_dt_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi'],
                        fk_dt_jadwal_dokter_umum: v['fk_dt_jadwal_dokter_umum'],
                        fk_dt_pasien: v['fk_dt_pasien'],
                        nama_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi']
                            ? v['DT_LAYANAN_SPESIALISASI.nama']
                            : v['fk_dt_jadwal_dokter_umum']
                                ? 'Umum'
                                : 'Tidak Ada'
                        ,
                        nama_user: v['DT_PASIEN.nama'],
                        nama_pendaftar: v['nama_pendaftar'],
                        umur: v['umur'],
                        gender: v['gender'],
                        address: v['address'],
                        no_handphone: v['no_handphone'],
                        waktu: v['waktu'],
                        tanggal: v['tanggal'],
                        status: v['status']

                    }))
              
                  const filtered_data = name
                    ? updated_data.filter(
                        (v) =>
                            v.nama_pendaftar?.toLowerCase().includes(name.toLowerCase()) ||
                            v.nama_layanan_spesialisasi?.toLowerCase()
                            .includes(name.toLowerCase())
                        )
                    : updated_data;

                    // Calculate the start and end index for slicing
                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    // Apply pagination
                    const paginated_data = filtered_data.slice(startIndex, endIndex);

                    return {
                    success: true,
                    data: paginated_data,
                    total: filtered_data.length, // Total number of filtered items
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_by_fk_dt_pasien: async (fk_dt_pasien) => {
                try {
                    const data = await DT_ANTREAN.findAll({
                        raw: true,
                        where: {
                            fk_dt_pasien
                        },
                        include: [
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM
                            }
                        ]
                    })

                    return {
                        success: true,
                        data: data.map(v => ({
                            "id": v['id'],
                            fk_dt_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi'],
                            fk_dt_jadwal_dokter_umum: v['fk_dt_jadwal_dokter_umum'],
                            fk_dt_pasien: v['fk_dt_pasien'],
                            nama_spesialisasi: v['fk_dt_layanan_spesialisasi']
                                ? v['DT_LAYANAN_SPESIALISASI.nama']
                                : v['fk_dt_jadwal_dokter_umum']
                                    ? 'Umum'
                                    : 'Tidak Ada'
                            ,
                            "nama_pendaftar": v['nama_pendaftar'],
                            "umur": v['umur'],
                            "no_handphone": v['no_handphone'],
                            "address": v['address'],
                            "gender": v['gender'],
                            "status": v['status'],
                            "waktu": v['waktu'],
                            "tanggal": v['tanggal'],
                        }))
                    }
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack
                    }
                }
            },
            get_today: async (per_page = 10, page = 1, name) => {
                try {
                  const data = await DT_ANTREAN.findAll({
                    raw: true,
                    where: {
                      tanggal: dayjs().format('YYYY-MM-DD'),
                    },
                    include: [
                      {
                        model: DT_PASIEN,
                      },
                      {
                        model: DT_LAYANAN_SPESIALISASI,
                      },
                      {
                        model: DT_JADWAL_DOKTER_UMUM
                      }
                    ],
                    order: [
                      ['tanggal', 'DESC'],
                      ['waktu', 'ASC'],
                    ],
                  });
              
                  // Transform the data into the desired format
                  const updated_data = data.map((v) => ({
                    id: v['id'],
                    fk_dt_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi'],
                    fk_dt_jadwal_dokter_umum: v['fk_dt_jadwal_dokter_umum'],
                    fk_dt_pasien: v['fk_dt_pasien'],
                    nama_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi']
                        ? v['DT_LAYANAN_SPESIALISASI.nama']
                        : v['fk_dt_jadwal_dokter_umum']
                            ? 'Umum'
                            : 'Tidak Ada'
                    ,
                    nama_pasien: v['DT_PASIEN.nama'],
                    nama_pendaftar: v['nama_pendaftar'],
                    waktu: v['waktu'],
                    tanggal: v['tanggal'],
                    status: v['status'],
                  }));

                  console.log(updated_data)
              
                  const filtered_data = name
                    ? updated_data.filter(
                        (v) =>
                            v.nama_pendaftar?.toLowerCase().includes(name.toLowerCase()) ||
                            v.nama_layanan_spesialisasi
                            ?.toLowerCase()
                            .includes(name.toLowerCase())
                        )
                    : updated_data;

                    // Calculate the start and end index for slicing
                    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
                    const endIndex = startIndex + parseInt(per_page);

                    // Apply pagination
                    const paginated_data = filtered_data.slice(startIndex, endIndex);

                    return {
                    success: true,
                    data: paginated_data,
                    total: filtered_data.length, // Total number of filtered items
                    };
                } catch (error) {
                  return {
                    success: false,
                    message: error?.message || error?.error,
                    debug: error?.stack,
                  };
                }
              },
            get_by_date: async (tanggal_awal = date_handler.get.dateonly(), tanggal_akhir, per_page = 10, page = 1, name) => {
                try {
                    const whereCondition = {
                        tanggal: {
                            [Op.gte]: tanggal_awal, // Start from tanggal_awal
                        },
                    };
            
                    if (tanggal_akhir) {
                        // Add upper bound if tanggal_akhir is provided
                        whereCondition.tanggal[Op.lte] = tanggal_akhir;
                    }
            
                    const data = await DT_ANTREAN.findAll({ where: whereCondition,
                        raw: true,
                        include: [
                            {
                                model: DT_PASIEN
                            },
                            {
                                model: DT_LAYANAN_SPESIALISASI
                            },
                            {
                                model: DT_JADWAL_DOKTER_UMUM
                            }
                        ],
                        order: [
                            ['tanggal', 'DESC'],
                            ['waktu', 'ASC']
                        ]
                     });

                     const updated_data = data.map(v => ({
                        id: v['id'],
                        fk_dt_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi'],
                        fk_dt_jadwal_dokter_umum: v['fk_dt_jadwal_dokter_umum'],
                        fk_dt_pasien: v['fk_dt_pasien'],
                        nama_layanan_spesialisasi: v['fk_dt_layanan_spesialisasi']
                            ? v['DT_LAYANAN_SPESIALISASI.nama']
                            : v['fk_dt_jadwal_dokter_umum']
                                ? 'Umum'
                                : 'Tidak Ada'
                        ,
                        nama_pasien: v['DT_PASIEN.nama'],
                        nama_pendaftar: v['nama_pendaftar'],
                        waktu: v['waktu'],
                        tanggal: v['tanggal'],
                        status: v['status']

                    }))
            
                    return {
                        success: true,
                        data: updated_data
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error?.message || error?.error,
                        debug: error?.stack,
                    };
                }
            },
            create: async (payload) => {
                try {
                    let data = null

                    if(Array.isArray(payload)) {
                        data = await DT_ANTREAN.bulkCreate(payload.map(v => ({
                            ...v,
                            waktu: v['waktu'] || date_handler.get.time(),
                            tanggal: v['tanggal'] || date_handler.get.dateonly()
                        })))
                    }else{
                        data = await DT_ANTREAN.create({
                            ...payload,
                            waktu: payload['waktu'] || date_handler.get.time(),
                            tanggal: payload['tanggal'] || date_handler.get.dateonly()
                        })
                    }

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
            },
            update: async (id, payload) => {
                try {
                    let data = null

                    if(Array.isArray(id)) {
                        data = await DT_ANTREAN.update(payload, {
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_ANTREAN.update(payload, {
                            where: {
                                id
                            }
                        })
                    }

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
            },
            delete: async (id) => {
                try {
                    let data = null
                    if(Array.isArray(id)) {
                        data = await DT_ANTREAN.destroy({
                            where: {
                                id: {
                                    [Op.in]: id
                                }
                            }
                        })
                    }else{
                        data = await DT_ANTREAN.destroy({
                            where: {
                                id
                            }
                        })
                    }

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
            },
            
            
        }
    }
}

module.exports = table_function
