import * as http from 'http';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as mongoose from 'mongoose';
import * as MongoStore from 'connect-mongo';
const _MongoStore: MongoStore.MongoStoreFactory = MongoStore(expressSession);
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
// import * as expressMinify from 'express-minify';
const expressMinify: any = require('express-minify');
import * as moment from 'moment';

const config: any = require('../config');

console.log('Web server loaded');

// Grobal options
const sessionExpires = 1000 * 60 * 60 * 24 * 365;
const htmlpretty = '  ';

// Init DB connection
const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

// Init server
const server: express.Express = express();
server.locals.compileDebug = false;
server.locals.pretty = htmlpretty;
server.set('view engine', 'jade');
server.set('views', `${__dirname}/views/pages`);
server.set('X-Frame-Options', 'SAMEORIGIN');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser(config.cookiePass));

// Session settings
server.use(expressSession({
	name: config.sessionKey,
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		path: '/',
		domain: ".#{config.public-config.domain}",
		httpOnly: false,
		secure: false,
		expires: new Date(Date.now() + sessionExpires),
		maxAge: sessionExpires,
	},
	store: new _MongoStore({
		mongooseConnection: db
	})
}));

function initSession(req: express.Request, res: express.Response, callback: () => void) {
	var uas = req.headers['user-agent'];
	var ua: string;
	var uaType: string;
	if (uas != null) {
		ua = uas.toLowerCase();
		if (/(iphone|ipod|ipad|android.*mobile|windows.*phone|psp|vita|nitro|nintendo)/i.test(ua)) {
			uaType = 'mobile';
		}
	} else {
		ua = null
		uaType = 'desktop';
	}

	(<any>req).login = req.session != null && (<any>req.session).userId != null;
	(<any>req).data = { // Render data
		pagePath: req.path,
		config: config.publicConfig,
		url: config.publicConfig.url,
		apiUrl: config.publicConfig.apiUrl,
		webStreamingUrl: config.publicConfig.webStreamingUrl,
		login: (<any>req).login,
		ua: uaType,
		moment: moment
	};

	# Renderer function
		res.display = (req, res, name, render - data) -> res.render name, req.data << <render-data

	# Check logged in, set user instance
	if req.login
		user- id = req.session.user - id
	User.find - by - id user- id, (, user) ->
	req
		..data.me = user
			..me = user
	callback!
	else
	req
		..data.me = null
			..me = null
	callback!
	}

# Statics
server.get '/favicon.ico' (req, res) -> res.send - file path.resolve "#__dirname/resources/favicon.ico"
server.get '/manifest.json' (req, res) -> res.send - file path.resolve "#__dirname/resources/manifest.json"

# Init session
server.all '*' (req, res, next) ->
server.init - session req, res, ->
		if req.is - mobile
			server.set 'views' "#__dirname/sites/mobile/views/pages"
		else
server.set 'views' "#__dirname/sites/desktop/views/pages"
next!

# Resources rooting
resources - router server

# General rooting
router server

# Not found handling
server.use(req, res) ->
res
	..status 404
		..display req, res, 'not-found' {}

# Error handling
server.use(err, req, res, next) ->
console.error err
display - err = "#{err.stack}\r\n#{repeat 32 '-'}\r\n#{req.method} #{req.url} [#{new Date!}]"
if (req.has - own - property \login) && req.login
display - err += "\r\n#{req.me?id ? ''}"
res.status 500
if res.has - own - property \display
res.display req, res, \error {err: display - err }
	else
res.send err

exports.server = server
