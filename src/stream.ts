import {
	cpus
} from 'os';
import Vinyl from 'vinyl';
import through from 'through2-concurrent';
import chalk from 'chalk';
import FaviconsGenerator, {
	IHeadersConfig,
	IConfig,
	getHtmlHeadersMarkup
} from './';

interface IPluginConfig extends IConfig {
	headers?: boolean|IHeadersConfig;
	background?: string;
	verbose?: boolean;
}

const throughOptions = {
	maxConcurrency: cpus().length
};

function toVinyl(source): Vinyl {
	return Vinyl.isVinyl(source)
		? source
		: source.isBuffer && source.isStream && source.isNull
			? new Vinyl(source)
			: source;
}

function log(verbose: boolean, ...message) {

	if (verbose) {
		console.log(...message);
	}
}

export default function plugin({
	headers,
	background,
	verbose,
	...options
}: IPluginConfig = {}) {

	log(
		verbose,
		chalk.blue('\n> Start\n')
	);

	const favicons = new FaviconsGenerator(
		background
			? {
				...options,
				manifest: {
					...options.manifest,
					background_color: background
				}
			}
			: options
		);
	const sources: Vinyl[] = [];

	function each(file, _, next) {

		if (file.isNull() || file.isStream()) {
			next(null, file);
			return;
		}

		try {
			sources.push(toVinyl(file));
			next();
		} catch (err) {
			next(err);
		}
	}

	async function flush(done) {

		try {

			const icons = favicons.generateIcons(sources);

			log(
				verbose,
				chalk.blue('\n> Icons:\n')
			);

			for await (const icon of icons) {
				this.push(icon);
				log(
					verbose,
					chalk.yellow(icon.basename)
				);
			}

			if (headers) {

				const htmlHeaders = favicons.generateHtmlHeaders(
					headers === true
						? {}
						: headers
				);

				this.push(
					new Vinyl({
						contents: Buffer.from(`${getHtmlHeadersMarkup(htmlHeaders)}\n`),
						path:    'favicons.html'
					})
				);
				log(
					verbose,
					`${chalk.blue('\n> HTML Headers:')} ${chalk.yellow('favicons.html')}\n`
				);
			}

			if (options.manifest) {

				const manifest = favicons.generateManifset();

				this.push(
					new Vinyl({
						contents: Buffer.from(`${JSON.stringify(manifest, null, '  ')}\n`),
						path:     'manifest.json'
					})
				);
				log(
					verbose,
					`${chalk.blue('\n> Web Manifest:')} ${chalk.yellow('manifest.json')}\n`
				);
			}

			done();

		} catch (err) {
			done(err);
		}
	}

	return through.obj(throughOptions, each, flush);
}
