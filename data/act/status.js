exports.execute = function (context) {
    var response = {
        status: 0,
        is_login: 1,
        data: [
            {
                'xnhb': 0,  // 新年红包
                'xnhk': 1,  // 新年贺卡
                'zfq': 0,   // 祝福墙
                'nhjm': 1,  // 年会节目
                'yyy': 0    // 摇一摇
            }
        ]
    };

    context.content = JSON.stringify(response);
};