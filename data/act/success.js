exports.execute = function (context) {
    
    var response = {
        status: 0,
        is_login: 1,
        data: Math.round(2015 * Math.random())   // vote_num
    };

    context.content = JSON.stringify(response);
};