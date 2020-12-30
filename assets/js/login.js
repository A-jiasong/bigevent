$(function () {
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })
})