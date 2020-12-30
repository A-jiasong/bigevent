$(function() {
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    });

    // 添加自定义校验规则
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            // 先获取密码框的值
            const pwd = $('.reg_box [name=password]').val();
            // 再进行判断
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    });
    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 向服务器提交数据
        const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    // return console.log('注册失败！', res.message);
                    // 使用leyui自带的弹窗效果
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录');
                // 注册成功后，跳转到登录界面
                $('#link_login').click();
            }
        )
    });
    // 监听注册表单提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 向服务器提交数据
        const data = $(this).serialize();
        $.post('/api/login', data,
            function(res) {
                if (res.status !== 0) {
                    // return console.log('注册失败！', res.message);
                    // 使用leyui自带的弹窗效果
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将令牌token存储起来
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        )
    });
})