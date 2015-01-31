exports.execute = function (context) {

    var st = [0, 302];

    var response = {
        status: st[Math.floor(Math.random() * st.length)],
        is_login: 0,
        redirect: 'heka.html',
        data: {
            card_id: 3,
            from: 'Virola',
            to: '亲爱的小伙伴',
            message: '新年快乐新年快乐新年快乐新年快乐！',
            image: 'http://f.hiphotos.baidu.com/image/pic/item/3801213fb80e7bec796566fb2d2eb9389b506b68.jpg'
        }
    };

    response.status = 0;

    context.content = JSON.stringify(response);
};