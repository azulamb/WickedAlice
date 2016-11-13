/// <reference path="./Component.ts" />

class Label extends Component
{
	constructor( text: string | Component )
	{
		super();
		if ( typeof text === 'string' )
		{
			this.root.textContent = text;
		} else
		{
			this.add( text );
		}
		
	}

	protected baseClass() { this.addClass( 'componentLabel' ); }
}
