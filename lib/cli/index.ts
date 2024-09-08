import {Command} from 'commander';
import createCommand from './commands/create.command';
import updateCommand from './commands/update.command';
import buildCommand from './commands/build.command';

export default async function cli() {
	const program = new Command();

	program
		.name('epub-env')
		.description('EpubEnv é uma ferramenta projetada para criar um ambiente eficiente para desenvolvimento de EPUB, oferecendo ferramentas e configurações mais fáceis de usar.')
		.version('0.0.1');

	program
		.command('create')
		.description('Create an EPUB template.')
		.action(async () => {
			await createCommand();
		});

	program
		.command('update')
		.description('Updates the EPUB manifest, spine, and NCX.')
		.action(async () => {
			await updateCommand();
		});

	program
		.command('build')
		.description('Compiles the EPUB.')
		.action(async () => {
			await buildCommand();
		});

	await program.parseAsync(process.argv);
}
