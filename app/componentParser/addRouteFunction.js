const fs = require('fs');
const path = require('path');
const eau = require('./esprima-ast-utils/index.js');

const addRouteFunction = {};

addRouteFunction.grabRouteRange = (src) => {
  let ranges = [];
  let close = '>';
  let pastRouter = false;
  let Routeridx = [];
  let closeCounter = 0;
  let closeIdx = null;

  for (let i = 0; i < src.length; i++) {
    if (src[i] === 'R' && src[i + 1] === 'o' && src[i + 2] === 'u' && src[i + 3] === 't' && src[i + 4] === 'e' && src[i + 5] === 'r' && src[i + 6] === '>') {
      Routeridx.push(i + 6, i + 7)
    }
  }

  for (let i = Routeridx[1]; i < src.length; i++) {
    if (src[i] === 'R' && src[i + 1] === 'o' && src[i + 2] === 'u' && src[i + 3] === 't' && src[i + 4] === 'e') {
      for (let j = i + 4; j < src.length - 4; j++) {
        if (src[j] === '>') {
          return [j + 1, j + 2];
        }
      }
    }
  }


  for (let i = Routeridx[1]; ranges.length < 2 && i < src.length; i++) {
    if (src[i] === '>') {
      closeCounter++
    }

    if (closeCounter === 1) {
      //find the ending JSX element
      ranges.push(i, i + 1)
      return ranges;
    }
  }

  return [0, 0]
}

addRouteFunction.grabLinkRange = (src) => {

  for (let i = 0; i < src.length; i++) {
    if (src[i] === 'r' && src[i + 1] === 'e' && src[i + 2] === 'n' && src[i + 3] === 'd' && src[i + 4] === 'e' && src[i + 5] === 'r') {
      for (let j = i + 5; j < src.length; j++) {
        if (src[j] === '>') {
          return [j + 1, j + 2]
        }
      }
    }
    if (src[i] === 'r' && src[i + 1] === 'e' && src[i + 2] === 't' && src[i + 3] === 'u' && src[i + 4] === 'r' && src[i + 5] === 'n') {
      for (let j = i + 5; j < src.length; j++) {
        if (src[j] === '>') {
          return [j + 1, j + 2]
        }
      }
    }
  }
  return [0, 0];
}


addRouteFunction.addRouteAndLink = function (nodeClicked, nameOfRoute, exactPath, componentToRender, filePathObj, entry, next) {

  nameOfRoute = nameOfRoute.split('');

  if (nameOfRoute[0] !== '/') nameOfRoute.unshift('/');
  nameOfRoute = nameOfRoute.join('');

  let linkCodeToInject = '\n\t<Link to=\'' + nameOfRoute + '\'/>\n';
  let entrySrc = fs.readFileSync(entry);
  entrySrc = entrySrc.toString();

  let entryTree = eau.parse(entrySrc);

  if (!fs.existsSync(filePathObj[nodeClicked])) {
    filePathObj[nodeClicked] += '.js';
    if (!fs.existsSync(entry)) {
      filePathObj[nodeClicked] += 'x';
    }
  }

  let linkSrc = fs.readFileSync(filePathObj[nodeClicked]);
  linkSrc = linkSrc.toString();

  let linkTree = eau.parse(linkSrc);

  let routeRange = this.grabRouteRange(entrySrc);
  let linkRange = this.grabLinkRange(linkSrc);


  // if (nameOfRouteExists ){
  //   eau.replaceCodeRange(linkSrc, linkRange, linkCodeToInject)
  // } else {
  //   if (exactPath){
  //     let routeCodeToInject = '<Route exact path= ' + nameOfRoute + ' component={' + componentToRender + '}/>'
  //   } else {
  //     let routeCodeToInject = '<Route path= ' + nameOfRoute + ' component={' + componentToRender + '}/>'
  //   }

  let routeCodeToInject;

  if (exactPath === 'on') {
    routeCodeToInject = '\n\t<Route exact path= \'' + nameOfRoute + '\' component={' + componentToRender + '}/>\n';
  } else {
    routeCodeToInject = '\n\t<Route path= \'' + nameOfRoute + '\' component={' + componentToRender + '}/>\n';
  }
  if (!entrySrc.includes(routeCodeToInject)) fs.writeFileSync(entry, eau.replaceCodeRange(entryTree, routeRange, routeCodeToInject));
  if (!linkSrc.includes(linkCodeToInject)) fs.writeFileSync(filePathObj[nodeClicked], eau.replaceCodeRange(linkTree, linkRange, linkCodeToInject));
  next();
}

module.exports = addRouteFunction;