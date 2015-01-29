exports.execute = function (context) {

    var data = [];

    for (var i = 0; i < 10; i++) {
        data[i] = {
            'title': '节目名' + i,
            'vote_num':  (10 - i) * 999,
            'act_join': '部门名' + i,
            'act_img': 'src/img/temp/1.jpg'
        };
    }
    
    var response = {
        status: 0,
        is_login: 1,
        data: data
    };

    context.content = JSON.stringify(response);
};