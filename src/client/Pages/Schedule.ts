
class Schedule extends App
{
	private env: InputLines;

	protected render()
	{
		document.title = 'Projects';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );
		API.getSchedule().then( ( result ) =>
		{
			this.env.addItems( result.env.map( ( data ) =>
			{
				return { text: data.line, on: data.enable };
			} ) );
		} );
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

		this.env = new InputLines();

		root.add( this.env );
		return root;
	}
}
