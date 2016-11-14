/// <reference path="./Component.ts" />

class InputBase extends Component
{
	private _on: { [ key: string ]: ( self: InputBase, event: MouseEvent ) => any } = {};

	protected createRoot(): HTMLElement { return document.createElement( 'input' ); }
	protected baseClass() { this.addClass( 'componentInputBase' ); }

	public onChange( callback: ( self: InputBase, event: MouseEvent ) => any ): InputBase
	{
		// TODO: paste
		this.addEvent( 'input' /*'keyup'*/, callback );
		return this;
	}

	public addEvent( event: string|string[], callback: ( self: InputBase, event: MouseEvent ) => any )
	{
		const ev: string[] = typeof event === 'string' ? [ event ] : event;
		ev.forEach( ( ename ) =>
		{
			if ( !this._on[ ename ] )
			{
				this.root.addEventListener( ename, ( event: MouseEvent ) =>
				{
					event.stopPropagation();
					if ( !this._on[ ename ] || this.isReadOnly() ) { return; }
					return this._on[ ename ]( this, event );
				}, false );
			}
			this._on[ ename ] = callback;
		} );
	}

	public readOnly( readOnly: boolean = false ): InputBase
	{
		(<HTMLInputElement>this.root).readOnly = readOnly;
		return this;
	}

	public isReadOnly(): boolean { return (<HTMLInputElement>this.root).readOnly; }

	public setPlaceHolder( value: string ): InputBase
	{
		(<HTMLInputElement>this.root).placeholder = value;
		return this;
	}

	public setValue( value: string, change: boolean = true ): InputBase
	{
		(<HTMLInputElement>this.root).value = value;
		return this;
	}

	public getValue(): string { return (<HTMLInputElement>this.root).value; }
}
