import { promisify } from 'util';
import { join } from 'path';
import Vinyl from 'vinyl';
import syncSizeOf from 'image-size';

const sizeOf = promisify(syncSizeOf);

/**
 * Attach image metadata to the vinyl file.
 * @param  source - Image file.
 * @return Source image file with attached metadata.
 */
export async function attachMetadata(source: Vinyl) {

	if (typeof source.metadata === 'object') {
		return source;
	}

	source.metadata = await sizeOf(source.contents as Buffer);

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
