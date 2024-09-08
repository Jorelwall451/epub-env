import {join} from 'path';
import {cwd} from 'process';
import {Builder} from 'xml2js';
import {writeFile} from 'fs/promises';
import buildManifest from './buildManifest';

export default async function buildManifestFile() {
	const filepath = join(cwd(), 'manifest.xml');
	const manifest = await buildManifest();

	const structure = {
		manifest: {
			item: manifest.allItemsXml,
		},
	};

	const builder = new Builder();
	const data = builder.buildObject(structure);

	await writeFile(filepath, data);
}
