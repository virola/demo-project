exports.execute = function (context) {
    var response = {
        status: 0,
        is_login: 1,
        message: '11111'
    };

    context.content = JSON.stringify(response);
};