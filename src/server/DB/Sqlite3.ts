import DB = require( './DB' );
import sqlite = require( 'sqlite3' );
import User = require( '../Data/User' );
import UserData = require( '../Data/UserData' );

interface SQLITE_PARAMS{ [ key: string ]: any };

class Sqlite implements DB
{
	private db: sqlite.Database;

	private createDB( file: string )
	{
		return new Promise( ( resolve, reject ) =>
		{
			this.db = new sqlite.Database( file, ( error ) =>
			{
				if ( error ){ return reject( { error: error } ); }
				resolve( {} );
			} );
		} );
	}

	private run( sql: string, params: any = {} ): Promise<{}>
	{
console.log(sql);
		return new Promise( ( resolve, reject ) =>
		{
			this.db.run( sql, params, ( error, result ) =>
			{
				if ( error ){ return reject( { error: error } ); }
				resolve( result );
			} );
		} );
	}

	private gets( table: string, where: string = '', option: { attr?: string[], params?: SQLITE_PARAMS, limit: number, offset: number } ): Promise<{}>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const attr: string = option.attr ? option.attr.join( ',' ) : '*';
			if ( where ){ where = ' WHERE ' + where; }
			const limit = option.limit === undefined ? '' : ' LIMIT ' + Math.floor( option.limit );
			const offset = option.offset === undefined ? '' : ' OFFSET ' + Math.floor( option.offset );

			this.db.get( 'SELECT ' + attr + ' FROM ' + table + where + limit + offset, option.params || {}, ( error, result ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( result );
			} );
		} );
	}

	private get( table: string, where: string = '', option: { attr?: string[], params?: SQLITE_PARAMS } = {} ): Promise<{}>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const attr: string = option.attr ? option.attr.join( ',' ) : '*';
			if ( where ){ where = ' WHERE ' + where; }
			this.db.get( 'SELECT ' + attr + ' FROM ' + table + where + ' LIMIT 1', option.params || {}, ( error, result ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( result );
			} );
		} );
	}

	private count( table: string, where: string = '', option: { params?: SQLITE_PARAMS } = {} ): Promise<number>
	{
		return new Promise( ( resolve, reject ) =>
		{
			if ( where ){ where = ' WHERE ' + where; }
			this.db.get( 'SELECT count(*) FROM ' + table + where, option.params || {}, ( error, result ) =>
			{
				if ( error ) { return reject( { error: error } ); }
				resolve( result[ 'count(*)' ] || 0 );
			} );
		} );
	}

	private add( table: string, value: { [ key: string ]: any } ): Promise<{}>
	{
		const keys: string[] = [];
		const vals: string[] = [];
		Object.keys( value ).forEach( ( key ) =>
		{
			keys.push( key );
			vals.push( this.toDBString( value[ key ] ) );
		} );
		return this.run( 'INSERT INTO ' + table + ' (' + keys.join( ',' ) + ') values (' + vals.join( ',' ) + ')' );
	}

	private toDBString( value: any ): string
	{
		switch ( typeof value )
		{
		case 'number': return value;
		case 'boolean':
		case 'null':
			return value + '';
		}
		return "'" + value + "'";
	}

	/*private isArray( object: any ): boolean { return Object.prototype.toString.call( object ) === "[object Array]"; }

	private createWhere( where: { [ key: string ]: any } ): string
	{
		const w: string[] = [];
		Object.keys( where ).forEach( ( key ) =>
		{
			if ( key === '-and' || key === '-or' )
			{
				// -and or -or
				if ( !this.isArray( where[ key ] ) ){ return; }
				// value is array only.
				w.push( '(' + where[ key ].map( ( v: any ) => { return this.createWhere( v ) } ).join( key.replace( '-', '' ) ) + ')' );
				return;
			}
			if ( typeof where[ key ] === 'object' )
			{
				// { OP: VAL }
				// ex: { '<': 10 } => '< 10'
				const k = Object.keys( where[ key ] );
				w.push( [ key, k[ 0 ], where[ key ][ k[ 0 ] ] ].join( ' ' ) );
			}
			//{ and: [ ... ] }, { or: [ ... ] }
		} );
		return w.join( ' ' );
	}*/

	public init( params: {} )
	{
		return this.createDB( (<any>params).file ).then( ( result ) =>
		{
			return new Promise( ( resolve, reject ) =>
			{
				this.db.get( 'SELECT count(*) FROM sqlite_master WHERE type="table" and name="option"', {}, ( error, result ) =>
				{
					if ( error || !result[ 'count(*)' ] ) { return reject( { error: error } ); }
					resolve( {} );
				} );
			} ).catch( ( error ) =>
			{
				const p: Promise<any>[] = [];
				// Create option table.
				p.push( this.run( 'CREATE TABLE option (key TEXT UNIQUE, val TEXT)' ) );
				// TODO: config
				// Create user table.
				p.push( this.run( 'CREATE TABLE user (' + Sqlite.table( User.create() ) + ')' ) );
				return Promise.all( p ).then( ( result ) =>
				{
					const p: Promise<any>[] = [];
					p.push(  );
					return Promise.all( p );
				} );
			} );
		} );
	}

	public session( email: string ): Promise<any>
	{
		return Promise.resolve( {} );
	}

	public registerUser( user: UserData )
	{
		// TODO: clone
		delete user.id;
		return this.add( 'user', user );
	}

	public countUser(): Promise<number>
	{
		return this.count( 'user' );
	}

	public getUser( key: string | number ): Promise<UserData>
	{
		const where = typeof key === 'string' ? 'email=$key' : 'id=$key';
		const option: SQLITE_PARAMS = {};
		option[ 'params' ] = { $key: key };
		return this.get( 'user', where, option ).then( ( result ) =>
		{
			if ( !result ){ return Promise.reject( { error: { message: 'Notfound' } } ); }
			return Promise.resolve( result );
		} );
	}

	public static table( data: { [ key: string ]: any }, table: { [ key: string ]: string } = {} ): string
	{
		const keys: string[] = [];
		if ( data[ 'id' ] !== undefined )
		{
			keys.push( 'id' );
			table[ 'id' ] = 'INTEGER PRIMARY KEY AUTOINCREMENT';
		}
		Object.keys( data ).forEach( ( key ) =>
		{
			if ( keys.indexOf( key ) < 0 ){ keys.push( key ); }
			if ( table[ key ] ) { return; }
			table[ key ] = typeof data[ key ] === 'number' ? 'INTEGER' : 'TEXT';
		} );
		return keys.map( ( key ) => { return key + ' ' + table[ key ]; } ).join( ', ' );
	}
}

export = Sqlite;
