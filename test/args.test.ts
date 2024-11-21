import { describe, it, expect } from 'bun:test'
import { parseArgs } from '../src/index'

describe("cli args tests", () => {

    it ("no args returns help", () => {
        expect(parseArgs("")).toEqual({ type:'help' })
    })

    it ("arg with language returns update", () => {
        expect(parseArgs("csharp")).toEqual({ type:'update', lang:'csharp' })
        expect(parseArgs("typescript")).toEqual({ type:'update', lang:'typescript' })
        expect(parseArgs("typescript.d")).toEqual({ type:'update', lang:'typescript.d' })
        expect(parseArgs("javascript")).toEqual({ type:'update', lang:'javascript' })
        expect(parseArgs("python")).toEqual({ type:'update', lang:'python' })
        expect(parseArgs("dart")).toEqual({ type:'update', lang:'dart' })
        expect(parseArgs("php")).toEqual({ type:'update', lang:'php' })
        expect(parseArgs("java")).toEqual({ type:'update', lang:'java' })
        expect(parseArgs("kotlin")).toEqual({ type:'update', lang:'kotlin' })
        expect(parseArgs("swift")).toEqual({ type:'update', lang:'swift' })
        expect(parseArgs("fsharp")).toEqual({ type:'update', lang:'fsharp' })
        expect(parseArgs("vbnet")).toEqual({ type:'update', lang:'vbnet' })
    })

    it ("arg with language ext returns update", () => {
        expect(parseArgs("cs")).toEqual({ type:'update', lang:'csharp' })
        expect(parseArgs("ts")).toEqual({ type:'update', lang:'typescript' })
        expect(parseArgs("tsd")).toEqual({ type:'update', lang:'typescript.d' })
        expect(parseArgs("js")).toEqual({ type:'update', lang:'javascript' })
        expect(parseArgs("mjs")).toEqual({ type:'update', lang:'javascript' })
        expect(parseArgs("py")).toEqual({ type:'update', lang:'python' })
        expect(parseArgs("kt")).toEqual({ type:'update', lang:'kotlin' })
        expect(parseArgs("fs")).toEqual({ type:'update', lang:'fsharp' })
        expect(parseArgs("vb")).toEqual({ type:'update', lang:'vbnet' })
    })

    it ("arg with language and url returns add", () => {
        const url = "https://openai.servicestack.net"
        expect(parseArgs("csharp", url)).toEqual({ type:'add', lang:'csharp', out:'dtos.cs', url })
        expect(parseArgs("typescript", url)).toEqual({ type:'add', lang:'typescript', out:'dtos.ts', url })
        expect(parseArgs("typescript.d", url)).toEqual({ type:'add', lang:'typescript.d', out:'dtos.d.ts', url })
        expect(parseArgs("javascript", url)).toEqual({ type:'add', lang:'javascript', out:'dtos.mjs', url })
        expect(parseArgs("python", url)).toEqual({ type:'add', lang:'python', out:'dtos.py', url })
        expect(parseArgs("dart", url)).toEqual({ type:'add', lang:'dart', out:'dtos.dart', url })
        expect(parseArgs("php", url)).toEqual({ type:'add', lang:'php', out:'dtos.php', url })
        expect(parseArgs("java", url)).toEqual({ type:'add', lang:'java', out:'dtos.java', url })
        expect(parseArgs("kotlin", url)).toEqual({ type:'add', lang:'kotlin', out:'dtos.kt', url })
        expect(parseArgs("swift", url)).toEqual({ type:'add', lang:'swift', out:'dtos.swift', url })
        expect(parseArgs("fsharp", url)).toEqual({ type:'add', lang:'fsharp', out:'dtos.fs', url })
        expect(parseArgs("vbnet", url)).toEqual({ type:'add', lang:'vbnet', out:'dtos.vb', url })
    })

    it ("arg with language, url and -include returns add", () => {
        const url = "https://openai.servicestack.net"
        const qs = { IncludeTypes:"openai" }
        expect(parseArgs("csharp", url, "-include", "openai")).toEqual({ type:'add', lang:'csharp', out:'dtos.cs', url, qs })
        expect(parseArgs("typescript", url, "-include", "openai")).toEqual({ type:'add', lang:'typescript', out:'dtos.ts', url, qs })
    })

    it ("arg with language, url and -q or --query returns add", () => {
        const url = "https://openai.servicestack.net"
        const qs = { IncludeTypes:"openai" }
        expect(parseArgs("csharp", url, "-qs", "IncludeTypes=openai")).toEqual({ type:'add', lang:'csharp', out:'dtos.cs', url, qs })
        expect(parseArgs("typescript", url, "-qs", "IncludeTypes=openai")).toEqual({ type:'add', lang:'typescript', out:'dtos.ts', url, qs })
    })

    it ("arg with language and url with queryString returns add", () => {
        const url = "https://openai.servicestack.net"
        const urlQs = url + "?IncludeTypes=openai"
        const qs = { IncludeTypes:"openai" }
        expect(parseArgs("csharp", urlQs)).toEqual({ type:'add', lang:'csharp', out:'dtos.cs', url, qs })
        expect(parseArgs("csharp", urlQs)).toEqual({ type:'add', lang:'csharp', out:'dtos.cs', url, qs })
        expect(parseArgs("typescript", urlQs)).toEqual({ type:'add', lang:'typescript', out:'dtos.ts', url, qs })
        expect(parseArgs("typescript", urlQs)).toEqual({ type:'add', lang:'typescript', out:'dtos.ts', url, qs })
    })

    it ("arg with filename returns update", () => {
        expect(parseArgs("dtos.cs")).toEqual({ type:'update', lang:'csharp', out:'dtos.cs' })
        expect(parseArgs("dtos.ts")).toEqual({ type:'update', lang:'typescript', out:'dtos.ts' })
        expect(parseArgs("dtos.d.ts")).toEqual({ type:'update', lang:'typescript.d', out:'dtos.d.ts' })
        expect(parseArgs("dtos.mjs")).toEqual({ type:'update', lang:'javascript', out:'dtos.mjs' })
        expect(parseArgs("dtos.py")).toEqual({ type:'update', lang:'python', out:'dtos.py' })
        expect(parseArgs("dtos.dart")).toEqual({ type:'update', lang:'dart', out:'dtos.dart' })
        expect(parseArgs("dtos.php")).toEqual({ type:'update', lang:'php', out:'dtos.php' })
        expect(parseArgs("dtos.java")).toEqual({ type:'update', lang:'java', out:'dtos.java' })
        expect(parseArgs("dtos.kt")).toEqual({ type:'update', lang:'kotlin', out:'dtos.kt' })
        expect(parseArgs("dtos.swift")).toEqual({ type:'update', lang:'swift', out:'dtos.swift' })
        expect(parseArgs("dtos.fs")).toEqual({ type:'update', lang:'fsharp', out:'dtos.fs' })
        expect(parseArgs("dtos.vb")).toEqual({ type:'update', lang:'vbnet', out:'dtos.vb' })
    })

    it ("arg with url and filename returns update", () => {
        const url = "https://openai.servicestack.net"
        expect(parseArgs(url, "dtos.cs")).toEqual({ type:'add', lang:'csharp', url, out:'dtos.cs' })
        expect(parseArgs(url, "dtos.ts")).toEqual({ type:'add', lang:'typescript', url, out:'dtos.ts' })
        expect(parseArgs(url, "dtos.d.ts")).toEqual({ type:'add', lang:'typescript.d', url, out:'dtos.d.ts' })
        expect(parseArgs(url, "dtos.mjs")).toEqual({ type:'add', lang:'javascript', url, out:'dtos.mjs' })
        expect(parseArgs(url, "dtos.py")).toEqual({ type:'add', lang:'python', url, out:'dtos.py' })
        expect(parseArgs(url, "dtos.dart")).toEqual({ type:'add', lang:'dart', url, out:'dtos.dart' })
        expect(parseArgs(url, "dtos.php")).toEqual({ type:'add', lang:'php', url, out:'dtos.php' })
        expect(parseArgs(url, "dtos.java")).toEqual({ type:'add', lang:'java', url, out:'dtos.java' })
        expect(parseArgs(url, "dtos.kt")).toEqual({ type:'add', lang:'kotlin', url, out:'dtos.kt' })
        expect(parseArgs(url, "dtos.swift")).toEqual({ type:'add', lang:'swift', url, out:'dtos.swift' })
        expect(parseArgs(url, "dtos.fs")).toEqual({ type:'add', lang:'fsharp', url, out:'dtos.fs' })
        expect(parseArgs(url, "dtos.vb")).toEqual({ type:'add', lang:'vbnet', url, out:'dtos.vb' })
    })

})
