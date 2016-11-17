/// <reference path="./LinkItem.ts" />

class LinkItems extends Component
{
	protected root: HTMLElement;

	protected createRoot(): HTMLElement { return document.createElement( 'ul' ); }

	protected baseClass() { this.addClass( 'componentLinkItems' ); }

	public addItem( items: [ { content: string | Component, callback?: ( self: LinkItem, event: MouseEvent ) => any, disable?: boolean } ] ): LinkItems
	{
		items.forEach( ( item ) =>
		{
			this.add( new LinkItem( item.content, item.callback ).toggle( item.disable ).addClass( 'colorLightButton' ) );
		} );
		return this;
	}
}
