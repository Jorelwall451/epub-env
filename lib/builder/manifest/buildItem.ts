import {stat} from 'fs/promises';
import {basename, join, relative} from 'path';
import buildItems from './buildItems';
import fileTypeMappings from '../../constants/fileTypesMapping';
import {cwd} from 'process';
import type ManifestItem from '../../types/ManifestItem';

const indexes = {
	pageIndex: 0,
	assetIndex: 0,
};

export default async function buildItem(
	filepath: string,
	prefix: 'page' | 'asset',
	resetIndexes = false,
): Promise<ManifestItem | ManifestItem[]> {
	const filename = basename(filepath);
	const fileStat = await stat(filepath);

	if (resetIndexes) {
		indexes.pageIndex = 0;
		indexes.assetIndex = 0;
	}

	if (fileStat.isFile()) {
		if (prefix === 'page') {
			indexes.pageIndex++;
		} else {
			indexes.assetIndex++;
		}

		const filetype = filename.split('.').pop();

		if (!filetype) {
			throw new Error(`Filename ${filename} don't have extension.`);
		}

		const mediaType = fileTypeMappings[filetype.toLowerCase()] ?? `application/${filetype}`;

		const newItem: ManifestItem = {
			id: `${prefix}:${prefix === 'page' ? indexes.pageIndex : indexes.assetIndex}`,
			href: relative(cwd(), filepath).replace(/\\/g, '/'),
			mediaType,
		};

		if (prefix === 'page') {
			const titleParts = filename.split('.');
			if (titleParts.length > 0) {
				newItem.title = titleParts[0].split('_')[1] || titleParts[0];
			}
		}

		return newItem;
	}

	return buildItems(join(filepath, filename), prefix, false);
}
