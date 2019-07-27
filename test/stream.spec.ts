import path from 'path';
import vfs from 'vinyl-fs';
import favicons from '../src/stream';

jest.setTimeout(50000);

describe('stream', () => {

	it('should emit files', (done) => {

		let counter = 0;

		vfs.src(
			path.join(__dirname, 'favicon.svg')
		)
			.pipe(favicons({
				headers: true,
				manifest: {
					name:             'Biletron',
					background_color: 'green',
					theme_color:      'white'
				}
			}))
			.on('error', done)
			.on('data', () => {
				counter++;
			})
			.on('end', () => {
				expect(counter).toBe(34);
				done();
			});
	});
});
