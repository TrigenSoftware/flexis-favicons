import {
	applyPath
} from './helpers';
import {
	IManifestConfig
} from './manifest';
import {
	IIconToGenerateConfig,
	iconsToGenerate
} from './icons';

export interface IHeadersConfig {
	path?: string;
	manifest?: IManifestConfig;
	webAppCapable?: 'yes'|'no';
	webAppStatusBarStyle?: 'default'|'black'|'black-translucent';
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

export default {
	favicon:      faviconHeaders,
	android:      androidHeaders,
	apple:        appleHeaders,
	appleStartup: appleStartupHeaders
};

/**
 * Get "favicon" headers.
 * @param  headersConfig - Config params.
 * @return Array of headers objects.
 */
function faviconHeaders({ path }: IHeadersConfig): IHtmlHeader[] {
	return Object.entries(iconsToGenerate.favicon).map(([filename, {
		sizes,
		width,
		height
	}]) => {

		const header: IHtmlHeader = {
			tagName: 'link',
			rel:     sizes ? 'shortcut icon' : 'icon',
			href:    applyPath(path, filename)
		};

		if (width && height) {
			header.type = 'image/png';
			header.sizes = `${width}x${height}`;
		}

		return header;
	});
}

/**
 * Get "android" headers.
 * @param  headersConfig - Config params.
 * @return Array of headers objects.
 */
function androidHeaders({
	path,
	webAppCapable = 'yes',
	manifest: {
		name: applicationName = null,
		theme_color: themeColor = null
	} = {}
}: IHeadersConfig): IHtmlHeader[] {

	const headers: IHtmlHeader[] = [
		{
			tagName: 'link',
			rel:     'manifest',
			href:    applyPath(path, 'manifest.json')
		},
		{
			tagName: 'meta',
			name:    'mobile-web-app-capable',
			content: webAppCapable
		}
	];

	if (typeof applicationName === 'string') {
		headers.push({
			tagName: 'meta',
			name:    'application-name',
			content: applicationName
		});
	}

	if (typeof themeColor === 'string') {
		headers.push({
			tagName: 'meta',
			name:    'theme-color',
			content: themeColor
		});
	}

	return headers;
}

/**
 * Get "apple" headers.
 * @param  headersConfig - Config params.
 * @return Array of headers objects.
 */
function appleHeaders({
	path,
	webAppCapable = 'yes',
	webAppStatusBarStyle = 'black-translucent',
	manifest: {
		name: applicationName = null
	} = {}
}: IHeadersConfig): IHtmlHeader[] {

	const headers: IHtmlHeader[] = [
		{
			tagName: 'meta',
			name:    'apple-mobile-web-app-capable',
			content: webAppCapable
		},
		{
			tagName: 'meta',
			name:    'apple-mobile-web-app-status-bar-style',
			content: webAppStatusBarStyle
		}
	];

	if (typeof applicationName === 'string') {
		headers.push({
			tagName: 'meta',
			name:    'apple-mobile-web-app-title',
			content: applicationName
		});
	}

	const iconsHeaders = Object.entries(iconsToGenerate.apple).map(([filename, {
		width,
		height
	}]) => ({
		tagName: 'link',
		rel:     'apple-touch-icon',
		sizes:   `${width}x${height}`,
		href:    applyPath(path, filename)
	}));

	headers.push(...iconsHeaders);

	return headers;
}

/**
 * Calculate media query for apple startup image.
 * @param  iconToGenerateConfig - Config with icon info.
 * @return Media query for device.
 */
function getAppleStartupMediaQuery(
	{
		width,
		height,
		pixelRatio: maybePixelRatio,
		rotate
	}: IIconToGenerateConfig
) {

	const pixelRatio = typeof maybePixelRatio === 'number'
		? maybePixelRatio
		: 1;
	const deviceWidth = width / pixelRatio;
	const deviceHeight = height / pixelRatio;
	let query = `(device-width: ${deviceWidth}px) and (device-height: ${deviceHeight}px)`;

	if (typeof rotate === 'boolean') {
		query += ` and (orientation: ${rotate ? 'landscape' : 'portrait'})`;
	}

	if (pixelRatio > 1) {
		query += ` and (-webkit-device-pixel-ratio: ${pixelRatio})`;
	}

	return query;
}

/**
 * Get "apple startup" headers.
 * @param  headersConfig - Config params.
 * @return Array of headers objects.
 */
function appleStartupHeaders({ path }: IHeadersConfig): IHtmlHeader[] {
	return Object.entries(iconsToGenerate.appleStartup).map(([filename, config]) => ({
		tagName: 'link',
		rel:     'apple-touch-startup-image',
		media:   getAppleStartupMediaQuery(config),
		href:    applyPath(path, filename)
	}));
}
