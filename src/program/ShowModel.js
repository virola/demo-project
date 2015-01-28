define(
    function (require) {
        var Model = require('er/Model');
        var datasource = require('er/datasource');

        function IndexModel() {
            Model.apply(this, arguments);

            // datasource
            this.datasource = {
                'list': datasource.remote(require('url').GET_PROGRAM_LIST, {
                    method: 'GET'
                })
            };
        }

        IndexModel.prototype.prepare = function () {
            var list = this.get('list');
            var len = list.length;

            var program = [];

            for (var i = 0; i < len; i++) {
                var item = list[i];
                program.push({
                    number: i + 1,
                    name: item['title'],
                    department: item['act_join'],
                    voteNum: item['vote_num'],
                    id: item['vote_id'],
                    banner: item['act_img']
                });
            }

            this.set('list', program);

        };

        require('er/util').inherits(IndexModel, Model);

        return IndexModel;
    }
);