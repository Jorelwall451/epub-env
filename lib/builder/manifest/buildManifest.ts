import type ManifestItem from '../../types/ManifestItem';
import {relative} from 'path';
import {cwd} from 'process';
import buildItems from './buildItems';
import fileTypeMappings from '../../constants/fileTypesMapping';

export default async function buildManifest() {
	const pagesPathDir = relative(cwd(), 'pages');
	const assetsPathDir = relative(cwd(), 'assets');
	const items: ManifestItem[] = [
		{
			id: 'ncx',
			href: 'toc.ncx',
			mediaType: Object.getOwnPropertyDescriptor(fileTypeMappings, 'ncx')?.value as string,
			title: 'toc',
		},
		...(await buildItems(pagesPathDir, 'page')),
		...(await buildItems(assetsPathDir, 'asset')),
	];

	const itemsXml = items.map(item => ({
		$: {
			id: item.id,
			href: item.href,
			'media-type': item.mediaType,
			title: item.title,
		},
	}));

	return {
		allItemsXml: itemsXml,
		pagesItemsXml: itemsXml.filter(item => item.$.id.startsWith('page')),
		assetsItemsXml: itemsXml.filter(item => item.$.id.startsWith('asset')),
		othersItemsXml: itemsXml.filter(item => !item.$.id.startsWith('page') && !item.$.id.startsWith('asset')),
		allItems: items,
		pagesItems: items.filter(item => item.id.startsWith('page')),
		assetsItems: items.filter(item => item.id.startsWith('asset')),
		othersItems: items.filter(item => !item.id.startsWith('page') && !item.id.startsWith('asset')),
	};
}
