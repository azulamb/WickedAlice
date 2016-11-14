class ItemLines extends Component
{
	private _on: { [ key: string ]: ( self: ItemLines, target: ItemLine, event: MouseEvent ) => any } = {};
	private list: ItemLine[];

	constructor()
	{
		super();
		this.list = [];
	}

	protected createRoot(): HTMLElement { return document.createElement( 'ul' ); }
	protected baseClass() { this.addClass( 'componentItemLines' ); }

	public addItems( items: ItemLine[] ): ItemLines
	{
		items.forEach( ( item ) =>
		{
			item.onChange( this.onChangeItem() ).onDelete( this.onDeleteItem() );
			this.list.push( item );
			this.add( item );
		} );
		return this;
	}

	private onEvent( name: string, run: boolean, self: ItemLine, event: MouseEvent )
	{
		if ( !this._on[ name ] || !run ){ return; }
		return this._on[ name ]( this, self, event );
	}

	private onChangeItem()
	{
		return ( self: ItemLine, event: MouseEvent ) => { this.onEvent( 'change', true, self, event ); }
	}

	private onDeleteItem()
	{
		return ( self: ItemLine, event: MouseEvent ) =>
		{
			this.deleteItem( self );
			return this.onEvent( 'delete', true, self, event );
		};
	}

	private deleteItem( item: ItemLine )
	{
		const index = this.list.indexOf( item );
		if ( index < 0 ) { return; }
		this.list.splice( index );
		this.remove( item );
	}

	public onDelete( callback: ( self: ItemLines, target: ItemLine, event: MouseEvent ) => any ): ItemLines
	{
		this._on[ 'delete' ] = callback;
		return this;
	}

	public onChange( callback: ( self: ItemLines, target: ItemLine, event: MouseEvent ) => any ): ItemLines
	{
		this._on[ 'change' ] = callback;
		return this;
	}

	public getValues(): string[]
	{
		return this.list.map( ( item ) => { return item.getStringData(); } );
	}
}
