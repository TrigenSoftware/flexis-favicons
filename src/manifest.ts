
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
	dir?: 'auto'|'ltr'|'rtl';
	lang?: string;
	display?: 'fullscreen'|'standalone'|'minimal-ui'|'browser';
	orientation?: 'any'|'natural'|'landscape'|'landscape-primary'
		|'landscape-secondary'|'portrait'|'portrait-primary'|'portrait-secondary';
	scope?: string;
	start_url?: string;
	background_color?: string;
	theme_color?: string;
	prefer_related_applications?: boolean;
	related_applications?: IManifestRelatedApplication[];
	icons?: IManifestIcon[];
}
