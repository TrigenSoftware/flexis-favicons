import { applyPath } from './helpers';
import { IManifestConfig } from './manifest';
import {
	ISize,
	IIconToGenerateConfig,
	iconsToGenerate
} from './icons';

interface IHeadersConfig {
	path: string;
	manifest: IManifestConfig;
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
	manifest: {
		name: applicationName,
		theme_color: themeColor
	}
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
			content: 'yes'
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
	manifest: {
		name: applicationName
	}
}: IHeadersConfig): IHtmlHeader[] {

	const headers: IHtmlHeader[] = [
		{
			tagName: 'meta',
			name:   'apple-mobile-web-app-capable',
			content: 'yes'
		},
		{
			tagName: 'meta',
			name:    'apple-mobile-web-app-status-bar-style',
			content: 'black-translucent'
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

const appleStartupDeviceSizes: ISize[] = [
	{
		width:  320,
		height: 480
	},
	{
		width:  320,
		height: 480
	},
	{
		width:  320,
		height: 568
	},
	{
		width:  375,
		height: 667
	},
	{
		width:  414,
		height: 736
	},
	{
		width:  414,
		height: 736
	},
	{
		width:  768,
		height: 1024
	},
	{
		width:  768,
		height: 1024
	},
	{
		width:  768,
		height: 1024
	},
	{
		width:  768,
		height: 1024
	}
];

const WIDTH_WITH_ORIENTATION = 400;

/**
 * Calculate media query for apple startup image.
 * @param  iconToGenerateConfig - Config with icon info.
 * @param  deviceSize - Device screen size.
 * @return Media query for device.
 */
function getAppleStartupMediaQuery(
	{
		width,
		rotate
	}: IIconToGenerateConfig,
	{
		width: deviceWidth,
		height: deviceHeight
	}: ISize
) {

	const pixelRatio = Math.round(width / deviceWidth);
	let query = `(device-width: ${deviceWidth}px) and (device-height: ${deviceHeight}px)`;

	if (deviceWidth > WIDTH_WITH_ORIENTATION) {
		query += ` and (orientation: ${rotate ? 'landscape' : 'portrait'})`;
	}

	query += ` and (-webkit-device-pixel-ratio: ${pixelRatio})`;

	return query;
}

/**
 * Get "apple startup" headers.
 * @param  headersConfig - Config params.
 * @return Array of headers objects.
 */
function appleStartupHeaders({ path }: IHeadersConfig): IHtmlHeader[] {
	return Object.entries(iconsToGenerate.appleStartup).map(([filename, config], i) => ({
		tagName: 'link',
		rel:     'apple-touch-startup-image',
		media:   getAppleStartupMediaQuery(config, appleStartupDeviceSizes[i]),
		href:    applyPath(path, filename)
	}));
}
