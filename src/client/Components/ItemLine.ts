/// <reference path="./ListItem.ts" />

class ItemLine extends ListItem
{
	private _on: { [ key: string ]: ( self: ItemLine, event: MouseEvent ) => any } = {};

	constructor( disable: boolean )
	{
		super();
	}

	protected baseClass() { this.addClass( 'componentItemLine' ); }

	protected onEvent( name: string, self: ItemLine, event: MouseEvent )
	{
		if ( !this._on[ name ] ){ return; }
		return this._on[ name ]( self, event );
	}

	public onChange( callback: ( self: ItemLine, event: MouseEvent ) => any ): ItemLine
	{
		this._on[ 'change' ] = callback;
		return this;
	}

	public onDisable( callback: ( self: ItemLine, event: MouseEvent ) => any ): ItemLine
	{
		this._on[ 'disable' ] = callback;
		return this;
	}

	public onDelete( callback: ( self: ItemLine, event: MouseEvent ) => any ): ItemLine
	{
		this._on[ 'delete' ] = callback;
		return this;
	}

	public isDisable(): boolean { return false; }

	public getStringData(): string { return ''; }
}
