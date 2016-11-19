import express = require( 'express' );
import LocalStorage = require( '../Data/LocalStorage' );
import DB = require( '../DB/DB' );
import crypto = require( 'crypto' );

class API
{
	private db: DB;
	private static secret: string; // TODO: research crypto

	constructor( db: DB, secret: string )
	{
		this.db = db;
		API.secret = secret;
	}

	private error( res: express.Response, code: number, error: {} )
	{
		res.statusCode = code;
		res.json( error );
	}

	private timeout( res: express.Response )
	{
		this.error( res, 500, { message: 'Timeout' } );
	}

	public checkSession()
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			this.db.session( this.getUserMail( req ) ).then( ( result ) =>
			{
				return next();
			} ).catch( ( error ) =>
			{
				// Session timeout.
				this.timeout( res );
				return Promise.reject( { error } );
			} );
		};
	}

	public errorResponce()
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			// TODO: error
			this.error( res, 500, { message: '' } );
		};
	}

	private getUserMail( req: express.Request ): string { return (<any>req).session.user || ''; }

	public static getUserMail( req: express.Request ): string { return (<any>req).session.passport.user.email || ''; }

	public static encodeKey( data: number | string ): string
	{
		const cipher = crypto.createCipher( 'aes192', API.secret );
		cipher.update( new Buffer( data.toString() ) );
		return cipher.final( 'hex' );
	}

	public static decodeKey( hash: string ): string
	{
		const decipher = crypto.createDecipher( 'aes192', API.secret );
		decipher.update( hash, 'hex', 'utf8' );
		try
		{
			return decipher.final('utf8');
		} catch( e ) {}
		return '';
	}
}


export = API;
