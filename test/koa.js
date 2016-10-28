const
	service = require('group.service');

const
	koa = require('koa')();
	app = require('./app')(koa);



app.use(service({a : 1}));

app.listen(9000);