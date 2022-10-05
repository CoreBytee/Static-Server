local Path = require("path")
local FS = require("fs")
local Mimes = require('mime')

local UrlParse = require('url').parse
local DecodeUrl = require('querystring').urldecode
local function ParseURL(Url)
    return DecodeUrl(UrlParse(Url).pathname)
end

return function (Root)
    Root = Path.normalize(Root)
    local Index = "index.html"

    return function (Request, Response, Next)
        if Request.method ~= 'GET' and Request.method ~= 'HEAD' then return Next() end
        local Url = ParseURL(Request.url)

        local function ServeFiles(ServeUrl)
            local Stat = FS.statSync(ServeUrl)
            if Stat.type == "directory" then
                return ServeFiles(ServeUrl .. Index)
            end

            if FS.existsSync(ServeUrl) then
                Response:setHeader('Content-Type', Mimes.getType(ServeUrl))
                Response:setHeader('Content-Length', Stat.size)
                Response:setHeader('Cache-Control', 'public, max-age=' .. 0)
                Response:writeHead(200)
                Response:finish(({FS.readFileSync(ServeUrl)})[1])
                p(ServeUrl)
            else
                Response:writeHead(404)
                Response:finish()
            end
        end

        ServeFiles(Path.join(Root, Url))
    end
end