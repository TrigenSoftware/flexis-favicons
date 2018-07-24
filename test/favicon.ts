import fs from 'fs';
import path from 'path';
import Vinyl from 'vinyl';

export const svg = new Vinyl({
	contents: fs.readFileSync(path.join(__dirname, './favicon.svg')),
	path:     '/some/icon.svg'
});

export const png = new Vinyl({
	contents: fs.readFileSync(path.join(__dirname, './favicon.png')),
	path:     '/some/icon.png'
});

export const expectedSize = {
	width: 216,
	height: 186
};
