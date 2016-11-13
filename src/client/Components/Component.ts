class Component
{
	protected root: HTMLElement;

	constructor()
	{
		this.root = this.createRoot();
		this.baseClass();
	}

	protected createRoot(): HTMLElement { return document.createElement( 'div' ); }
	protected baseClass() {}

	public render(): HTMLElement { return this.root; }

	public add( component: Component | Component[] ): Component
	{
		if ( Object.prototype.toString.call( component ) !== '[object Array]' )
		{
			this.root.appendChild( (<Component>component).render() );
			return this;
		}
		(<Component[]>component).forEach( ( component ) =>
		{
			this.root.appendChild( component.render() );
		} );
		return this;
	}

	public addClass( className: string ): Component
	{
		this.root.classList.add( className );
		return this;
	}

	public remove( component: Component )
	{
		this.root.removeChild( component.root );
	}
}
