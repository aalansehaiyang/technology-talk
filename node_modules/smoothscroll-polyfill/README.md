# Smooth Scroll behavior polyfill

The [Scroll Behavior specification](https://developer.mozilla.org/en/docs/Web/CSS/scroll-behavior) has been introduced as an extension of the `Window` interface to allow for the developer to opt in to native smooth scrolling. To date this has only been implemented in [_Chrome_, _Firefox_ and _Opera_](https://caniuse.com/#feat=css-scroll-behavior).

Check out all the methods covered here: https://iamdustan.github.io/smoothscroll


## Installation and use

Download the production ready file [here](https://unpkg.com/smoothscroll-polyfill/dist/smoothscroll.min.js) and include it in your project, or install it as a package.

```sh
# npm
npm install smoothscroll-polyfill --save

# yarn
yarn add smoothscroll-polyfill
```

When including the polyfill in a script tag, it will run immediately after loaded.

If you are importing it as a dependency, make sure to call the `polyfill` method:

```js
import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();
```

In both cases, the script will detect if the spec is natively supported and take action only when necessary.

_The code requires requestAnimationFrame polyfill for browsers which don't support it._


### Force polyfill implementation

If you prefer to always override the native scrolling methods, place this global variable before requiring the module or including the polyfill file.

```js
window.__forceSmoothScrollPolyfill__ = true;
```

_We strongly recommend not to do this unless your project strongly needs it._


## Contribute

The requirements to contribute are [yarn](https://yarnpkg.com) and the latest LTS [Node.js](https://nodejs.org/en/) version.

First, fork the repository and do `yarn install` in the root folder to get all the dependencies to work with. Create a feature branch, write your stuff and run `yarn test` to check code style and prevent bugs.

In this project we use [Prettier](https://prettier.io) to format the final published code, you can run `yarn format` before committing. If you don't, a precommit hook will prevent you from pushing code that hasn't been formatted properly.

Are you done? Awesome, submit a pull request explaining your changes.

_This is a polyfill, not library, so make sure the behavior you are introducing is in the spec._

On tests files we are using ES2015, but the polyfill is written in ES5 for browser compatibility.


### Watch tests

If you want to watch tests as you write your code run `yarn test --watch`.


## Browser Support

Successfully working in:

- _natively supported in Chrome_
- _natively supported in Firefox_
- Safari 6+
- Internet Explorer 9+
- Microsoft Edge 12+
- Opera Next


## Standards documentation

- http://dev.w3.org/csswg/cssom-view
- http://lists.w3.org/Archives/Public/www-style/2013Mar/0314.html
