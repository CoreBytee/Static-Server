const Express = require('express');

module.exports = function (Port, PackageId, ResourcePrefix, Backup) {
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
        function (Request, Response, Next) {
            if (Request.method != 'GET') {
                return Response.status(405).send('Method Not Allowed');
            }
            var ResourcePath = [...ResourcePrefix.split("/"), ...Request.path.split("/")].join("/").replaceAll("//", "/")
            if (ResourcePath.endsWith("/")) {
                ResourcePath = ResourcePath.substring(0, ResourcePath.length - 1)
            }
            if (!ResourcePath.startsWith("/")) {
                ResourcePath = "/" + ResourcePath
            }
            //console.log(ResourcePath)
            //console.log(ResourcePath + ".html")
            //console.log(ResourcePath + "/index.html")
            //console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath))
            //console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html"))
            //console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html"))
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath)) {
                Response.header('Content-Type', Express.static.mime.lookup(ResourcePath));
                return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath))
            }
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html")) {
                Response.header('Content-Type', Express.static.mime.lookup(ResourcePath + ".html"));
                return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath + ".html"))
            }
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html")) {
                Response.header('Content-Type', Express.static.mime.lookup(ResourcePath + "/index.html"));
                return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath + "/index.html"))
            }
            if (Backup) {
                const BackupResult = Backup(Request, Response);
                if (BackupResult) {
                    return Response.send(BackupResult);
                }
            }
            return Response.status(404).send('Requested resource not found');
        }
    )
    return {
        Close: function () {
            Server.close();
        },
        App: App
    }
}