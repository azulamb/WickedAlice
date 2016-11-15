

class Users extends App
{
	protected render()
	{
		document.title = 'User';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );
	}

	private toPage( page: string ) { return () => { this.transition( '/' + page + '/' ); }; }

	private menuComponent(): Component
	{
		const root = new Component();

		return root;
	}

	private mainContent(): Component
	{
		const root = new Component();
		return root;
	}
}
