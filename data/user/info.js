exports.execute = function (context) {
    var response = {
        status: 0,
        is_login: 1,
        data: {
            'open_id': 12345678,
            'wx_avatar': 'src/img/temp/avatar.jpg',
            'name': 'pmtest',
            // 'mobile': '13111112222',
            'department': '场外'
        }
    };

    context.content = JSON.stringify(response);
};