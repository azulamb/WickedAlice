import fs = require( 'fs' );
import child = require('child_process');

class FileSystem
{
	static exec( command: string ): Promise<{ stdout: string, stderr: string }>
	{
		return new Promise( ( resolve, reject ) =>
		{
			child.exec( command, ( error: NodeJS.ErrnoException, stdout: string, stderr: string ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( { stdout: stdout, stderr: stderr } );
			} );
		} );
	}

	static isFile( path: string ): boolean
	{
		try
		{
			return fs.statSync( path ).isFile();
		} catch( e )
		{
			return false;
		}
	}

	static readFile( file: string, enc: string = 'utf8' ): Promise<{ data: string }>
	{
		return new Promise( ( resolve, reject ) =>
		{
			fs.readFile( file, enc, ( error: NodeJS.ErrnoException, data: string ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( { data: data } );
			} );
		} );
	}

	static writeFile( file: string, data: any ): Promise<{}>
	{
		return new Promise( ( resolve, reject ) =>
		{
			fs.writeFile( file, data, ( error: NodeJS.ErrnoException ) =>
			{
				if ( error ){ return reject( { error: error } ) }
				resolve( {} );
			} );
		} );
	}

	static readdir( path: string ): Promise<string[]>
	{
		return new Promise( ( resolve, reject ) =>
		{
			fs.readdir( path, ( error: NodeJS.ErrnoException, files: string[] ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( files || [] );
			} );
		} );
	}

	static mkdir( path: string | Buffer ): Promise<{ exsists:boolean }>
	{
		return new Promise( ( resolve, reject ) =>
		{
			fs.mkdir( path, ( error: NodeJS.ErrnoException ) =>
			{
				if ( error && error.code !== 'EEXIST' ) { return reject( { error: error } ); }
				resolve( { exsists: !!error } );
			} );
		} );
	}

	static chmod( path: string | Buffer, mode: number ): Promise<{}>
	{
		return new Promise( ( resolve, reject ) =>
		{
			fs.chmod( path, mode, ( error: NodeJS.ErrnoException ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( {} );
			} );
		} );
	}

	static chown( path: string | Buffer, uid: number | string, gid: number | string ): Promise<{}>
	{
		const data =
		{
			uid: typeof uid === 'number' ? uid : -1,
			gid: typeof gid === 'number' ? gid : -1,
		};
		const p: Promise<{}>[] = [];
		if ( uid === gid && typeof uid === 'string' )
		{
			p.push( FileSystem.id( uid ).then( ( result ) =>
			{
				data.uid = result.uid;
				data.gid = result.gid;
				return Promise.resolve( {} );
			} ) );
		} else
		{
			if( typeof uid === 'string' )
			{
				p.push( FileSystem.id( uid ).then( ( result ) =>
				{
					data.uid = result.uid;
					return Promise.resolve( {} );
				} ) );
			}
			if( typeof gid === 'string' )
			{
				p.push( FileSystem.group( gid ).then( ( result ) =>
				{
					data.gid = result.gid;
					return Promise.resolve( {} );
				} ) );
			}
		}

		return Promise.all( p ).then( ( result ) =>
		{
			fs.chown( path, data.uid, data.gid, ( error: NodeJS.ErrnoException ) =>
			{
				if ( error ) { return Promise.reject( { error: error } ); }
				return Promise.resolve( {} );
			} );
		} );
	}


	static id( userName: string = '' ): Promise<{ uid: number, gid: number, groups: number }>
	{
		return FileSystem.exec( 'id ' + userName ).then( ( result ) =>
		{
			const data = { uid: -1, gid: -1, groups: -1 };
			result.stdout.split( ' ' ).forEach( ( value ) =>
			{
				const [ key, id ] = value.replace( /^([a-z\=0-9]+).+$/, '$1' ).split( '=' );
				(<any>data)[ key ] = parseInt( id );
			} );
			return Promise.resolve( data );
		} ).catch( ( error ) =>
		{
			return Promise.reject( { message: 'Notfound user.', user: userName } );
		} );
	}

	static group( groupName: string ): Promise<{ gid: number, member: string[] }>
	{
		return FileSystem.exec( 'getent group' ).then( ( result ) =>
		{
			const data: { gid: number, member: string[] } = { gid: -1, member: [] };
			result.stdout.split( /\n/ ).forEach( ( line ) =>
			{
				const [ group, pass, gid, member ] = line.split( ':' );
				if ( group === groupName )
				{
					data.gid = parseInt( gid );
					data.member = member.split( ',' );
				}
			} );
			return Promise.resolve( data );
		} ).catch( ( error ) =>
		{
			return Promise.reject( { message: 'Notfound group.', group: groupName } );
		} );
	}
}

export = FileSystem;
