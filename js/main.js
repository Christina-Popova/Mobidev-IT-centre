define(['routers/app-router'], function(AppRouter) {
    console.log('a');
    Parse.initialize("kbGqvtthGHcJtxulUtMXwHvULR1ORorGCCci8i4O", "61EgD1NeVAKFuE8IZwe6Vd1cXTigNl1cExolTYbB");
    new AppRouter;
    Parse.history.start();
});
