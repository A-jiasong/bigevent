// 引入 express
const express = require('express');

// 创建服务器对象
const app = express();

// TODO01: 导入cors中间件
const cors = require('cors')

// 注册路由之前，配置解析 Token 的中间件 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 1.将cors注册为全局中间件，跨域处理
app.use(cors())

// 2.解析 post 请求
app.use(express.urlencoded({ extend: false }))
app.use(express.json())

// 3.统一响应，优化 res.send
app.use(require('./middleware/optimizeSend'))

// 4.使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并注册用户路由模块
app.use('/api', require('./router/user'))

// 导入并使用用户信息路由模块
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', require('./router/userinfo'))

// 导入并使用文章分类路由模块
app.use('/my/article', require('./router/artcate'))

// 导入并使用文章路由模块
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', require('./router/article'))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 错误中间件
app.use(require('./middleware/optimizeErr'))

// 监听端口
app.listen(3001, () => console.log('Api server running on http://localhost:3001'));