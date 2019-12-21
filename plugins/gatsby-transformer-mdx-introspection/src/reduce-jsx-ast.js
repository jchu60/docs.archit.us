const jsxAstUtils = require("./jsx-ast-utils");
const defaultExcludeTags = [
  "p",
  "tr",
  "th",
  "td",
  "li",
  "span",
  "em",
  "strong",
  "del",
  "code"
];

/**
 * Whether the node is a JSX element or fragment node
 * @param {object} node Babel JSX AST node
 */
function isJsxElement(node) {
  return (
    jsxAstUtils.isAstNode(node) &&
    (node.type === "JSXElement" || node.type === "JSXFragment")
  );
}

function cleanJsxSnippet(raw) {
  const trimmed = raw.trim();
  if (trimmed.charAt(trimmed.length - 1) === ";") return trimmed.slice(0, -1);
  else return trimmed;
}

/**
 * Converts a JSX AST node (and its subtree) to a string
 * @param {object} node Babel JSX AST
 */
function convertToString(node, context) {
  const { jsx } = context;
  if (node == null) return "";
  else if (node.type === "StringLiteral") return node.value;
  else {
    const str = cleanJsxSnippet(jsx.substring(node.start, node.end));
    if (node.type === "TemplateLiteral") return str.slice(1, -1);
    else return str;
  }
}

function reduceChildren(children) {
  let reduced = [];
  console.log(children);
  for (const child of children) {
    if (typeof child === "string") {
      const whitespaceCollapsed = child.replace(/\s\s+/g, " ");
      const trimmed = whitespaceCollapsed.trim();
      if (trimmed.length > 0) {
        children.push(trimmed);
      }
    } else {
      // Don't touch node children
      reduced.push(child);
    }
  }
  return reduced;
}

/**
 * Finds all JSX element children of the current node
 * @param {object} node Babel JSX AST
 */
function getJsxChildren(node) {
  return jsxAstUtils.findNode(node, isJsxElement, false);
}

function transformAttributes(attributes, context) {
  // Keep track of any JSX elements seen outside of direct children to parse
  // and index (but not tag as children of the current element)
  let detachedHeads = [];
  const reduceExpression = node => {
    const value = convertToString(node, context);
    const subJsx = getJsxChildren(node);
    if (subJsx.length > 0) {
      // The value is (or contains) one or more JSX tree heads; add to list
      detachedHeads = detachedHeads.concat(subJsx);
    }
    return value;
  };

  let reducedAttributes = [];
  for (const attribute of attributes) {
    if (attribute.type === "JSXAttribute") {
      // Parse simple attribute
      // ex. <tag name="value" />
      // ex. <tag name={expression} />
      // ex. <tag name />
      const { name: nameNode, value: valueNode } = attribute;
      const name = nameNode.name;
      let value;
      if (valueNode === null) {
        // value wasn't specified, so treat as truthy boolean
        value = true;
      } else {
        // value was specified, parse
        value = reduceExpression(valueNode);
      }
      reducedAttributes.push({
        name,
        value
      });
    } else if (attribute.type === "JSXSpreadAttribute") {
      // Parse rest attibute like in <tag {...{ key: "value" }} />
      if (attribute.argument.type === "ObjectExpression") {
        for (const propertyNode of attribute.argument.properties) {
          if (propertyNode.type === "ObjectProperty") {
            // Try to parse property: only use if not computed like { [a]: "b" }
            if (!propertyNode.computed) {
              // Determine if property was declared with string or identifier
              let name;
              if (propertyNode.key.type === "Identifier") {
                name = propertyNode.key.name;
              } else {
                // Declared with string literal
                name = propertyNode.key.value;
              }

              // Parse shorthand property like const a = "boo"; { a }
              if (propertyNode.shorthand) {
                reducedAttributes.push({
                  name,
                  value: name
                });
              } else {
                // Parse standard key: value property
                const value = reduceExpression(propertyNode.value);
                reducedAttributes.push({
                  name,
                  value
                });
              }
            }
          } else if (propertyNode.type === "ObjectMethod") {
            // Parse the method like { method(arg) { return null; } }
            const asString = asString(propertyNode);
            const methodName = propertyNode.key.name;
            // string like (arg) { return null; }
            const withoutName = asString.substring(
              asString.indexOf(methodName) + methodName.length
            );
            // set the value to be like function(arg) { return null; }
            reducedAttributes.push({
              name: methodName,
              value: `function${withoutName}`
            });
          }
        }
      }
    }
  }
  return [reducedAttributes, detachedHeads];
}

