/// <reference path="../Types.ts" />
import UserData = require( './UserData' );

class User
{
	public static Type =
	{
		administrator: 0,
		developer: 1,
		user: 2,
	};

	public static getUserTypeName( type: number ): string
	{
		return Object.keys( User.Type ).filter( ( key, value ) => { return value === type; } )[ 0 ];
	}

	public static create( data: {} = {} ): UserData
	{
		const user: UserData =
		{
			id: 0,
			email: '',
			name: '',
			type: User.Type.developer,
		};

		Object.keys( data ).forEach( ( key ) =>
		{
			(<any>user)[ key ] = (<any>data)[ key ];
		} );

		return user;
	}

	public static serialize( user: UserData ): OpenUserData
	{
		return (
		{
			id: user.id,
			email: user.email,
			name:  user.name,
			type:  User.getUserTypeName( user.type ),
		} );
	}

	public static deserialize( data: {} ): UserData
	{
		const user = User.create();

		return user;
	}
}

export = User;
