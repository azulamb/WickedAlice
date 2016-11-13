/// <reference path="./Component.ts" />

class InputLine extends Component
{
	private _on: { [ key: string ]: ( self: InputLine, event: MouseEvent ) => any } = {};

	constructor( text: string = '', placeHolder: string = '' )
	{
		super();
		this.setValue( text );
		this.setPlaceHolder( placeHolder );
	}

	protected createInput( type: string ): HTMLInputElement
	{
		const input = document.createElement( 'input' );
		input.type = type;
		return input;
	}

	protected createRoot(): HTMLElement { return this.createInput( 'text' ); }
	protected baseClass() { this.addClass( 'componentInputLine' ); }

	private rootElement(): HTMLInputElement { return <HTMLInputElement>this.root; }

	public readOnly( readOnly: boolean = false ): InputLine
	{
		this.rootElement().readOnly = readOnly;
		return this;
	}

	public isReadOnly(): boolean { return (<HTMLInputElement>this.root).readOnly; }

	public onChange( callback: ( self: InputLine, event: MouseEvent ) => any ): InputLine
	{
		if ( !this._on[ 'keyup' ] )
		{
			this.root.addEventListener( 'keyup', ( event: MouseEvent ) =>
			{
				event.stopPropagation();
				if ( !this._on[ 'keyup' ] || this.isReadOnly() ) { return; }
				return this._on[ 'keyup' ]( this, event );
			}, false );
		}
		this._on[ 'keyup' ] = callback;
		return this;
	}

	public setPlaceHolder( value: string ): InputLine
	{
		this.rootElement().placeholder = value;
		return this;
	}

	public setValue( value: string, change: boolean = true ): InputLine
	{
		this.rootElement().value = value;
		return this;
	}

	public getValue(): string { return this.rootElement().value; }
}
