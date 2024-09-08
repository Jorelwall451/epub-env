import getMetadata from '../../data/metadata/getMetadata';
import buildNavMap from './buildNavMap';

export default async function buildNcx() {
	const metadata = await getMetadata();
	const navMap = await buildNavMap();

	const head = {
		meta: [
			{
				$: {
					name: 'dtb:uid',
					content: 'BookId',
				},
			},
			{
				$: {
					name: 'dtb:depth',
					content: '1',
				},
			},
			{
				$: {
					name: 'dtb:totalPageCount',
					content: '0',
				},
			},
			{
				$: {
					name: 'dtb:maxPageNumber',
					content: '0',
				},
			},
		],
	};

	return {
		ncx: {
			$: {
				xmlns: 'http://www.daisy.org/z3986/2005/ncx/',
				version: '2005-1',
			},
			head,
			docTitle: {
				text: metadata?.['dc:title'] ?? 'Unknown Title',
			},
			docAuthor: {
				text: metadata?.['dc:creator'] ?? 'Unknown Creator',
			},
			navMap: {
				navPoint: navMap,
			},
		},
	};
}
