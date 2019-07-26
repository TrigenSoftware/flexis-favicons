import {
	promisify
} from 'util';
import Vinyl from 'vinyl';
import Sharp from 'sharp';
import svg2imgCb from 'svg2img';
import {
	ISize
} from './icons';
import {
	isSvg
} from './extensions';
import {
	attachMetadata
} from './helpers';

interface IRenderConfig {
	rotate: boolean;
	width: number;
	height: number;
	background: string;
	offset: number;
}

const PERCENTS_100 = 100;
const TWICE = 2;
const ROTATE_DEGREES = 90;

const svg2img = promisify(svg2imgCb);

/**
 * Render icon.
 * @param  sources - Array of sources.
 * @param  renderConfig - Render config.
 * @return Rendered icon.
 */
export default async function renderIcon(sources: Vinyl[], {
	rotate,
	width,
	height,
	background,
	offset
}: IRenderConfig) {

	const maximumSide = Math.max(width, height);
	const offsetPx = Math.round(maximumSide / PERCENTS_100 * offset) || 0;
	const canvas = await createCanvas(width, height, background);
	const sprite = await createSprite(sources, rotate, width, height, offsetPx);
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
	return Sharp(undefined, {
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
 * @param  rotate - Rotate 90deg or not.
 * @param  width - Width of sprite.
 * @param  height - Height of sprite.
 * @param  offset - Offset from canvas edges.
 * @return Sprite.
 */
async function createSprite(
	sources: Vinyl[],
	rotate: boolean,
	width: number,
	height: number,
	offset: number
) {

	const spriteWidth = width - offset * TWICE;
	const spriteHeight = height - offset * TWICE;
	const source = await getSuitableSourceBuffer(sources, spriteWidth, spriteHeight);
	const sprite = Sharp(source);

	if (rotate) {
		sprite.rotate(ROTATE_DEGREES);
	}

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

		const icon: Buffer = await svg2img((svgSource.contents as Buffer).toString('utf8'), {
			preserveAspectRatio: 'xMidYMid meet',
			...getContainSize({
				width,
				height
			}, svgSource.metadata)
		});

		return icon;
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
