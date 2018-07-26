import { join } from 'path';
import Vinyl from 'vinyl';
import Sharp from 'sharp';
import { isIco } from './extensions';

/**
 * Attach image metadata to the vinyl file.
 * @param  source - Image file.
 * @return Source image file with attached metadata.
 */
export async function attachMetadata(source: Vinyl) {

	if (typeof source.metadata === 'object') {
		return source;
	}

	if (isIco(source.basename)) {
		source.metadata = {
			format: 'ico',
			width:  16,
			height: 16
		};
	} else {
		source.metadata = await Sharp(source.contents as Buffer).metadata();
	}

	return source;
}

/**
 * Add path to file name.
 * @param  path - Path to destination folder.
 * @param  filename - Target file name.
 * @return Full path to file.
 */
export function applyPath(path, filename) {
	return path ? join(path, filename) : filename;
}
