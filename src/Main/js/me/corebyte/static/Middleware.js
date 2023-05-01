const Express = require('express')

console.log(Express)

function MimeLookup(Path) {
    return Express.static.mime.lookup(Path)
}

module.exports = function(PackageId, ResourcePrefix, Backup) {
    return function (Request, Response) {
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
        console.log(ResourcePath)
        console.log(MimeLookup(ResourcePath))
        console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath))
        console.log(ResourcePath + ".html")
        console.log(MimeLookup(ResourcePath + ".html"))
        console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html"))
        console.log(ResourcePath + "/index.html")
        console.log(MimeLookup(ResourcePath + "/index.html"))
        console.log(TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html"))
        if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath)) {
            Response.header('Content-Type', MimeLookup(ResourcePath));
            return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath))
        }
        if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + ".html")) {
            Response.header('Content-Type', MimeLookup(ResourcePath + ".html"));
            return Response.send(TypeWriter.ResourceManager.GetRaw(PackageId, ResourcePath + ".html"))
        }
        if (TypeWriter.ResourceManager.ResourceExists(PackageId, ResourcePath + "/index.html")) {
            Response.header('Content-Type', MimeLookup(ResourcePath + "/index.html"));
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
}