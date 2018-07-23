
export interface IParams {
	format?: string;
	quality?: number;
	width?: number;
	height?: number;
}

interface ICallback {
	(error: Error, result: Buffer);
}

export default function svg2img(source: string, callback: ICallback);
export default function svg2img(source: string, params: IParams, callback: ICallback);
