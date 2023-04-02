const Express = require('express');

module.exports = function (Port, PackageId, ResourcePrefix="", Backup) {
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
            console.log('Request: ' + Request.url);
            var ResourcePath = [...ResourcePrefix.split("/"), ...Request.path.split("/")].join("/").replaceAll("//", "/")
            if (ResourcePath.endsWith("/")) {
                ResourcePath = ResourcePath.substring(0, ResourcePath.length - 1)
            }
            console.log(ResourcePath)
            console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath))
            console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html"))
            console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html"))
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath)) {
                return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath))
            }
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html")) {
                return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath + ".html"))
            }
            if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html")) {
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
    return Server;
}