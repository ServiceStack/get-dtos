#! /usr/bin/env node

import { cli } from "./index"

await cli(process.argv)

export { cli }
