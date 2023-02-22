# Contributing to Autocomplete.js

First of all, thanks for taking a look at contributing here 🎉 If you have any questions while contributing, feel free to open an issue or to send an email to <support@algolia.com> mentioning the PR or issue you're working on.

## Development

To start developing, you can use the following commands:

```sh
yarn
yarn dev
open http://localhost:8888/test/playground.html
```

Linting is done with [eslint](http://eslint.org/) and [Algolia's configuration](https://github.com/algolia/eslint-config-algolia) and can be run with:

```sh
yarn lint
```

## Tests

Unit tests are written using [Jasmine](http://jasmine.github.io/) and ran with [Karma](http://karma-runner.github.io/). Integration tests are using [Mocha](http://mochajs.org/) and [Saucelabs](https://saucelabs.com/).

To run the unit tests suite run:

```sh
yarn test
```

To run the integration tests suite run:

```sh
yarn build
yarn server
ngrok 8888
TEST_HOST=http://YOUR_NGROK_ID.ngrok.com SAUCE_ACCESS_KEY=YOUR_KEY SAUCE_USERNAME=YOUR_USERNAME./node_modules/mocha/bin/mocha --harmony -R spec ./test/integration/test.js
```

### Testing accessibility

Autocomplete.js is accessible to screen readers, and here's how to test how most blind users will experience it:

#### Steps

1. Run `yarn dev` on your development machine
1. Start the screen reader
1. Open a browser to http://YOUR_IP:8888/test/playground.html
1. Tab to the field
1. Type a search query
1. Use the arrow keys to navigate through the results

✔ SUCCESS: results are read (not necessarily in sync with the visually selected cursor)  
𐄂 FAIL: no text is read or the screen reader keeps reading the typed query

#### Recommended testing platforms

- VoiceOver (CMD+F5 in macOS): Safari, Chrome
- [JAWS](http://www.freedomscientific.com/Products/Blindness/JAWS): IE11, Chrome (Windows 7 VM available at [modern.ie](https://modern.ie))
- [NVDA](http://www.nvaccess.org/): IE11, Chrome (Windows 8.1 VM available at [modern.ie](https://modern.ie))

#### Tips

- All screen readers work slightly differently - which makes making accessible pages tricky.
- Don't worry if the usability isn't 100% perfect, but make sure the functionality is there.

## Release

Decide if this is a patch, minor or major release, have a look at [semver.org](http://semver.org/).

```sh
npm run release [major|minor|patch|x.x.x]
```
