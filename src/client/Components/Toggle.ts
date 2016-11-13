
class Toggle extends Component
{
	private _on: { [ key: string ]: ( self: Toggle, event: MouseEvent ) => any } = {};

	constructor ( on: boolean = false )
	{
		super();
		this.addClass( 'clickable' );
		this.on( on );
	}

	protected createRoot(): HTMLElement
	{
		const root = document.createElement( 'div' );
		root.appendChild( document.createElement( 'div' ) );
		return root;
	}
	protected baseClass() { this.addClass( 'componentToggle' ); }

	public on( on: boolean = false ): Toggle
	{
		if ( on )
		{
			this.root.classList.add( 'on' );
		} else
		{
			this.root.classList.remove( 'on' );
		}
		return this;
	}

	public isOn(): boolean { return this.root.classList.contains( 'on' ); }

	private onEvent( name: string, run: boolean, event: MouseEvent )
	{
		event.stopPropagation();
		if ( !this._on[ name ] || !run ) { return; }
		return this._on[ name ]( this, event );
	}

	public onChange( callback: ( self: Toggle, event: MouseEvent ) => any ): Toggle
	{
		if ( !this._on[ 'click' ] )
		{
			this.root.addEventListener( 'click', ( event: MouseEvent ) =>
			{
				this.root.classList.toggle( 'on' );
				return this.onEvent( 'click', true, event );
			}, false );
		}
		this._on[ 'click' ] = callback;
		return this;
	}
}
