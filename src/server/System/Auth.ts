import express = require( 'express' );
import passport = require( 'passport' );
import session = require( 'express-session' );
//import Google = require( 'passport-google-oauth20' );
const Google = require( 'passport-google-oauth20' );
import DB = require( '../DB/DB' );
import UserData = require( '../Data/UserData' );
import User = require( '../Data/User' );

interface SessionData { user: string };

class Auth
{
	private app: express.Express;

	constructor( app: express.Express, secret: string )
	{
		this.app = app;
		this.app.use( passport.initialize() );
		this.app.use( passport.session() );
		this.app.use( session( { secret: secret } ) );
	}

	public setUpAuth( app: express.Express,  db: DB, GOOGLE_DATA: {}/*Google.IStrategyOption*/, scope: string[] )
	{
		passport.serializeUser( ( user, done ) => { done( null, { email: this.getMail( user ) } ); } );

		passport.deserializeUser( (obj, done) => { done( null, obj ); } );

		passport.use( new Google.Strategy( GOOGLE_DATA, ( accessToken: string, refreshToken: string, profile: {}, done: any ) =>
		{
			(<any>profile).token = accessToken;
			(<any>profile).token_secret = refreshToken;
			let saveUser:{} | boolean = false;
			db.getUser( this.getMail( profile ) ).then( ( result ) =>
			{
				// Exists user.
				saveUser = { email: this.setUser( passport, profile ).email };
				return Promise.resolve( {} );
			} ).catch( ( error ) =>
			{
				return db.countUser().then( ( count: number ) =>
				{
					// Unauthorized user.
					if ( count !== 0 ) { return Promise.resolve( { error: { message: 'Unauthorized user.' } } ); }

					// First user is administrator.
					const user = this.setUser( passport, profile, User.Type.administrator );
					saveUser = { email: user.email };
					db.registerUser( user );
					return Promise.resolve( {} );
				} );
			} ).then( ( result ) =>
			{
				process.nextTick( () =>
				{
					return done( null, profile );
				} );
				return Promise.resolve( {} );
			} );
		} ) );

		this.app.get( '/auth/google', passport.authenticate( 'google', { scope: scope } ) );
		this.app.get( '/auth/google/callback', passport.authenticate( 'google', { successRedirect: '/mypage', failureRedirect: '/' } ) );

		/*app.get( '/auth/google/callback', ( req, res, next ) =>
		{
			passport.authenticate( 'google', { successRedirect: '/mypage', failureRedirect: '/' } )
		} );*/
	}

	public auth()
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			// TODO: redirect now page.
			if( !this.isLogin( passport ) ) { return res.redirect( '/' ); }
			next();
		}
	}

	private getMail( profile: any/*Google.Profile*/ ): string
	{
		if ( !profile.emails ){ return '';}
		const list = (<{value:string,type:string}[]>profile.emails);
		for ( let i = 0 ; i < list.length ; ++i ) { if ( list[ i ].type === 'account' ) { return list[ i ].value; } }
		return '';
	}

	private getSessionData( passport: passport.Passport ){ return (<SessionData>(<any>passport.session)); }

	private setUser( passport: passport.Passport, profile: any/*Google.Profile*/, type?: number ): UserData
	{
		const user = User.create(
		{
			id: profile.id,
			name: profile.displayName,
			email: this.getMail( profile ),
			type: type,
		} );
		this.getSessionData( passport ).user = user.email;
		return user;
	}

	private getUserMail( passport: passport.Passport ): string { return this.getSessionData( passport ).user || ''; }

	private isLogin( passport: passport.Passport ): boolean { return this.getUserMail( passport ) !== ''; }
}


export = Auth;
