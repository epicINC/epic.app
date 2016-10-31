

const
	io = require('socket.io')(),
	app = require('../app')(io);



let run = async () => {
	let result = await app.listen();
	console.log('result', result);
}

run();