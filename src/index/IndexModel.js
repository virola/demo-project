define(function (require) {
    var Model = require('er/Model');

    function IndexModel() {
        
        this.datasource = [
            {
                // 使用数据获取配置项指定name
                retrieve: function () {
                    return 'virola';
                },
                name: 'username'
            },
            {
                retrieve: function() {
                    var now = new Date;
                    var nowDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' '
                        + now.getHours() + ':' + now.getMinutes();

                    return {
                        initDate: '2015-2-28',
                        nowDate: nowDate
                    };
                },
                dump: true
            }
        ];

        Model.apply(this, arguments);
    }

    require('er/util').inherits(IndexModel, Model);

    return IndexModel;
});