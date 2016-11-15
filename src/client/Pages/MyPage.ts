

class MyPage extends App
{
	protected render()
	{
		document.title = 'MyPage';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );
	}

	private toPage( page: string ) { return () => { this.transition( '/' + page + '/' ); }; }

	private menuComponent(): Component
	{
		const root = new Component();

		root.add( new Button( 'open' ).onClick( ()=>{this.closeMenu()} ) );
		root.add( new LinkItems().addItem( [
			{ content: Dictionary.page.projects, callback: this.toPage( 'projects' ) },
			{ content: Dictionary.page.schedule, callback: this.toPage( 'schedule' ) },
			{ content: Dictionary.page.users, callback: this.toPage( 'users' ) },
			{ content: Dictionary.page.setting, disable: true },
		] ) );

		return root;
	}

	private mainContent(): Component
	{
		const root = new Component();
		const button = new Button( ((<any>this.params).message || 0) + '' );
		button.onClick( () =>
		{
			this.transition( '/projects/', { message: ((<any>this.params).message || 0) + 1 } );
		} );
		root.add( button );
		return root;
	}
}
