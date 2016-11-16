import express = require( 'express' );
import Api = require( './Api' );
import User = require( '../Data/User' );
import DB = require( '../DB/DB' );

class UserApi
{
	public static get( db: DB )
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			db.getUser( Api.getUserMail( req ) ).then( ( user ) =>
			{
				res.json( User.serialize( user ) );
			} ).catch( ( error ) =>
			{
				next();
			} );
		};
	}
}

export = UserApi;
