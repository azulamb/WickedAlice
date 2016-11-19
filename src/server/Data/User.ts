/// <reference path="../Types.ts" />
import UserData = require( './UserData' );
import API = require( '../API/API' );

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
			id: API.encodeKey( user.id ),
			email: user.email,
			name:  user.name,
			type:  User.getUserTypeName( user.type ),
		} );
	}

	public static serializeCloseUser( user: UserData ): CloseUserData
	{
		return (
		{
			id: API.encodeKey( user.id ),
			name:  user.name,
			type:  User.getUserTypeName( user.type ),
		} );
	}

	//public static deserialize( data: OpenUserData | CloseUserData ): UserData
	public static deserialize( data: { [ key: string ]: any } ): UserData
	{
		const user = User.create();
		Object.keys( data ).forEach( ( key ) =>
		{
			if ( (<any>user)[ key ] === undefined ) { return; }
			if ( key === 'id' )
			{
				user.id = parseInt( API.decodeKey( data[ 'id' ] ) );
			} else if( typeof (<any>user)[ key ] === 'number' )
			{
				(<any>user)[ key ] = parseInt( data[ key ] );
			} else
			{
				(<any>user)[ key ] = data[ key ];
			}
		} );
		return user;
	}
}

export = User;
