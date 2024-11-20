import { describe, it, expect } from 'bun:test'
import { parse } from '../src/index'

describe("cli args tests", () => {

    it ("no args returns help", () => {
        expect(parse("")).toEqual({ type:'help' })
    })

    it ("arg with language returns update", () => {
        expect(parse("csharp")).toEqual({ type:'update', lang:'csharp' })
        expect(parse("typescript")).toEqual({ type:'update', lang:'typescript' })
        expect(parse("typescript.d")).toEqual({ type:'update', lang:'typescript.d' })
        expect(parse("javascript")).toEqual({ type:'update', lang:'javascript' })
        expect(parse("python")).toEqual({ type:'update', lang:'python' })
        expect(parse("dart")).toEqual({ type:'update', lang:'dart' })
        expect(parse("php")).toEqual({ type:'update', lang:'php' })
        expect(parse("java")).toEqual({ type:'update', lang:'java' })
        expect(parse("kotlin")).toEqual({ type:'update', lang:'kotlin' })
        expect(parse("swift")).toEqual({ type:'update', lang:'swift' })
        expect(parse("fsharp")).toEqual({ type:'update', lang:'fsharp' })
        expect(parse("vbnet")).toEqual({ type:'update', lang:'vbnet' })
    })

    it ("arg with language ext returns update", () => {
        expect(parse("cs")).toEqual({ type:'update', lang:'csharp' })
        expect(parse("ts")).toEqual({ type:'update', lang:'typescript' })
        expect(parse("tsd")).toEqual({ type:'update', lang:'typescript.d' })
        expect(parse("js")).toEqual({ type:'update', lang:'javascript' })
        expect(parse("mjs")).toEqual({ type:'update', lang:'javascript' })
        expect(parse("py")).toEqual({ type:'update', lang:'python' })
        expect(parse("kt")).toEqual({ type:'update', lang:'kotlin' })
        expect(parse("fs")).toEqual({ type:'update', lang:'fsharp' })
        expect(parse("vb")).toEqual({ type:'update', lang:'vbnet' })
    })

    it ("arg with language and url returns add", () => {
        const url = "https://openai.servicestack.net"
        expect(parse("csharp", url)).toEqual({ type:'add', lang:'csharp', url })
        expect(parse("typescript", url)).toEqual({ type:'add', lang:'typescript', url })
        expect(parse("typescript.d", url)).toEqual({ type:'add', lang:'typescript.d', url })
        expect(parse("javascript", url)).toEqual({ type:'add', lang:'javascript', url })
        expect(parse("python", url)).toEqual({ type:'add', lang:'python', url })
        expect(parse("dart", url)).toEqual({ type:'add', lang:'dart', url })
        expect(parse("php", url)).toEqual({ type:'add', lang:'php', url })
        expect(parse("java", url)).toEqual({ type:'add', lang:'java', url })
        expect(parse("kotlin", url)).toEqual({ type:'add', lang:'kotlin', url })
        expect(parse("swift", url)).toEqual({ type:'add', lang:'swift', url })
        expect(parse("fsharp", url)).toEqual({ type:'add', lang:'fsharp', url })
        expect(parse("vbnet", url)).toEqual({ type:'add', lang:'vbnet', url })
    })

    it ("arg with language, url and -include returns add", () => {
        const url = "https://openai.servicestack.net"
        const qs = { IncludeTypes:"openai" }
        expect(parse("csharp", url, "-include", "openai")).toEqual({ type:'add', lang:'csharp', url, qs })
        expect(parse("typescript", url, "-include", "openai")).toEqual({ type:'add', lang:'typescript', url, qs })
    })

    it ("arg with language, url and -q or --query returns add", () => {
        const url = "https://openai.servicestack.net"
        const qs = { IncludeTypes:"openai" }
        expect(parse("csharp", url, "-q", "IncludeTypes=openai")).toEqual({ type:'add', lang:'csharp', url, qs })
        expect(parse("csharp", url, "--query", "IncludeTypes=openai")).toEqual({ type:'add', lang:'csharp', url, qs })
        expect(parse("typescript", url, "-q", "IncludeTypes=openai")).toEqual({ type:'add', lang:'typescript', url, qs })
        expect(parse("typescript", url, "--query", "IncludeTypes=openai")).toEqual({ type:'add', lang:'typescript', url, qs })
    })

    it ("arg with language and url with queryString returns add", () => {
        const url = "https://openai.servicestack.net"
        const urlQs = url + "?IncludeTypes=openai"
        const qs = { IncludeTypes:"openai" }
        expect(parse("csharp", urlQs)).toEqual({ type:'add', lang:'csharp', url, qs })
        expect(parse("csharp", urlQs)).toEqual({ type:'add', lang:'csharp', url, qs })
        expect(parse("typescript", urlQs)).toEqual({ type:'add', lang:'typescript', url, qs })
        expect(parse("typescript", urlQs)).toEqual({ type:'add', lang:'typescript', url, qs })
    })

    it ("arg with filename returns update", () => {
        expect(parse("dtos.cs")).toEqual({ type:'update', lang:'csharp', out:'dtos.cs' })
        expect(parse("dtos.ts")).toEqual({ type:'update', lang:'typescript', out:'dtos.ts' })
        expect(parse("dtos.d.ts")).toEqual({ type:'update', lang:'typescript.d', out:'dtos.d.ts' })
        expect(parse("dtos.mjs")).toEqual({ type:'update', lang:'javascript', out:'dtos.mjs' })
        expect(parse("dtos.py")).toEqual({ type:'update', lang:'python', out:'dtos.py' })
        expect(parse("dtos.dart")).toEqual({ type:'update', lang:'dart', out:'dtos.dart' })
        expect(parse("dtos.php")).toEqual({ type:'update', lang:'php', out:'dtos.php' })
        expect(parse("dtos.java")).toEqual({ type:'update', lang:'java', out:'dtos.java' })
        expect(parse("dtos.kt")).toEqual({ type:'update', lang:'kotlin', out:'dtos.kt' })
        expect(parse("dtos.swift")).toEqual({ type:'update', lang:'swift', out:'dtos.swift' })
        expect(parse("dtos.fs")).toEqual({ type:'update', lang:'fsharp', out:'dtos.fs' })
        expect(parse("dtos.vb")).toEqual({ type:'update', lang:'vbnet', out:'dtos.vb' })
    })

    it ("arg with url and filename returns update", () => {
        const url = "https://openai.servicestack.net"
        expect(parse(url, "dtos.cs")).toEqual({ type:'add', lang:'csharp', url, out:'dtos.cs' })
        expect(parse(url, "dtos.ts")).toEqual({ type:'add', lang:'typescript', url, out:'dtos.ts' })
        expect(parse(url, "dtos.d.ts")).toEqual({ type:'add', lang:'typescript.d', url, out:'dtos.d.ts' })
        expect(parse(url, "dtos.mjs")).toEqual({ type:'add', lang:'javascript', url, out:'dtos.mjs' })
        expect(parse(url, "dtos.py")).toEqual({ type:'add', lang:'python', url, out:'dtos.py' })
        expect(parse(url, "dtos.dart")).toEqual({ type:'add', lang:'dart', url, out:'dtos.dart' })
        expect(parse(url, "dtos.php")).toEqual({ type:'add', lang:'php', url, out:'dtos.php' })
        expect(parse(url, "dtos.java")).toEqual({ type:'add', lang:'java', url, out:'dtos.java' })
        expect(parse(url, "dtos.kt")).toEqual({ type:'add', lang:'kotlin', url, out:'dtos.kt' })
        expect(parse(url, "dtos.swift")).toEqual({ type:'add', lang:'swift', url, out:'dtos.swift' })
        expect(parse(url, "dtos.fs")).toEqual({ type:'add', lang:'fsharp', url, out:'dtos.fs' })
        expect(parse(url, "dtos.vb")).toEqual({ type:'add', lang:'vbnet', url, out:'dtos.vb' })
    })

})
