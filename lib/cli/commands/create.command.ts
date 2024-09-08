/* eslint-disable @typescript-eslint/naming-convention */
import chalk from 'chalk';
import {randomUUID} from 'crypto';
import {createInterface} from 'node:readline/promises';
import {relative} from 'path';
import {cwd} from 'process';
import buildMetadataFile from '../../builder/metadata/buildMetadataFile';
import type EpubMetadata from '../../types/EpubMetadata';
import buildManifestFile from '../../builder/manifest/buildManifestFile';
import buildSpineFile from '../../builder/spine/buildSpineFile';
import buildNcxFile from '../../builder/ncx/buildNcxFile';

export default async function createCommand() {
	const readline = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const dirname = relative('../', cwd());

	const date = new Date();
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	const metadata: EpubMetadata = {
		'dc:title': dirname,
		'dc:creator': 'Unknown Author',
		'dc:subject': 'General',
		'dc:description': 'No description provided',
		'dc:publisher': 'Unknown Publisher',
		'dc:contributor': 'Unknown Contributor',
		'dc:date': `${year}-${month}-${day}`,
		'dc:type': 'Text',
		'dc:identifier': `UUID:${randomUUID()}`,
		'dc:source': 'Unknown Source',
		'dc:language': 'en-US',
		'dc:relation': 'No relation',
		'dc:coverage': 'Worldwide',
		'dc:rights': 'All rights reserved',
	};

	const titleStyled = chalk.bgHex('#fcba03').redBright.bold(' EPUB-ENV ');
	const versionStyled = chalk.bold('epub-env v0.0.1');

	console.log(titleStyled);
	console.log(versionStyled);

	const questions: Array<[string, string | undefined]> = [
		['title', metadata['dc:title']],
		['creator', metadata['dc:creator']],
		['subject', metadata['dc:subject']],
		['description', metadata['dc:description']],
		['publisher', metadata['dc:publisher']],
		['contributor', metadata['dc:contributor']],
		['date', metadata['dc:date']],
		['type', metadata['dc:type']],
		['identifier', metadata['dc:identifier']],
		['source', metadata['dc:source']],
		['language', metadata['dc:language']],
		['relation', metadata['dc:relation']],
		['coverage', metadata['dc:coverage']],
		['rights', metadata['dc:rights']],
	];

	async function askQuestion(index: number) {
		if (index === questions.length) {
			const successMetadataMessageStyled = chalk.green.bold('Metadata collection complete.');

			readline.close();
			console.log(successMetadataMessageStyled);

			await buildMetadataFile(metadata);
			await buildManifestFile();
			await buildSpineFile();
			await buildNcxFile();

			return;
		}

		const [question, defaultAnswer] = questions[index];
		const textQuestStyled = chalk.gray.bold('question');
		const defaultAnswerStyled = chalk.bold(defaultAnswer ?? '');

		const questionTextStyled = `${textQuestStyled} ${question} (${defaultAnswerStyled}): `;

		const answer = await readline.question(questionTextStyled);

		metadata[`dc:${question}` as keyof EpubMetadata] = answer.trim().length > 0 ? answer : (defaultAnswer ?? '');

		await askQuestion(index + 1);
	}

	await askQuestion(0);
}
