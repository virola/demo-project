exports.execute = function (context) {
    var response = {
        status: 0,
        is_login: 1,
        data: {
            'wx_openid': 12345678,
            'wx_avatar': 'src/img/temp/avatar.jpg',
            'wx_name': 'pmtest',
            'department': '场外'
        }
    };

    context.content = JSON.stringify(response);
};