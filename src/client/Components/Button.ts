/// <reference path="./Label.ts" />

class Button extends Label
{
	private _on: { [ key: string ]: ( self: Button, event: MouseEvent ) => any } = {};

	constructor ( content: string | Component, disable: boolean = false )
	{
		super( content );
		this.disable( disable );
	}

	protected createRoot(): HTMLElement { return document.createElement( 'button' ); }
	protected baseClass() { this.addClass( 'componentButton' ); }

	public disable( disable: boolean = false ): Button
	{
		if ( disable )
		{
			this.root.classList.remove( 'clickable' );
		} else
		{
			this.root.classList.add( 'clickable' );
		}
		return this;
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
