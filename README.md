# Mithril Component

React style components for [Mithril.js][mithril]

[![version][npm-version]][npm-url]
[![License][npm-license]][license-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependencies][david-image]][david-url]

## Install

- Download [the latest package][download]
- NPM: `npm install mithril-component`

## Usage

**Node.js / Browserify**

```js
// Include mithril
var m = require('mithril')

// Pass mithril to the component system.
// Only required to overload once, subsequent overloads will
// return the same instance
require('mithril-component')(m)
```

**Browser**

```html
<script src="path/to/mithril.js" type="text/javascript"></script>
<script src="path/to/mithril.component.js" type="text/javascript"></script>
```

## Documentation

### m.createComponent(Object specification)

Creates and returns a component class constructor which takes two arguments:

```js
Function ComponentClassConstructor (Object props, Array Children)
```

Component specification requires a `view` method which returns a mithril node element. Components specification may also contain a `controller` method which is ran when the class is created, values returned will be set on `this.state`, to learn more see [Specification Object](#specification-object).

### Specification Object

- `specification.controller(Object props, Array children)`

  Invoked immediately when used within another mithril element as a child.

  **Using Promises**

  Supports returning A+ promises, when a promise is returned inside of the controller method, the result is
  caught by a wrapper which then attaches itself to the `then` and `catch` (should it exist) methods. On
  success the promise result `data` replaces `component.state`. On error `component.onControllerError` is invoked
  with the error passed as the first argument.
- `specification.view()` Render method, should return a mithril element.
- `specification.onControllerError(Object error)` Invoked when a returned promise fails.
- `specification.onUnload()` Invoked when component is unloaded.

### Component Class Object

When `ComponentClassConstructor` is invoked the resulting object contains the following properties.

- `component.state` Component class internal state
- `component.props` Component class properties passed from parent
- `component.setState(Object State)` Sets `component.state` and invokes `m.redraw(true)`
- `component.controller(Object props, Array children)`
- `component.view()` Render method, should return a mithril element.
- `component.onControllerError(Object error)` Invoked when a returned promise fails.
- `component.onUnload()` Invoked when component is unloaded.


#### Example Usage

1. Basic usage w/ Children props ( [React Equivalent](https://facebook.github.io/react/docs/reusable-components.html#transferring-props-a-shortcut) )

  ```js
  var CheckLink = m.createComponent({
    view: function () {
      this.props.children.unshift('√ ')
      return m('a', this.props.attr || {}, this.props.children);
    }
  })

  m.render(document.body, m('div.component-holder', [
    CheckLink({
      attr: { href: '#' },
    }, 'Check, Check it out')
  ]))
  ```
2. Controller usage
  ```js
  var TimerComponent = m.createComponent({
    controller: function () {
      return this.startClock()
    },

    startClock: function () {
      var component = this
      this.state.seconds = 0
      this.state.clock = setInterval(function () {
        component.state.seconds++
        component.setState(component.state)
      }, 1000)

      return this.state
    },

    stopClock: function () {
      clearInterval(this.state.clock)
    },

    onUnload: function () {
      this.stopClock()
    },

    view: function (ctrl) {
      return m('div.timer-component', this.state.seconds);
    }
  })

  m.mount(document.body, TimerComponent())
  ```

## License

Licensed under [The MIT License](LICENSE).

[license-url]: https://github.com/Nijikokun/mithril-component/blob/master/LICENSE

[travis-url]: https://travis-ci.org/Nijikokun/mithril-component
[travis-image]: https://img.shields.io/travis/Nijikokun/mithril-component.svg?style=flat

[npm-url]: https://www.npmjs.com/package/mithril-component
[npm-license]: https://img.shields.io/npm/l/mithril-component.svg?style=flat
[npm-version]: https://img.shields.io/npm/v/mithril-component.svg?style=flat
[npm-downloads]: https://img.shields.io/npm/dm/mithril-component.svg?style=flat

[codeclimate-url]: https://codeclimate.com/github/Nijikokun/mithril-component
[codeclimate-quality]: https://img.shields.io/codeclimate/github/Nijikokun/mithril-component.svg?style=flat
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/Nijikokun/mithril-component.svg?style=flat

[david-url]: https://david-dm.org/Nijikokun/mithril-component
[david-image]: https://img.shields.io/david/Nijikokun/mithril-component.svg?style=flat

[download]: https://github.com/Nijikokun/mithril-component/archive/v1.2.3.zip
[mithril]: https://github.com/lhorie/mithril.js
