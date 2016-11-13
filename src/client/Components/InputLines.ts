class InputLines extends Component
{
	private _on: { [ key: string ]: ( self: InputLines, target: InputLine, event: MouseEvent ) => any } = {};
	private itemList: Component;
	private list: InputLine[];

	constructor()
	{
		super();
		this.itemList = new Component().addClass( 'list' );
		this.add( this.itemList );
		this.list = [];
	}

	protected createRoot(): HTMLElement { return document.createElement( 'ul' ); }
	protected baseClass() { this.addClass( 'componentInputLines' ); }

	public addItems( items: { text?: string, placeHolder?: string, on?: boolean }[] ): InputLines
	{
		items.forEach( ( item ) =>
		{
			const line = new ListItem();
			const input = new InputLine( item.text, item.placeHolder ).onChange( this.changedItem() ).readOnly( item.on === false );
			line.add( new Toggle( item.on !== false ).onChange( ( self ) => { input.readOnly( !self.isOn() ) } ) );
			line.add( input );
			line.add( new Button( '-' ).onClick( this.deletedItem( line, input ) ) );
			this.list.push( input );
			this.itemList.add( line );
		} );
		return this;
	}

	private onEvent( name: string, run: boolean, self: InputLine, event: MouseEvent )
	{
		if ( !this._on[ name ] || !run ){ return; }
		return this._on[ name ]( this, self, event );
	}

	private changedItem()
	{
		return ( self: InputLine, event: MouseEvent ) => { this.onEvent( 'click', true, self, event ); }
	}

	private deletedItem( parent: Component, item: InputLine )
	{
		return ( self: Button, event: MouseEvent ) =>
		{
			this.deleteItem( parent, item );
			return this.onEvent( 'delete', true, item, event );
		};
	}

	private deleteItem( parent: Component, item: InputLine )
	{
		const index = this.list.indexOf( item );
		if ( index < 0 ) { return; }
		this.list.splice( index );
		this.itemList.remove( parent );
	}

	public onDelete( callback: ( self: InputLines, target: InputLine, event: MouseEvent ) => any ): InputLines
	{
		this._on[ 'delete' ] = callback;
		return this;
	}

	public onChange( callback: ( self: InputLines, target: InputLine, event: MouseEvent ) => any ): InputLines
	{
		this._on[ 'click' ] = callback;
		return this;
	}

	public getValues(): string[]
	{
		return this.list.map( ( line ) => { return line.getValue(); } );
	}
}
