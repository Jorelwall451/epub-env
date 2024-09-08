import {Builder} from 'xml2js';
import buildManifest from '../manifest/buildManifest';
import getMetadata from '../../data/metadata/getMetadata';
import buildSpine from '../spine/buildSpine';

export default async function createContentOpf() {
	const metadata = await getMetadata();
	const manifest = await buildManifest();
	const spine = await buildSpine();

	const structure = {
		package: {
			$: {
				xmlns: 'http://www.idpf.org/2007/opf',
				version: '3.0',
				'unique-identifier': 'BookId',
			},
			metadata: {
				$: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
					// eslint-disable-next-line @typescript-eslint/naming-convention
					'xmlns:opf': 'http://www.idpf.org/2007/opf',
				},
				...metadata,
			},
			manifest: {
				item: manifest.allItemsXml,
			},
			spine,
		},
	};

	const builder = new Builder();
	const data = builder.buildObject(structure);

	return data;
}
