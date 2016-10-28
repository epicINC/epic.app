const
	protocol = require('./protocol'),
	service = require('group.service');

const
	io = require('socket.io')(),
	app = require('./app')(io);


//console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
let data = {

	'u.li': function *(...args) {
		console.log(args);
		console.log(this.service);
	}
}


app.use(service({a : 1}));
app.use(protocol(data));

app.listen(9000);