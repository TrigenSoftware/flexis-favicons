import {
	join
} from 'path';

/**
 * Add path to file name.
 * @param  path - Path to destination folder.
 * @param  filename - Target file name.
 * @return Full path to file.
 */
export function applyPath(path: string, filename: string) {
	return path ? join(path, filename) : filename;
}
