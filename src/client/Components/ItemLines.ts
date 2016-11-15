class ItemLines extends Component
{
	private _on: { [ key: string ]: ( self: ItemLines, target: ItemLine, event: MouseEvent ) => any } = {};
	private list: ItemLine[];
	private newline: () => ItemLine;

	constructor()
	{
		super();
		this.list = [];
		this.setNewLineGenerator( () => { return new ItemLine( false ); } );
//const button = new Button( '+' );
//button.onClick( this.onAddCallback() );
	}

	protected createRoot(): HTMLElement { return document.createElement( 'ul' ); }
	protected baseClass() { this.addClass( 'componentItemLines' ); }

	private createEmptyLine(): ItemLine { return this.newline(); }

	public addItems( items: ItemLine[] ): ItemLines
	{
		items.forEach( ( item ) => { this.addItem( item ); } );
		return this;
	}

	private onEvent( name: string, run: boolean, self: ItemLine, event: MouseEvent )
	{
		event.stopPropagation();
		if ( !this._on[ name ] || !run ){ return; }
		return this._on[ name ]( this, self, event );
	}

	private onChangeCallback()
	{
		return ( self: ItemLine, event: MouseEvent ) => { this.onEvent( 'change', true, self, event ); }
	}

	public onAddCallback()
	{
		return ( self:Button, event: MouseEvent ) =>
		{
			this.addItem( this.createEmptyLine(), event );
		};
	}

	private onDeleteCallback()
	{
		return ( self: ItemLine, event: MouseEvent ) =>
		{
			this.deleteItem( self );
			return this.onEvent( 'delete', true, self, event );
		};
	}

	private addItem( item: ItemLine, event?: MouseEvent )
	{
		item.onChange( this.onChangeCallback() ).onDelete( this.onDeleteCallback() );
		this.list.push( item );
		this.add( item );
		if ( event ) { this.onEvent( 'add', true, item, event ); }
		return item;
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

	public onAdd( callback: ( self: ItemLines, target: ItemLine, event: MouseEvent ) => any ): ItemLines
	{
		this._on[ 'add' ] = callback;
		return this;
	}

	public setNewLineGenerator( create: () => ItemLine ): ItemLines
	{
		this.newline = create;
		return this;
	}

	public getValues(): string[]
	{
		return this.list.map( ( item ) => { return item.getStringData(); } );
	}
}
