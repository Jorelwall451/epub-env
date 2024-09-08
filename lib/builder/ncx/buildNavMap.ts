import getManifest from '../../data/manifest/getManifest';

export default async function buildNavMap() {
	const manifest = await getManifest();

	if (!manifest) {
		throw new Error('');
	}

	const navMap = manifest.pages.map((page, index) => {
		let pageIndex = index;

		if (typeof page.$.id[0] === 'number' && page.$.id[1] === ':') {
			pageIndex = page.$.id[0];
		}

		return {
			$: {
				id: `navPoint-${pageIndex + 1}`,
				playOrder: pageIndex + 1,
			},
			navLabel: {
				text: `${page.$.title}`,
			},
			content: {
				$: {
					src: page.$.href,
				},
			},
		};
	});

	return navMap;
}
