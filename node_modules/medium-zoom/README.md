<p align="center">
  <a href="https://medium-zoom.francoischalifour.com"><img src="logo.svg" alt="Demo" width="64"></a>
  <h3 align="center">medium-zoom</h3>
  <p align="center">A JavaScript library for zooming images like Medium</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/medium-zoom">
    <img src="https://img.shields.io/npm/v/medium-zoom.svg?style=flat-square" alt="version">
  </a>
  <a href="https://github.com/francoischalifour/medium-zoom/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/medium-zoom.svg?style=flat-square" alt="MIT license">
  </a>
  <a href="http://npmcharts.com/compare/medium-zoom">
    <img src="https://img.shields.io/npm/dm/medium-zoom.svg?style=flat-square" alt="downloads">
  </a>
  <br>
  <a href="https://unpkg.com/medium-zoom/dist/">
    <img src="http://img.badgesize.io/https://unpkg.com/medium-zoom/dist/medium-zoom.min.js?compression=gzip&label=gzip%20size&style=flat-square" alt="gzip size">
  </a>
  <a href="https://github.com/francoischalifour/medium-zoom/blob/master/package.json">
    <img src="https://img.shields.io/badge/dependencies-none-lightgrey.svg?style=flat-square" alt="no dependencies">
  </a>
  <a href="https://travis-ci.org/francoischalifour/medium-zoom">
    <img src="https://img.shields.io/travis/francoischalifour/medium-zoom.svg?style=flat-square" alt="travis">
  </a>
</p>

<p align="center">
  <a href="https://medium-zoom.francoischalifour.com">
    <img src="https://user-images.githubusercontent.com/6137112/43369906-7623239a-9376-11e8-978b-6e089be499fb.gif" alt="Medium Zoom Demo">
  </a>
  <br>
  <br>
  <strong>
  <a href="https://codesandbox.io/s/github/francoischalifour/medium-zoom/tree/master/website">🔬 Playground</a> ・
  <a href="https://medium-zoom.francoischalifour.com">🔎 Demo</a> ・
  <a href="https://medium-zoom.francoischalifour.com/storybook">📚 Storybook</a>
  </strong>
</p>

<details>
  <summary><strong>Contents</strong></summary>

<!--
Generate the table of contents using:

