import Vinyl from 'vinyl';
import toIco from 'to-ico';
import {
	IIconConfig,
	IIconsConfig,
	IIconToGenerateConfig,
	IManifestConfig,
	IHeadersConfig,
	IHtmlHeader,
	IRenderConfig
} from './types';
import {
	applyPath
} from './util';
import {
	getCompleteIconConfig,
	iconsToGenerate
} from './icons';
import htmlHeaders from './htmlHeaders';
import {
	isSupportedType,
	isIco,
	extensions
} from './extensions';
import {
	icons as defaultIcons
} from './defaults';

export interface IConfig {
	/**
	 * Relative public path to use in webmanifest and html-headers.
	 */
	path?: string;
	/**
	 * Webmanifest to add icons. Also can use it to get background color.
	 */
	manifest?: IManifestConfig;
	/**
	 * Output icons configuration.
	 */
	icons?: IIconsConfig;
}

type SupportedExtension = keyof typeof extensions;

export abstract class FaviconsGenerator {

	protected readonly config: IConfig = {};

	constructor({
		path,
		manifest,
		icons
	}: IConfig = {}) {
		Object.assign(this.config, {
			path,
			manifest: {
				background_color: '#fff',
				...manifest
			},
			icons: icons || defaultIcons
		});
	}

	protected abstract attachMetadata(source: Vinyl): Promise<Vinyl>;
	protected abstract renderIcon(sources: Vinyl[], config: IRenderConfig): Promise<Buffer>;

	/**
	 * Create favicons form sources.
	 * @param sources - Favicons sources.
	 * @returns Results of handling.
	 */
	async *generateIcons(source: Vinyl | Vinyl[]) {

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

			await this.attachMetadata(source);
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
	 * @returns Manifest object.
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
	 * @param headersConfig - Custom headers config.
	 * @returns Array of headers objects. You can get HTML-markup with `getHtmlHeadersMarkup` helper.
	 */
	generateHtmlHeaders(headersConfig: IHeadersConfig = {}): IHtmlHeader[] {

		const {
			icons,
			...config
		} = {
			...this.config,
			...headersConfig,
			manifest: {
				...this.config.manifest,
				...headersConfig.manifest
			}
		};
		const headers = Object.entries(icons)
			.filter(([, value]) => value)
			.map(([type]) => htmlHeaders[type](config));

		return [].concat(...headers);
	}

	/**
	 * Create icons of given type.
	 * @param iconsType - Type of needed icons.
	 * @param sources - Icons sources.
	 * @returns Icons of given type.
	 */
	protected async *generateIconsOfType(iconsType: string, sources: Vinyl[]) {

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
	protected async generateIcon(
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
			width,
			height
		} = iconToGenerateConfig;
		const icon = await this.renderIcon(sources, {
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
	protected async generateIco(
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
