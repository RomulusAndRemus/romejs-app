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

      let ast = eau.parse(src);

      let importVars = {};

      ast.body.forEach(elem => {
        if (elem.type === 'ImportDeclaration') {
          if (elem.specifiers.length > 0) {
            let name = elem.specifiers[0].local.name;
              importVars[name] = elem.source.value;
          }
        }
        if (elem.type === 'ExportDefaultDeclaration') {
          inner.name = elem.declaration.name;
        }
      });

      if (!inner.name) inner.name = filename;

      const reactComponents = [];
      let components = esquery(ast, 'JSXOpeningElement');

      components.forEach(component => {
        component.attributes.forEach(comp => {
          if (comp.name.name === 'component') {
            reactComponents.push(comp.value.expression.name);
          }
        });
      });

      let identifiers = esquery(ast, 'JSXIdentifier');

      identifiers.forEach(identifier => {
        if (importVars.hasOwnProperty(identifier.name) && identifier.name !== 'Router' && identifier.name !== 'path') {
          reactComponents.push(identifier.name);
        }
      })

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
              filepaths[e] = filePath;
              inner.children.push(parse(filePath));
            }
          }
        });
      }
      return inner;
    }
    outputData.push(mainObj);
    outputData.push(filepaths);
    outputData.push(file);
    return outputData;
  }
  exports.ASTParser = ASTParser;
})();
