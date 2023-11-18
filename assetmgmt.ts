// From Infinity-Next, src/utils/funcs/assetmgmt.ts
import { cdnUrl } from './consts'
import { AssetMetadata } from './generated/popplio/types'
import logger from './logger'

interface RAMPOptions {
    /**
     * If set, will not prepend the CDN url to the path
     *
     * @default false
     * */
    noPrependCdn?: boolean
    /**
     * If set, will not prepend the cache-busting query string to the path
     *
     * @default false
     * */
    noCacheBusting?: boolean
}

/** Given asset metadata, return the path to use for display
 *
 * Sometimes, no path may be returned. This occurs if there is no default_path whatsoever
 *
 * @param {AssetMetadata} assetMetadata
 **/
export const resolveAssetMetadataToPath = (assetMetadata: AssetMetadata, options?: RAMPOptions) => {
    if (!assetMetadata) {
        return ''
    }

    let path: string

    if (assetMetadata?.exists) {
        if (!assetMetadata?.path) {
            logger.warn('ResolveAssetMetadataToPath', 'assetMetadata exists but has no path', assetMetadata)
            assetMetadata.path = ''
        }
        path = assetMetadata.path
    } else {
        // Use default path in this case or path if its set
        // If neither is set, this will thus return an empty string
        path = assetMetadata?.default_path || assetMetadata?.path || ""
    }

    if (!options?.noPrependCdn) {
        path = `${cdnUrl}/${path}`
    }

    if (!options?.noCacheBusting && assetMetadata.last_modified) {
        let date = Math.floor(new Date(assetMetadata.last_modified).getTime())
        path += `?ts=${date}`
    }

    return path
}
