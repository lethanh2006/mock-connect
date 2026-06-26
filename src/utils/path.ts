export const getAppBasePath = () => {
	const basePath =
		typeof APP_CONFIG_BASE_PATH !== 'undefined' ? APP_CONFIG_BASE_PATH : process.env.APP_CONFIG_BASE_PATH || '/';

	return basePath.endsWith('/') ? basePath : `${basePath}/`;
};

export const getPublicAssetPath = (assetPath: string) => {
	return `${getAppBasePath()}${assetPath.replace(/^\/+/, '')}`;
};
