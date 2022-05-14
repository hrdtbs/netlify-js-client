See https://github.com/netlify/js-client

This package was created for personal use to address the issue that netlify js-client has removed support for the deploy
method and the recommended alternative, netlify-cli, is very bloated and not suitable for use on CI.

I do not guarantee that the deploy method will work properly. It also does not support `functions` due to the heavy
@netlify/zip-it-and-ship-it dependencies. Use at your own risk.

References:

- https://github.com/netlify/cli/issues/494
- https://github.com/netlify/cli/issues/4556
- https://github.com/netlify/js-client/issues/157
