define(
    function (require) {
        var store = {};

        // function queryToJson(url) {
        //     var query   = url.substr(url.lastIndexOf('?') + 1);
        //     var params  = query.split('&');
        //     var len     = params.length;
        //     var result  = {};
            
        //     for (var i = 0; i < len; i++) {
        //         if(!params[i]){
        //             continue;
        //         }
        //         var param   = params[i].split('=');
        //         var key     = param[0];
        //         var value   = param[1];
                
        //         var item = result[key];
        //         if ('undefined' == typeof item) {
        //             result[key] = value;
        //         } 
        //         else if ($.isArray(item)) {
        //             item.push(value);
        //         } 
        //         else { // 这里只可能是string了
        //             result[key] = [item, decodeURIComponent(value)];
        //         }
        //     }
            
        //     return result;
        // };

        store.set = function (key, value) {
            if (!localStorage) {
                console.log('no localStorage supported!');
                return null;
            }
            if ($.isPlainObject(value)) {
                localStorage.setItem(key, JSON.stringify(value));
            }
            else {
                localStorage.setItem(key, value);
            }
        };

        store.get = function (key) {
            if (!localStorage) {
                console.log('no localStorage supported!');
                return null;
            }
            var value = localStorage.getItem(key) || '';
            try {
                value = $.parseJSON(value);
            }
            catch (e) {
                // ...
            }
            
            return value;
        };
        return store;
    }
);