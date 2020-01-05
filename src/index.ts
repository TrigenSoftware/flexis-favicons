import {
	attachMetadata,
	renderIcon
} from './image';
import FaviconsGeneratorBase, {
	IConfig
} from './FaviconsGenerator';

export * from './types';

export {
	default as getHtmlHeadersMarkup
} from './getHtmlHeadersMarkup';

export {
	IConfig
};

export default class FaviconsGenerator extends FaviconsGeneratorBase {

	protected attachMetadata = attachMetadata;
	protected renderIcon = renderIcon;
}
