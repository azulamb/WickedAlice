/// <reference path="./Component.ts" />

class Paragraph extends Label
{
	protected createRoot(): HTMLElement { return document.createElement( 'p' ); }
	protected baseClass() { this.addClass( 'componentParagraph' ); }
}
