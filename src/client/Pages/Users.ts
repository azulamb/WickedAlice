

class Users extends App
{
	private email: InputLineText;
	private name: InputLineText;
	private send: Button;

	protected render()
	{
		document.title = 'User';
		this.setMenu( this.menuComponent() );
		this.setContent( this.mainContent() );

		API.getMe().then( ( user ) =>
		{
			this.email.setValue( user.email );
			this.name.setValue( user.name );
			this.send.enable();
		} ).catch( ( error ) =>
		{
			// Error message.
		} );
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

		this.email = new InputLineText().readOnly( true );

		this.name = new InputLineText().readOnly( true );

		this.send = new Button( Dictionary.button.update ).disable().onClick( () =>
		{
			API.updateMe(
			{
				id: '',
				name: this.name.getValue(),
				type: '',
			} );
		} );

		root.add( [ this.email, this.name, this.send ] );
		return root;
	}
}
