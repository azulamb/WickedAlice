class ErrorPage extends App
{
	protected render()
	{
		document.title = 'Error';
		this.setContent( this.mainContent() );
	}

	private mainContent(): Component
	{
		return new Label( 'Error' );
	}
}
