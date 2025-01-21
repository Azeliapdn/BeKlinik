exports.error_handler = (res, error) => {
    return res.status(500).json({
        message: error?.message || error?.error,
        debug: error?.stack || error?.debug,
        cause: error?.cause
    })
}

