// 引入 express
const express = require('express');

// 创建服务器对象
const router = express.Router();

// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')

// 导入multer 和 Path 
const multer = require('multer');
const path = require('path');

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
    // 导入文章的验证模块
const { add_article_schema } = require('../schema/article')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// TODO:发布新文章
// 注意：在当前的路由中，先后使用了两个中间件： 
// 先使用 multer 解析表单数据 
// 再使用 expressJoi 对解析的表单数据进行验证 
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

// 向外共享路由对象
module.exports = router