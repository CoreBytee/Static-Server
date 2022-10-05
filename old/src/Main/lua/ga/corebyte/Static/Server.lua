return function (Settings)
    local Settings = Settings or {}
    Settings.Host = Settings.Host or "0.0.0.0"
    Settings.Port = Settings.Port or 80
    Settings.Path = Settings.Path or require("path").resolve("./")

    local App = require('utopia'):new()
    local Static = Import("ga.corebyte.Static.External.Static")
    local Path = require("path")

    App:use(
        Static(
            Path.resolve(Settings.Path)
        )
    )

    p(require("weblit-app").start())
    p(Path.resolve(Settings.Path) .. "/")
    local Server = App:listen(Settings.Port, Settings.Host)
    return string.format("http://localhost:%s/", Settings.Port), App, function ()
        Server:destroy()
    end
end