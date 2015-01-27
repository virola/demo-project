exports.execute = function (context) {
    
    
    var response = {
        status: 0,
        is_login: 1,
        data: {
            status: 1,
            level: '一等奖',
            name: '美的面包机'
        }
    };

    context.content = JSON.stringify(response);
};