function transformJsxElement(jsxElement, context) {
  const { excludeTagSet, lowercaseTags, trimWhitespace } = context;

  // Keep track of any JSX elements seen outside of direct children to parse
  // and index (but not tag as children of the current element)
  let detachedHeads = [];

  // 1. Transform attributes
  let tag;
  let attributes = [];
  if (jsxElement.type === "JSXElement") {
    tag = jsxElement.openingElement.name.name;
    const [foundAttributes, foundHeads] = transformAttributes(
      jsxElement.openingElement.attributes,
      context
    );
    detachedHeads = detachedHeads.concat(foundHeads);
    attributes = foundAttributes;
  } else {
    tag = "React.Fragment";
  }

  // 2. Transform children to array of string | reduced node
  let children = [];
  if (!jsxElement.openingElement.selfClosing) {
    for (const child of jsxElement.children) {
      const [node, foundHeads] = transformNode(child, context);
      if (node !== null) {
        children.push(node);
        detachedHeads = detachedHeads.concat(foundHeads);
      }
    }
  }

  // 3. Trim whitespace children as needed
  if (trimWhitespace) {
    children = reduceChildren(children);
  }

  const reducedNode = {
    tag: lowercaseTags ? tag.toLowerCase() : tag,
    attributes,
    children,
    hasGatsbyNode: !excludeTagSet.has(tag),
    // astNode: jsxElement,
    jsx: convertToString(jsxElement, context)
  };
  return [reducedNode, detachedHeads];
}

/**
 * Transforms the current JSX element into a node of the simpler component tree
 * @param {object} node Babel JSX AST node
 */
function transformNode(node, context) {
  // Keep track of any JSX elements seen outside of direct children to parse
  // and index (but not tag as children of the current element)
  let detachedHeads = [];
  const reduceExpression = node => {
    const value = convertToString(node, context);
    const subJsx = getJsxChildren(node);
    if (subJsx.length > 0) {
      // The value is (or contains) one or more JSX tree heads; add to list
      detachedHeads = detachedHeads.concat(subJsx);
    }
    return value;
  };

  let reducedNode = null;
  if (node.type === "JSXText") {
    // Simple embedded text like <div>text</div>
    reducedNode = node.value;
  } else if (node.type === "JSXExpressionContainer") {
    // JSX javascript expression like:
    // ex. <span>{[1,2,3].toString()}</span>
    // ex. <span>{` template string `}</span>
    // ex. <span>{"string literal"}</span>
    // ex. <span>{<em>embedded jsx</em>}</span>
    const { expression } = node;
    if (expression.type === "StringLiteral") {
      // <span>{"string literal"}</span>
      reducedNode = expression.value;
    } else if (isJsxElement(expression)) {
      // <span>{<em>embedded jsx</em>}</span>
      const [element, foundHeads] = transformJsxElement(expression, context);
      reducedNode = element;
      detachedHeads = detachedHeads.concat(foundHeads);
    } else if (expression.type !== "JSXEmptyExpression") {
      // anything but <span>{}</span>
      reducedNode = reduceExpression(node);
    }
  } else if (isJsxElement(node)) {
    // Normal JSX element like <span><img /></span>
    const [element, foundHeads] = transformJsxElement(node, context);
    reducedNode = element;
    detachedHeads = detachedHeads.concat(foundHeads);
  }

  return [reducedNode, detachedHeads];
}

/**
 * Reduces the complex babel JSX AST to a simpler component tree
 * @param {object} jsxAst Babel JSX AST root node
 * @param {string} rawJsx Raw JSX document to parse substrings from
 * @param {object} options Options object from gatsby config
 * @see the readme for information on the options object
 */
function reduceJsxAst(
  jsxAst,
  jsx,
  {
    excludeTags = defaultExcludeTags,
    lowercaseTags = false,
    trimWhitespace = true
  }
) {
  const context = {
    excludeTagSet: new Set(excludeTags),
    lowercaseTags,
    jsx,
    trimWhitespace
  };

  // Transform the tree via queue, adding detached heads to the queue as they
  // are discovered to eventually traverse each JSX element node and produce a
  // final reduced forest
  let queue = [jsxAst];
  let forest = [];
  while (queue.length > 0) {
    const head = queue.shift();
    const [tree, detachedHeads] = transformNode(head, context);
    queue = queue.concat(detachedHeads);
    forest.push(tree);
  }

  return forest;
}

module.exports = reduceJsxAst;
