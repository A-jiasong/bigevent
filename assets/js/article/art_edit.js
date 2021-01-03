$(function() {

    // console.log(location.search);   ?id-1234
    // location.search.split('?');
    // location.search.split('?')[1];
    // location.search.split('?')[1].split('&);

    const formatParams = str => {
        let r = str.split('?')[1].split('&');
        const obj = [];
        for (let i = 0; i < r.length; i++) {
            let arr = r[i].split('=');
            obj[arr[0]] = arr[1];
        }
        return obj;
    }
    const obj = formatParams(location.search);
    console.log(obj);
    const getArticleDetails = () => {
        $.ajax({
            url: '/my/article/${obj.id}',
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取数据失败！')
                }
                // layui.form.val('artEdit', res.data);
                initCate();

            }
        })
    }
    getArticleDetails();

    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor()

    // 加载文章分类的方法
    function initCate(data) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();
                layui.form.val('artEdit', data);
                // 内容位置没有填充，使用手动来填充
                document.querySelector('#content_ifr').contentDocument.querySelector('#tinymce').innerHTML = data.content

                $image.prop('src', 'http://ajax.frontend.itheima.net' + data.cover_img);
                $image.cropper(options);

            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    // 为选择封面的按钮，绑定点击事件处理函数
    // $image.cropper(options);
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //     为表单绑定 submit 提交事件

    // - 阻止表单默认提交行为
    // - 基于 form 表单，快速创建一个 FormData 对象
    // - 将文章的发布状态，存到 FormData 对象中
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        //     - 将裁剪后的图片输出成一个文件
        // - 把文件追加到 formData 中即可
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                fd.append('Id', obj.id);
                // 6.发起ajax数据请求
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // location.href = '/article/art_list.html';
                window.parent.document.querySelector('[href="/article/art_list.html"]').click();
            }
        })
    }


})