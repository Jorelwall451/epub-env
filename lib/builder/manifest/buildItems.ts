import {readdir, stat} from 'fs/promises';
import buildItem from './buildItem';
import type ManifestItem from '../../types/ManifestItem';
import {join} from 'path';
import getManifest from '../../data/manifest/getManifest';

export default async function buildItems(
	dirpath: string,
	prefix: 'page' | 'asset',
	resetIndexes = false,
): Promise<ManifestItem[]> {
	const manifest = await getManifest();
	const filesDir = await readdir(dirpath);

	const existingFiles = new Set();

	if (manifest) {
		existingFiles.add([...manifest.pages, ...manifest.assets, ...manifest.others].map(item => item.$.href));
	}

	const newFiles: string[] = [];
	const newFilesPromises: Array<Promise<ManifestItem[]>> = [];

	for (const filename of filesDir) {
		const path = join(dirpath, filename);
		// eslint-disable-next-line no-await-in-loop
		const fileStat = await stat(path);

		if (fileStat.isDirectory()) {
			const items = buildItems(path, 'page', false);

			newFilesPromises.push(items);

			continue;
		}

		newFiles.push(path);
	}

	const filePromises = newFiles.map(async filename =>
		buildItem(
			join(filename.toString()),
			prefix,
			resetIndexes,
		),
	);

	const files = await Promise.all(filePromises);

	return files.flat();
}
