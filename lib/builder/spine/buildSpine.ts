import getManifest from '../../data/manifest/getManifest';
import type SpineItem from '../../types/SpineItem';

export default async function buildSpine() {
	const manifest = await getManifest();

	if (!manifest) {
		throw new Error('Manifest not found or could not be loaded.');
	}

	const spine: SpineItem[] = manifest.pages.map(page => ({
		idref: page.$.id,
		linear: isNaN(parseFloat(page.$.id.split(':')[1])) ? 'no' : 'yes',
	}));

	return {
		$: {
			toc: 'ncx',
			'page-progression-direction': 'ltr',
		},
		itemref: spine.map(item => ({
			$: {
				idref: item.idref,
				linear: item.linear,
			},
		})),
	};
}
