define(
    function (require) {
        var ENV_RUNTIME = (window.location.href.indexOf('94uv') > -1 ? 'deploy' : 'dev');

        var url = {
            'dev': {
                USER_LOGIN: '#/sign',

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

            'deploy': {
                USER_LOGIN: '#/sign',

                GET_ACCOUNT: '/index.php?app=user&func=wxLogin',
                POST_SIGN: '/index.php?app=user&func=signIn',
                GET_ACT_STATUS: '/index.php?app=project&func=activity',

                POST_BOUNCE: '/index.php?app=packet&func=get',
                POST_SHAKE_GIFT: '/index.php?app=gift&func=get',
                POST_MESSAGE: '/index.php?app=message&func=addMessage',

                GET_PROGRAM_LIST: '/index.php?app=act&func=actlist',
                GET_PROGRAM_RANK: '/index.php?app=act&func=voteList',
                POST_PROGRAM: '/index.php?app=act&func=vote'
            }
        };

        return url[ENV_RUNTIME] || url['dev'];
    }
);