define(
    function (require) {
        var store = {};

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