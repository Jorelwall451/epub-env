import {readFile} from 'fs/promises';
import {join} from 'path';
import {cwd} from 'process';
import {parseStringPromise} from 'xml2js';
import type EpubSpine from '../../types/EpubSpine';

export default async function getSpine() {
	const filepath = join(cwd(), 'spine.xml');

	try {
		const file = await readFile(filepath, 'utf-8');

		const data = (await parseStringPromise(file))?.spine as EpubSpine;

		if (!data) {
			throw new Error('Spine must be have the tag root <spine>');
		}

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
