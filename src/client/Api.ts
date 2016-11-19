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

	private static get(  api: string ): Promise<Response> { return API.timeout( '/api/' + api, { credentials: 'include' } ); }

	private static post(  api: string, data: {} ): Promise<Response>
	{
		return API.timeout( '/api/' + api, { method: 'POST', body: JSON.stringify( data ), credentials: 'include' } );
	}

	// ----------------------------------------

	public static getMe(): Promise<OpenUserData>
	{
		return API.get( 'user/' );
	}

	public static updateMe( data: CloseUserData ): Promise<ResultMessage>
	{
		delete data.id;
		delete data.type;
		return API.post( 'user/', data );
	}

	public static getSchedule(): Promise<CronData>
	{
		return API.get( 'schedule/' );
	}
}
