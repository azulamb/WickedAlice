class App
{
	public static createApp( page: string, params: {} = {} ): App
	{
		const [ name, path ] = page.replace( /^\//, '' ).split( '/', 2 );
		switch ( name )
		{
			case 'projects': return new Projects( params );
			case 'schedule': return new Schedule( params );
			case 'mypage': return new MyPage( params );
		}
		return new ErrorPage( params );
	}
	private static popstate: boolean = false;
	private static empty: HTMLElement = document.createElement( 'div' );

	// GET
	protected query: { [ key: string ]: string } = {};
	// Params from prev page.
	protected params: {};

	constructor( params: {} )
	{
		this.params = params;
		this.parseGetParams();
		this.closeMenu();
		this.registerChangeHistory();
		this.render();
		//this.getElement( 'modal' ).addEventListener( 'click', () => { this.closeModal(); }, false )
	}

	protected render()
	{
		document.title = 'Crocidolite';
	}

	protected pushState(): any { return {}; }

	private parseGetParams()
	{
		location.search.substr( 1 ).split( '&' ).forEach( ( v ) =>
		{
			if ( !v ){ return; }
			const [ key, value ] = v.split( '=', 2 );
			this.query[ key ] = decodeURI( value );
		} );
	}

	private getElement( id: string ): HTMLElement { return document.getElementById( id ) || App.empty; }

	private setComponent( element: HTMLElement, component: Component )
	{
		for ( let i = element.childNodes.length - 1; 0 <= i ; --i )
		{
			element.removeChild( element.childNodes[ i ] );
		}
		element.appendChild( component.render() );
	}

	// Menu

	protected setMenu( component: Component, open: boolean = true )
	{
		this.setComponent( this.getElement( 'menu' ), component );
		if ( open ){ this.openMenu(); }
	}

	protected closeMenu()
	{
		this.getElement( 'menu' ).parentElement.classList.add( 'close' );
	}

	protected openMenu()
	{
		this.getElement( 'menu' ).parentElement.classList.remove( 'close' );
	}

	// Content

	protected setContent( component: Component )
	{
		this.setComponent( this.getElement( 'content' ), component );
	}

	// Modal

	protected openModal( component: Component )
	{
		// add contents.
		this.getElement( 'modal' ).classList.remove( 'hidden' );
	}

	protected closeModal() { this.getElement( 'modal' ).classList.add( 'hidden' ); }

	// History

	private registerChangeHistory()
	{
		if ( App.popstate ) { return; }
		App.popstate = true;
		window.addEventListener( 'popstate', ( event: PopStateEvent ) =>
		{
			event.preventDefault();
			this.onChangeHistory( event );
		}, false );
	}

	protected onChangeHistory( event: PopStateEvent )
	{
		App.createApp( location.pathname, event.state ? event.state.params : {} );
	}

	protected transition( page: string, params?: {} )
	{
		history.pushState( App.createApp( page, params ).pushState(), document.title, page );
	}

	// Function
}
