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
	htmlHeaders,
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
	['htmlHeaders', 'l']
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

	optionsTable.cell('Option', 'input');
	optionsTable.cell('Description', 'Input icon(s) glob patterns.');
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

	optionsTable.cell('Option', '--htmlHeaders, -h');
	optionsTable.cell('Description', 'Create html-file with headers for icons.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--dest, -d');
	optionsTable.cell('Description', 'Destination directory,');
	optionsTable.newRow();

	console.log(`\nfavicons [...input] [...options]\n\n${optionsTable.toString()}`);
	process.exit(0);
}

function configIcon(
	icon: boolean|IIconConfig,
	skip: boolean,
	background: string,
	offset: string|number
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
	src:      argv,
	path,
	verbose,
	background,
	icons,
	manifest: manifest
		? JSON.parse(readFileSync(manifest, 'utf8'))
		: typeof rc.manifest === 'string'
			? JSON.parse(readFileSync(rc.manifest, 'utf8'))
			: rc.manifest,
	headers:  htmlHeaders,
	dest
};

if (!params.src || !params.src.length) {
	throw new Error('No any sources');
}

vfs.src(params.src)
	.pipe(stream(params))
	.pipe(vfs.dest(params.dest));
