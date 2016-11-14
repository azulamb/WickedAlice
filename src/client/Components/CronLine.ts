/// <reference path="./ItemLine.ts" />

class CronLine extends ItemLine
{
	private _enable: Toggle;
	private _values: InputLineText[];

	constructor( time: string[], command: string, disable: boolean )
	{
		super( disable );

		this._values = [];
		time.forEach( ( value ) =>
		{
			this._values.push( <InputLineText>this.createInputLineText( value, disable ).addClass( 'crontime' ) );
		} );

		this._values.push( this.createInputLineText( command, disable ) );

		this._enable = new Toggle( !disable )
		.onChange( ( self, event ) =>
		{
			const readonly = !self.isOn();
			this._values.forEach( ( value ) => { value.readOnly( readonly ); } );
			return this.onEvent( 'disable', this, event );
		} );

		const button = new Button( '-' )
		.onClick( ( self, event ) => { return this.onEvent( 'delete', this, event ); } );

		this.add( this._enable );
		this._values.forEach( ( value ) => { this.add( value ); } );
		this.add( button );
	}

	private createInputLineText( value: string, disable: boolean): InputLineText
	{
		return new InputLineText( value )
		.readOnly( disable )
		.onChange( ( self, event ) => { return this.onEvent( 'change', this, event ); } )
	}

	protected baseClass() { super.baseClass(); this.addClass( 'componentCronLine' ); }

	public isDisable(): boolean { return !this._enable.isOn(); }

	public getStringData(): string
	{
		return ( this.isDisable() ? '#' : '' ) + this._values.map( ( value ) => { return value.getValue() } ).join( ' ' );
	}
}
