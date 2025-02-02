#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'
import { json_to_tdd } from './json_to_tdd'

for (let filename of ['Colour.js', 'tdd.js', 'json_to_tdd.js']) {
  vm.runInThisContext(
    fs.readFileSync(path.resolve(__dirname, filename), 'utf-8')
  )
}

if (process.argv.length <= 2) {
  console.log('You must specify an input file')
  process.exit(1)
}

for (let n = 2; n < process.argv.length; n++) {
  let input_filename = path.resolve(process.argv[n])
  let output_filename = path.parse(input_filename).name + '.tdd'

  let json = require(input_filename)
  fs.writeFileSync(output_filename, json_to_tdd(json).toString())
}
