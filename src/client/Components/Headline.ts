/// <reference path="./Label.ts" />

class HeadLine extends Component
{
	private level: number = 1;
	constructor( level: number, text: string | Component )
	{
		super();
		this.setLevel( level );
		if ( typeof text === 'string' )
		{
			this.root.textContent = text;
		} else
		{
			this.add( text );
		}
	}

	protected createRoot(): HTMLElement { return document.createElement( 'h' + this.level ); }
	protected baseClass() { this.addClass( 'componentHeadline' ); }

	private copyList<T,C>( list: T, callback: ( item: C ) => void )
	{
		for ( var i = 0; i < (<any>list).length ; ++i )
		{
			callback( (<any>list)[ i ] );
		}
	}

	public setLevel( level: number ): HeadLine
	{
		level = Math.floor( level );
		level = level < 1 ? 1 : ( 6 < level ? 6 : level );
		if ( level !== this.level )
		{
			this.level = level;
			const headline = this.createRoot();

			// Copy contents.

			// Copy node.
			this.copyList<NodeList,Node>( this.root.childNodes, ( item ) => { headline.appendChild( item ); } );

			// Copy class.
			this.copyList<DOMTokenList,string>( this.root.classList, ( item ) => { headline.classList.add( item ); } );

			this.root = headline;
		}
		return this;
	}
}
