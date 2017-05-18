const fs = require('fs');
const path = require('path');
const eau = require('./esprima-ast-utils/index.js');
const escodegen = require('./escodegen-jsx/escodegen.js')

const addComponentFunction = {};


addComponentFunction.findComponentRange = function(src){

  for (let i = 0; i < src.length; i++) {
    if (src[i] === 'r' && src[i + 1] === 'e' && src[i + 2] === 'n' && src[i + 3] === 'd' && src[i + 4] === 'e' && src[i + 5] === 'r') {
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
  let srcString = fs.readFileSync(src).toString();

  let filename = childFilepath.split('/');
  filename = filename.pop();
  let parentTree = eau.parse(srcString);
  let JSXCodeToInject = "\n\t<" + componentName + " />\n"
  let importCodetoInject = "import " + componentName + " from " + '"./' + filename + '"\n';
  let importVarRange = [0,0]

  let generated = eau.replaceCodeRange(parentTree, importVarRange, importCodetoInject);
  let parsed = eau.parse(generated);
  let code = eau.replaceCodeRange(parsed, addComponentFunction.findComponentRange(generated), JSXCodeToInject);
  fs.writeFileSync(src, code);
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

addComponentFunction.grabChildComponentRanges = function(entry, cwd){
  let ranges = {"import":null, "comp": null, "export": null};
  let entrySrc = fs.readFileSync(entry);
  entrySrc = entrySrc.toString();

  let src;

  if (addComponentFunction.isReactRouterV4installed(entrySrc)){
    src = fs.readFileSync(cwd + '/componentParser/addComponentBoilerPlateReactRouter.js');
    src = src.toString();
  } else {
    src = fs.readFileSync(cwd + '/componentParser/addComponentBoilerPlateReactRouter.js');
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


addComponentFunction.writeChildComponent = function(childComponentName, parentComponentName, filePathObj, cwd, next){
  //write boiler plate in different file,  stringify it, then writeFileSync

  let boilerPlateSrc;

  if (addComponentFunction.isReactRouterV4installed){
    boilerPlateSrc = fs.readFileSync(cwd + '/componentParser/addComponentBoilerPlateReactRouter.js').toString();
  } else {
    boilerPlateSrc = fs.readFileSync(cwd + '/componentParser/addComponentBoilerPlateReact.js').toString();
  }

  // fs.createReadStream(__dirname + "/" + boilerPlateSrc).pipe(fs.createWriteStream(__dirname+ childComponentName + ".js"));

  let parentDir = filePathObj[parentComponentName].split('/');
  parentDir.pop();
  parentDir = parentDir.join('/');
  fs.writeFileSync(parentDir + "/" + childComponentName + ".js", boilerPlateSrc)

  let childFilePath = parentDir + "/" + childComponentName + ".js";
  let childSrc = fs.readFileSync(childFilePath);
  childSrc = childSrc.toString();

  let ranges = addComponentFunction.grabChildComponentRanges(childFilePath, cwd);



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
        romerome.body[k].declaration.name = childComponentName + ";";
      }
    }
  }

  // let yo = eau.replaceCodeRange(eau.parse(childSrc),[ranges['comp'][0], ranges['comp'][1] + add], compCode2inject)
  fs.writeFileSync(parentDir + "/" + childComponentName + ".js", escodegen.generate(romerome))

  // let yo1 = fs.readFileSync(__dirname + "/" + childComponentName + ".js").toString();

  // let yoo = eau.replaceCodeRange(eau.parse(yo1),[ranges['export'][0] + add, ranges['export'][1] + add], exportCode2inject)
  // fs.writeFileSync(__dirname + "/" + childComponentName + ".js", yoo)


  let parentFilePath = filePathObj[parentComponentName]
  console.log('PARENT FILE PATH\n', parentFilePath)
  if(!fs.existsSync(parentFilePath)) {
    parentFilePath += '.js';
    if(!fs.existsSync(parentFilePath)) {
    parentFilePath += 'x';
    }
  }

  addComponentFunction.addComponentToMother(parentFilePath, childComponentName, childFilePath)


  next();
}

module.exports = addComponentFunction;
