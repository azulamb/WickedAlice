import l = require( './Log' );
import express = require( 'express' );
import Auth = require( './System/Auth' );
import APIRouter = require( './API/APIRouter' );
import DB = require( './DB/Sqlite3' );
import LocalStorage = require( './Data/LocalStorage' );
import path = require( 'path' );
import https = require( 'https' );
import fs = require( 'fs' );

/*
# Need env

* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET

# Option env

* GOOGLE_CALLBACK
* GOOGLE_SCOPE
* PORT
* SECRET_KEY
* PUBLIC_DOCUMENT
* PRIVATEC_DOCUMENT
* LOCAL_STORAGE
* DATABASE_FILE

*/

const PORT = process.env.PORT || 3080;
const GOOGLE_DATA =
{
	clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
	clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
	callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:' + PORT + '/auth/google/callback',
};
const GOOGLE_SCOPE: string[] = process.env.GOOGLE_SCOPE ? process.env.GOOGLE_SCOPE.split( ',' ) : [ 'https://www.googleapis.com/auth/plus.login' ];
const LOCAL_STORAGE: string = process.env.LOCAL_STORAGE || './data';
const PRIVATE_DIR: string = process.env.PRIVATE_DOCUMENT || './private';
const PAGE_OPTION = { root: path.resolve( PRIVATE_DIR )/*, headers: { 'Content-Type': 'text/html' }*/ };
const USER = process.env.USER || '';

function PrivatePage( req: express.Request, res: express.Response, next: express.NextFunction )
{
	if ( !req.originalUrl.match( /\/[^\.]*$/ ) ){ return next(); }
	res.sendFile( 'index.html', PAGE_OPTION );
}

function ErrorPage( req: express.Request, res: express.Response, next: express.NextFunction )
{
	res.sendFile( 'notfound.html', PAGE_OPTION );
}

function AppInit( ls: LocalStorage, db: DB ): express.Express
{
	const app = express();
	const router = express.Router();
	const secret = process.env.SECRET_KEY || 'crocidolite';
	const auth = new Auth( app, secret );

	// public
	app.use( express.static( process.env.PUBLIC_DOCUMENT || './public' ) );
	if ( GOOGLE_SCOPE.indexOf( 'profile' ) < 0 ) { GOOGLE_SCOPE.push( 'profile' ); }
	if ( GOOGLE_SCOPE.indexOf( 'email' ) < 0 ) { GOOGLE_SCOPE.push( 'email' ); }
	auth.setUpAuth( app, db, GOOGLE_DATA, GOOGLE_SCOPE );

	// private
	app.use( '/api', auth.auth(), APIRouter( ls, db, secret ) );
	app.use( '/mypage', auth.auth(), express.static( PRIVATE_DIR ) );
	app.use( '/projects', auth.auth(), express.static( PRIVATE_DIR ) );
	app.use( '/schedule', auth.auth(), express.static( PRIVATE_DIR ) );
	app.use( '/users', auth.auth(), express.static( PRIVATE_DIR ) );
	app.use( '/*', auth.auth(), ErrorPage );

	// Error
	app.use( <any>( ( err: {}, req: express.Request, res: express.Response, next: express.NextFunction ) =>
	{
console.error(err);
		res.status (500 );
		res.json( { error: 'error' } );
	} ) );

	return app;
}

function Init()
{
	const p: Promise<{}>[] = [];

	const ls = new LocalStorage( LOCAL_STORAGE );
	const db = new DB();

	p.push( ls.init( USER ).then( ( result ) =>
	{
		return db.init(
		{
			file: process.env.DATABASE_FILE || ls.get() + '/data.sqlite3',
			user: USER,
		} );
	} ) );

	return Promise.all( p ).then( ( result ) => { return { ls: ls, db: db, result: result }; } );
}

function changeUser()
{
	if ( USER ) { process.setuid( USER ); }
}

Init().then( ( result ) =>
{
	// Log output start.
	const date = new Date();
	l.log( 'Start: ' + date );
	l.info( 'Start: ' + date );
	//l.debug( 'Start: ' + date );
	l.warn( 'Start: ' + date );
	l.error( 'Start: ' + date );

	l.info( 'Root directory: ' + process.cwd() );
	l.info( 'Listen on port: ' + PORT );

	const app = AppInit( result.ls, result.db );
	if ( process.env.CERT_DIR )
	{
		const option =
		{
			key: fs.readFileSync ( process.env.CERT_DIR + '/privkey.pem' ),
			cert: [ fs.readFileSync( process.env.CERT_DIR +  '/cert.pem' ) ],
			ca: [ fs.readFileSync( process.env.CERT_DIR +  '/chain.pem', 'utf8' ), fs.readFileSync( process.env.CERT_DIR +  '/fullchain.pem', 'utf8' ) ],
		};
		https.createServer( option, app ).listen( PORT, changeUser );
	} else
	{
		app.listen( PORT, changeUser );
	}
} ).catch( ( error ) =>
{
	l.error( error );
} );
