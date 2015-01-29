define(
    function (require) {
        var Model = require('er/Model');

        // 配置变量，写死了
        var DEPARTMENTS = [
            {
                value: '',
                name: '请选择部门...'
            },
            {
                name: '天津项目部',
                value: '天津项目部'
            },
            {
                name: '泰富国际工程',
                value: '泰富国际工程'
            },
            {
                name: '泰富重工',
                value: '泰富重工'
            },
            {
                name: '泰富租赁',
                value: '泰富租赁'
            },
            {
                name: '能源物流事业部',
                value: '能源物流事业部'
            },
            {
                name: '泰富置业',
                value: '泰富置业'
            },
            {
                name: '营销总公司',
                value: '营销总公司'
            },
            {
                name: '营运总部',
                value: '营运总部'
            },
            {
                name: '研究院',
                value: '研究院'
            },
            {
                name: '行政总部',
                value: '行政总部'
            },
            {
                name: '财务总部',
                value: '财务总部'
            },
            {
                name: '人力资源总部',
                value: '人力资源总部'
            },
            {
                name: '风险管理总部',
                value: '风险管理总部'
            },
            {
                name: '基建指挥部',
                value: '基建指挥部'
            },
            {
                name: '党建工作总部',
                value: '党建工作总部'
            },
            {
                name: '质量管理部',
                value: '质量管理部'
            },
            {
                name: '商务部',
                value: '商务部'
            },
            {
                name: '上海分公司',
                value: '上海分公司'
            },
            {
                name: '香港分公司',
                value: '香港分公司'
            },
            {
                name: '打酱油',
                value: '打酱油'
            }
        ];

        function FormModel() {
            Model.apply(this, arguments);

            this.set('departments', DEPARTMENTS);
        }

        require('er/util').inherits(FormModel, Model);

        return FormModel;
    }
);