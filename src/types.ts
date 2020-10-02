
/**
 * Icons
 */

export interface IIconConfig {
	offset?: number;
	background?: boolean | string;
}

export interface IIconsConfig {
	favicon?: boolean;
	android?: boolean | IIconConfig;
	apple?: boolean | IIconConfig;
	appleStartup?: boolean | IIconConfig;
}

export interface ISize {
	width?: number;
	height?: number;
}

export interface IIconToGenerateConfig extends ISize {
	sizes?: ISize[];
	rotate?: boolean;
	pixelRatio?: number;
}

/**
 * Manifest
 */

export interface IManifestIcon {
	src: string;
	sizes: string;
	type?: string;
}

export interface IManifestRelatedApplication {
	platform: string;
	id?: string;
	url?: string;
}

export interface IManifestConfig {
	name?: string;
	short_name?: string;
	description?: string;
	dir?: 'auto' | 'ltr' | 'rtl';
	lang?: string;
	display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
	orientation?: 'any' | 'natural' | 'landscape' | 'landscape-primary'
		|'landscape-secondary' | 'portrait' | 'portrait-primary' | 'portrait-secondary';
	scope?: string;
	start_url?: string;
	background_color?: string;
	theme_color?: string;
	prefer_related_applications?: boolean;
	related_applications?: IManifestRelatedApplication[];
	icons?: IManifestIcon[];
}

/**
 * HTML
 */

export interface IHeadersConfig {
	path?: string;
	manifest?: IManifestConfig;
	webAppCapable?: 'yes' | 'no';
	webAppStatusBarStyle?: 'default' | 'black' | 'black-translucent';
}

export interface IHtmlHeader {
	tagName: string;
	name?: string;
	content?: string;
	rel?: string;
	type?: string;
	sizes?: string;
	media?: string;
	href?: string;
}

/**
 * Internals
 */

export interface IRenderConfig {
	width: number;
	height: number;
	background: string;
	offset: number;
}
