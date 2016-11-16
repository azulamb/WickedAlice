import express = require( 'express' );
import LocalStorage = require( '../Data/LocalStorage' );
import DB = require( '../DB/DB' );
// API
import User = require( './User' );
import Schedule = require( './Schedule' );

class Api
{
	private db: DB;

	constructor( db: DB )
	{
		this.db = db;
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
			this.db.session( Api.getUserMail( req ) ).then( ( result ) =>
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

	public static getUserMail( req: express.Request ): string { return (<any>req).session.user || ''; }

	public static router( ls: LocalStorage, db: DB ): express.Router
	{
		const router = express.Router();

		const api = new Api( db );

		router.use( ( req, res, next ) => { next(); } );

		// User
		router.get( '/user/', api.checkSession(), User.get( db ), api.errorResponce() );

		// Schedule
		router.get( '/schedule/', api.checkSession(), Schedule.get( ls ), api.errorResponce() );

		return router;
	}
}


export = Api;
