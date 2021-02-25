// 导入错误的验证包
const joi = require('@hapi/joi')

module.exports = (err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }

    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }

    // 未知错误
    res.cc(err)
}