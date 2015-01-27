define(
    function (require) {

        var url = {
            'dev': {
                USER_LOGIN: '#/',

                GET_ACCOUNT: 'user/info',
                POST_SIGN: 'user/sign',
                GET_ACT_STATUS: 'act/status',

                POST_BOUNCE: 'act/bounce',
                POST_SHAKE_GIFT: 'act/shake',
                POST_MESSAGE: 'act/success',

                GET_PROGRAM_LIST: 'act/program',
                GET_PROGRAM_RANK: 'act/rank',
                POST_PROGRAM: 'act/success'
            },

            'dep': {
            }
        };

        return url[ENV_RUNTIME] || url['dev'];
    }
);