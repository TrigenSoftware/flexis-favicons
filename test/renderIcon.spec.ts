import fs from 'fs';
import path from 'path';
import renderIcon from '../src/renderIcon';
import {
	svg,
	png
} from './favicon';

describe('renderIcon', () => {

	it('should render correct icon from svg', async () => {

		const icon = await renderIcon([svg], {
			rotate:     false,
			width:      80,
			height:     80,
			background: 'red',
			offset:     20
		});

		fs.writeFileSync(path.join(__dirname, 'renderIcon_svg.png'), icon);
		expect(JSON.stringify(icon)).toMatchSnapshot();
	});

	it('should render correct icon from png', async () => {

		const icon = await renderIcon([png], {
			rotate:     false,
			width:      80,
			height:     80,
			background: 'red',
			offset:     20
		});

		fs.writeFileSync(path.join(__dirname, 'renderIcon_png.png'), icon);
		expect(JSON.stringify(icon)).toMatchSnapshot();
	});

	it('should render correct rotated icon from svg', async () => {

		const icon = await renderIcon([svg], {
			rotate:     true,
			width:      128,
			height:     128,
			background: 'blue',
			offset:     25
		});

		fs.writeFileSync(path.join(__dirname, 'renderIcon_svg_rotated.png'), icon);
		expect(JSON.stringify(icon)).toMatchSnapshot();
	});

	it('should render correct rotated icon from png', async () => {

		const icon = await renderIcon([png], {
			rotate:     true,
			width:      128,
			height:     128,
			background: 'blue',
			offset:     25
		});

		fs.writeFileSync(path.join(__dirname, 'renderIcon_png_rotated.png'), icon);
		expect(JSON.stringify(icon)).toMatchSnapshot();
	});
});
