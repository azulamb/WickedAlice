/// <reference path="./Button.ts" />

class ListItem extends Component
{
	protected root: HTMLElement;

	protected createRoot(): HTMLElement { return document.createElement( 'li' ); }

	protected baseClass() { this.addClass( 'componentListItem' ); }
}
