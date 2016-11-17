import express = require( 'express' );
import API = require( './API' );
import User = require( '../Data/User' );
import DB = require( '../DB/DB' );

class UserAPI
{
	public static get( db: DB )
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			db.getUser( API.getUserMail( req ) ).then( ( user ) =>
			{
				res.json( User.serialize( user ) );
			} ).catch( ( error ) =>
			{
				next();
			} );
		};
	}
}

export = UserAPI;
