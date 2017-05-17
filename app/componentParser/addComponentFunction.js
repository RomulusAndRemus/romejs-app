const fs = require('fs');
const path = require('path');
const eau = require('./esprima-ast-utils/index.js');
const escodegen = require('./escodegen-jsx/escodegen.js')

const addComponentFunction = {};


addComponentFunction.findComponentRange = function(src){

  for (let i = 0; i < src.length; i++) {
    if (src[i] === 'r' && src[i + 1] === 'e' && src[i + 2] === 'n' && src[i + 3] === 'd' && src[i + 4] === 'e' && src[i + 5] === 'r' && src[i + 6] === '>') {
      for(let j = i+7; j < src.length; j++){
        if (src[j] === '>'){
          return [j+1, j+2]
        }
      }
    }
  }

  return [0,0];
}


addComponentFunction.addComponentToMother = function (src, componentName, childFilepath){
  src = fs.readFileSync(src);
  src = src.toString();
  let parentTree = eau.parse(src);
  let JSXCodeToInject = "<" + componentName + " />"
  let importCodetoInject = "import " + componentName + " from" + '"' + childFilepath + '"';
  let importVarRange = [0,0]

  eau.replaceCodeRange(parentTree, importVarRange, importCodetoInject)
  eau.replaceCodeRange(parentTree, addComponentFunction.findComponentRange(src), JSXCodeToInject)
}

addComponentFunction.isReactRouterV4installed = function(src){
  let isReactRouterV4installed = false;

  for (let j = 0; j < src.length; j++){
    if (src[j] === "r" && src[j+1] === "e" && src[j+2] === "a" && src[j+3] === "c"
    && src[j+4] === "t" &&  src[j+5] === "-" &&  src[j+6] === "r" && src[j+7] === "o"
    && src[j+8] === "u" && src[j+9] === "t" && src[j+10] === "e"  && src[j+11] === "r"
    && src[j+12] === "-"  && src[j+13] === "d" && src[j+14] === "o" && src[j+15] === "m"){
      return isReactRouterV4installed = true;
    }
  }

  return isReactRouterV4installed;
}

addComponentFunction.grabChildComponentRanges = function(entry){
  let ranges = {"import":null, "comp": null, "export": null};
  let entrySrc = fs.readFileSync(entry);
  entrySrc = entrySrc.toString();

  let src;

  if (addComponentFunction.isReactRouterV4installed(entrySrc)){
    src = fs.readFileSync("/Users/joelguizar/Desktop/romejs-app/app/componentParser/addComponentBoilerPlateReactRouter.js");
    src = src.toString();
  } else {
    src = fs.readFileSync("/Users/joelguizar/Desktop/romejs-app/app/componentParser/addComponentBoilerPlate.js");
    src = src.toString();
  }


  //have to check if entry file has "react-router-dom", then grab the corresponding boilerplate


  for (let i = 0; i < src.length; i++){
    if (src[i] === "c" && src[i+1] === "l" && src[i+2] === "a" && src[i+3] === "s" && src[i+4] === "s"){
      ranges["comp"] = [i, i+27];
    } else if (src[i] === "e" && src[i+1] === "x" && src[i+2] === "p" && src[i+3] === "o"){
      ranges["export"] = [i, i+21];
    }
  }

  return ranges;
}


addComponentFunction.writeChildComponent = function(childComponentName, parentComponentName, filePathObj){
  //write boiler plate in different file,  stringify it, then writeFileSync


  let boilerPlateSrc;

  if (addComponentFunction.isReactRouterV4installed){
    boilerPlateSrc = fs.readFileSync("/Users/joelguizar/Desktop/romejs-app/app/componentParser/addComponentBoilerPlateReactRouter.js").toString();
  } else {
    boilerPlateSrc = fs.readFileSync("/Users/joelguizar/Desktop/romejs-app/app/componentParser/addComponentBoilerPlate.js").toString();
  }

  fs.writeFileSync(__dirname + "/" + childComponentName + ".js", boilerPlateSrc)
  // fs.createReadStream(__dirname + "/" + boilerPlateSrc).pipe(fs.createWriteStream(__dirname+ childComponentName + ".js"));

  let childFilePath = __dirname + "/" + childComponentName + ".js";
  let childSrc = fs.readFileSync(childFilePath);
  childSrc = childSrc.toString();

  let ranges = addComponentFunction.grabChildComponentRanges(childFilePath);



  // let compCode2inject = "class " + childComponentName + " extends Component {"
  // let exportCode2inject = "export default " + childComponentName + " ;"


  let romerome = eau.parse(childSrc);


  for (let j = 0; j < romerome.tokens.length; j++)
    if (romerome.tokens[j].value === "ROME"){
      romerome.tokens[j].value = childComponentName
      // console.log(childComponentName);
      // console.log("THIS IS IT!!!", romerome.tokens[j].value)
    }

  for (let k = 0; k < romerome.body.length; k++) {
    if (romerome.body[k].id) {
      if (romerome.body[k].id.name === "ROME"){
        romerome.body[k].id.name = childComponentName;
      }
    }
    if (romerome.body[k].declaration) {
      if (romerome.body[k].declaration.name === "ROME"){
        romerome.body[k].declaration.name = "default " + childComponentName ";";
      }
    }
  }

  console.log(JSON.stringify(romerome, null, 2));

  // let yo = eau.replaceCodeRange(eau.parse(childSrc),[ranges['comp'][0], ranges['comp'][1] + add], compCode2inject)
  fs.writeFileSync(__dirname + "/" + childComponentName + ".js", escodegen.generate(romerome))

  // let yo1 = fs.readFileSync(__dirname + "/" + childComponentName + ".js").toString();

  // let yoo = eau.replaceCodeRange(eau.parse(yo1),[ranges['export'][0] + add, ranges['export'][1] + add], exportCode2inject)
  // fs.writeFileSync(__dirname + "/" + childComponentName + ".js", yoo)


  let parentFilePath = filePathObj[parentComponentName]

  if(!fs.existsSync(parentFilePath)) {
    parentFilePath += '.js';
    if(!fs.existsSync(parentFilePath)) {
    parentFilePath += 'x';
    }
  }

  parentSrc = fs.readFileSync(parentFilePath);
  parentSrc = parentSrc.toString();

  addComponentFunction.addComponentToMother(parentFilePath, childComponentName, childFilePath)


  return;
}

module.exports = addComponentFunction;
