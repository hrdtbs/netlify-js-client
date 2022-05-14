import { resolve } from 'path'

import test from 'ava'

import { DEFAULT_CONCURRENT_HASH } from './constants.js'
import hashFiles from './hash_files.js'
import { defaultFilter } from './util.js'

// eslint-disable-next-line no-underscore-dangle
const __dirname = new URL(import.meta.url).pathname

test('hashes files in a folder', async (t) => {
  const { files, filesShaMap } = await hashFiles(__dirname, resolve(__dirname, '../../fixtures/netlify.toml'), {
    filter: defaultFilter,
    concurrentHash: DEFAULT_CONCURRENT_HASH,
    statusCb() {},
  })
  t.truthy(files['netlify.toml'], 'includes the netlify.toml file')
  Object.keys(files).forEach((filePath) => {
    t.truthy(filePath, 'each file has a path')
  })
  t.truthy(filesShaMap, 'filesShaMap is returned')
  Object.values(filesShaMap).forEach((fileObjArray) => {
    fileObjArray.forEach((fileObj) => {
      t.truthy(fileObj.normalizedPath, 'fileObj have a normalizedPath field')
    })
  })
})
