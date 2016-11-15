import UserData = require( './UserData' );

class User
{
	public static create( data: {} = {} ): UserData
	{
		const user: UserData =
		{
			id: 0,
			email: '',
			name: '',
			type: 1,
		};

		Object.keys( data ).forEach( ( key ) =>
		{
			(<any>user)[ key ] = (<any>data)[ key ];
		} );

		return user;
	}

}

export = User;
