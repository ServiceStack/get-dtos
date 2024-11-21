import fs from "fs"
import path from "path"
import packageConf from '../package.json'

// src/index.ts
const ALIAS:Record<string,any> = {
    "cs":  "csharp",
    "ts":  "typescript",
    "mjs": "javascript",
    "js":  "javascript",
    "tsd": "typescript.d",
    "py":  "python",
    "kt":  "kotlin",
    "vb":  "vbnet",
    "fs":  "fsharp",
    "sw":  "swift",
    "ja":  "java",
    "da":  "dart",
}
const REF_EXT:Record<string,any> = {
    "csharp":       "dtos.cs",
    "typescript":   "dtos.ts",
    "typescript.d": "dtos.d.ts",
    "javascript":   "dtos.mjs",
    "python":       "dtos.py",
    "dart":         "dtos.dart",
    "php":          "dtos.php",
    "java":         "dtos.java",
    "kotlin":       "dtos.kt",
    "swift":        "dtos.swift",
    "fsharp":       "dtos.fs",
    "vbnet":        "dtos.vb",
}
const LANGS = Object.keys(REF_EXT)
const LANG_EXTS = Object.values(REF_EXT)

type CommandType = "add" | "update" | "help" | "version" | "verbose" | "json"

type Command = {
    lang?: string
    url?: string
    qs?: Record<string,any>
    out?: string
    type:CommandType
    verbose?: boolean
    json?: boolean
    ignoreSsl?: boolean
    unknown?: string[]
    script?: { name:string, cwd:string }
}

export function parseArgs(...args: string[]) : Command {
    const ret:Command = { type: "help" }
    for (let i=0; i<args.length; i++) {
        const arg = args[i]
        const opt = normalizeSwitches(arg)
        if (opt.startsWith('/')) {
            switch (opt) {
                case "/?":
                case "/h":
                case "/help":
                    ret.type = "help"
                    break
                case "/v":
                case "/version":
                    ret.type = "version"
                    break
                case "/verbose":
                    ret.verbose = true
                    break
                case "/include":
                    ret.qs = { IncludeTypes: args[++i] }
                    break
                case "/qs":
                    ret.qs = queryString('?' + args[++i])
                    break
                case "/ignore-ssl-errors":
                    ret.ignoreSsl = true
                    break
                case "/json":
                    ret.json = true
                    break
                default:
                    ret.unknown = ret.unknown || []
                    ret.unknown.push(arg)
                    break
            }
        } else if (LANGS.includes(arg)) {
            ret.lang = arg
            ret.type = "update"
        } else if (ALIAS[arg]) {
            ret.lang = ALIAS[arg]
            ret.type = "update"
        } else if (arg.indexOf("://") >= 0) {
            const hasQs = arg.indexOf('?') >= 0
            ret.url = hasQs
                ? arg.substring(0, arg.indexOf('?'))
                : arg
            if (hasQs) ret.qs = queryString(arg.substring(arg.indexOf('?')))
            ret.type = "add"
            const localHosts = ["localhost","0.0.0.0","127.0.0.1","10.0.2.2","192.168.0.2"]
            if (localHosts.some(host => arg.includes("://" + host))) ret.ignoreSsl = true
            ret.out = REF_EXT[ret.lang!]
        } else if (LANG_EXTS.some(ext => arg.endsWith(ext))) {
            ret.out = arg
            ret.type = ret.url ? "add" : "update"
            const entry = Object.entries(REF_EXT).find(([lang,ext]) => arg.endsWith(ext))
            if (entry) ret.lang = entry[0]
        } else if (arg) {
            ret.unknown = ret.unknown || []
            ret.unknown.push(arg)
        }
    }
    return ret
}

function logAnyUnknownCommand(command:Command) {
    if (command.unknown?.length) {
        console.log(`Unknown Command: ${command.script!.name} ${command.unknown!.join(' ')}\n`)
        return -1
    }
    return 0
}

var VERBOSE = false
export async function cli(args: string[]) {
    //var nodeExe = args[0]
    const cliPath = args[1]
    const scriptNameExt = splitOnLast(cliPath.replace(/\\/g, '/'), '/')[1]
    const cmdArgs = args.slice(2)
    
    const command = parseArgs(...cmdArgs)
    command.script = { 
        name: splitOnLast(scriptNameExt, '.')[0],
        cwd: process.cwd()
    }

    if (command.ignoreSsl) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"        
    }

    if (command.json) {
        console.log(JSON.stringify(command, null, 4))
        return
    }

    if (command.verbose) {
        VERBOSE = true
        cmdArgs.shift()
        let arg1 = cmdArgs[0] || ""
        console.log(arg1, cmdArgs, ' VERBOSE: ', VERBOSE)
    }

    if (command.unknown?.length) {
        return execHelp(command)
    }

    try {
        switch (command.type) {
            case "help":
                return execHelp(command)
            case "version":
                console.log("Version: " + packageConf.version)
                return
            case "update":
                if (!command.out) {
                    execDefault(command)
                } else {
                    await updateReference(command.lang!, command.out)
                }
                return
            case "add":
                var typesUrl = command.url!.indexOf("/types/" + command.lang) == -1
                    ? combinePaths(command.url!, "/types/" + command.lang)
                    : command.url!
                if (command.qs && Object.keys(command.qs).length > 0) {
                    typesUrl = appendQueryString(typesUrl, command.qs)
                }
                let fileName = command.out ?? REF_EXT[command.lang!]
                if (fs.existsSync(fileName)) {
                    // if exists create a new file name
                    var parts = new URL(typesUrl).host.split('.')
                    fileName = parts.length >= 2
                        ? parts[parts.length - 2]
                        : parts[0]
                    fileName += "." + REF_EXT[command.lang!]
                }
                await saveReference(command.lang!, typesUrl, fileName)
                break
        }
    } catch (e) {
        handleError(e)
    }
}

