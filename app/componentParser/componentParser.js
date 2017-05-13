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

    const routePaths = [];
    const linkedComponents = {};

    //Parses through the React app and extracts the components
    const mainObj = parse(file);
    function parse (entry){

      //Temporary object that we build and then 
      const inner = {};

      //Adds file extension and checks for .js or .jsx files
      if(!fs.existsSync(entry)) {
        entry += '.js';
        if(!fs.existsSync(entry)) {
        entry += 'x';
        }
      }

      //Reads file and converts the code into string format
      let src = fs.readFileSync(entry);
      src = src.toString();

      //Takes the current file path and extracts its working directory
      let file = entry.split('/');
      let filename = file.pop();
      file = file.join('/');
      
      //Strips the extension from the filename
      if (filename[filename.length + 1] === 'x') filename = filename.slice(0, -4);
      else filename = filename.slice(0, -3);

      //Converts the stringified code into an AST
      let ast = eau.parse(src);

      //Checks the AST and stores all imports into an object
      let importVars = {};
      ast.body.forEach(elem => {
        if (elem.type === 'ImportDeclaration') {
          if (elem.specifiers.length > 0) {
            //Component name
            let name = elem.specifiers[0].local.name;
              //Component filepath relevant to the file currently being parsed
              importVars[name] = elem.source.value;
          }
        }

        //Use the export declaration as the name of the component that we are currently parsing
        if (elem.type === 'ExportDefaultDeclaration') {
          inner.name = elem.declaration.name;
        }
      });

      //If an export was not defined, we use the filename as the name of the component that we are currently parsing
      if (!inner.name) inner.name = filename;

      const reactComponents = [];
      const linkedTo = [];

      //Checks the AST for <Route path='/thispath component={thiscomponent} /> and grabs the component if it was found in the import variables'
      let components = esquery(ast, 'JSXOpeningElement');
      components.forEach(component => {
        if (component.name.name === 'Route') {
          let paths = {};
          let routePath;
          component.attributes.forEach(comp => {
            if (comp.name.name === 'path' && comp.value.value) routePath = comp.value.value;
            if (comp.name.name === 'component') {        
              reactComponents.push(comp.value.expression.name);
              if (routePath) paths[comp.value.expression.name] = routePath;
            }
          });
          if (Object.keys(paths).length) routePaths.push(paths);
        }
        if (component.name.name === 'Link') {
          component.attributes.forEach(comp => {
            if (comp.name.name === 'to') {
              routePaths.forEach(route => {
                const keys = Object.keys(route);
                if (route[keys[0]] === comp.value.value) {
                  linkedTo.push(keys[0]);
                }
              });
            }
          });
        }
      });

      if (linkedTo.length) linkedComponents[inner.name] = linkedTo;

      //Checks the AST for components from import variables to see which are rendered. import Comp1 from './Comp1' -> <Comp1 />
      let identifiers = esquery(ast, 'JSXIdentifier');
      identifiers.forEach(identifier => {
        if (importVars.hasOwnProperty(identifier.name) && identifier.name !== 'Router' && identifier.name !== 'path') {
          reactComponents.push(identifier.name);
        }
      })

      //If there are child components, we must parse through them recursively to check for nested components
      if (reactComponents.length > 0){
        //Create array to hold child components
        inner.children = [];
        reactComponents.forEach(e => {
          //Match import variables with components that can be rendered
          if (importVars.hasOwnProperty(e)) {
            //Normalizes the working path
            if (importVars[e].includes('/')) {
              //Gets the filename from import
              let dir = importVars[e].split('/');
              let name = dir.pop();
              if (dir[0] === '.') dir.shift();
              dir = dir.join('/');
              //Merge current working directory with filepath
              dir = file + '/' + dir;
              //Adds the filename to the end of the working 
              let filePath = '/' + dir + '/' + name;
              //Removes extra slashes
              filePath = filePath.replace(/\/+/g, '\/');
              filepaths[e] = filePath;
              //Recursion
              inner.children.push(parse(filePath));
            }
          }
        });
      }
      return inner;
    }
    //Main object that stores the components and its children
    outputData.push(mainObj);
    //Object that stores filepaths for components
    outputData.push(filepaths);
    //Name of the entry file
    outputData.push(file);
    outputData.push(linkedComponents);
    return outputData;
  }
  exports.ASTParser = ASTParser;
})();
