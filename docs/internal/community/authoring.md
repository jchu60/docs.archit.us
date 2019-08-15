---
title: Authoring
---

This site contains both public-facing usage documentation and internal implementation documentation intended for contributors. As such, the pages are divided into two navigation trees: those under `/docs/internal/` and the remainder under the docs root (`/docs/`). Each appears separately on the side nav to the left.

## File format

### Frontmatter

```yml
// Titles
title: Primary page title (appears in <h1> at top) [Required]
shortTitle: Secondary page title (appears in tab title; falls back to title)
overrideNav: Side nav title (falls back to title)
overrideBreadcrumb: Breadcrumb segment title (falls back to shortTitle)
// Switches
noTOC: Disables a table of contents on the right side
noBreadcrumb: Disables the breadcrumb bar at the top
overview: Whether this page should show a "In this section" segment
isRoot: Whether this page should form the root of a subtree (appear as its own top-level heading in the side nav)
// Misc
childrenOrder: Used to specify explicit ordering of direct children pages (by slug)
```

Page content can be specified using standard markdown format:

## Headings

```md
# h1 - Lorem ipsum

## h2 - Lorem ipsum

### h3 - Lorem ipsum

#### h4 - Lorem ipsum

##### h5 - Lorem ipsum

###### h6 - Lorem ipsum
```

# h1 - Lorem ipsum

## h2 - Lorem ipsum

### h3 - Lorem ipsum

#### h4 - Lorem ipsum

##### h5 - Lorem ipsum

###### h6 - Lorem ipsum

## Elements

### Blockquote

```md
> Blockquote
```

> Blockquote

### Lists

```md
- Unordered
- list
```

- Unordered
- list

```md
1. Ordered
2. list
```

1. Ordered
2. list

### Code block

~~~md
```language
code block
```
~~~

```md
`inline` code block
```

`inline` code block

## MDX elements

To auto-generate docs pages, the site uses [MDX](https://github.com/mdx-js/mdx) under the hood to render Markdown content with custom React components. With that in mind, there are a few components that are available to page authors.

To add new ones, a component can be authored and then included in the [MDX scope](https://github.com/architus/docs.archit.us/blob/master/src/components/Mdx/mdx_scope.js) file.

### Route

```jsx
<Route method="METHOD" path="/route/{parameter}/segment" auth />
```

<Route method="METHOD" path="/route/{parameter}/segment" auth />

### Collapse

~~~jsx
<Collapse>
```js
function resolveTypeClass(name) {
  let foundClass = "fas"; // default
  for (var typeClass in typeResolutionMap) {
    if (typeResolutionMap[typeClass].includes(name)) {
      foundClass = typeClass;
      break;
    }
  }
  return foundClass;
}
```
</Collapse>
~~~

<Collapse>

```js
function resolveTypeClass(name) {
  let foundClass = "fas"; // default
  for (var typeClass in typeResolutionMap) {
    if (typeResolutionMap[typeClass].includes(name)) {
      foundClass = typeClass;
      break;
    }
  }
  return foundClass;
}
```

</Collapse>
