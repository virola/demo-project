exports.execute = function (context) {
    var data = {
        'xnhb1': 1,
        'xnhb2': 0,  // 新年红包
        'xnhk': 1,  // 新年贺卡
        'zfq': 1,   // 祝福墙
        'nhjm': 1,  // 年会节目
        'yyy1': 1,    // 摇一摇
        'yyy2': 0,
        'yyy3': 0
    };

    var status = [0, 1, 302];

    var response = {
        status: 0,
        message: 'nologin',
        redirect: '/heka.html',
        is_login: Math.floor(Math.random() * 2),
        data: data
    };

    context.content = JSON.stringify(response);
};