import {readFile} from 'fs/promises';
import {join} from 'path';
import {cwd} from 'process';
import {parseStringPromise} from 'xml2js';
import type EpubNcx from '../../types/EpubNcx';

export default async function getNcx() {
	const filepath = join(cwd(), 'toc.xml');

	try {
		const file = await readFile(filepath, 'utf-8');

		const data = (await parseStringPromise(file)) as EpubNcx;

		return data;
	} catch (unknownError) {
		const error = unknownError as Error;

		if (error.name === 'ENOENT') {
			console.warn('Spine file not found, continuing without it.');
			return null;
		}

		throw error;
	}
}
