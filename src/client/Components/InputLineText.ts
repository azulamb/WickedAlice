/// <reference path="./InputBase.ts" />

class InputLineText extends InputBase
{
	constructor( text: string = '', placeHolder: string = '' )
	{
		super();
		this.setValue( text );
		this.setPlaceHolder( placeHolder );
	}

	protected createRoot(): HTMLElement
	{
		const input = document.createElement( 'input' );
		input.type = 'text';
		return input;
	}
	protected baseClass() { this.addClass( 'componentInputLineText' ); }

	public onChange( callback: ( self: InputLineText, event: MouseEvent ) => any ): InputLineText
	{
		super.onChange( callback );
		return this;
	}

	public readOnly( readOnly: boolean = false ): InputLineText
	{
		super.readOnly( readOnly );
		return this;
	}

	public setPlaceHolder( value: string ): InputLineText
	{
		super.setPlaceHolder( value );
		return this;
	}

	public setValue( value: string, change: boolean = true ): InputLineText
	{
		super.setValue( value, change );
		return this;
	}
}
