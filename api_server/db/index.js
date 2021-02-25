// 导入mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test01'
})

// 测试数据库是否连接成功
// db.query('select * from ev_users', (err, res) => {
//     if (err) {
//         return console.log(err.message)
//     }
//     console.log(res)
// })


// 向外共享db 数据库连接对象
module.exports = db