```
npx doctoc README.md --maxlevel 3
```
-->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Selectors](#selectors)
  - [Options](#options)
  - [Methods](#methods)
  - [Attributes](#attributes)
  - [Events](#events)
- [Examples](#examples)
- [Debugging](#debugging)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

</details>

## Features

- 📱 **Responsive** — _scale on mobile and desktop_
- 🚀 **Performant and lightweight** — _should be able to reach 60 [fps](https://en.wikipedia.org/wiki/Frame_rate)_
- ⚡️ **High definition support** — _load the HD version of your image on zoom_
- 🔎 **Flexibility** — _apply the zoom to a selection of images_
- 🖱 **Mouse, keyboard and gesture friendly** — _click anywhere, press a key or scroll away to close the zoom_
- 🎂 **Event handling** — _trigger events when the zoom enters a new state_
- 📦 **Customization** — _set your own margin, background and scroll offset_
- 🔧 **Pluggable** — _add your own features to the zoom_
- 💎 **Custom templates** — _extend the default look to match the UI of your app_

## Installation

The module is available on the [npm](https://www.npmjs.com) registry.

```sh
npm install medium-zoom
# or
yarn add medium-zoom
```

###### Download

- [Normal](https://cdn.jsdelivr.net/npm/medium-zoom/dist/medium-zoom.js)
- [Minified](https://cdn.jsdelivr.net/npm/medium-zoom/dist/medium-zoom.min.js)

###### CDN

- [jsDelivr](https://www.jsdelivr.com/package/npm/medium-zoom)
- [unpkg](https://unpkg.com/medium-zoom/)

## Usage

> [Try it out in the browser](https://codesandbox.io/s/github/francoischalifour/medium-zoom/tree/master/website)

Import the library as a module:

```js
import mediumZoom from 'medium-zoom'
```

Or import the library with a script tag:

```html
<script src="node_modules/medium-zoom/dist/medium-zoom.min.js"></script>
```

That's it! You don't need to import any CSS styles.

Assuming you add the `data-zoomable` attribute to your images:

```js
mediumZoom('[data-zoomable]')
```

## API

```ts
mediumZoom(selector?: string | HTMLElement | HTMLElement[] | NodeList, options?: object): Zoom
```

### Selectors

The selector allows attaching images to the zoom. It can be of the following types:

- [CSS selectors](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
- [`NodeList`](https://developer.mozilla.org/docs/Web/API/NodeList)
- [`Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)

```js
// CSS selector
mediumZoom('[data-zoomable]')

// HTMLElement
mediumZoom(document.querySelector('#cover'))

// NodeList
mediumZoom(document.querySelectorAll('[data-zoomable]'))

// Array
const images = [
  document.querySelector('#cover'),
  ...document.querySelectorAll('[data-zoomable]'),
]

mediumZoom(images)
```

### Options

The options enable the customization of the zoom. They are defined as an object with the following properties:

| Property       | Type                                  | Default  | Description                                                                 |
| -------------- | ------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `margin`       | `number`                              | `0`      | The space outside the zoomed image                                          |
| `background`   | `string`                              | `"#fff"` | The background of the overlay                                               |
| `scrollOffset` | `number`                              | `40`     | The number of pixels to scroll to close the zoom                            |
| `container`    | `string` \| `HTMLElement` \| `object` | `null`   | The viewport to render the zoom in<br> [Read more →](docs/container.md)     |
| `template`     | `string` \| `HTMLTemplateElement`     | `null`   | The template element to display on zoom<br> [Read more →](docs/template.md) |

```js
mediumZoom('[data-zoomable]', {
  margin: 24,
  background: '#BADA55',
  scrollOffset: 0,
  container: '#zoom-container',
  template: '#zoom-template',
})
```

### Methods

#### `open({ target?: HTMLElement }): Promise<Zoom>`

Opens the zoom and returns a promise resolving with the zoom.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.open()
```

_Emits an event [`open`](#events) on animation start and [`opened`](#events) when completed._

#### `close(): Promise<Zoom>`

Closes the zoom and returns a promise resolving with the zoom.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.close()
```

_Emits an event [`close`](#events) on animation start and [`closed`](#events) when completed._

#### `toggle({ target?: HTMLElement }): Promise<Zoom>`

Opens the zoom when closed / dismisses the zoom when opened, and returns a promise resolving with the zoom.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.toggle()
```

#### `attach(...selectors: string[] | HTMLElement[] | NodeList[] | Array[]): Zoom`

Attaches the images to the zoom and returns the zoom.

```js
const zoom = mediumZoom()

zoom.attach('#image-1', '#image-2')
zoom.attach(
  document.querySelector('#image-3'),
  document.querySelectorAll('[data-zoomable]')
)
```

#### `detach(...selectors: string[] | HTMLElement[] | NodeList[] | Array[]): Zoom`

Releases the images from the zoom and returns the zoom.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.detach('#image-1', document.querySelector('#image-2')) // detach two images
zoom.detach() // detach all images
```

_Emits an event [`detach`](#events) on the image._

#### `update(options: object): Zoom`

Updates the options and returns the zoom.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.update({ background: '#BADA55' })
```

_Emits an event [`update`](#events) on each image of the zoom._

#### `clone(options?: object): Zoom`

Clones the zoom with provided options merged with the current ones and returns the zoom.

```js
const zoom = mediumZoom('[data-zoomable]', { background: '#BADA55' })

const clonedZoom = zoom.clone({ margin: 48 })

clonedZoom.getOptions() // => { background: '#BADA55', margin: 48, ... }
```

#### `on(type: string, listener: () => void, options?: boolean | AddEventListenerOptions): Zoom`

Registers the listener on each target of the zoom.

The same `options` as [`addEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Parameters) are used.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.on('closed', event => {
  // the image has been closed
})

zoom.on(
  'open',
  event => {
    // the image has been opened (tracked only once)
  },
  { once: true }
)
```

The zoom object is accessible in `event.detail.zoom`.

#### `off(type: string, listener: () => void, options?: boolean | AddEventListenerOptions): Zoom`

Removes the previously registered listener on each target of the zoom.

The same `options` as [`removeEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener#Parameters) are used.

```js
const zoom = mediumZoom('[data-zoomable]')

function listener(event) {
  // ...
}

zoom.on('open', listener)
// ...
zoom.off('open', listener)
```

The zoom object is accessible in `event.detail.zoom`.

#### `getOptions(): object`

Returns the zoom options as an object.

```js
const zoom = mediumZoom({ background: '#BADA55' })

zoom.getOptions() // => { background: '#BADA55', ... }
```

#### `getImages(): HTMLElement[]`

Returns the images attached to the zoom as an array of [`HTMLElement`s](https://developer.mozilla.org/docs/Web/API/HTMLElement).

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.getImages() // => [HTMLElement, HTMLElement]
```

#### `getZoomedImage(): HTMLElement`

Returns the current zoomed image as an [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) or `null` if none.

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.getZoomedImage() // => null
zoom.open().then(() => {
  zoom.getZoomedImage() // => HTMLElement
})
```

### Attributes

#### `data-zoom-src`

Specifies the high definition image to open on zoom. This image loads when the user clicks on the source image.

```html
<img src="image-thumbnail.jpg" data-zoom-src="image-hd.jpg" alt="My image" />
```

### Events

| Event  | Description                                         |
| ------ | --------------------------------------------------- |
| open   | Fired immediately when the `open` method is called  |
| opened | Fired when the zoom has finished being animated     |
| close  | Fired immediately when the `close` method is called |
| closed | Fired when the zoom out has finished being animated |
| detach | Fired when the `detach` method is called            |
| update | Fired when the `update` method is called            |

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.on('open', event => {
  // track when the image is zoomed
})
```

The zoom object is accessible in `event.detail.zoom`.

## Examples

<details>
 <summary>Trigger a zoom from another element</summary>

```js
const button = document.querySelector('[data-action="zoom"]')
const zoom = mediumZoom('#image')

button.addEventListener('click', () => zoom.open())
```

</details>

<details>
 <summary>Track an event (for analytics)</summary>

You can use the `open` event to keep track of how many times a user interacts with your image. This can be useful if you want to gather some analytics on user engagement.

```js
let counter = 0
const zoom = mediumZoom('#image-tracked')

zoom.on('open', event => {
  console.log(`"${event.target.alt}" has been zoomed ${++counter} times`)
})
```

</details>

<details>
 <summary>Detach a zoom once closed</summary>

```js
const zoom = mediumZoom('[data-zoomable]')

zoom.on('closed', () => zoom.detach(), { once: true })
```

</details>

<details>
 <summary>Attach jQuery elements</summary>

jQuery elements are compatible with `medium-zoom` once converted to an array.

```js
mediumZoom($('[data-zoomable]').toArray())
```

</details>

<details>
 <summary>Create a zoomable React component</summary>

**Using React hooks**

```js
import React from 'react'
import mediumZoom from 'medium-zoom'

function ImageZoom({ zoom, src, alt, background }) {
  const zoomRef = React.useRef(zoom.clone({ background }))

  function attachZoom(image) {
    zoomRef.current.attach(image)
  }

  return <img src={src} alt={alt} ref={attachZoom} />
}

function App() {
  const zoom = React.useRef(mediumZoom({ background: '#000', margin: 48 }))

  render() {
    return (
      <ImageZoom src="image.jpg" alt="Image" zoom={zoom.current} color="#BADA55" />
    )
  }
}
```

**Using React classes**

```js
import React, { Component } from 'react'
import mediumZoom from 'medium-zoom'

class ImageZoom extends Component {
  zoom = this.props.zoom.clone({
    background: this.props.color,
  })

  attachZoom = image => {
    this.zoom.attach(image)
  }

  render() {
    return (
      <img src={this.props.src} alt={this.props.alt} ref={this.attachZoom} />
    )
  }
}

class App extends Component {
  zoom = mediumZoom({ background: '#000', margin: 48 })

  render() {
    return (
      <ImageZoom src="image.jpg" alt="Image" zoom={this.zoom} color="#BADA55" />
    )
  }
}
```

</details>
<br>

You can see [more examples](examples/) including [React](examples/react) and [Vue](examples/vue), or check out the [storybook](https://medium-zoom.francoischalifour.com/storybook).

## Debugging

### The zoomed image is not visible

The library doesn't provide a `z-index` value on the zoomed image to avoid conflicts with other frameworks. Some frameworks might specify a `z-index` for their elements, which makes the zoomed image not visible.

If that's the case, you can provide a `z-index` value in your CSS:

```css
.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 999;
}
```

## Browser support

| IE              | Edge            | Chrome | Firefox | Safari |
| --------------- | --------------- | ------ | ------- | ------ |
| 10<sup>\*</sup> | 12<sup>\*</sup> | 36     | 34      | 9      |

<sup>\*</sup> _These browsers require a [`template` polyfill](https://github.com/webcomponents/template) when using [custom templates](docs/template.md)_.

<blockquote>
  <p align="center">
    Cross-browser testing is sponsored by
  </p>
  <p align="center">
    <a href="https://www.browserstack.com">
      <img src="https://user-images.githubusercontent.com/6137112/44587083-35987000-a7b2-11e8-8e0d-8ba15de83802.png" alt="BrowserStack" height="35">
    </a>
  </p>
</blockquote>

## Contributing

- Run `yarn` to install Node dev dependencies
- Run `yarn start` to build the library in watch mode
- Run `yarn run storybook` to see your changes at http://localhost:9001

Please read the [contributing guidelines](CONTRIBUTING.md) for more detailed explanations.

_You can also use [npm](https://www.npmjs.com)._

## License

MIT © [François Chalifour](https://francoischalifour.com)
