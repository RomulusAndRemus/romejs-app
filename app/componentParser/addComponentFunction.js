const fs = require('fs');
const path = require('path');
const eau = require('./esprima-ast-utils/index.js');



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
  let src = fs.readFileSync(src);
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


  if (addComponentFunction.isReactRouterV4installed(entrySrc)){
    let src = fs.readFileSync("./addComponentBoilerPlateReactRouter.js");
    src = src.toString();
  } else {
    let src = fs.readFileSync("./addComponentBoilerPlate.js");
    src = src.toString();
  }


  //have to check if entry file has "react-router-dom", then grab the corresponding boilerplate


  for (let i = 0; i < src.length; i++){
    if (src[i] === "R" && src[i+1] === "O" && src[i+2] === "M" && src[i+3] === "E" && src[i+4] === " "){
      ranges["comp"] = [i, i+3];
    } else if (src[i] === "R" && src[i+1] === "O" && src[i+2] === "M" && src[i+3] === "E"){
      ranges["export"] = [i, i+3]
    }
  }

  return ranges;
}


addComponentFunction.writeChildComponent = function(childComponentName, parentComponentName, parentFilePath){
  //write boiler plate in different file,  stringify it, then writeFileSync
  if (addComponentFunction.isReactRouterV4installed){
    let boilerPlateSrc = fs.readFileSync("./addComponentBoilerPlateReactRouter.js");
  } else {
    let boilerPlateSrc = fs.readFileSync("./addComponentBoilerPlate.js";
  }

  boilerPlateSrc = boilerPlateSrc.toString();
  let counter = 0;



  fs.createReadStream(__dirname + "/" + boilerPlateSrc).pipe(fs.createWriteStream(__dirname+'romanChild' + counter + ".js"));

  let childFilePath = __dirname + '/romanChild' + counter + ".js";
  let childSrc = fs.readFileSync(childFilePath);
  childSrc.toString();

  let ranges = addComponentFunction.grabChildComponentRanges(chlidSrc);

  let compCode2inject = "class " + childComponentName + " extends Component"
  let exportCode2inject = "export default " + childComponentName + ";"

  if (childComponent.length < 4){
    while (childComponent.length !== 4){
      childComponent += childComponent + " ";
    }
  }

  let add = childComponent.length - 4;


  eau.replaceCodeRange(childSrc,[ranges['comp'][0], ranges['comp'][1] + add], compCode2inject)
  eau.replaceCodeRange(childSrc,[ranges['export'][0] + add, ranges['export'][1] + add], exportCode2inject)

  addComponentFunction.addComponentToMother(parentSrc, childComponentName, childFilePath)

  //PUSH CHILDCOMPONENTNAME: CHILDFILEPATH INTO MASTEROBJECT!!!!!!!

  return;
}

module.exports = addComponentFunction;
