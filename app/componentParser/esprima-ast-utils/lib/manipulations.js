'use strict';

module.exports = {
  attach: attach,
  detach: detach,
  attachPunctuator: attachPunctuator,
  attachBefore: attachBefore,
  attachAfterComment: attachAfterComment,
  attachAfter: attachAfter,
  replace: replace,
  replaceComment: replaceComment,
  injectCode: injectCode
};

var traverse = require("./walk.js").traverse,
  getRoot = require("./walk.js").getRoot,
  attachComments = require("./walk.js").attachComments,
  parentize = require("./walk.js").parentize,
  idze = require("./walk.js").idze,
  removeTokens = require("./tokens.js").removeTokens,
  replaceCodeRange = require("./tokens.js").replaceCodeRange,
  pushTokens = require("./tokens.js").pushTokens,
  tokenAt = require("./tokens.js").tokenAt,
  addTokens = require("./tokens.js").addTokens,
  getCode = require("./query.js").getCode,
  getComment = require("./query.js").getComment,
  getDefaultProperty = require("./query.js").getDefaultProperty,
  toProgram = require("./transformations.js").toProgram,
  parse = require("./io.js").parse;

/**
 * Attach Code/Program to given node.
 * @note tokens are updated
 * @note range is updated
 * @note comments are not attached to root.comments (invalid-comments)
 *
 * @param {Object} node node to attach
 * @param {String} property Where attach, could be an array or an object
 * @param {Number|null} position index if an array is used as target property
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 */
function attach(node, property, position, str) {
  var root = getRoot(node);

  if (!node[property] && Array.isArray(node[property])) {
    throw new Error("invalid attach point");
  }

  // parse str to ast
  var tree;
  if ("string" === typeof str) {
    tree = parse(str);
  } else {
    tree = str;

    if (tree.type !== "Program") {
      throw new Error("only Program can be attached");
    }
  }

  // search the entry where we attach new code
  var entry,
    push_range_start;

  if (Array.isArray(node[property])) {
    if (node[property].length === 0) {
      // empty program/block
      push_range_start = node.range[0];

      // move until any text
      while (root.$code[push_range_start] === " " || root.$code[push_range_start] === "\n") {
        ++push_range_start;
      }

      if (root.$code[push_range_start] === "{") {
        ++push_range_start;
      }

    } else {
      if (position == -1) { // last
        entry = node[property][node[property].length - 1];
        push_range_start = entry.range[1];
      } else {
        entry = node[property][position];

        if (entry) {
          push_range_start = entry.range[0];
        } else {
          entry = node[property][position - 1];
          if (!entry) {
            throw new Error("cannot determine entry range");
          }

          push_range_start = entry.range[0];
        }
      }
    }
  } else { // object
    push_range_start = node.range[0];
  }

  var clean_str = tree.$code.substring(tree.range[0], tree.range[1]),
    i,
    j;

  // push new tokens
  pushTokens(tree, 0, push_range_start);
  // push old tokens
  pushTokens(root, push_range_start, clean_str.length);

  if (root.tokens.length === 0) {
    i = 0;
  } else {
    i = tokenAt(root, push_range_start);

    if (i === -1) {
      throw new Error("Cannot determine token entry?");
    }
  }

  addTokens(root, tree, i);
  replaceCodeRange(root, [push_range_start, push_range_start], clean_str);

  if (Array.isArray(node[property])) {
    for (i = 0; i < tree.body.length; ++i) {
      if (position == -1) {
        node[property].push(tree.body[i]);
      } else {
        node[property].splice(position + i, 0, tree.body[i]);
      }
    }
  } else { // object
    if (node[property] !== null) {
      throw new Error("node[" + property + "] is not null, detach first");
    }

    if (tree.body.length > 1) {
      throw new Error("Only one node can be attached to an object property");
    }

    node[property] = tree.body[0];
  }

  // rebuild parents
  parentize(root);
  idze(root);
  // should we re-attach comments ?
}

/**
 * Attach a punctuator and keep the tree ranges sane.
 * The Punctuator can be anything... be careful!
 *
 * @note The Punctuator is not parsed and could be assigned to nearest literal or alike.
 *
 * @param {Object} tree
 * @param {String} punctuator
 * @param {Number} position
 * @return {String} detached code string
 */
