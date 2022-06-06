const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const path = require('path');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/order');
const menuRouter = require('./routes/menu');
const authRouter = require('./routes/auth');
const storeRouter = require('./routes/store');
const cors = require('cors'); //교차통신 모듈 호출

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function wrapAsync(fn) {
	return function (req, res, next) {
		// 모든 오류를 .catch() 처리하고 next()로 전달하기
		fn(req, res, next).catch(next);
	};
}

app.use(cors()); //교차통신 적용å
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/menu', menuRouter);
app.use('/auth', authRouter);
app.use('/store', storeRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = err;

	// render the error page
	res.status(err.status || 500);
	res.send({
		ok: false,
		message: err.message,
	});
});

module.exports = app;
