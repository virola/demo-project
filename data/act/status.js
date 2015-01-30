exports.execute = function (context) {
    var response = {
        status: 0,
        message: 'nologin',
        is_login: 1,
        data: {
            'xnhb1': 1,
                'xnhb2': 0,  // 新年红包
                'xnhk': 1,  // 新年贺卡
                'zfq': 1,   // 祝福墙
                'nhjm': 1,  // 年会节目
                'yyy1': 1,    // 摇一摇
                'yyy2': 0,
                'yyy3': 0
            }
    };

    context.content = JSON.stringify(response);
};