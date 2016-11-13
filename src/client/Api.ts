/// <reference path="../server/Types.ts" />

class API
{
	static getSchedule(): Promise<CronData>
	{
		return fetch( '/api/schedule/' ).then( ( responce ) => { return responce.json(); } );
	}
}
