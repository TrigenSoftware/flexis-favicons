import Vinyl from 'vinyl';
import Sharp from 'sharp';
import {
	DOMParser
} from 'xmldom';
import * as canvas from 'canvas';
import fetch from 'node-fetch';
import Canvg, {
	presets
} from 'canvg';
import {
	ISize,
	IRenderConfig
} from './types';
import {
	isIco,
	isSvg
} from './extensions';

const PERCENTS_100 = 100;
const TWICE = 2;

const nodeCanvgPreset = presets.node({
	DOMParser,
	canvas,
	fetch
});

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
 * Render icon.
 * @param  sources - Array of sources.
 * @param  renderConfig - Render config.
 * @return Rendered icon.
 */
export async function renderIcon(sources: Vinyl[], {
	width,
	height,
	background,
	offset
}: IRenderConfig) {

	const maximumSide = Math.max(width, height);
	const offsetPx = Math.round(maximumSide / PERCENTS_100 * offset) || 0;
	const canvas = await createCanvas(width, height, background);
	const sprite = await createSprite(sources, width, height, offsetPx);
	const renderedSprite = await sprite.png().toBuffer();

	canvas.composite([{
		input: renderedSprite
	}]);

	return canvas.png().toBuffer();
}

/**
 * Create canvas for rendering.
 * @param  width - Width of canvas.
 * @param  height - Height of canvas.
 * @param  background - Background color of canvas.
 * @return Canvas.
 */
function createCanvas(
	width: number,
	height: number,
	background: string
) {
	return Sharp({
		create: {
			width,
			height,
			background,
			channels: 4
		}
	});
}

/**
 * Create sprite.
 * @param  sources - Sprite sources.
 * @param  width - Width of sprite.
 * @param  height - Height of sprite.
 * @param  offset - Offset from canvas edges.
 * @return Sprite.
 */
async function createSprite(
	sources: Vinyl[],
	width: number,
	height: number,
	offset: number
) {

	const spriteWidth = width - offset * TWICE;
	const spriteHeight = height - offset * TWICE;
	const source = await getSuitableSourceBuffer(sources, spriteWidth, spriteHeight);
	const sprite = Sharp(source);

	sprite.resize(spriteWidth, spriteHeight, {
		fit: 'inside'
	});

	return sprite;
}

/**
 * Get suitable source by size.
 * @param  sources - Array of sources.
 * @param  width - Needed width.
 * @param  height - Needed height.
 * @return Siutable source.
 */
async function getSuitableSourceBuffer(
	sources: Vinyl[],
	width: number,
	height: number
): Promise<Buffer> {

	const svgSource = sources.find(({ basename }) => isSvg(basename));

	if (svgSource) {

		await attachMetadata(svgSource);

		const svg = (svgSource.contents as Buffer).toString('utf8');
		const {
			width: desiredWidth,
			height: desiredHeight
		} = getContainSize({
			width,
			height
		}, svgSource.metadata);
		const c = nodeCanvgPreset.createCanvas(0, 0);
		const ctx = c.getContext('2d');
		const v = Canvg.fromString(ctx, svg, nodeCanvgPreset);

		v.resize(desiredWidth, desiredHeight, 'xMidYMid meet');

		await v.render();

		return c.toBuffer();
	}

	for (const source of sources) {
		await attachMetadata(source);
	}

	const maximumSide = Math.max(width, height);
	const nearestIcon = sources.reduce((nearestIcon, source) => {

		const {
			width: nearestIconWidth,
			height: nearestIconHeight
		} = nearestIcon.metadata;
		const {
			width: sourceWidth,
			height: sourceHeight
		} = source.metadata;
		const nearestIconMaximumSide = Math.max(nearestIconWidth, nearestIconHeight);
		const sourceMaximumSide = Math.max(sourceWidth, sourceHeight);

		if (
			(nearestIconMaximumSide > sourceMaximumSide || nearestIconMaximumSide < maximumSide)
			&& sourceMaximumSide >= maximumSide
		) {
			return source;
		}

		return nearestIcon;
	}, sources[0]);

	return nearestIcon.contents as Buffer;
}

/**
 * Get size of icon to contain in box.
 * @param boxSize - Size of box.
 * @param iconsSize - Size of icon.
 */
function getContainSize(
	{
		width: boxWidth,
		height: boxHeight
	}: ISize,
	{
		width: iconWidth,
		height: iconHeight
	}: ISize
): ISize {

	const minBoxSide = Math.min(boxWidth, boxHeight);
	const isWidthMin = minBoxSide === boxWidth;

	return isWidthMin ? {
		width:  boxWidth,
		height: Math.round(iconHeight / iconWidth * boxWidth)
	} : {
		height: boxHeight,
		width:  Math.round(iconWidth / iconHeight * boxHeight)
	};
}
