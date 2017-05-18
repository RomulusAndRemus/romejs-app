module.exports = {
  arrayPush: arrayPush,
  arrayPushLiteral: arrayPushLiteral,
  arrayUnshift: arrayUnshift
};

var traverse = require("./walk.js").traverse,
  getRoot = require("./walk.js").getRoot,
  removeTokens = require("./tokens.js").removeTokens,
  replaceCodeRange = require("./tokens.js").replaceCodeRange,
  pushTokens = require("./tokens.js").pushTokens,
  tokenAt = require("./tokens.js").tokenAt,
  addTokens = require("./tokens.js").addTokens,
  getCode = require("./query.js").getCode,
  getComment = require("./query.js").getComment,
  toProgram = require("./transformations.js").toProgram,
  attachPunctuator = require("./manipulations.js").attachPunctuator,
  attach = require("./manipulations.js").attach,
  parse = require("./io.js").parse;

/**
* Push a Literal into an ArrayExpression.
*
* @todo: support for other node types
*
* @param {Object} node
* @param {String} literal_value
* @param {Boolean} unique
* @param {String} [pre_puntuator]
*/
function arrayPushLiteral(node, literal_value, unique, pre_puntuator) {

  var i;

  if (node.type === "ArrayExpression") {
    if (unique) {
      for (i = 0; i < node.elements.length; ++i) {
        if (node.elements[i].value === literal_value) {
          return true;
        }
      }
    }

    var tree = parse(JSON.stringify(literal_value)),
      literal = toProgram(tree.body[0].expression); // get rid of Expression

    arrayPush(node, literal, pre_puntuator);

    return true;
  }

  throw new Error("node must be an ArrayExpression");
}

/**
* Push anything into an ArrayExpression.
*
* @todo: support for other node types
*
* @param {Object} node
* @param {String|Object} code
* @param {String} [pre_puntuator]
*/
function arrayPush(node, code, pre_puntuator) {

  var i,
    tree = getRoot(node),
    inject_tree;

  if (node.type === "ArrayExpression") {

    var last_node = node.elements[node.elements.length - 1];

    if ("object" === typeof code) {
      inject_tree = code;
    } else {
      inject_tree = parse(code);
    }

    attachPunctuator(tree, pre_puntuator || ",", last_node.range[1]);

    // attach the literal
    attach(node, "elements", -1, inject_tree);

    return true;
  }

  throw new Error("node must be an ArrayExpression");
}

/**
* Unshift anything into an ArrayExpression.
*
* @todo: support for other node types
*
* @param {Object} node
* @param {String|Object} code
* @param {String} [pre_puntuator]
*/
function arrayUnshift(node, code, post_puntuator) {

  var i,
    tree = getRoot(node),
    inject_tree;

  if (node.type === "ArrayExpression") {

    if ("object" === typeof code) {
      inject_tree = code;
    } else {
      inject_tree = parse(code);
    }

    // attach the literal
    attach(node, "elements", 0, inject_tree);

    var last_node = node.elements[0];
    attachPunctuator(tree, post_puntuator || ",", last_node.range[1]);

    return true;
  }

  throw new Error("node must be an ArrayExpression");
}