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
		};

		Object.keys( data ).forEach( ( key ) =>
		{
			(<any>user)[ key ] = (<any>data)[ key ];
		} );

		return user;
	}

	public static table( data: { [ key: string ]: any }, table: { [ key: string ]: string } = {} ): string
	{
		const keys: string[] = [];
		if ( data[ 'id' ] )
		{
			keys.push( 'id' );
			(<any>table).id = 'INTEGER PRIMARY KEY AUTOINCREMENT';
		}
		Object.keys( data ).forEach( ( key ) =>
		{
			if ( keys.indexOf( key ) < 0 ){ keys.push( key ); }
			if ( table[ key ] ) { return; }
			table[ key ] = 'TEXT';
		} );
		return keys.map( ( key ) => { return key + ' ' + table[ key ]; } ).join( ', ' );
	}
}

export = User;
