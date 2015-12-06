//requirejs.config({
//    shim: {
//        jquery: {
//            exports: '$'
//        },
//        underscore: {
//            exports: '_'
//        },
//        parse: {
//            deps: [
//                'underscore',
//                'jquery'
//            ],
//            exports: 'Parse'
//        }
//    },
//    waitSeconds: 0,
//    paths: {
//        jquery: '3p/jquery',
//        underscore: '3p/underscore',
//        parse: '3p/parse'
//        //backboneLocalstorage: '../node_modules/backbone.localstorage/backbone.localStorage',
//        //text: '3p/requirejs-text/text'
//    }
//});


requirejs(['main']);




//require(["3p/jquery", "3p/underscore", "3p/parse", "routers/app-router"], function($, _, Parse, AppRouter) {
//    Parse.initialize("kbGqvtthGHcJtxulUtMXwHvULR1ORorGCCci8i4O", "61EgD1NeVAKFuE8IZwe6Vd1cXTigNl1cExolTYbB");
//    alert('Hi');
//    new AppRouter;
//    Parse.history.start();
//});
