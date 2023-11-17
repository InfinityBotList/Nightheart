"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAssetMetadataToPath = void 0;
// From Infinity-Next, src/utils/funcs/assetmgmt.ts
const consts_1 = require("./consts");
/** Given asset metadata, return the path to use for display
 *
 * Sometimes, no path may be returned. This occurs if there is no default_path whatsoever
 *
 * @param {AssetMetadata} assetMetadata
 **/
const resolveAssetMetadataToPath = (assetMetadata, options) => {
    if (!assetMetadata) {
        return '';
    }
    let path;
    if (assetMetadata?.exists) {
        if (!assetMetadata?.path) {
            console.warn('ResolveAssetMetadataToPath', 'assetMetadata exists but has no path', assetMetadata);
            assetMetadata.path = '';
        }
        path = assetMetadata.path;
    }
    else {
        // Use default path in this case or path if its set
        // If neither is set, this will thus return an empty string
        path = assetMetadata?.default_path || assetMetadata?.path || "";
    }
    if (!options?.noPrependCdn) {
        path = `${consts_1.cdnUrl}/${path}`;
    }
    if (!options?.noCacheBusting && assetMetadata.last_modified) {
        let date = Math.floor(new Date(assetMetadata.last_modified).getTime());
        path += `?ts=${date}`;
    }
    return path;
};
exports.resolveAssetMetadataToPath = resolveAssetMetadataToPath;