function attachPunctuator(tree, punctuator, position) {
  var list = [{
    type: 'Punctuator',
    value: punctuator,
    range: [position, position + punctuator.length]
  }];

  pushTokens(tree, position, punctuator.length);

  addTokens(tree, list, tokenAt(tree, position));

  replaceCodeRange(tree, [position, position], punctuator);
}

/**
 * Detach given node from it's parent
 * @note `node.$parent` is set to `null`, remember to save it first if you need it.
 *
 * @param {Object} node
 * @param {String} property
 * @return {String} detached code string
 */
function detach(node, property) {
  var parent = node.$parent,
    root = getRoot(node);

  if (!node) {
    throw new Error("invalid node given");
  }

  if (!parent) {
    throw new Error("node cannot be detached, no parent.");
  }

  property = property || getDefaultProperty(parent);

  // invalid detachable parents
  switch (parent.type) {
    case "VariableDeclarator":
      throw new Error("cannot detach from VariableDeclarator, detach the VariableDeclarator itself");
      break;
  }

  if (!parent[property]) {
    throw new Error("cannot detach from " + property);
  }

  if (Array.isArray(parent[property])) {
    if (!parent[property].length) {
      throw new Error("cannot detach from empty: " + property);
    }

    var idx = parent[property].indexOf(node);
    if (idx !== -1) {
      parent[property].splice(idx, 1);
    }
  } else if ("object" === typeof parent[property] && parent[property] !== null) {
    parent[property] = null;
  } else {
    throw new Error("cannot find node in parent[" + property + "] body");
  }

  removeTokens(root, node.range[0], node.range[1]);

  var text = getCode(node);

  replaceCodeRange(root, node.range, "");

  node.$parent = null;

  return text;
}
/**
 * Attach after node, that means `node.$parent.type` is a `BockStament`
 *
 * @param {Object} node
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 * @param {String} [property] where to search node in the parent
 */
function attachAfter(node, str, property) {
  if (node.$parent) {

    property = property || getDefaultProperty(node.$parent);

    var idx = node.$parent[property].indexOf(node);

    //require("./debug.js").debug_tree(node.$parent);
    attach(node.$parent, "body", idx + 1, str);
    //require("./debug.js").debug_tree(node.$parent);
    return true;
  }
  return false;
}

/**
 * Attach before node, that means `node.$parent.type` is a `BockStament`
 *
 * @param {Object} node
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 */
function attachBefore(node, str) {
  if (node.$parent) {
    var idx = node.$parent.body.indexOf(node);

    //require("./debug.js").debug_tree(getRoot(node));
    attach(node.$parent, "body", idx, str);
    //require("./debug.js").debug_tree(node);

    return true;
  }

  return false;
}

/**
 * Shortcut: Search for given comment, and attachAfter
 *
 * @param {Object} node
 * @param {String} comment
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 * @return {Boolean} success
 */
function attachAfterComment(node, comment, str) {
  var n = getComment(node, comment);

  if (n) {
    return attachAfter(n, str);
  }

  return false;
}

/**
 * Shortcut: detach/attach
 *
 * @param {Object} node
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 */
function replace(node, str) {
  if (node.$parent) {
    var idx = node.$parent.body.indexOf(node),
      parent = node.$parent,
      prev_code = detach(node);

    attach(parent, "body", idx, str);

    return prev_code;
  }

  return false;
}

/**
 * Shortcut: Search for a comment and replace
 *
 * @param {Object} node
 * @param {String} comment
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 */
function replaceComment(node, comment, str) {
  var n = getComment(node, comment);

  if (n) {
    replace(n, str);

    return true;
  }

  return false;
}

/**
 * Inject code directly intro the given range.
 * After the injection the code will be parsed again so original `$id` will be lost
 *
 * @note this is dangerous and powerful
 *
 * @param {Object} tree
 * @param {Array} range
 * @param {String|Object} str String is preferred if not possible remember that only Program can be attached, you may consider using `toProgram`
 * @param {Boolean} debug display $id, $parent and $code in console.log (enumerable=true)
 */
function injectCode(tree, range, str, debug) {
  var clone = {
    $code: tree.$code
  };
  replaceCodeRange(clone, range, str);
  var ntree = parse(clone.$code, debug || false);

  Object.keys(ntree).forEach(function (k) {
    tree[k] = ntree[k];
  });

  tree.$code = ntree.$code;

  parentize(tree);
  idze(tree);
}