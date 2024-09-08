import {readFile} from 'fs/promises';
import {join} from 'path';
import {cwd} from 'process';
import type EpubMetadata from '../../types/EpubMetadata';
import {parseStringPromise} from 'xml2js';

export default async function getMetadata() {
	const filepath = join(cwd(), 'metadata.xml');

	try {
		const file = await readFile(filepath, 'utf-8');

		const data = (await parseStringPromise(file)).metadata as EpubMetadata;

		return data;
	} catch (unknownError) {
		const error = unknownError as NodeJS.ErrnoException;

		if (error.code === 'ENOENT') {
			console.warn('Metadata file not found, continuing without it.');
			return null;
		}

		throw error;
	}
}
