import { join } from 'path';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';

/**
 * Attach image metadata to the vinyl file.
 * @param  source - Image file.
 * @return Source image file with attached metadata.
 */
export function attachMetadata(source: Vinyl) {

	if (typeof source.metadata === 'object') {
		return source;
	}

	source.metadata = sizeOf(source.contents as Buffer);

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
