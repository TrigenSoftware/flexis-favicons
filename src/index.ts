import {
	FaviconsGenerator as FaviconsGeneratorBase
} from './core';
import {
	attachMetadata,
	renderIcon
} from './image';

export * from './core';

export default class FaviconsGenerator extends FaviconsGeneratorBase {

	protected attachMetadata = attachMetadata;
	protected renderIcon = renderIcon;
}
