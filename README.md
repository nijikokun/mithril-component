# Mithril Router

Django style router for [Mithril.js][mithril]

## Install

- Download [the latest package][download]
- NPM: `npm install mithril-router`

## Documentation

### m.route()

Router allowing creation of Single-Page-Applications (SPA) with a DRY mechanism
(identification classified as namespaces) to prevent hard-coded URLs.

- `m.route()`: returns current route
- `m.route(element)`: bind elements while abstracting away route mode
- `m.route(namespace|route(, args))`: programmatic redirect w/ arguments
- `m.route(rootElement, routes)`: configure app routing
- `m.route(rootElement, rootRoute, routes)`: configure app routing (mithril default router style)

#### Configure Routing

To define routing specify a host DOM element, and routes with a root route. Should no root
route be specified, the first route is chosen.

```js
m.route(document.body, {
  "/": { controller: home, namespace: "index", root: true },
  "/login": { controller: login, namespace: "login" },
  "/dashboard": { controller: dashboard, namespace: "dashboard" }
})
```

---

### m.route.mode

See [Mithril.route.html#mode][mithril-mode]

---

### m.route.param()

See [Mithril.route.html#param][mithril-param]

---

### m.redirect()

Redirect user to specified route, or route namespace with given arguments.

Sugar for `m.route(namespace|path(, args))`

---

### m.reverse()

Generate path using specified identifier (route namespace) and path arguments.

#### Api

- `m.reverse(namespace(, options))`: takes specified route namespace and options and generates path.

##### Options

- `params`: **Object** Route parameters, named and non-named.
- `query`: **String | Object** Querystring

#### Examples

```js
// user => /user/
m.reverse('user')

// user => /user/:id => /user/23
m.reverse('user', { params: { id: 23 }})

// user => /user/:id => /user/23?include=profile
m.reverse('user', { params: { id: 23 }, query: { include: 'profile' }})
```

[download]: https://github.com/Nijikokun/mithril-router
[mithril]: https://github.com/lhorie/mithril.js
[mithril-mode]: http://lhorie.github.io/mithril/mithril.route.html#mode
[mithril-param]: http://lhorie.github.io/mithril/mithril.route.html#param