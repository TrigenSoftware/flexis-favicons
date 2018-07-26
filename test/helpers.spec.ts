import {
	attachMetadata,
	applyPath
} from '../src/helpers';
import { getCompleteIconConfig } from '../src/icons';
import getHtmlHeadersMarkup from '../src/getHtmlHeadersMarkup';
import {
	svg,
	png,
	expectedSize
} from './favicon';

describe('Helpers', () => {

	beforeEach(() => {
		Reflect.deleteProperty(svg, 'metadata');
		Reflect.deleteProperty(png, 'metadata');
	});

	describe('attachMetadata', () => {

		it('should attach correct metadata for png', async () => {

			await attachMetadata(png);

			expect(png.metadata.format).toBe('png');
			expect(png.metadata.width).toBe(expectedSize.width);
			expect(png.metadata.height).toBe(expectedSize.height);
		});

		it('should attach correct metadata for svg', async () => {

			await attachMetadata(svg);

			expect(svg.metadata.format).toBe('svg');
			expect(svg.metadata.width).toBe(expectedSize.width);
			expect(svg.metadata.height).toBe(expectedSize.height);
		});

		it('shouldn\'t reattach metadata', async () => {

			png.metadata = { mock: true };
			await attachMetadata(png);

			expect(png.metadata.mock).toBe(true);
		});
	});

	describe('applyPath', () => {

		it('shouldn\'t apply empty path', () => {

			const filename = 'favicon.svg';
			const fullpath = applyPath(undefined, filename);

			expect(fullpath).toBe(filename);
		});

		it('should apply path', () => {

			const path = 'app/favicons';
			const filename = 'favicon.svg';
			const fullpath = applyPath(path, filename);

			expect(fullpath).toBe(`${path}/${filename}`);
		});
	});

	describe('getCompleteIconConfig', () => {

		const iconsConfig = {
			favicon: true,
			android: { offset: 20, background: '#FACE8D' },
			apple:   { background: true }
		};
		const manifest = {
			background_color: '#fff'
		};

		it('should return `null` for empty config', () => {

			const config = getCompleteIconConfig('appleStartup', iconsConfig, manifest);

			expect(config).toBe(null);
		});

		it('should complete boolean shirthand for transparent icon', () => {

			const config = getCompleteIconConfig('favicon', iconsConfig, manifest);

			expect(config).toEqual({
				offset:     0,
				background: 'transparent'
			});
		});

		it('should use complete config', () => {

			const config = getCompleteIconConfig('android', iconsConfig, manifest);

			expect(config).toEqual(iconsConfig.android);
		});

		it('should complete by shirt config for non-transparent icon', () => {

			const config = getCompleteIconConfig('apple', iconsConfig, manifest);

			expect(config).toEqual({
				offset:     0,
				background: manifest.background_color
			});
		});
	});

	describe('getHtmlHeadersMarkup', () => {

		const appName = {
			tagName: 'meta',
			name:    'application-name',
			content: 'App'
		};
		const manifest = {
			tagName: 'link',
			href:    'manifest.json',
			rel:     'manifest'
		};
		const custom = {
			tagName: 'link',
			key:     'face8d',
			href:    'style.css',
			rel:     'stylesheet'
		};
		const htmlHeaders = [
			'<meta name="application-name" content="App">',
			'<link rel="manifest" href="manifest.json">',
			'<link rel="stylesheet" href="style.css" key="face8d">'
		];

		it('should return correct html-string', () => {

			const html = getHtmlHeadersMarkup(appName);

			expect(html).toBe(htmlHeaders[0]);
		});

		it('should paste attributes in correct order', () => {

			const html = getHtmlHeadersMarkup(manifest);

			expect(html).toBe(htmlHeaders[1]);
		});

		it('should push unknown attributes at end', () => {

			const html = getHtmlHeadersMarkup(custom);

			expect(html).toBe(htmlHeaders[2]);
		});

		it('should handle few headers', () => {

			const html = getHtmlHeadersMarkup([
				appName,
				manifest,
				custom
			]);

			expect(html).toBe(htmlHeaders.join('\n'));
		});
	});
});
