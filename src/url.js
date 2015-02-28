define(
    function (require) {
        var ENV_RUNTIME = (window.location.href.indexOf('94uv') > -1 ? 'deploy' : 'dev');

        var url = {
            'dev': {
                USER_LOGIN: '#/sign',

                GET_ACCOUNT: '/user/info'
            },

            'deploy': {
                USER_LOGIN: '#/sign'
            }
        };

        return url[ENV_RUNTIME] || url['dev'];
    }
);