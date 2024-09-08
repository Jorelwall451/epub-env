import {readFile} from 'fs/promises';
import {join} from 'path';
import {cwd} from 'process';
import {parseStringPromise} from 'xml2js';
import type EpubManifest from '../../types/EpubManifest';

export default async function getManifest() {
	const filepath = join(cwd(), 'manifest.xml');

	try {
		const file = await readFile(filepath, {
			encoding: 'utf-8',
		});

		const data = (await parseStringPromise(file))?.manifest as EpubManifest;

		if (!data) {
			throw new Error('Manifest must have the root tag <manifest>');
		}

		const pages = data.item?.filter(item => item.$.id.startsWith('page')) || [];
		const assets = data.item?.filter(item => item.$.id.startsWith('asset')) || [];
		const others = data.item?.filter(item => !(item.$.id.startsWith('page') || item.$.id.startsWith('asset'))) || [];

		return {
			all: data,
			pages,
			assets,
			others,
		};
	} catch (unknownError) {
		const error = unknownError as NodeJS.ErrnoException;

		if (error.code === 'ENOENT') {
			return null;
		}

		throw error;
	}
}
