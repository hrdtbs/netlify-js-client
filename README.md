See https://github.com/netlify/js-client

This package was created for personal use to address the issue that netlify js-client has removed support for the deploy
method and the recommended alternative, netlify-cli, is very bloated and not suitable for use on CI.

I do not guarantee that the deploy method will work properly. It also does not support `functions` due to the heavy
@netlify/zip-it-and-ship-it dependencies. Use at your own risk.

References:

- https://github.com/netlify/cli/issues/494
- https://github.com/netlify/cli/issues/4556
- https://github.com/netlify/js-client/issues/157

## Using deploy method

```js
import { NetlifyAPI } from 'netlify'

const client = new NetlifyAPI('1234myAccessToken')

const opts = {
  fnDir: null, // path to a folder of functions to deploy
  branch: null, // branch to pass onto the netlify api
  configPath: null, // path to a netlify.toml file to include in the deploy (e.g. redirect support for manual deploys)
  draft: false, // draft deploy or production deploy
  message: undefined, // a short message to associate with the deploy
  deployTimeout: 1.2e6, // 20 mins
  concurrentHash: 100, // number of parallel hashing calls
  concurrentUpload: 5, // number of files to upload in parallel
  maxRetry: 5, // number of times to try on failed file uploads
  filter: (filepath) => {
    /* return false to filter a file  from the deploy */
  },
  tmpDir: tempy.directory(), // a temporary directory to zip functions into
  statusCb: (statusObj) => {
    // a callback function to receive status events
    // statusObj: {
    //      type: name-of-step
    //      msg: msg to print
    //      phase: [start, progress, stop]
    //  }
    // See https://github.com/netlify/cli/blob/v2.0.0-beta.3/src/commands/deploy.js#L161-L195
    // for an example of how this can be used.
  },
  // passing a deployId will update an existing deploy based on the provided options
  deployId: null,
}

const siteId = '1234abcd'
const buildDir = './build'

const development = await client.deploy(siteId, buildDir, opts)

console.log(development)
```
