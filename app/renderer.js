const { dialog } = require('electron').remote;
const componentParser = require('./componentParser/componentParser.js');

function showOpen() {
	dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: 'JavaScript', extensions: ['js', 'jsx'] }]}, (file) => {
		const components = componentParser.ASTParser(file[0]);
		
	});
}

let $openFile = $('#open-file');
$openFile.click(showOpen);
