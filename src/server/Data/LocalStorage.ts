/// <reference path="../Types.ts" />
import fs = require( '../FileSystem' );

class LocalStorage
{
	private dir: string;

	constructor( directory: string )
	{
		this.dir = directory.replace( /\/+$/, '' );
	}

	public init( userName: string = '' ): Promise<{}>
	{
		return fs.mkdir( this.get() ).then( ( result ) =>
		{
			if ( !result.exsists && userName )
			{
				return fs.chown( this.dir, userName, userName );
			}
			return Promise.resolve( {} );
		} );
	}

	public get(): string { return this.dir; }

	public changeUser( userName: string )
	{
		return fs.chown( this.dir, userName, userName );
	}

	public getCrontab(): Promise<CronData>
	{
		return fs.readFile( this.dir + '/crontab' ).catch( ( error ) =>
		{
			if ( !error || !error.error || error.error.code !== 'ENOENT' ) { return Promise.reject( error ); }
			// crontab file notfound.
			return fs.exec( 'crontab -l' ).then( ( result ) =>
			{
				return Promise.resolve( { data: result.stdout, sub: result.stderr, error: error } );
			} ).catch( ( error ) =>
			{
				return fs.writeFile( this.dir + '/crontab', '' ).then( ( result ) =>
				{
					return Promise.resolve( { data: '', message: error } );
				} );
			} );
		} ).then( ( result ) =>
		{
			const data: CronData = { env: [], cron: [] };
			if ( (<any>result).message ) { data.create = true; }

			const lines = result.data.split( /\r\n|[\n\r]/ );
			lines.forEach( ( line ) =>
			{
				let m: string[] | null = line.match( /^([\#\s]*)\s*(export\s+[\s\S]+)$/ );
				if ( m )
				{
					data.env.push( { line: m[ 2 ], enable: !(m[ 1 ].match( /\#/ ) !== null) } );
					return;
				}
				m = line.match( /^([\#\s]*)\s*([\*\/\d\,\-]+)\s+([\*\/\d\,\-]+)\s+([\*\/\d\,\-]+)\s+([\*\/\d\,\-]+)\s+([\*\/\d\,\-]+)\s+([\s\S]+)$/ );
				if ( m )
				{
					data.cron.push(
					{
						time: m.slice( 2, 7 ),
						command: m[ 7 ],
						enable: !( m[ 1 ].match( /\#/ ) !== null ),
					} );
					return;
				}
			} );

			return Promise.resolve( data );
		} );
	}
}

export = LocalStorage;