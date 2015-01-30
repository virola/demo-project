define(
    function (require) {
        var Model = require('er/Model');
        var datasource = require('er/datasource');

        function RankModel() {
            Model.apply(this, arguments);

            // datasource
            this.datasource = {
                'source': datasource.remote(require('url').GET_PROGRAM_RANK, {
                    method: 'GET'
                })
            };
        }

        RankModel.prototype.prepare = function () {
            var list = this.get('source').data || [];
            var len = list.length;

            var voteMax;

            var program = [];

            for (var i = 0; i < len; i++) {
                var data = {
                    name: list[i]['title'],
                    department: list[i]['act_join'],
                    voteNum: list[i]['vote_num'],
                    id: list[i]['vote_id']
                };
                if (!voteMax) {
                    voteMax = data.voteNum;
                }

                data.progress = Math.floor((list[i]['vote_num'] / voteMax) * 100);
                
                program.push(data);
            }

            this.set('voteMax', voteMax);
            this.set('list', program);

        };

        require('er/util').inherits(RankModel, Model);

        return RankModel;
    }
);