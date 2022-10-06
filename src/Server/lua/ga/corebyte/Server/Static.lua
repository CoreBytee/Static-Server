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
        local Url = ParseURL(Request.path)

        local function ServeFiles(ServeUrl)
            local Stat = FS.statSync(ServeUrl)
            if Stat.type == "directory" then
                return ServeFiles(ServeUrl .. Index)
            end

            if FS.existsSync(ServeUrl) then
                Response.headers["Content-Type"] = Mimes.getType(ServeUrl)
                Response.headers["Content-Length"] = Stat.size
                Response.headers["Cache-Control"] = 'public, max-age=' .. 0
                Response.code = 200
                Response.body = ({FS.readFileSync(ServeUrl)})[1]
            else
                Response.code = 404
            end
        end

        ServeFiles(Path.join(Root, Url))
    end
end