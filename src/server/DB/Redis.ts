import DB = require( './DB' );
import redis = require( 'redis' );
import User = require( '../Data/User' );
import UserData = require( '../Data/UserData' );

class Sqlite implements DB
{
	public init( params: {} ): Promise<any>
	{
		return Promise.resolve( {} );
	}

	public registerUser( user: UserData ): Promise<any>
	{
		return Promise.resolve( {} );
	}

	public getUser( key: string | number ): Promise<User>
	{
		return Promise.resolve({});
	}
}