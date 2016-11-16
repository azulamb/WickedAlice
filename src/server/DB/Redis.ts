import DB = require( './DB' );
import redis = require( 'redis' );
import User = require( '../Data/User' );
import UserData = require( '../Data/UserData' );

class Sqlite implements DB
{
	public init( params: {} ): Promise<any>
	{
		// user:EMAIL / (STRING) JSONSTRING
		// userlist   / (LIST)   EMAIL
		// config     / (HASH)   KEY=VALUE
		return Promise.resolve( {} );
	}

	public session( email: string ): Promise<any>
	{
		return Promise.resolve( {} );
	}

	public registerUser( user: UserData ): Promise<any>
	{
		// Add userlist: -> get index
		// Add user:EMAIL
		return Promise.resolve( {} );
	}

	public countUser(): Promise<number>
	{
		// userlist: LLEN
		return Promise.resolve( 0 );
	}

	public getUser( key: string | number ): Promise<UserData>
	{
		// if num
		//     userlist -> EMAIL
		// user:EMAIL
		return Promise.resolve({});
	}
}