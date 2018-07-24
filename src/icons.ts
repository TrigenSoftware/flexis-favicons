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
	rotate: boolean;
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
			],
			rotate: false
		},
		'favicon-16x16.png': {
			width: 16,
			height: 16,
			rotate: false
		},
		'favicon-32x32.png': {
			width: 32,
			height: 32,
			rotate: false
		}
	},
	android: {
		'android-chrome-36x36.png': {
			width: 36,
			height: 36,
			rotate: false
		},
		'android-chrome-48x48.png': {
			width: 48,
			height: 48,
			rotate: false
		},
		'android-chrome-72x72.png': {
			width: 72,
			height: 72,
			rotate: false
		},
		'android-chrome-96x96.png': {
			width: 96,
			height: 96,
			rotate: false
		},
		'android-chrome-144x144.png': {
			width: 144,
			height: 144,
			rotate: false
		},
		'android-chrome-192x192.png': {
			width: 192,
			height: 192,
			rotate: false
		},
		'android-chrome-256x256.png': {
			width: 256,
			height: 256,
			rotate: false
		},
		'android-chrome-384x384.png': {
			width: 384,
			height: 384,
			rotate: false
		},
		'android-chrome-512x512.png': {
			width: 512,
			height: 512,
			rotate: false
		}
	},
	apple: {
		'apple-touch-icon-57x57.png': {
			width: 57,
			height: 57,
			rotate: false
		},
		'apple-touch-icon-60x60.png': {
			width: 60,
			height: 60,
			rotate: false
		},
		'apple-touch-icon-72x72.png': {
			width: 72,
			height: 72,
			rotate: false
		},
		'apple-touch-icon-76x76.png': {
			width: 76,
			height: 76,
			rotate: false
		},
		'apple-touch-icon-114x114.png': {
			width: 114,
			height: 114,
			rotate: false
		},
		'apple-touch-icon-120x120.png': {
			width: 120,
			height: 120,
			rotate: false
		},
		'apple-touch-icon-144x144.png': {
			width: 144,
			height: 144,
			rotate: false
		},
		'apple-touch-icon-152x152.png': {
			width: 152,
			height: 152,
			rotate: false
		},
		'apple-touch-icon-167x167.png': {
			width: 167,
			height: 167,
			rotate: false
		},
		'apple-touch-icon-180x180.png': {
			width: 180,
			height: 180,
			rotate: false
		},
		'apple-touch-icon.png': {
			width: 180,
			height: 180,
			rotate: false
		},
		'apple-touch-icon-precomposed.png': {
			width: 180,
			height: 180,
			rotate: false
		}
	},
	appleStartup: {
		'apple-touch-startup-image-320x460.png': {
			width: 320,
			height: 460,
			rotate: false
		},
		'apple-touch-startup-image-640x920.png': {
			width: 640,
			height: 920,
			rotate: false
		},
		'apple-touch-startup-image-640x1096.png': {
			width: 640,
			height: 1096,
			rotate: false
		},
		'apple-touch-startup-image-748x1024.png': {
			width: 748,
			height: 1024,
			rotate: true
		},
		'apple-touch-startup-image-750x1294.png': {
			width: 750,
			height: 1294,
			rotate: false
		},
		'apple-touch-startup-image-768x1004.png': {
			width: 768,
			height: 1004,
			rotate: false
		},
		'apple-touch-startup-image-1182x2208.png': {
			width: 1182,
			height: 2208,
			rotate: true
		},
		'apple-touch-startup-image-1242x2148.png': {
			width: 1242,
			height: 2148,
			rotate: false
		},
		'apple-touch-startup-image-1496x2048.png': {
			width: 1496,
			height: 2048,
			rotate: true
		},
		'apple-touch-startup-image-1536x2008.png': {
			width: 1536,
			height: 2008,
			rotate: false
		}
	}
};