function handleError(e:any, msg?:string) {
    if (msg) {
        console.error(msg)
    }
    if (VERBOSE) console.error
    else console.error(e.message || e)
    process.exit(-1)
}
async function updateReference(lang:string, target:string) {
    if (VERBOSE)
        console.log('updateReference', lang, target)
    var targetExt = splitOnLast(target, '.')[1]
    var langExt = splitOnLast(REF_EXT[lang], '.')[1]
    if (targetExt != langExt)
        throw new Error("Invalid file type: '" + target + "', expected '." + langExt + "' source file")
    var existingRefPath = path.resolve(target)
    if (!fs.existsSync(existingRefPath))
        throw new Error("File does not exist: " + existingRefPath.replace(/\\/g, '/'))
    var existingRefSrc = fs.readFileSync(existingRefPath, 'utf8')
    var startPos = existingRefSrc.indexOf("Options:")
    if (startPos === -1)
        throw new Error("ERROR: " + target + " is not an existing ServiceStack Reference")
    var options:Record<string,any> = {}
    var baseUrl = ""
    existingRefSrc = existingRefSrc.substring(startPos)
    var lines = existingRefSrc.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        var line = lines[i]
        if (line.startsWith("*/"))
            break
        if (lang === "vbnet") {
            if (line.trim().length === 0)
                break
            if (line[0] === "'")
                line = line.substring(1)
        }
        if (line.startsWith("BaseUrl: ")) {
            baseUrl = line.substring("BaseUrl: ".length)
        } else if (baseUrl) {
            if (!line.startsWith("//") && !line.startsWith("'")) {
                var parts = splitOnFirst(line, ":")
                if (parts.length === 2) {
                    var key = parts[0].trim()
                    var val = parts[1].trim()
                    options[key] = val
                }
            }
        }
    }
    if (!baseUrl)
        throw new Error("ERROR: Could not find baseUrl in " + target);
    var qs = "";
    for (var key in options) {
        qs += qs.length > 0 ? "&" : "?";
        qs += key + "=" + encodeURIComponent(options[key])
    }
    var typesUrl = combinePaths(baseUrl, "/types/" + lang) + qs
    await saveReference(lang, typesUrl, target)
}
async function saveReference(lang:string, typesUrl:string, fileName:string) {
    if (VERBOSE)
        console.log('saveReference', lang, typesUrl, fileName)
    var filePath = path.resolve(fileName)
    try {
        const r = await fetch(typesUrl)
        const dtos = await r.text()
        try {
            if (dtos.indexOf("Options:") === -1)
                throw new Error("ERROR: Invalid Response from " + typesUrl)
            var filePathExists = fs.existsSync(filePath)
            fs.writeFileSync(filePath, dtos, 'utf8')
            console.log(filePathExists ? "Updated: " + fileName : "Saved to: " + fileName)
            if (process.env.SERVICESTACK_TELEMETRY_OPTOUT != "1") {
                var cmdType = filePathExists ? "updateref" : "addref"
                var statsUrl = "https://servicestack.net/stats/" + cmdType + "/record?name=" + lang + "&source=cli&version=" + packageConf.version
                try {
                    (await fetch(statsUrl)).text()
                }
                catch (ignore) { }
            }
        } catch (e) {
            handleError(e, "ERROR: Could not write DTOs to: " + fileName)
        }
    } catch (e) {
        handleError(e)
    }
}

async function execDefault(command:Command) {

    const { lang, script } = command
    if (!lang || !REF_EXT[lang])
        return

    const out = REF_EXT[lang]
    var matchingFiles:string[] = []
    const ignoreDirs = [
        ".git", ".vscode", ".idea", "node_modules", "bin", "obj", "dist", "build", ".venv", "packages",
        "gradle", "dart_tool", "vendor"
    ]
    walk(script!.cwd, ignoreDirs).forEach(function (entry) {
        if (entry.endsWith(out!)) {
            matchingFiles.push(entry)
        }
    })
    if (matchingFiles.length === 0) {
        console.error("No '." + out + "' files found")
        process.exit(-1)
    } else {
        for (const target of matchingFiles) {
            try {
                if (lang) {
                    await updateReference(lang, target)
                }
            }
            catch (e:any) {
                console.error(e.message || e)
            }
        }
    }
}

