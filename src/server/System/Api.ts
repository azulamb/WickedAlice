import express = require( 'express' );
import LocalStorage = require( '../Data/LocalStorage' );
import DB = require( '../DB/DB' );

function API( ls: LocalStorage, db: DB ): express.Router
{
	const router = express.Router();

	router.use( ( req, res, next ) => { next(); } );

	router.get( '/schedule/', ( req, res, next ) =>
	{
		ls.getCrontab().then( ( result ) =>
		{
			res.json( result );
		} ).catch( ( error ) =>
		{
			res.statusCode = 500;
			res.json( { message: 'File notfound & crontab failed.' } );
		} );
	} );

	return router;
}

export = API;
