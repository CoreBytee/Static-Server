local App = require('weblit-app')
local Arguments = require("json").decode(
    TypeWriter.ArgumentParser:GetArgument("serverargs", "serverargs")
)

App.bind(
    {
        host = Arguments.Host,
        port = Arguments.Port
    }
)

App.use(
    Import("ga.corebyte.Server.Static")(
        Arguments.Path
    )
)

App.start()