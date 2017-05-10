(function () {
  const fs = require('fs');
  const eau = require('./esprima-ast-utils/index.js');
  const esquery = require('./esquery/esquery.js');
  const path = require('path');

  function ASTParser(file) {

    //This array contains the data for the component tree and the filepaths for each component
    const outputData = [];

    //Grabs the import variables and stores the variable name as the key and the path as the value
    const filepaths = {};

    //Parses through the React app and extracts the components
    const mainObj = parse(file);
    function parse (entry){

      //Temporary object that we build and then 
      const inner = {};

      if(!fs.existsSync(entry)) {
        entry += '.js';
        if(!fs.existsSync(entry)) {
        entry += 'x';
        }
      }

      let src = fs.readFileSync(entry);
      src = src.toString();

      let file = entry.split('/');
      let filename = file.pop();
      file = file.join('/');
      filename = filename.slice(0, -3);
      inner.name = filename;

      let ast = eau.parse(src);

      let imports = esquery(ast, "ImportDeclaration");
      let importVars = {};

      for (let i = 0; ast.body[i].type === "ImportDeclaration";  i++) {
        if (ast.body[i].specifiers.length > 0) {
          let name = ast.body[i].specifiers[0].local.name
            importVars[name] = ast.body[i].source.value
        }
      }

      const reactComponents = [];
      let components = esquery(ast, "JSXOpeningElement");

      for (let i = 0; i < components.length; i++) {
        for (let j = 0; j < components[i].attributes.length; j++) {
          if (components[i].attributes[j].name.name === "component") {
            reactComponents.push(components[i].attributes[j].value.expression.name);
          }
        }
      }

      let identifiers = esquery(ast, "JSXIdentifier");
      for (let i = 0; i < identifiers.length; i += 1) {
        if (importVars.hasOwnProperty(identifiers[i].name) && identifiers[i].name !== "Router" && identifiers[i].name !== "path") {
          reactComponents.push(identifiers[i].name);
        }
      }

      if (reactComponents.length > 0){
        inner.children = [];
        reactComponents.forEach(e => {
          if (importVars.hasOwnProperty(e)) {
            if (importVars[e].includes('/')) {
              let dir = importVars[e].split('/');
              let name = dir.pop();
              if (dir[0] === '.') dir.shift();
              dir = dir.join('/');
              dir = file + '/' + dir;
              let filePath = '/' + dir + '/' + name;
              filePath = filePath.replace(/\/+/g, '\/');
              filepaths[filename] = filePath;
              inner.children.push(parse(filePath));
            }
          }
        });
      }
      return inner;
    }
    outputData.push(mainObj);
    outputData.push(filepaths);
    console.log(outputData);
    return outputData;
  }
  exports.ASTParser = ASTParser;
})();
