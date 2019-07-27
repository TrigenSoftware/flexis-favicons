import {
	IHtmlHeader
} from './htmlHeaders';

const attributeNamesOrder = [
	'name',
	'content',
	'rel',
	'type',
	'sizes',
	'media',
	'href'
];

/**
 * Get order index of attribute name.
 * @param  attributeName - Target attribute name.
 * @return Index.
 */
function getAttributeOrder(attributeName: string) {

	const index = attributeNamesOrder.indexOf(attributeName);

	return index === -1
		? attributeNamesOrder.length
		: index;
}

/**
 * Comparator function to sort attributes entries.
 * @param  a - Left attribute entry.
 * @param  b - Right attribute entry.
 * @return Result of comparation.
 */
function comparator([a]: [string, any], [b]: [string, any]) {
	return getAttributeOrder(a) - getAttributeOrder(b);
}

/**
 * Make attribute string from entry.
 * @param  entry - Entry with attribute name and value.
 * @return Attribute string.
 */
function entryToString([key, value]: [string, string]) {
	return `${key}="${String(value)}"`;
}

/**
 * Get HTML-markup from objects.
 * @param  header - Object or array of objects with header info.
 * @return HTML-markup.
 */
export default function getHtmlHeadersMarkup(header: IHtmlHeader|IHtmlHeader[]): string {

	if (Array.isArray(header)) {
		return header.map(getHtmlHeadersMarkup).join('\n');
	}

	const {
		tagName,
		...attributes
	} = header;
	const attributesString = Object
		.entries(attributes)
		.sort(comparator)
		.map(entryToString)
		.join(' ');
	const markup = `<${tagName} ${attributesString}>`;

	return markup;
}
