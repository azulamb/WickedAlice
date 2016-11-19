import express = require( 'express' );
import LocalStorage = require( '../Data/LocalStorage' );
import DB = require( '../DB/DB' );
import API = require( './API' );
// API
import User = require( './User' );
import Schedule = require( './Schedule' );

function APIRouter( ls: LocalStorage, db: DB, secret: string ): express.Router
{
	const router = express.Router();

	const api = new API( db, secret );

	//router.use( ( req, res, next ) => { next(); } );

	// User
	router.get( '/user/', api.checkSession(), User.get( db ), api.errorResponce() );

	// Schedule
	router.get( '/schedule/', api.checkSession(), Schedule.get( ls ), api.errorResponce() );

	return router;
}



export = APIRouter;
