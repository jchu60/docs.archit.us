function isAstNode(value) {
  return Object.prototype.hasOwnProperty.call(value, "type");
}

function getChildren(node) {
  let children = [];
  if (node != null) {
    // Examine each attribute of the object
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = node[key];
        if (value != null && typeof value === "object") {
          if (Array.isArray(value)) {
            // Check if it is a node array
            if (value.every(isAstNode)) {
              children = children.concat(value);
            }
          } else {
            // check if it is a single node
            if (isAstNode(value)) children.push(value);
          }
        }
      }
    }
  }
  return children;
}

function findContentRoot(jsxAst) {
  const result = findTag(jsxAst, "MDXLayout", false);
  if (result.length > 0) return result[0];
  else return null;
}

function findTag(ast, tag, searchMatchChildren) {
  return findNode(
    ast,
    node => node.type === "JSXElement" && node.openingElement.name.name === tag,
    searchMatchChildren
  );
}

function findNode(ast, predicate, searchMatchChildren) {
  const found = [];

  function traverseAst(node) {
    if (predicate(node)) {
      found.push(node);
      if (!searchMatchChildren) return;
    }

    // Traverse children
    for (const child of getChildren(node)) {
      traverseAst(child);
    }
  }

  traverseAst(ast);
  return found;
}

module.exports = {
  findNode,
  isAstNode,
  getChildren,
  findTag,
  findContentRoot
};
