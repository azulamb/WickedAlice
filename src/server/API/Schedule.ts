import express = require( 'express' );
import Api = require( './Api' );
import User = require( '../Data/User' );
import LocalStorage = require( '../Data/LocalStorage' );

class ScheduleApi
{
	public static get( ls: LocalStorage )
	{
		return ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
		{
			ls.getCrontab().then( ( result ) =>
			{
				res.json( result );
			} ).catch( ( error ) =>
			{
				next();
				/*res.statusCode = 500;
				res.json( { message: 'File notfound & crontab failed.' } );*/
			} );
		};
	}
}

export = ScheduleApi;
