exports.execute = function (context) {
    var response = {
        status: Math.floor(Math.random() * 2),
        is_login: 1,
        message: '11111'
    };

    context.content = JSON.stringify(response);
};