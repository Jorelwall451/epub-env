type EpubMetadata = {
	'dc:title': string;
	'dc:creator'?: string;
	'dc:subject'?: string;
	'dc:description'?: string;
	'dc:publisher'?: string;
	'dc:contributor'?: string;
	'dc:date'?: string;
	'dc:type'?: string;
	'dc:identifier': string;
	'dc:source'?: string;
	'dc:language': string;
	'dc:relation'?: string;
	'dc:coverage'?: string;
	'dc:rights'?: string;
};

export default EpubMetadata;
