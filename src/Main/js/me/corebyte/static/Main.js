const Express = require('express')
const Middleware = await Import("me.corebyte.static.Middleware")

module.exports = function (Port, PackageId, ResourcePrefix) {
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
        Middleware(PackageId, ResourcePrefix)
    )
    return {
        Close: function () {
            Server.close();
        },
        App: App
    }
}