import {join} from 'path';
import buildNcx from './buildNcx';
import {cwd} from 'process';
import {writeFile} from 'fs/promises';
import {Builder} from 'xml2js';

export default async function buildNcxFile() {
	const filepath = join(cwd(), 'toc.ncx');
	const ncx = await buildNcx();

	const builder = new Builder();
	const data = builder.buildObject(ncx);

	await writeFile(filepath, data);
}
