import buildManifestFile from '../../builder/manifest/buildManifestFile';
import buildNcxFile from '../../builder/ncx/buildNcxFile';
import buildSpineFile from '../../builder/spine/buildSpineFile';

export default async function updateCommand() {
	await buildManifestFile();
	await buildSpineFile();
	await buildNcxFile();
}

