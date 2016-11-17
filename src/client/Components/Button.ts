/// <reference path="./Label.ts" />

class Button extends Label
{
	private _on: { [ key: string ]: ( self: Button, event: MouseEvent ) => any } = {};

	constructor ( content: string | Component )
	{
		super( content );
	}

	protected createRoot(): HTMLElement { return document.createElement( 'button' ); }
	protected baseClass() { this.addClass( 'componentButton' ); }

	public toggle( disable?: boolean ): Button
	{
		if ( disable === undefined )
		{
			this.root.classList.toggle( 'clickable' );
			return this;
		}
		if ( disable )
		{
			this.root.classList.remove( 'clickable' );
		} else
		{
			this.root.classList.add( 'clickable' );
		}
		return this;
	}

	public enable(): Button
	{
		return this.toggle( true );
	}

	public disable(): Button
	{
		return this.toggle( false );
	}

	private onEvent( name: string, run: boolean, event: MouseEvent )
	{
		event.stopPropagation();
		if ( !this._on[ name ] || !run ) { return; }
		return this._on[ name ]( this, event );
	}

	public onClick( callback: ( self: Button, event: MouseEvent ) => any ): Button
	{
		if ( !this._on[ 'click' ] )
		{
			this.root.addEventListener( 'click', ( event: MouseEvent ) =>
			{
				return this.onEvent( 'click', this.root.classList.contains( 'clickable' ), event );
			}, false );
		}
		this._on[ 'click' ] = callback;
		return this;
	}
}
