import { IManifestConfig } from './manifest';

export interface IIconConfig {
	offset?: number;
	background?: boolean|string;
}

export interface IIconsConfig {
	favicon?: boolean;
	android?: boolean|IIconConfig;
	apple?: boolean|IIconConfig;
	appleStartup?: boolean|IIconConfig;
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

interface IIconsToGenerate {
	[type: string]: {
		[iconName: string]: IIconToGenerateConfig;
	};
}

/**
 * Get complete icon config from shirt config.
 * @param  iconsType - Icons type name.
 * @param  iconsConfig - Icons shirt config.
 * @param  manifestConfig - Config to get background color.
 * @return Complete config.
 */
export function getCompleteIconConfig(
	iconsType: string,
	iconsConfig: IIconsConfig,
	{ background_color: background }: IManifestConfig
): IIconConfig {

	const iconConfigSource: boolean|IIconConfig = iconsConfig[iconsType];

	if (!iconConfigSource) {
		return null;
	}

	const {
		offset: iconOffsetSource,
		background: iconBackgroundSource
	}: IIconConfig = iconConfigSource === true
		? {}
		: iconConfigSource;
	const completeOffset = typeof iconOffsetSource !== 'undefined'
		? iconOffsetSource
		: 0;
	let completeBackground = typeof iconBackgroundSource !== 'undefined'
		? iconBackgroundSource
		: false;

	if (typeof completeBackground === 'boolean') {

		if (iconsTransparency[iconsType] && !completeBackground) {
			completeBackground = 'transparent';
		} else {
			completeBackground = background;
		}
	}

	return {
		offset: completeOffset,
		background: completeBackground
	};
}

const iconsTransparency = {
	favicon:      true,
	android:      true,
	apple:        false,
	appleStartup: false
};

export const iconsToGenerate: IIconsToGenerate = {
	favicon: {
		'favicon.ico': {
			sizes: [
				{
					width: 16,
					height: 16
				},
				{
					width: 24,
					height: 24
				},
				{
					width: 32,
					height: 32
				},
				{
					width: 48,
					height: 48
				},
				{
					width: 64,
					height: 64
				}
			]
		},
		'favicon-16x16.png': {
			width: 16,
			height: 16
		},
		'favicon-32x32.png': {
			width: 32,
			height: 32
		}
	},
	android: {
		'android-chrome-36x36.png': {
			width: 36,
			height: 36
		},
		'android-chrome-48x48.png': {
			width: 48,
			height: 48
		},
		'android-chrome-72x72.png': {
			width: 72,
			height: 72
		},
		'android-chrome-96x96.png': {
			width: 96,
			height: 96
		},
		'android-chrome-144x144.png': {
			width: 144,
			height: 144
		},
		'android-chrome-192x192.png': {
			width: 192,
			height: 192
		},
		'android-chrome-256x256.png': {
			width: 256,
			height: 256
		},
		'android-chrome-384x384.png': {
			width: 384,
			height: 384
		},
		'android-chrome-512x512.png': {
			width: 512,
			height: 512
		}
	},
	apple: {
		// 'apple-touch-icon-57x57.png' - non-retina iPhone/iPod touch
		// 'apple-touch-icon-60x60.png' - unknown or notification icon for native apps
		// 'apple-touch-icon-72x72.png' - non-retina iPad
		// 'apple-touch-icon-76x76.png' - also non-retina iPad
		// 'apple-touch-icon-114x114.png' - retina iPhone with iOS < 7
		// modern retina iPhone
		'apple-touch-icon-120x120.png': {
			width: 120,
			height: 120
		},
		// 'apple-touch-icon-144x144.png' - retina iPad with iOS < 7
		// modern retina iPad
		'apple-touch-icon-152x152.png': {
			width: 152,
			height: 152
		},
		// iPad Pro
		'apple-touch-icon-167x167.png': {
			width: 167,
			height: 167
		},
		// iPhone X, iPhone [N] Plus
		'apple-touch-icon-180x180.png': {
			width: 180,
			height: 180
		},
		// generic?
		'apple-touch-icon.png': {
			width: 180,
			height: 180
		}
		// 'apple-touch-icon-precomposed.png' - iOS < 7
	},
	appleStartup: {
		// iPhone 5
		'apple-touch-startup-image-640x1136.png': {
			width: 640,
			height: 1136,
			pixelRatio: 2
		},
		// iPhone
		'apple-touch-startup-image-750x1334.png': {
			width: 750,
			height: 1334,
			pixelRatio: 2
		},
		// iPhone [N] Plus
		'apple-touch-startup-image-1242x2208.png': {
			width: 1242,
			height: 2208,
			pixelRatio: 3
		},
		'apple-touch-startup-image-2208x1242.png': {
			width: 2208,
			height: 1242,
			pixelRatio: 3,
			rotate: true
		},
		// iPhone X
		'apple-touch-startup-image-1125x2436.png': {
			width: 1125,
			height: 2436,
			pixelRatio: 3
		},
		'apple-touch-startup-image-2436x1125.png': {
			width: 2436,
			height: 1125,
			pixelRatio: 3,
			rotate: true
		},
		// iPhone Xr
		'apple-touch-startup-image-828x1792.png': {
			width: 828,
			height: 1792,
			pixelRatio: 2
		},
		'apple-touch-startup-image-1792x828.png': {
			width: 1792,
			height: 828,
			pixelRatio: 2,
			rotate: true
		},
		// iPhone Xs Max
		'apple-touch-startup-image-1242x2688.png': {
			width: 1242,
			height: 2688,
			pixelRatio: 3
		},
		'apple-touch-startup-image-2688x1242.png': {
			width: 2688,
			height: 1242,
			pixelRatio: 3,
			rotate: true
		},
		// iPad Mini, Air
		'apple-touch-startup-image-1536x2048.png': {
			width: 1536,
			height: 2048,
			pixelRatio: 2
		},
		'apple-touch-startup-image-2048x1536.png': {
			width: 2048,
			height: 1536,
			pixelRatio: 2,
			rotate: true
		},
		// iPad Pro 10.5"
		'apple-touch-startup-image-1668x2224.png': {
			width: 1668,
			height: 2224,
			pixelRatio: 2
		},
		'apple-touch-startup-image-2224x1668.png': {
			width: 2224,
			height: 1668,
			pixelRatio: 2,
			rotate: true
		},
		// iPad Pro 11"
		'apple-touch-startup-image-1668x2388.png': {
			width: 1668,
			height: 2388,
			pixelRatio: 2
		},
		'apple-touch-startup-image-2388x1668.png': {
			width: 2224,
			height: 2388,
			pixelRatio: 2,
			rotate: true
		},
		// iPad Pro 12.9"
		'apple-touch-startup-image-2048x2732.png': {
			width: 2048,
			height: 2732,
			pixelRatio: 2
		},
		'apple-touch-startup-image-2732x2048.png': {
			width: 2732,
			height: 2048,
			pixelRatio: 2,
			rotate: true
		}
	}
};
