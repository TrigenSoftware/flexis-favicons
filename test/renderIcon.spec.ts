import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import renderIcon from '../src/renderIcon';
import {
	svg,
	png
} from './favicon';

function sha1(buffer: Buffer): string {
	return crypto.createHash('sha1').update(buffer).digest('hex');
}

describe('renderIcon', () => {

	jest.setTimeout(30000);

	it('should render correct icon from svg', async () => {

		const icon = await renderIcon([svg], {
			rotate:     false,
			width:      80,
			height:     80,
			background: 'red',
			offset:     20
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_svg.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render correct icon from png', async () => {

		const icon = await renderIcon([png], {
			rotate:     false,
			width:      80,
			height:     80,
			background: 'red',
			offset:     20
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_png.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render correct rotated icon from svg', async () => {

		const icon = await renderIcon([svg], {
			rotate:     true,
			width:      128,
			height:     128,
			background: 'blue',
			offset:     25
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_svg_rotated.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render correct rotated icon from png', async () => {

		const icon = await renderIcon([png], {
			rotate:     true,
			width:      128,
			height:     128,
			background: 'blue',
			offset:     25
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_png_rotated.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render correct rotated non-square icon from svg', async () => {

		const icon = await renderIcon([svg], {
			rotate:     true,
			width:      256,
			height:     512,
			background: 'blue',
			offset:     0
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_svg_rotated_non-square.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render correct rotated non-square icon from png', async () => {

		const icon = await renderIcon([png], {
			rotate:     true,
			width:      256,
			height:     512,
			background: 'blue',
			offset:     0
		});

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_png_rotated_non-square.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});

	it('should render better quality from svg source', async () => {

		const config = {
			rotate:     false,
			width:      1280,
			height:     1280,
			background: 'blue',
			offset:     5
		};
		let icon = await renderIcon([png], config);

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_png-quality.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();

		icon = await renderIcon([svg], config);

		fs.writeFileSync(path.join(__dirname, 'artifacts', 'renderIcon_svg-quality.png'), icon);
		expect(sha1(icon)).toMatchSnapshot();
	});
});
