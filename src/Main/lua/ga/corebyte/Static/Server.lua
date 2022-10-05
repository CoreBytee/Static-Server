return function (Settings)
    local Settings = Settings or {}
    Settings.Host = Settings.Host or "0.0.0.0"
    Settings.Port = Settings.Port or 80
    Settings.Path = Settings.Path or require("path").resolve("./")

    local FS = require("fs")
    local AppData = TypeWriter.ApplicationData .. "/StaticServer/"
    local ServerExe = AppData .. "/Server.twr"
    FS.mkdirSync(AppData)
    FS.writeFileSync(ServerExe, TypeWriter.LoadedPackages["Static"].Resources["/Server.twr"])

    local Server, Error = require("coro-spawn")(
        TypeWriter.This,
        {
            args = {
                "execute", "--input=" .. ServerExe,
                "--serverargs=" .. require("base64").encode(require("json").encode(Settings))
            },
            stdio = {
                process.stdin.handle,
                process.stdout.handle,
                process.stderr.handle
            }
        }
    )

    coroutine.wrap(function ()
        Server.waitExit()
    end)()

    return string.format("http://localhost:%s/", Settings.Port), function ()
        return require("uv").process_kill(Server.handle)
    end
end