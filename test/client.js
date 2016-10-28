const
	ioc = require('socket.io-client');


let tester = ioc('http://127.0.0.1:9000', {query: {uid:'1000+001E67070740-panhuixin'}});
tester.on('connect', function(socket) {
	console.log('connect');
	tester.on('u.li.r', function (data) {
		console.log('r:', data);
	});
	tester.emit('u.li.q', {id:'test123'});
});
