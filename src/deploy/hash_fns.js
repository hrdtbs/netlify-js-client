// eslint-disable-next-line no-unused-vars,require-await
const hashFns = async (dir, { tmpDir, concurrentHash, hashAlgorithm = 'sha256', assetType = 'function', statusCb }) => {
  // early out if the functions dir is omitted
  if (!dir) return { functions: {}, shaMap: {} }
  if (!tmpDir) throw new Error('Missing tmpDir directory for zipping files')
  throw new Error('Not suppported functions')
}

export default hashFns
