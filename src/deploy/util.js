import { basename, sep } from 'path'

import pWaitFor from 'p-wait-for'

import { DEPLOY_POLL } from './constants.js'

// Default filter when scanning for files
// eslint-disable-next-line complexity
export const defaultFilter = (filePath) => {
  if (filePath == null) {
    return false
  }

  const filename = basename(filePath)
  return (
    filename !== 'node_modules' &&
    !(filename.startsWith('.') && filename !== '.well-known') &&
    !filename.includes('/__MACOSX') &&
    !filename.includes('/.')
  )
}

// normalize windows paths to unix paths
export const normalizePath = (relname) => {
  if (relname.includes('#') || relname.includes('?')) {
    throw new Error(`Invalid filename ${relname}. Deployed filenames cannot contain # or ? characters`)
  }
  return (
    relname
      .split(sep)
      // .map(segment => encodeURI(segment)) // TODO I'm fairly certain we shouldn't encodeURI here, thats only for the file upload step
      .join('/')
  )
}

// poll an async deployId until its done diffing
export const waitForDiff = async (api, deployId, siteId, timeout) => {
  // capture ready deploy during poll
  let deploy

  // eslint-disable-next-line complexity
  const loadDeploy = async () => {
    const siteDeploy = await api.getSiteDeploy({ siteId, deployId })

    switch (siteDeploy.state) {
      // https://github.com/netlify/bitballoon/blob/master/app/models/deploy.rb#L21-L33
      case 'error': {
        const deployError = new Error(`Deploy ${deployId} had an error`)
        deployError.deploy = siteDeploy
        throw deployError
      }
      case 'prepared':
      case 'uploading':
      case 'uploaded':
      case 'ready': {
        deploy = siteDeploy
        return true
      }
      case 'preparing':
      default: {
        return false
      }
    }
  }

  await pWaitFor(loadDeploy, {
    interval: DEPLOY_POLL,
    timeout,
    message: 'Timeout while waiting for deploy',
  })

  return deploy
}

// Poll a deployId until its ready
export const waitForDeploy = async (api, deployId, siteId, timeout) => {
  // capture ready deploy during poll
  let deploy

  // eslint-disable-next-line complexity
  const loadDeploy = async () => {
    const siteDeploy = await api.getSiteDeploy({ siteId, deployId })
    switch (siteDeploy.state) {
      // https://github.com/netlify/bitballoon/blob/master/app/models/deploy.rb#L21-L33
      case 'error': {
        const deployError = new Error(`Deploy ${deployId} had an error`)
        deployError.deploy = siteDeploy
        throw deployError
      }
      case 'ready': {
        deploy = siteDeploy
        return true
      }
      case 'preparing':
      case 'prepared':
      case 'uploaded':
      case 'uploading':
      default: {
        return false
      }
    }
  }

  await pWaitFor(loadDeploy, {
    interval: DEPLOY_POLL,
    timeout,
    message: 'Timeout while waiting for deploy',
  })

  return deploy
}

// Transform the fileShaMap and fnShaMap into a generic shaMap that file-uploader.js can use
export const getUploadList = (required, shaMap) => {
  if (!required || !shaMap) return []
  // TODO: use `Array.flatMap()` instead once we remove support for Node <11.0.0
  return required.flatMap((sha) => shaMap[sha])
}
