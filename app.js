const
	http = require('http'),
	compose = require('koa-compose');
	assert = require('assert'),
	debug = require('debug')('group:application'),
	co = require('co');


module.exports = server => server.constructor.name === 'Server' ? new SocketIORunner(server) : new KoaRunner(server);


class Runner {

	constructor (server) {

		this.env = process.env.NODE_ENV || 'development';
		this.server = server;

		let self = this;
		this.middleware = [async (context, next) => {
			context.epic = this;
			next && await next();
		}];

	}

	on (...args) {
		this.server.on(...args);
	}

	emit (...args) {
		this.server.emit(...args);
	}

	use (...fns) {
	  this.middleware.push(...fns);
	  return this;
	}

	onerror (...args) {
		console.error('err:', ...args);
	}

}


class KoaRunner extends Runner {

	constructor (server) {
		super(server);
	}

	listen (...args) {
		this.server.middleware.unshift(...this.middleware);
		let http, fn = args.length && typeof(args[args.length - 1]) === 'function' && args.pop();
		return new Promise((resolve, reject) => {
			http = this.server.listen(...args.concat(resolve));
		})
		.then(e => this.address = http.address())
		.then(e => {
			this.emit('start', e);
			return fn ? fn(e) : e;
		})
		.catch(this.onerror);
	}

}

class SocketIORunner extends Runner {

	constructor (server) {
		super(server);
	}

	listen (...args) {
		this.server.sockets.fns.unshift(...this.middleware);
		let fn = args.length && typeof(args[args.length - 1]) === 'function' && args.pop();
		return new Promise((resolve, reject) => {
			if (!this.server.httpServer) 
				this.server.attach(require('http').createServer());
			this.server.httpServer.listen(...args.concat(resolve));
		})
		.then(e => this.address = this.server.httpServer.address())
		.then(e => {
			this.emit('start', e);
			return fn ? fn(e) : e;
		})
		.catch(this.onerror);
	}


}