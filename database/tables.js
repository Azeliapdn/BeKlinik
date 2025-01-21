const db_column = require("../helpers/column_builder");
const db_model_options = require("../helpers/model_options");
const db = require("./config");

const DT_LAYANAN_SPESIALISASI = db.define('DT_LAYANAN_SPESIALISASI', {
    ...db_column('id').pk().increment().integer().build(),
    ...db_column('nama').string().notNull().unique('LAYANAN_SPESIALISASI_UNIQUE_NAMA').build(),
    ...db_column('jam_mulai').str().null().build(),
    ...db_column('jam_selesai').str().null().build(),
    ...db_column('foto').null().longBlob().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('hari_mulai').null().string().build(),
    ...db_column('hari_selesai').null().string().build(),
    ...db_column('aktif').bool().default(true).build(),
}, {
    ...db_model_options()
    .tableName('DT_LAYANAN_SPESIALISASI')
    .timestamps(true)
    .indexes([
        { 
            fields: ['nama'],
            name: 'LAYANAN_SPESIALISASI_UNIQUE_NAMA',
            unique: true
        }
    ])
    .build()
})

const DT_DOKTER = db.define('DT_DOKTER', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('nama').notNull().str().unique('DOKTER_UNIQUE_NAMA').build(),
    ...db_column('foto').null().longBlob().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('fk_dt_layanan_spesialisasi').int().null().ref('DT_LAYANAN_SPESIALISASI').build(),
    ...db_column('aktif').bool().default(true).build(),
}, {
    ...db_model_options()
    .tableName('DT_DOKTER')
    .timestamps(true)
    .indexes([
        { 
            fields: ['nama'],
            name: 'DOKTER_UNIQUE_NAMA',
            unique: true
        }
    ])
    .build(),
    
})

const DT_DOKTER_UMUM = db.define('DT_DOKTER_UMUM', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('nama').notNull().str().unique('DOKTER_UMUM_UNIQUE_NAMA').build(),
    ...db_column('foto').null().longBlob().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('aktif').bool().default(true).build(),
},
    db_model_options()
        .tableName('DT_DOKTER_UMUM')
        .timestamps(false)
        .indexes([
            { 
                fields: ['nama'],
                name: 'DOKTER_UMUM_UNIQUE_NAMA',
                unique: true
            }
        ])
        .build()
)

const DT_JADWAL_DOKTER_UMUM = db.define('DT_JADWAL_DOKTER_UMUM', {
    ...db_column('id').pk().increment().int().build(),
    ...db_column('jam_mulai').null().str().build(),
    ...db_column('jam_selesai').null().str().build(),
    ...db_column('senin_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('selasa_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('rabu_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('kamis_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('jumat_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('sabtu_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
    ...db_column('minggu_by_fk_dt_dokter_umum').null().int().ref('DT_DOKTER_UMUM').build(),
}, db_model_options()
    .tableName('DT_JADWAL_DOKTER_UMUM')
    .timestamps(true)
    .build()
)
 
const DT_PASIEN = db.define('DT_PASIEN', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('nama').notNull().str().unique('PASIEN_UNIQUE_NAMA').build(),
    ...db_column('username').notNull().str().unique('PASIEN_UNIQUE_USERNAME').build(),
    ...db_column('password').str().notNull().build(),
    ...db_column('foto').longBlob().null().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('aktif').bool().default(true).build(),
}, 
    db_model_options()
    .tableName('DT_PASIEN')
    .timestamps(true)
    .indexes([
        {
            fields: ['nama'],
            name: 'PASIEN_UNIQUE_NAMA',
            unique: true
        },
        {
            fields: ['username'],
            nama: 'PASIEN_UNIQUE_USERNAME',
            unique: true
        }
    ])
    .build()
)

const DT_ANTREAN = db.define('DT_ANTREAN', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('fk_dt_layanan_spesialisasi').int().null().ref('DT_LAYANAN_SPESIALISASI').build(),
    ...db_column('fk_dt_jadwal_dokter_umum').int().null().ref('DT_JADWAL_DOKTER_UMUM').build(),
    ...db_column('fk_dt_pasien').int().notNull().ref('DT_PASIEN').build(),
    ...db_column('nama_pendaftar').str().notNull().build(),
    ...db_column('umur').str().notNull().build(),
    ...db_column('no_handphone').str().notNull().build(),
    ...db_column('address').str().notNull().build(),
    ...db_column('gender').str().notNull().build(),
    ...db_column('status').str().notNull().default('Proses').build(),
    ...db_column('waktu').str().null().build(),
    ...db_column('tanggal').str().null().build()
},
    db_model_options()
    .tableName('DT_ANTREAN')
    .timestamps(true)
    .build()
)

const DT_ADMIN = db.define('DT_ADMIN', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('nama').notNull().str().unique('ADMIN_UNIQUE_NAMA').build(),
    ...db_column('username').notNull().str().unique('ADMIN_UNIQUE_USERNAME').build(),
    ...db_column('password').str().notNull().build(),
    ...db_column('foto').longBlob().null().build(),
    ...db_column('foto_mimetype').str().null().build(),
    ...db_column('aktif').bool().default(true).build(),
}, 
    db_model_options()
    .tableName('DT_ADMIN')
    .timestamps(true)
    .indexes([
        {
            fields: ['nama'],
            name: 'ADMIN_UNIQUE_NAMA',
            unique: true
        },
        {
            fields: ['username'],
            nama: 'ADMIN_UNIQUE_USERNAME',
            unique: true
        }
    ])
    .build()
)
 
