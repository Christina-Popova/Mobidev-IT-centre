require.config({
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        parse: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Parse'
        }
    },
    paths: {
        jquery: '3p/jquery',
        underscore: '3p/underscore',
        parse: '3p/parse',
        text: '3p/text'
    }
});


require(['app']);