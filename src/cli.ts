import {
	readFileSync
} from 'fs';
import {
	argv,
	end,
	options as readOptions
} from 'argue-cli';
import Table from 'easy-table';
import vfs from 'vinyl-fs';
import getRc from 'rcfile';
import omit from 'omit-empty';
import stream from './stream';
import {
	IIconConfig
} from './';

const {
	help,
	verbose,
	path,
	background,
	manifest,
	headers,
	dest,
	skipFavicon,
	skipAndroid,
	skipApple,
	skipAppleStartup,
	androidBackground,
	androidOffset,
	appleBackground,
	appleOffset,
	appleStartupBackground,
	appleStartupOffset
}: any = readOptions([
	['help', 'h'],
	['verbose', 'v'],
	['headers', 'H']
], [
	{ 'path': 'p' },
	{ 'background': 'b' },
	{ 'manifest': 'm' },
	{ 'dest': 'd' },
	'skipFavicon',
	'skipAndroid',
	'skipApple',
	'skipAppleStartup',
	'androidBackground',
	'androidOffset',
	'appleBackground',
	'appleOffset',
	'appleStartupBackground',
	'appleStartupOffset'
]);

if (help) {

	end();

	const optionsTable = new Table();

	optionsTable.cell('Option', 'sources');
	optionsTable.cell('Description', 'Source icon(s) glob patterns.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--help, -h');
	optionsTable.cell('Description', 'Print this message.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--verbose, -v');
	optionsTable.cell('Description', 'Print additional info about progress.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--path, -p');
	optionsTable.cell('Description', 'Relative public path to use in webmanifest and html-headers.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--background, -b');
	optionsTable.cell('Description', 'Background color for icons and startup images.');
	optionsTable.cell('Default', 'white');
	optionsTable.newRow();

	optionsTable.cell('Option', '--manifest, -m');
	optionsTable.cell('Description', 'Path to webmanifest file to add icons. Also can use it to get background color.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--headers, -H');
	optionsTable.cell('Description', 'Create html-file with headers for icons.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--skipFavicon');
	optionsTable.cell('Description', 'Do not create favicon.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--skipAndroid');
	optionsTable.cell('Description', 'Do not create icons for Android.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--skipApple');
	optionsTable.cell('Description', 'Do not create icons for iOS.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--skipAppleStartup');
	optionsTable.cell('Description', 'Do not create startup screens for iOS.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--androidBackground');
	optionsTable.cell('Description', 'Background color for Android icons.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--androidOffset');
	optionsTable.cell('Description', 'Offset size in percents for Android icons.');
	optionsTable.cell('Default', '0');
	optionsTable.newRow();

	optionsTable.cell('Option', '--appleBackground');
	optionsTable.cell('Description', 'Background color for iOS icons.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--appleOffset');
	optionsTable.cell('Description', 'Offset size in percents for iOS icons.');
	optionsTable.cell('Default', '0');
	optionsTable.newRow();

	optionsTable.cell('Option', '--appleStartupBackground');
	optionsTable.cell('Description', 'Background color for iOS startup screens.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--appleStartupOffset');
	optionsTable.cell('Description', 'Offset size in percents for iOS startup screens.');
	optionsTable.cell('Default', '0');
	optionsTable.newRow();

	optionsTable.cell('Option', '--dest, -d');
	optionsTable.cell('Description', 'Destination directory.');
	optionsTable.newRow();

	console.log(`\nfavicons [...sources] [...options]\n\n${optionsTable.toString()}`);
	process.exit(0);
}

function configIcon(
	icon: boolean | IIconConfig,
	skip: boolean,
	background: string,
	offset: string | number
) {

	if (skip || !background && !offset && icon === false) {
		return false;
	}

	const config: IIconConfig = typeof icon !== 'boolean'
		? { ...icon }
		: {};

	if (background) {
		config.background = background;
	}

	if (offset) {
		config.offset = Number(offset);
	}

	if (!Object.keys(config).length) {
		return true;
	}

	return config;
}

const rc = {
	icons: {},
	...getRc('favicons')
};
const icons = {
	...rc.icons,
	favicon:      !skipFavicon,
	android:      configIcon(rc.icons.android, skipAndroid, androidBackground, androidOffset),
	apple:        configIcon(rc.icons.apple, skipApple, appleBackground, appleOffset),
	appleStartup: configIcon(rc.icons.appleStartup, skipAppleStartup, appleStartupBackground, appleStartupOffset)
};
const params = {
	...rc,
	...omit({
		src:      argv.length
			? argv
			: rc.src,
		path,
		verbose,
		background,
		icons,
		manifest: manifest
			? JSON.parse(readFileSync(manifest, 'utf8'))
			: typeof rc.manifest === 'string'
				? JSON.parse(readFileSync(rc.manifest, 'utf8'))
				: rc.manifest,
		headers,
		dest
	})
};

if (!params.src || !params.src.length) {
	throw new Error('No any sources');
}

vfs.src(params.src)
	.pipe(stream(params))
	.pipe(vfs.dest(params.dest));
