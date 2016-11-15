/// <reference path="./Component.ts" />

class ImagePreview extends Component
{
	protected root: HTMLImageElement;
	private path: string;
	private largepath: string;
	private _on: { [ key: string ]: ( self: ImagePreview, arg: boolean | MouseEvent ) => any } = {};

	constructor( image: string, onload?: ( self: ImagePreview, success: boolean ) => {} )
	{
		super();
		this.setImage( image, onload );
		this.root.addEventListener( 'load', () =>
		{
			if ( !this._on[ 'load' ] ){ return ; }
			this._on[ 'load' ]( this, true );
		} );

		this.root.addEventListener( 'error', () =>
		{
			if ( !this._on[ 'error' ] ){ return ; }
			this._on[ 'error' ]( this, false );
		} );

		this.root.addEventListener( 'click', ( event: MouseEvent ) =>
		{
			if ( !this._on[ 'click' ] ){ return ; }
			// TODO: open modal
			this._on[ 'click' ]( this, event );
		} );
	}

	protected baseClass() { this.addClass( 'img' ); }

	public setImage( image: string, onload?: ( self: ImagePreview, success: boolean ) => {} ): ImagePreview
	{
		this.path = image;
		this.largepath = '';

		if ( onload )
		{
			this._on[ 'load' ] = onload;
			this._on[ 'error' ] = onload;
		} else
		{
			delete this._on[ 'load' ];
			delete this._on[ 'error' ];
		}

		this.root.src = image;

		return this;
	}

	public getImage(): HTMLImageElement { return this.root; }

	public setLargeImage( largeImage: string ): ImagePreview
	{
		this.largepath = largeImage;
		return this;
	}
}
