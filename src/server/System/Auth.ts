import express = require( 'express' );
import passport = require( 'passport' );
//import Google = require( 'passport-google-oauth20' );
const Google = require( 'passport-google-oauth20' );
import DB = require( '../DB/DB' );
import UserData = require( '../Data/UserData' );
import User = require( '../Data/User' );

function init( app: express.Express,  db: DB, GOOGLE_DATA: {}/*Google.IStrategyOption*/, scope: string[] )
{
	passport.serializeUser( ( user, done ) => { done( null, user.id ); } );

	passport.deserializeUser( (obj, done) => { done( null, obj ); } );

	passport.use( new Google.Strategy( GOOGLE_DATA, ( accessToken: string, refreshToken: string, profile: {}, done: any ) =>
	{
		(<any>profile).token = accessToken;
		(<any>profile).token_secret = refreshToken;
		db.getUser( getMail( profile ) ).then( ( result ) =>
		{
			setUser( passport, profile );
			process.nextTick( () =>
			{
				return done( null, profile );
			});
		} ).catch( ( error ) =>
		{
			setUser( passport, profile );
			process.nextTick( () =>
			{
				return done( null, profile );
			});
		} );
	} ) );

	app.get( '/auth/google', passport.authenticate( 'google', { scope: scope } ) );
	app.get( '/auth/google/callback', passport.authenticate( 'google', { successRedirect: '/mypage', failureRedirect: '/' } ) );
}

function getMail( profile: {} ): string
{
	if ( !(<any>profile).emails ){ return '';}
	const list = (<{value:string,type:string}[]>(<any>profile).emails);
	for ( let i = 0 ; i < list.length ; ++i ) { if ( list[ i ].type === 'account' ) { return list[ i ].value; } }
	return '';
}

function setUser( passport: passport.Passport, profile: any/*Google.Profile*/ )
{
	(<any>passport.session).user = User.create(
	{
		id: profile.id,
		name: profile.displayName,
		email: profile.emails,
	} );
}

function getUser( passport: passport.Passport ): UserData { return (<any>passport.session).user || null; }

function isLogin( passport: passport.Passport ): boolean { return getUser( passport ) !== null; }

function auth()
{
	return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
	{
		if( !isLogin( passport ) ) { return res.redirect( '/' ); }
		next();
	}
}

export = { passport: passport, isLogin: isLogin, auth: auth, init: init };
