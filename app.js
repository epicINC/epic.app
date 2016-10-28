const
	compose = require('koa-compose');
	assert = require('assert'),
	debug = require('debug')('group:application'),
	co = require('co');

let app = Application.prototype;

module.exports = Application;


function Application (server) {
	if (!(this instanceof Application)) return new Application(server);
	this.env = process.env.NODE_ENV || 'development';
	this.server = server;
	let self = this;
	this.middleware = [async (context, next) => {
		context.epic = this;
		next && await next();
	}];
}

app.on = function (...args) {
	//this.server.on(...args);
}


app.use = function (...fns) {
  this.middleware.push(...fns);
  return this;
};


app.listen = function(...options) {
	if (this.server.constructor.name === 'Server') {
		// Socket.io
		this.server.sockets.fns.unshift(...this.middleware);
	} else
		 // Koa fix
		this.server.middleware.unshift(...this.middleware);
		//this.middleware.forEach(e => this.server.use(e));
		//this.server.middleware.splice(1, 0, ...this.middleware);

	return new Promise((resolve, reject) => {
		try {
			let result = options && options.length ? this.server.listen(...options) : this.server.listen();
			result = (result.httpServer || result).address();
			if (!result) {
				this.onerror('Server start fail, pls check config > port');
				return reject(e);
			}
			console.log('Server listen at: %d ', result.port);
			return resolve(this);
		}
		catch (e) {
			this.onerror(e);
			return reject(e);
		}
	});





}

app.onerror = function (...args) {
	console.error('err:', ...args);
}