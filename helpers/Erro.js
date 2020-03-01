exports.erro = (req, res, next, msg) => {
    const error = new Error(msg)
    error.httpStatusCode = 500;
    return next(error)
}
