import { $ } from 'bun'
import { describe, it, expect } from 'bun:test'

describe("Does run cli commands", () => {
    it ("empty commands should print help", async () => {
        let out = await $`./dist/get-dtos.js`.text()
        expect(out).toStartWith('get-dtos <lang>')
    })
    
    it ("unknown commands should fail", async () => {
        let out = await $`./dist/get-dtos.js unknown`.text()
        expect(out).toStartWith('Unknown Command: get-dtos unknown')
    })
    
    it ("should print version", async () => {
        let out = await $`./dist/get-dtos.js --version`.text()
        expect(out).toStartWith('Version: ')
        out = await $`./dist/get-dtos.js -version`.text()
        expect(out).toStartWith('Version: ')
        out = await $`./dist/get-dtos.js -v`.text()
        expect(out).toStartWith('Version: ')
    })
})
