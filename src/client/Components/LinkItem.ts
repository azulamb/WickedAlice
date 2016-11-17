/// <reference path="./Button.ts" />

class LinkItem extends Button
{
	protected root: HTMLElement;

	constructor( text: string | Component, callback?: ( self: LinkItem, event: MouseEvent ) => any )
	{
		super( text );
		if ( !callback ){ return; }
		this.onClick( callback );
	}

	protected createRoot(): HTMLElement { return document.createElement( 'li' ); }

	protected baseClass() { this.addClass( 'componentLinkItem' ); }
}
