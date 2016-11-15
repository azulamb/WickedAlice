import UserData = require( '../Data/UserData' );
import User = require( '../Data/User' );

interface DB
{
	init( params: {} ): Promise<any>,
	registerUser( user: UserData ): Promise<any>,
	getUser( key: string | number ): Promise<User>,
}

export = DB;
