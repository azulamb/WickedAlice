import UserData = require( '../Data/UserData' );
import User = require( '../Data/User' );

interface DB
{
	init( params: {} ): Promise<any>,
	session( email: string ): Promise<any>,
	registerUser( user: UserData ): Promise<any>,
	countUser(): Promise<number>,
	getUser( key: string | number ): Promise<UserData>,
}

export = DB;
