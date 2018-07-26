import Vinyl from 'vinyl';
import toIco from 'to-ico';
import {
	extensions,
	isSupportedType,
	isIco
} from './extensions';
import { IManifestConfig } from './manifest';
import {
	IIconConfig,
	IIconsConfig,
	IIconToGenerateConfig,
	getCompleteIconConfig,
	iconsToGenerate
} from './icons';
import {
	attachMetadata,
	applyPath
} from './helpers';
import {
	icons as defaultIcons,
	manifest as defaultManifest
} from './defaults';
import renderIcon from './renderIcon';
import htmlHeaders, { IHtmlHeader } from './htmlHeaders';

export {
	default as getHtmlHeadersMarkup
} from './getHtmlHeadersMarkup';

interface IConfig {
	path?: string;
	manifest?: IManifestConfig;
	icons?: IIconsConfig;
}

type SupportedExtension = keyof typeof extensions;

export default class FaviconsGenerator {

	private readonly config: IConfig = {};

	constructor({
		path,
		manifest,
		icons
	}: IConfig = {}) {
		Object.assign(this.config, {
			path,
			manifest: {
				...defaultManifest,
				...manifest
			},
			icons: icons || defaultIcons
		});
	}

	/**
	 * Create favicons form sources.
	 * @param  sources - Favicons sources.
	 * @return Results of handling.
	 */
	async *generateIcons(source: Vinyl|Vinyl[]) {

		const sources = Array.isArray(source)
			? source
			: [source];

		if (!sources.length) {
			throw new Error('No sources provided.');
		}

		for (const source of sources) {

			if (!Vinyl.isVinyl(source) || source.isNull() || source.isStream()) {
				throw new Error('Invalid source.');
			}

			const sourceType = source.extname.replace(/^\./, '') as SupportedExtension;

			if (!isSupportedType(sourceType)) {
				throw new Error(`"${sourceType}" is not supported.`);
			}

			await attachMetadata(source);
		}

		const {
			icons
		} = this.config;

		for (const iconsType in icons) {

			const iconsOfType = this.generateIconsOfType(iconsType, sources);

			for await (const icon of iconsOfType) {
				yield icon;
			}
		}
	}

	/**
	 * Create full manifest object with icons.
	 * @return Manifest object.
	 */
	generateManifset(): IManifestConfig {

		const {
			path,
			manifest: manifestConfig,
			icons: { android }
		} = this.config;
		const manifest = {
			...manifestConfig
		};

		if (android) {
			manifest.icons = Object.entries(iconsToGenerate.android).map(([filename, {
				width,
				height
			}]) => ({
				src:   applyPath(path, filename),
				sizes: `${width}x${height}`,
				type:  'image/png'
			}));
		}

		return manifest;
	}

	/**
	 * Create HTML-headers for target icons.
	 * @return Array of headers objects. You can get HTML-markup with `getHtmlHeadersMarkup` helper.
	 */
	generateHtmlHeaders(): IHtmlHeader[] {

		const {
			path,
			manifest,
			icons
		} = this.config;
		const headers = Object.entries(icons)
			.filter(([, value]) => value)
			.map(([type]) => htmlHeaders[type]({
				path,
				manifest
			}));

		return [].concat(...headers);
	}

	/**
	 * Create icons of given type.
	 * @param  iconsType - Type of needed icons.
	 * @param  sources - Icons sources.
	 * @return Icons of given type.
	 */
	private async *generateIconsOfType(iconsType: string, sources: Vinyl[]) {

		const {
			manifest,
			icons
		} = this.config;
		const iconConfig = getCompleteIconConfig(iconsType, icons, manifest);

		if (iconConfig === null) {
			return;
		}

		const iconsOfTypeToGenerate = iconsToGenerate[iconsType];

		for (const filename in iconsOfTypeToGenerate) {
			yield this.generateIcon(
				filename,
				sources,
				iconConfig,
				iconsOfTypeToGenerate[filename]
			);
		}
	}

	/**
	 * Create icon.
	 * @param filename - File name of icon.
	 * @param sources - Sources of icon.
	 * @param iconConfig - Icon config.
	 * @param iconToGenerateConfig - Icon to generate config.
	 */
	private async generateIcon(
		filename: string,
		sources: Vinyl[],
		iconConfig: IIconConfig,
		iconToGenerateConfig: IIconToGenerateConfig
	) {

		if (isIco(filename)) {
			return this.generateIco(
				filename,
				sources,
				iconConfig,
				iconToGenerateConfig
			);
		}

		const target = sources[0].clone({ contents: false });
		const {
			offset,
			background
		} = iconConfig;
		const {
			rotate,
			width,
			height
		} = iconToGenerateConfig;
		const icon = await renderIcon(sources, {
			rotate,
			width,
			height,
			background: background as string,
			offset
		});

		target.basename = filename;
		target.contents = icon;
		Reflect.deleteProperty(target, 'metadata');

		return target;
	}

	/**
	 * Create ".ico" icon.
	 * @param filename - File name of icon.
	 * @param sources - Sources of icon.
	 * @param iconConfig - Icon config.
	 * @param iconToGenerateConfig - Icon to generate config.
	 */
	private async generateIco(
		filename: string,
		sources: Vinyl[],
		iconConfig: IIconConfig,
		iconToGenerateConfig: IIconToGenerateConfig
	) {

		const target = sources[0].clone({ contents: false });
		const icons = await Promise.all(
			iconToGenerateConfig.sizes.map(({
				width,
				height
			}) => this.generateIcon(
				`${width}x${height}.png`,
				sources,
				iconConfig,
				{
					...iconToGenerateConfig,
					width,
					height
				}
			))
		);
		const ico = await toIco(icons.map(({ contents }) => contents));

		target.basename = filename;
		target.contents = ico;
		Reflect.deleteProperty(target, 'metadata');

		return target;
	}
}
