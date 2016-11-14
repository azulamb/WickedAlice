/// <reference path="./ItemLine.ts" />

class EnvLine extends ItemLine
{
	private _enable: Toggle;
	private _input: InputLineText;

	constructor( value: string, disable: boolean )
	{
		super( disable );

		this._input = new InputLineText( value )
		.readOnly( disable )
		.onChange( ( self, event ) => { return this.onEvent( 'change', this, event ); } );

		this._enable = new Toggle( !disable )
		.onChange( ( self, event ) =>
		{
			this._input.readOnly( !self.isOn() );
			return this.onEvent( 'disable', this, event );
		} );

		const button = new Button( '-' )
		.onClick( ( self, event ) => { return this.onEvent( 'delete', this, event ); } );

		this.add( this._enable );
		this.add( this._input );
		this.add( button );
	}

	protected baseClass() { super.baseClass(); this.addClass( 'componentEnvLine' ); }

	public isDisable(): boolean { return !this._enable.isOn(); }

	public getStringData(): string { return ( this.isDisable() ? '#' : '' ) + this._input.getValue(); }
}
