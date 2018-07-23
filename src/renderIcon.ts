import { promisify } from 'util';
import Vinyl from 'vinyl';
import Jimp from 'jimp';
import svg2imgCb from 'svg2img';
import color from 'tinycolor2';
import { isSvg } from './extensions';

interface IRenderConfig {
	rotate: boolean;
	width: number;
	height: number;
	background: string;
	offset: number;
}

const RGB_MAX = 255;
const PERCENTS_100 = 100;
const TWICE = 2;
const ROTATE_DEGREES = 90;

const svg2img = promisify(svg2imgCb);

/**
 * Color string to integer.
 * @param  colorSource - Color string.
 * @return Color integer.
 */
function parseColor(colorSource: string): number {

	const {
		r,
		g,
		b,
		a
	} = color(colorSource).toRgb();

	return Jimp.rgbaToInt(r, g, b, a * RGB_MAX);
}

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

	canvas.composite(sprite, offsetPx, offsetPx);

	return getBuffer(canvas);
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
	return new Promise<Jimp>((resolve, reject) => {
		new Jimp(
			width,
			height,
			parseColor(background),
			(error, canvas) => {

				if (error) {
					reject(error);
					return;
				}

				resolve(canvas);
			}
		);
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
	const sprite = await Jimp.read(source);

	sprite.contain(
		spriteWidth,
		spriteHeight,
		Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
	);

	if (rotate) {
		sprite.rotate(ROTATE_DEGREES, false);
	}

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
) {

	const svgSource = sources.find(({ basename }) => isSvg(basename));

	if (svgSource) {

		const icon = await svg2img((svgSource.contents as Buffer).toString('utf8'), {
			width,
			height
		});

		return icon;
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

	return nearestIcon.contents;
}

/**
 * Helper to get buffer from Jimp.
 * @param  canvas - Jimp canvas.
 * @return Buffer.
 */
function getBuffer(canvas: Jimp) {
	return new Promise<Buffer>((resolve, reject) => {
		canvas.getBuffer(Jimp.MIME_PNG, (error, buffer) => {

			if (error) {
				reject(error);
				return;
			}

			resolve(buffer);
		});
	});
}
