
const
	Koa = new require('koa');
	app = require('../app')(new Koa());

app.listen(e => {
	console.log(e);
})