function walk(dir:string, ignoreDirs:string[]) {
    var results:string[] = []
    if (!ignoreDirs.some(ignoreDir => dir.endsWith(ignoreDir))) {
        const list = fs.readdirSync(dir)
        list.forEach(function (file:string) {
            file = path.join(dir, file)
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(walk(file, ignoreDirs))
            }
            else {
                /* Is a file */
                results.push(file)
            }
        })
    }
    return results
}

function execHelp(command:Command) {
    const exitCode = logAnyUnknownCommand(command)

    const tool = command.script?.name ?? "get-dtos"
    var USAGE = `
${tool} <lang>                  Update all ServiceStack References in directory (recursive)
${tool} <file>                  Update existing ServiceStack Reference (e.g. dtos.cs)
${tool} <lang>     <url> <file> Add ServiceStack Reference and save to file name
${tool} csharp     <url>        Add C# ServiceStack Reference            (Alias 'cs')
${tool} typescript <url>        Add TypeScript ServiceStack Reference    (Alias 'ts')
${tool} swift      <url>        Add Swift ServiceStack Reference         (Alias 'sw')
${tool} java       <url>        Add Java ServiceStack Reference          (Alias 'ja')
${tool} kotlin     <url>        Add Kotlin ServiceStack Reference        (Alias 'kt')
${tool} dart       <url>        Add Dart ServiceStack Reference          (Alias 'da')
${tool} fsharp     <url>        Add F# ServiceStack Reference            (Alias 'fs')
${tool} vbnet      <url>        Add VB.NET ServiceStack Reference        (Alias 'vb')
${tool} tsd        <url>        Add TypeScript Definition ServiceStack Reference    

Options:
    -h, --help, ?             Print this message
    -v, --version             Print tool version version
        --include <tag>       Include all APIs in specified tag group
        --qs <key=value>      Add query string to Add ServiceStack Reference URL
        --verbose             Display verbose logging
        --ignore-ssl-errors   Ignore SSL Errors
`
    console.log(USAGE.trim())
    if (process.env.SERVICESTACK_TELEMETRY_OPTOUT == null) {
        console.log(`\nThis tool collects anonymous usage to determine the most used languages to improve your experience.
To disable set SERVICESTACK_TELEMETRY_OPTOUT=1 environment variable to 1 using your favorite shell.`)
    }

    return exitCode
}

function normalizeSwitches(cmd:string) { return cmd.replace(/^-+/, '/') }

//utils
function splitOnFirst(s: string, c: string): string[] {
    if (!s) return [s]
    let pos = s.indexOf(c)
    return pos >= 0 ? [s.substring(0, pos), s.substring(pos + 1)] : [s]
}
function splitOnLast(s: string, c: string): string[] {
    if (!s) return [s]
    let pos = s.lastIndexOf(c)
    return pos >= 0
        ? [s.substring(0, pos), s.substring(pos + 1)]
        : [s]
}
function rightPart(s:string, needle:string) {
    if (s == null) return null
    let pos = s.indexOf(needle)
    return pos == -1
        ? s
        : s.substring(pos + needle.length)
}
function queryString(url: string): any {
    if (!url || url.indexOf('?') === -1) return {}
    let pairs = rightPart(url, '?')?.split('&') ?? []
    let map:Record<string,any> = {}
    for (let i = 0; i < pairs.length; ++i) {
        let p = pairs[i].split('=')
        map[p[0]] = p.length > 1
            ? decodeURIComponent(p[1].replace(/\+/g, ' '))
            : null
    }
    return map
}
function appendQueryString(url: string, args: any): string {
    for (let k in args) {
        if (args.hasOwnProperty(k)) {
            let val = args[k]
            if (typeof val == 'undefined' || typeof val == 'function' || typeof val == 'symbol') continue
            url += url.indexOf("?") >= 0 ? "&" : "?"
            url += k + (val === null ? '' :  "=" + qsValue(val))
        }
    }
    return url
}
function qsValue(arg: any) {
    if (arg == null)
        return ""
    return encodeURIComponent(arg) || ""
}
function combinePaths(...paths: string[]): string {
    let parts:string[] = []
    for (let i = 0; i < paths.length; i++) {
        let arg = paths[i]
        parts = arg.indexOf("://") === -1
            ? parts.concat(arg.split("/"))
            : parts.concat(arg.lastIndexOf("/") === arg.length - 1 ? arg.substring(0, arg.length - 1) : arg)
    }
    let combinedPaths = []
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        if (!part || part === ".") continue
        if (part === "..") combinedPaths.pop()
        else combinedPaths.push(part)
    }
    if (parts[0] === "") combinedPaths.unshift("")
    return combinedPaths.join("/") || (combinedPaths.length ? "/" : ".")
}
