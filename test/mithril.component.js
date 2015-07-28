var assert = require('assert')
var m = require('../mithril.component.js')(require('mithril'))

describe('mithril-component', function () {
  it('should only patch mithril once', function () {
    var mock = require('../mithril.component.js')({
      createComponent: true
    })

    assert(mock.createComponent === true)
  })
})

describe('m.createComponent', function () {
  it('should be a function', function () {
    assert(typeof m.createComponent === 'function')
  })

  it('should throw an error when no arguments are passed', function () {
    assert.throws(function () {
      m.createComponent()
    }, Error)
  })

  it('should throw an error when an invalid argument type is passed', function () {
    assert.throws(function () {
      m.createComponent(function () {})
    }, Error)
  })

  it('should throw an error when the component does not contain a view method', function () {
    assert.throws(function () {
      var MockComponent = m.createComponent({})
    }, Error)
  })

  it('should return a function on proper instantiation', function () {
    var MockComponent = m.createComponent({
      view: function () {
        return m('div')
      }
    })

    assert(typeof MockComponent === 'function')
  })

  it('should return an object upon component invocation', function () {
    var MockComponent = m.createComponent({
      view: function () {
        return m('div')
      }
    })

    var Component = MockComponent()

    assert(typeof Component === 'object')
    assert(typeof Component.props === 'object')
    assert(typeof Component.state === 'object')
    assert(typeof Component.view === 'function')
    assert(typeof Component.controller === 'function')
  })

  it('should properly pass props to component on invocation', function () {
    var movie = 'Princess Mononoke'
    var MovieComponent = m.createComponent({
      view: function () {
        return this.props.film
      }
    })

    var Component = MovieComponent({
      film: movie
    })

    assert(Component.view() === movie)
  })


  it('should properly pass children to controller on invocation', function () {
    var RequiresChildrenComponent = m.createComponent({
      controller: function (props, children) {
        assert(children.tag === 'div')
        assert(children.attrs.className === 'child-element')
      },

      view: function () {}
    })

    var Component = RequiresChildrenComponent(null, m('div.child-element'))
    Component.controller()
  })

  it('should properly store state on controller invocation', function () {
    var fixture = {
      film: 'Princess Mononoke'
    }

    var MovieComponent = m.createComponent({
      controller: function () {
        return {
          film: this.props.film
        }
      },

      view: function () {
        return this.state.film
      }
    })

    var Component = MovieComponent(fixture)

    // Controller must be invoked prior to render
    assert(Component.controller().film === fixture.film)

    // Now that render has been invoked we continue
    assert(Component.view() === fixture.film)
  })

  // Requires DOM / Browser Environment
  //
  // it('should properly handle promises returned in the controller', function (done) {
  //   var fixture = 'You want weapons? We’re in a library! Books! The best weapons in the world!'
  //   var randomShowQuote = function (show, season, episode, after) {
  //     var onData
  //     var onError
  //
  //     setTimeout(function () {
  //       onData({
  //         quote: fixture
  //       })
  //
  //       after()
  //     }, 100)
  //
  //     var deferred = {
  //       then: function (next) {
  //         onData = next
  //         return deferred
  //       },
  //
  //       catch: function (next) {
  //         onError = next
  //         return deferred
  //       }
  //     }
  //
  //     return deferred
  //   }
  //
  //   var ShowComponent = m.createComponent({
  //     controller: function (after) {
  //       return randomShowQuote('Doctor Who', 2, 2, after.bind(this))
  //     },
  //
  //     view: function () {
  //       return this.state.quote
  //     }
  //   })
  //
  //   ShowComponent().controller(function () {
  //     console.log('?', this.state)
  //     done()
  //   })
  // })
})
