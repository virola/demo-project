exports.execute = function (context) {

    var st = [0, 302];

    var response = {
        status: st[Math.floor(Math.random() * st.length)],
        is_login: 0,
        redirect: 'heka.html',
        data: {
            'wx_openid': 12345678,
            'wx_avatar': 'src/img/temp/avatar.jpg',
            'wx_name': 'pmtest',
            'department': '场外'
        }
    };

    response.status = 0;

    context.content = JSON.stringify(response);
};