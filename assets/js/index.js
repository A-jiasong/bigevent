$(function() {
    getUserInfo();
    const layer = layui.layer;
    // 点击退出按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = '/login.html';
            // 关闭confirm询问框
            layer.close(index);
        })
    })
});

// 定义获取用户信息的函数
function getUserInfo() {
    // 向服务器发起get请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象，可以将token设置在ajaxPrefilter函数里面
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // 调用renderAvatar函数，渲染用户的头像
                renderAvatar(res.data);
            }
            // 不论成功还是失败，最终都会调用 complete 回调函数
            // complete: function(res) {
            //   // console.log('执行了 complete 回调：')
            //   // console.log(res)
            //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //     // 1. 强制清空 token
            //     localStorage.removeItem('token')
            //     // 2. 强制跳转到登录页面
            //     location.href = '/login.html'
            //   }
            // }
    })
};
// 定义 renderAvatar 函数，接收服务器返回的用户数据
function renderAvatar(user) {
    // 1.获取用户的名称
    const name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}