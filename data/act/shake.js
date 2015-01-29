exports.execute = function (context) {
    var STATUS = [
        // 中奖
        {
            status: 1,
            round: 1,
            cur_value: '一等奖',
            value: '二等奖'
        },
        {
            status: 1,
            round: 2,
            cur_value: '二等奖',
            value: '二等奖'
        },
        {
            status: 1,
            round: 3,
            cur_value: '三等奖',
            value: '一等奖'
        },
        // 摇过了
        {
            status: 2,
            round: 1,
            cur_value: '一等奖',
            value: '二等奖'
        },
        {
            status: 2,
            round: 2,
            cur_value: '一等奖',
            value: '三等奖'
        },
        // 结束了
        {
            status: 3,
            round: 1,
            cur_value: '一等奖',
            value: '二等奖'
        },
        {
            status: 3,
            round: 2,
            cur_value: '一等奖',
            value: '二等奖'
        },
        // 未开始
        {
            status: 4,
            round: 1,
            value: '一等奖'
        },
        // 没摇中
        {
            status: 5,
            round: 1,
            cur_value: '一等奖',
            value: '二等奖'
        },
        {
            status: 5,
            round: 2,
            cur_value: '一等奖',
            value: '二等奖'
        }
    ];

    var index = Math.floor(Math.random() * STATUS.length);
    
    var response = {
        status: 0,
        is_login: 1,
        data: STATUS[index]
    };

    context.content = JSON.stringify(response);
};