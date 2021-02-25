// 引入数据库连接的文件
const db = require('../db/index')

// 3.导入密码加密的包
const bcrypt = require('bcryptjs')

// 5.导入jsonwebtoken 包， 用这个包来生成token字符串
const jwt = require('jsonwebtoken')
    // 导入配置文件
const config = require('../config')

exports.regUser = (req, res) => {
    // res.send('reguser ok')
    const userinfo = req.body;
    // 1.检测是否为空
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不能为空'
    //     // })
    //     return res.cc('用户名或密码不能为空')
    // }

    // 2.检测用户名是否被占用
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, (err, results) => {
        if (err) {
            // return results.send({
            //     status: 1,
            //     message: err.message
            // })
            res.cc(err.message)
        }
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用，请更换其他用户名'
            // })
            res.cc('用户名被占用，请更换其他用户名')
        }
        // res.send('可以注册')
        // 3.加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 4.插入新用户
        const sqlin = 'insert into ev_users set ?';
        db.query(sqlin, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            if (err) {
                // return res.send({
                //     status: 1,
                //     message: err.message
                // });
                return res.cc(err.message)
            }
            if (results.affectedRows !== 1) {
                // return res, send({
                //     status: 1,
                //     message: '注册用户失败，请稍后重试'
                // })
                return res.cc('注册用户失败，请稍后重试')
            }
            // res.send({
            //     status: 0,
            //     message: '注册成功'
            // })
            res.cc('注册成功', 0)
        })
    })

}

exports.login = (req, res) => {
    // res.send('login ok')
    // 1.接收表单数据
    const userinfo = req.body

    // 2.定义SQL语句
    const sql = 'select * from ev_users where username =?'

    // 3.执行SQL语句，查询用户的数据
    db.query(sql, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err);
        // 执行SQL语句成功，但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
            // todo: 判断用户输入的登录密码是否和数据库中的密码一致
            // 拿着用户输入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);

        if (!compareResult) {
            return res.cc('登录失败')
        }
        // TODO：登录成功，生成 Token 字符串
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值 
        const user = {...results[0], password: '', user_pic: '' }

        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
                expiresIn: '10h' // token 有效期为 10 个小时
            })
            // 6. 将生成的 Token 字符串响应给客户端：
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        })
    })
}