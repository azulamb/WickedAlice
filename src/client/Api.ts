/// <reference path="../server/Types.ts" />

class API
{
	private static timeout( url: RequestInfo, init?: RequestInit ): Promise<Response>
	{
		return fetch( url, init ).catch( ( error ) =>
		{
console.log( error );
			// TODO: redirect
			return Promise.reject( error );
		} ).then( ( responce ) => { return responce.json(); } );
	}

	private static get(  api: string ): Promise<Response> { return API.timeout( '/api/' + api ); }

	private static post(  api: string, data: {} ): Promise<Response>
	{
		return API.timeout( '/api/' + api, { method: 'POST', body: JSON.stringify( data ) } );
	}

	// ----------------------------------------

	public static getUser(): Promise<OpenUserData>
	{
		return API.get( 'user/' );
	}

	public static getSchedule(): Promise<CronData>
	{
		return API.get( 'schedule/' );
	}
}
