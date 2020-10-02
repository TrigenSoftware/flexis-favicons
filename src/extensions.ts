import path from 'path';

export const extensions = {
	png:  /^png$/,
	svg:  /^svg$/
};

/**
 * Check image type
 * @param type - Image extension without dot.
 * @returns Image type is supported or not.
 */
export function isSupportedType(type: string): boolean {
	return extensions.hasOwnProperty(type);
}

/**
 * Check is "ico" or not.
 * @param filename - File name to check.
 * @returns Result of checking.
 */
export function isIco(filename: string) {
	return path.extname(filename) === '.ico';
}

/**
 * Check is "svg" or not.
 * @param filename - File name to check.
 * @returns Result of checking.
 */
export function isSvg(filename: string) {
	return path.extname(filename) === '.svg';
}
