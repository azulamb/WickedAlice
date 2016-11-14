/// <reference path="./InputBase.ts" />

class InputText extends InputBase
{
	constructor( text: string = '', placeHolder: string = '' )
	{
		super();
		this.setValue( text );
		this.setPlaceHolder( placeHolder );
	}

	protected createRoot(): HTMLElement { return document.createElement( 'textarea' ); }
	protected baseClass() { this.addClass( 'componentInputText' ); }

	public onChange( callback: ( self: InputText, event: MouseEvent ) => any ): InputText
	{
		super.onChange( callback );
		return this;
	}

	public isReadOnly(): boolean { return (<HTMLTextAreaElement>this.root).readOnly; }

	public readOnly( readOnly: boolean = false ): InputText
	{
		(<HTMLTextAreaElement>this.root).readOnly = readOnly;
		return this;
	}

	public setPlaceHolder( value: string ): InputText
	{
		(<HTMLTextAreaElement>this.root).placeholder = value;
		return this;
	}

	public setValue( value: string, change: boolean = true ): InputText
	{
		(<HTMLTextAreaElement>this.root).value = value;
		// TODO: on change
		if ( change ){}
		return this;
	}

	public getValue(): string { return (<HTMLTextAreaElement>this.root).value; }
}
