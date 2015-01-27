exports.execute = function (context) {
    
    var STATUS = [
        // 抢到了
        {
            status: 1,
            round: 1,
            value: 17.82
        },
        {
            status: 1,
            round: 2,
            value: 67.82
        },
        // 抢过了
        {
            status: 2,
            round: 1,
            value: 7.2
        },
        {
            status: 2,
            round: 2,
            value: 78.2
        },
        // 抢完了
        {
            status: 3,
            round: 1,
            value: 27.82
        },
        {
            status: 3,
            round: 2,
            value: 17.82
        },
        // 未开始
        {
            status: 4,
            round: 2,
            value: 27.82
        }
    ];

    var data = STATUS[Math.floor(Math.random() * STATUS.length)];
    
    var response = {
        status: 0,
        is_login: 1,
        data: data
    };

    context.content = JSON.stringify(response);
};