// ======================================= ASSOCIATIONS START HERE

DT_LAYANAN_SPESIALISASI.hasMany(DT_DOKTER, {
    foreignKey: 'fk_dt_layanan_spesialisasi',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

DT_DOKTER.belongsTo(DT_LAYANAN_SPESIALISASI, {
    foreignKey: 'fk_dt_layanan_spesialisasi',
    targetKey: 'id'
})

DT_LAYANAN_SPESIALISASI.hasMany(DT_ANTREAN, {
    foreignKey: 'fk_dt_layanan_spesialisasi',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

DT_ANTREAN.belongsTo(DT_LAYANAN_SPESIALISASI, {
    foreignKey: 'fk_dt_layanan_spesialisasi',
    targetKey: 'id'
})

DT_JADWAL_DOKTER_UMUM.hasMany(DT_ANTREAN, {
    foreignKey: 'fk_dt_jadwal_dokter_umum'
})

DT_ANTREAN.belongsTo(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'fk_dt_jadwal_dokter_umum'
})

DT_PASIEN.hasMany(DT_ANTREAN, {
    foreignKey: 'fk_dt_pasien',
    sourceKey: 'id',
    onDelete: "CASCADE"
})

DT_ANTREAN.belongsTo(DT_PASIEN, {
    foreignKey: 'fk_dt_pasien',
    targetKey: 'id'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'senin_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'SENIN_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'senin_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'SENIN_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'selasa_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'SELASA_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'selasa_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'SELASA_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'rabu_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'RABU_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'rabu_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'RABU_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'kamis_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'KAMIS_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'kamis_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'KAMIS_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'jumat_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'JUMAT_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'jumat_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'JUMAT_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'sabtu_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'SABTU_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'sabtu_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'SABTU_BY'
})

DT_DOKTER_UMUM.hasMany(DT_JADWAL_DOKTER_UMUM, {
    foreignKey: 'minggu_by_fk_dt_dokter_umum',
    sourceKey: 'id',
    onDelete: 'SET NULL',
    as: 'MINGGU_BY'
})

DT_JADWAL_DOKTER_UMUM.belongsTo(DT_DOKTER_UMUM, {
    foreignKey: 'minggu_by_fk_dt_dokter_umum',
    targetKey: 'id',
    as: 'MINGGU_BY'
})

module.exports = {
    DT_ADMIN,
    DT_ANTREAN,
    DT_DOKTER,
    DT_JADWAL_DOKTER_UMUM,
    DT_LAYANAN_SPESIALISASI,
    DT_PASIEN,
    DT_DOKTER_UMUM
}