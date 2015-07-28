(function (plugin) {
  /* istanbul ignore next: differing implementations */
  if (typeof module !== 'undefined' && module !== null && module.exports) {
    module.exports = plugin
  } else if (typeof define === 'function' && define.amd) {
    define(['mithril'], plugin)
  } else if (typeof window !== 'undefined') {
    plugin(m)
  }
})(function MithrilComponent (m) {
  // Mithril is already patched, exit to avoid infinite recursion
  if (m.createComponent) {
    return m
  }

  /**
   * No operation instruction
   */
  var noop = function () {}

  /**
   * Determine whether an Object is a Promise
   *
   * @param  {Object}  obj Object to be evaluated
   * @return {Boolean}
   */
  function isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
  }

  /**
   * Determine whether Object passed is an actual Javascript Object
   *
   * @param  {Object}  obj  Object to be evaluated
   * @return {Boolean} Evalutation result
   */
  function isObject (obj) {
    return (typeof obj === "object" && !Array.isArray(obj) && obj !== null)
  }

  /**
   * Handle children object
   */
  function handleChildren (children) {
    var result = typeof children === 'function'
      ? children()
      : children

    if (result) {
      return !Array.isArray(result) ? [result] : result
    }

    return []
  }

  /**
   * React style component classes for Mithril.js
   *
   * ### API
   *
   * - `m.createComponent(object:Object)`: returns component class
   *
   * ### Usage
   *
   * Here, we create a simple component for a list, where we can pass attributes and children from the parent.
   *
   *     var ListItemComponent = m.createComponent({
   *       render: function () {
   *         return m('li.list-item-component', this.props.attr, this.props.children)
   *       }
   *     })
   *
   *     // Instantiate the component, and render.
   *     console.log(ListItemComponent({
   *       attr: {
   *         className: 'list-item'
   *       },
   *       children: '#1'
   *     }).render())
   *
   * Next, we use the component within a mithril element node, mithril will automatically render the component
   * for you.
   *
   *     console.log(m('ul.list-component', [
   *       ListItemComponent({ attr: { className: 'list-item' }, children: '#1' })
   *     ]))
   *
   * @return {Function}
   */
  m.createComponent = function _m_createComponent (component) {
    var controller
    var onSuccess
    var onError

    // m.createComponent()
    if (arguments.length === 0) {
      throw new Error('Missing first argument on component instatiation.')
    }

    // m.createComponent(Object)
    if (arguments.length === 1 && isObject(arguments[0])) {
      // Ensure component has a render method
      if (!component.view || typeof component.view !== 'function') {
        throw new Error('Missing view method on component object.')
      }

      // Store controller or no operation function for later
      controller = component.controller || noop

      // Component defaults
      component.state = {}
      component.props = {}

      // Component aliases
      component.onunload = component.onunload || component.onUnload || noop

      // Component setState
      component.setState = function (obj) {
        component.state = obj
        m.redraw(true)
      }

      // Overload component controller
      component.controller = function (props, children) {
        var result = {}

        // Check props
        if (props && !isObject(props)) {
          throw new Error("Invalid props argument, props must be an object.")
        }

        // Store properties on component object
        // w/ fallback to original object
        component.props = props || component.props

        // Store children passed or fallback to initial elements
        component.props.children = handleChildren(children || component.props.children)

        // Invoke original controller should this be possible
        if (typeof controller === 'function') {
          result = controller.call(component, component.props, component.props.children)
        }

        // Is controller result a promise, utilize this step to
        // halt rendering until the promise has completed.
        if (isPromise(result)) {
          m.startComputation()

          onSuccess = function (data) {
            component.state = data || component.state
            m.endComputation()
          }

          onError = function (error) {
            if (typeof component.onControllerError === 'function') {
              component.onControllerError(error)
            }
            m.endComputation()
          }

          // Handle old mithril style promises
          if (typeof result.catch === 'undefined') {
            return result.then(onSuccess, onError)
          }

          return result.then(onSuccess).catch(onError)
        }

        // Save result as component state
        component.state = result || component.state

        // Return component state (default behavior for controller)
        return component.state
      }

      // Component Initializer
      return function ComponentClassConstructor (props, children) {
        if (props && !isObject(props)) {
          throw new Error("Invalid props argument, props must be an object.")
        }

        component.props = props || component.props
        component.props.children = handleChildren(children)

        return m.component(component)
      }
    }

    throw new Error("Invalid argument passed, first argument must be an Object.")
  }

  return m
})
