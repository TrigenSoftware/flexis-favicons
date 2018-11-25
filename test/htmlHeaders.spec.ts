import htmlHeaders from '../src/htmlHeaders';

const {
	favicon: faviconHeaders,
	android: androidHeaders,
	apple: appleHeaders,
	appleStartup: appleStartupHeaders
} = htmlHeaders;

describe('htmlHeaders', () => {

	describe('favicon', () => {

		it('should return correct result', () => {

			const headers = faviconHeaders({});

			expect(headers.length).toBe(3);
		});

		it('should apply path', () => {

			const path = 'icons';
			const headers = faviconHeaders({ path });

			headers.forEach(({
				tagName,
				href
			}) => {

				if (tagName === 'link') {
					expect(href).toMatch(new RegExp(`^${path}`));
				}
			});
		});
	});

	describe('android', () => {

		it('should return correct result', () => {

			const headers = androidHeaders({});

			expect(headers.length).toBe(2);
		});

		it('should apply path', () => {

			const path = 'icons';
			const headers = androidHeaders({ path });

			headers.forEach(({
				tagName,
				href
			}) => {

				if (tagName === 'link') {
					expect(href).toMatch(new RegExp(`^${path}`));
				}
			});
		});

		it('should apply manifest', () => {

			const manifest = {
				name: 'App',
				theme_color: '#fff'
			};
			const headers = androidHeaders({ manifest });

			expect(headers.length).toBe(4);
		});
	});

	describe('apple', () => {

		it('should return correct result', () => {

			const headers = appleHeaders({});

			expect(headers.length).toBe(7);
		});

		it('should apply path', () => {

			const path = 'icons';
			const headers = appleHeaders({ path });

			headers.forEach(({
				tagName,
				href
			}) => {

				if (tagName === 'link') {
					expect(href).toMatch(new RegExp(`^${path}`));
				}
			});
		});

		it('should apply manifest', () => {

			const manifest = {
				name: 'App'
			};
			const headers = appleHeaders({ manifest });

			expect(headers.length).toBe(8);
		});
	});

	describe('appleStartup', () => {

		it('should return correct result', () => {

			const headers = appleStartupHeaders({});

			expect(headers.length).toBe(18);
		});

		it('should apply path', () => {

			const path = 'icons';
			const headers = appleStartupHeaders({ path });

			headers.forEach(({
				tagName,
				href
			}) => {

				if (tagName === 'link') {
					expect(href).toMatch(new RegExp(`^${path}`));
				}
			});
		});
	});
});
