class Schedule extends App
{
	private env: ItemLines;
	private cron: ItemLines;

	protected render()
	{
		document.title = 'Projects';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );
		API.getSchedule().then( ( result ) =>
		{
			this.env.addItems( result.env.map( ( data ) =>
			{
				return new EnvLine( data.line, !data.enable );
			} ) );

			this.cron.addItems( result.cron.map( ( data ) =>
			{
				return new CronLine( data.time, data.command, !data.enable );
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

		this.env = new ItemLines().setNewLineGenerator( () => { return new EnvLine( '', false ); } );
		const addEnv = new Button( '+' ).onClick( this.env.onAddCallback() );

		this.cron = new ItemLines();
		const addCron = new Button( '+' ).onClick( this.cron.onAddCallback() );

		const update = new Button( Dictionary.button.update );

		root.add( [ this.env, addEnv, this.cron, addCron, update ] );
		return root;
	}
}
