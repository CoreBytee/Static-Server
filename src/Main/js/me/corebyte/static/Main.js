const Express = require('express')

module.exports = function (Port, PackageId, ResourcePrefix, Backup, OnServe) {
    if (!ResourcePrefix) {ResourcePrefix = ""}
    const App = Express();
    const Server = App.listen(Port);
    App.set('etag', false)
    App.use(
        function (Request, Response, Next) {
            Response.header('Access-Control-Allow-Origin', '*');
            Response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            Next();
        }
    )
    App.use(
        Import("me.corebyte.static.Middleware")(PackageId, ResourcePrefix, Backup, OnServe)
    )
    return {
        Close: function () {
            Server.close();
        },
        App: App
    }
}