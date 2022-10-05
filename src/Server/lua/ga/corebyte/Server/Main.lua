local App = require('weblit-app')
p("a")
p(TypeWriter.ArgumentParser:GetArgument("serverargs", "serverargs"))
local Arguments = require("json").decode(
    require("base64").decode(
        TypeWriter.ArgumentParser:GetArgument("serverargs", "serverargs")
    )
)
p("b")

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