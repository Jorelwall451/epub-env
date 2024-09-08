import JSZip from 'jszip';
import createContentOpf from '../../builder/opf/buildContentOpf';
import getManifest from '../../data/manifest/getManifest';
import {readFile, writeFile} from 'fs/promises';
import {cwd} from 'process';
import {join} from 'path';
import {load} from 'cheerio';
import {Builder} from 'xml2js';

export default async function buildCommand() {
	const builder = new Builder();
	const zip = new JSZip();

	const opf = await createContentOpf();
	const manifest = await getManifest();

	if (!manifest) {
		throw new Error();
	}

	const mimetypeData = 'application/epub+zip';

	const containerStructure = {
		container: {
			$: {
				version: '1.0',
				xmlns: 'urn:oasis:names:tc:opendocument:xmlns:container',
			},
			rootfiles: [
				{
					rootfile: {
						$: {
							'full-path': 'OEBPS/content.opf',
							'media-type': 'application/oebps-package+xml',
						},
					},
				},
			],
		},
	};

	const containerData = builder.buildObject(containerStructure);

	zip.file('mimetype', mimetypeData);
	zip.file('META-INF/container.xml', containerData);
	zip.file('OEBPS/content.opf', opf);

	const itemsContentPromises: Array<Promise<string>> = [];

	for (const item of manifest.all.item) {
		const filepath = join(cwd(), item.$.href);
		const itemContent = readFile(filepath, {
			encoding: 'utf-8',
		});

		itemsContentPromises.push(itemContent);
	}

	const itemsContent = await Promise.all(itemsContentPromises);

	for (let itemIndex = 0; itemIndex < manifest.all.item.length; itemIndex++) {
		const itemContentHtml = load(itemsContent[itemIndex], {
			xml: true,
		}).html();

		zip.file(`OEBPS/${manifest.all.item[itemIndex].$.href}`, itemContentHtml);
	}

	const data = await zip.generateAsync({
		type: 'nodebuffer',
		compression: 'DEFLATE',
		mimeType: 'application/epub+zip',
	});

	await writeFile('main.epub', data);
}
