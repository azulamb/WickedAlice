class Projects extends App
{
	protected render()
	{
		document.title = 'Projects';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );
	}

	private menuComponent(): Component
	{
		const root = new Component();

		root.add( new Button( 'open' ) );

		return root;
	}

	private mainContent(): Component
	{
		const root = new Component();
		const button = new Button( ((<any>this.params).message || 0) + '' );
		button.onClick( () =>
		{
			this.transition( '/mypage/', { message: ((<any>this.params).message || 0) + 1 } );
		} );
		root.add( button );
		return root;
	}
}
