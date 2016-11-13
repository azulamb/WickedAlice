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
			fs.mkdir( path, ( error:NodeJS.ErrnoException ) =>
			{
				if ( error && error.code !== 'EEXIST' ) { return reject( { error: error } ); }
				resolve( { exsists: !!error } );
			} );
		} );
	}

}

export = FileSystem;
