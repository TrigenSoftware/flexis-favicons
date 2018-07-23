import path from 'path';

export const extensions = {
	png:  /^png$/,
	svg:  /^svg$/
};

/**
 * Check image type
 * @param  type - Image extension without dot.
 * @return Image type is supported or not.
 */
export function typeIsSupported(type: string): boolean {
	return extensions.hasOwnProperty(type);
}

/**
 * Check is "ico" or not.
 * @param  filename - File name to check.
 * @return Result of checking.
 */
export function isIco(filename: string) {
	return path.extname(filename) === '.ico';
}

/**
 * Check is "svg" or not.
 * @param  filename - File name to check.
 * @return Result of checking.
 */
export function isSvg(filename: string) {
	return path.extname(filename) === '.svg';
}
