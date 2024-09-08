import {join} from 'path';
import {cwd} from 'process';
import buildSpine from './buildSpine';
import {writeFile} from 'fs/promises';
import {Builder} from 'xml2js';

export default async function buildSpineFile() {
	const filepath = join(cwd(), 'spine.xml');
	const spine = await buildSpine();

	const structure = {
		spine,
	};

	const builder = new Builder();
	const data = builder.buildObject(structure);

	await writeFile(filepath, data);
}
