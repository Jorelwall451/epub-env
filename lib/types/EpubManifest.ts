import type ManifestItem from './ManifestItem';

type EpubManifest = {
	item: Array<{
		'$': ManifestItem;
	}>;
};

export default EpubManifest;
