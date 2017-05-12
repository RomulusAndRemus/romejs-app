'use strict';

module.exports = {
  getToken: getToken,
  getTokens: getTokens,
  pushTokens: pushTokens,
  growTokens: growTokens,
  tokenAt: tokenAt,
  addTokens: addTokens,
  replaceCodeRange: replaceCodeRange,
  removeTokens: removeTokens
};

var traverse = require("./walk.js").traverse;

/**
 * Get token based on given range
 *
 * @param {Object} tree
 * @param {Number} start
 * @param {Number} end
 * @return {Object|null}
 */
function getToken(tree, start, end) {
  var i,
    token_list = tree.tokens,
    max = token_list.length;

  for (i = 0; i < max; ++i) {
    if (token_list[i].range[0] === start && token_list[i].range[1] === end) {
      return token_list[i];
    }
  }

  return null;
}

/**
 * Get tokens in range
 *
 * @param {Object} tree
 * @param {Number} start
 * @param {Number} end
 * @return {Array|null}
 */
function getTokens(tree, start, end) {
  var i,
    token_list = tree.tokens,
    max = token_list.length,
    list = [];

  for (i = 0; i < max; ++i) {
    if (token_list[i].range[0] >= start && token_list[i].range[1] <= end) {
      list.push(token_list[i]);
    }
  }

  return list;
}

/**
 * Push tokens range from start
 * @note Update nodes range
 *
 * @param {Object} tree
 * @param {Number} start
 * @param {Number} amount
 */
function pushTokens(tree, start, amount) {
  var i,
    token_list = tree.tokens,
    max = token_list.length;

  for (i = 0; i < max; ++i) {
    if (start <= token_list[i].range[0]) {
      token_list[i].range[0] += amount;
      token_list[i].range[1] += amount;
    }
  }

  traverse(tree, function (n) {
    if (n.range) {
      if (start <= n.range[0]) {
        n.range[0] += amount;
        n.range[1] += amount;
      } else if (start <= n.range[1]) {
        n.range[1] += amount;
      }
    }
  });
}

/**
 * Grow tokens in given range
 * @note Update nodes range
 *
 * @param {Object} tree
 * @param {Number} start
 * @param {Number} end
 * @param {Number} amount
 */
function growTokens(tree, start, end, amount) {
  var i,
    token_list = tree.tokens,
    max = token_list.length;

  for (i = 0; i < max; ++i) {
    if (start >= token_list[i].range[0] && end <= token_list[i].range[0]) {
      token_list[i].range[1] += amount;
    }
  }

  traverse(tree, function (n) {
    if (n.range && start >= n.range[0] && max <= n.range[1]) {
      n.range[1] += amount;
    }
  });
}

/**
 * Get the first token
 *
 * @param {Object} tree
 * @param {Number} start
 * @return {Object}
 */
function tokenAt(tree, start) {
  // add new tokens
  var i = 0,
    token_list = tree.tokens,
    max = token_list.length;

  while (i < max && token_list[i].range[0] < start) {
    ++i;
  }

  return i === max ? -1 : i;
}

/**
 * Add `src` tokens to `dst` since `start` (so keep the order)
 * @note Remember to push `src` tokens before `addTokens` otherwise won't be synced
 *
 * @param {Object} dst_tree
 * @param {Object|Array} src
 * @param {Number} start
 */
function addTokens(dst_tree, src, start) {
  src = Array.isArray(src) ? src : src.tokens;

  var i,
    dst = dst_tree.tokens,
    max = src.length;

  for (i = 0; i < max; ++i) {
    dst.splice(start + i, 0, src[i]);
  }
}

/**
 * Replace code range with given text.
 *
 * @param {Object} tree
 * @param {Array} range
 * @param {String} new_text
 */
function replaceCodeRange(tree, range, new_text) {
  tree.$code = [
    tree.$code.substring(0, range[0]),
    new_text,
    tree.$code.substring(range[1])
  ].join("");

  return tree.$code;
}

/**
 * Remove tokens in range and update ranges
 * @note Do not remove nodes.
 *
 * @param {Object} tree
 * @param {Number} start
 * @param {Number} end
 */
function removeTokens(tree, start, end) {
  //console.log(require("util").inspect(tree.tokens, {depth: null, colors: true}));

  var diff = (end - start);
  tree.tokens = tree.tokens.filter(function (n) {
    return n.range[1] < start || n.range[0] > end;
  }).map(function (n) {
    if (n.range[0] > end) { // right
      n.range[0] -= diff;
      n.range[1] -= diff;
    }

    return n;
  });

  traverse(tree, function (n) {
    if (n.range[0] > end) { // right
      n.range[0] -= diff;
      n.range[1] -= diff;
    } else if (n.range[0] < start && n.range[1] > end) { // inside
      n.range[1] -= diff;
    }
  });

  //console.log(require("util").inspect(tree.tokens, {depth: null, colors: true}));
}
