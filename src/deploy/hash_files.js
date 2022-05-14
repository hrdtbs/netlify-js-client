import { promisify } from 'util'

import walker from 'folder-walker'
import pump from 'pump'

import { hasherCtor, manifestCollectorCtor, fileFilterCtor, fileNormalizerCtor } from './hasher_segments.js'

const pumpPromisify = promisify(pump)

const hashFiles = async (
  dir,
  configPath,
  { concurrentHash, hashAlgorithm = 'sha1', assetType = 'file', statusCb, filter },
) => {
  if (!filter) throw new Error('Missing filter function option')
  const fileStream = walker([configPath, dir], { filter })
  const fileFilter = fileFilterCtor()
  const hasher = hasherCtor({ concurrentHash, hashAlgorithm })
  const fileNormalizer = fileNormalizerCtor({ assetType })

  // Written to by manifestCollector
  // normalizedPath: hash (wanted by deploy API)
  const files = {}
  // hash: [fileObj, fileObj, fileObj]
  const filesShaMap = {}
  const manifestCollector = manifestCollectorCtor(files, filesShaMap, { statusCb, assetType })

  await pumpPromisify(fileStream, fileFilter, hasher, fileNormalizer, manifestCollector)

  return { files, filesShaMap }
}

export default hashFiles
