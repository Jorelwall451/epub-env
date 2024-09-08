import {join} from 'node:path';
import type EpubMetadata from '../../types/EpubMetadata';
import {cwd} from 'node:process';
import {Builder} from 'xml2js';
import {writeFile} from 'node:fs/promises';

export default async function buildMetadataFile(metadata: EpubMetadata) {
	const filepath = join(cwd(), 'metadata.xml');

	const identifierXml = {
		$: {
			id: 'BookId',
		},
		_: metadata['dc:identifier'],
	};

	const metadataXml = {
		...metadata,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'dc:identifier': identifierXml,
	};

	const structure = {
		metadata: {
			$: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'xmlns:opf': 'http://www.idpf.org/2007/opf',
			},
			...metadataXml,
		},
	};

	const builder = new Builder();
	const data = builder.buildObject(structure);

	await writeFile(filepath, data);
}
