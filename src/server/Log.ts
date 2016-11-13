class Log
{
	static LOG_LV_LOG   = 16;
	static LOG_LV_INFO  = 8;
	static LOG_LV_DEBUG = 4;
	static LOG_LV_WARN  = 2;
	static LOG_LV_ERROR = 1;
	static LOGLEVEL: number = Log.LOG_LV_LOG | Log.LOG_LV_INFO | Log.LOG_LV_DEBUG | Log.LOG_LV_WARN | Log.LOG_LV_ERROR;
	static log( message: any, ...optionalParams: any[] ) { if ( !(Log.LOGLEVEL & Log.LOG_LV_LOG) ) { return; } console.log.apply( console, arguments ); }
	static info( message: any, ...optionalParams: any[] ) { if ( !(Log.LOGLEVEL & Log.LOG_LV_INFO) ) { return; } console.info.apply( console, arguments ); }
	//static debug( message: any, ...optionalParams: any[] ) { if ( !(Log.LOGLEVEL & Log.LOG_LV_DEBUG) ) { return; } console.debug.apply( console, arguments ); }
	static warn( message: any, ...optionalParams: any[] ) { if ( !(Log.LOGLEVEL & Log.LOG_LV_WARN) ) { return; } console.warn.apply( console, arguments ); }
	static error( message: any, ...optionalParams: any[] ) { if ( !(Log.LOGLEVEL & Log.LOG_LV_ERROR) ) { return; } console.error.apply( console, arguments ); }
}

export = Log;
