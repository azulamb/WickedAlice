import UserData = require( '../Data/UserData' );

interface DB
{
	init( params: {} ): Promise<any>,
	registerUser( user: UserData ): Promise<any>,
}

export = DB;
