import fs from 'node:fs';
import crypto from 'node:crypto';
import { Image, loadImage } from 'canvas-constructor/cairo';
import sharp from 'sharp';
import { pngCacheClearAge, pngCached } from './consts';

const makeCache = () => {
    // Check if cache directory exists
    let stat = fs.statSync('.cache')
    if (!stat.isDirectory()) {
        // Remove if exists
        if(stat.isFile()) {
            fs.unlinkSync('.cache')
        }

        fs.mkdirSync('.cache')
    }    
}

export const cleanPngCache = () => {
    // Check if cache directory exists
    makeCache()

    // Get all files in cache directory
    let files = fs.readdirSync('.cache', {
        withFileTypes: true
    })

    // Iterate over files
    for(let file of files) {
        if(file.isDirectory()) continue
        if(!file.name.endsWith('.png')) continue

        // Get stats
        let stat = fs.statSync(`.cache/${file}`)

        // If file is older than pngCacheClearInterval, delete it
        if(stat.mtimeMs < Date.now() - pngCacheClearAge) {
            fs.unlinkSync(`.cache/${file}`)
        }
    }
}

 export const loadPngFromCache = async (url: string) => {
    // Check if cache directory exists
    makeCache()

    // Get sha512 hash of url
    let hash = crypto.createHash('sha512').update(url).digest('hex')

    // Check for .cache/{hash}.png
    if(fs.existsSync(`.cache/${hash}.png`)) {
        return await loadImage(`.cache/${hash}.png`)
    }
 }

 export const loadPngToCache = (url: string, img: Buffer) => {
    // Check if cache directory exists
    makeCache()

    // Get sha512 hash of url
    let hash = crypto.createHash('sha512').update(url).digest('hex')

    // Save to .cache/{hash}.png
    let file = fs.createWriteStream(`.cache/${hash}.png`, {
        flags: 'w'
    })

    file.write(img)
 }


/**
 * Workaround to loadImage not supporting PNG
*/
export const loadAsPng = async (url: string) => {
    if(pngCached) {
        makeCache()

        // Get sha512 hash of url
        let hash = crypto.createHash('sha512').update(url).digest('hex')

        // Check for .cache/{hash}.png
        if(fs.existsSync(`.cache/${hash}.png`)) {
            return await loadImage(`.cache/${hash}.png`)
        }
    }

    // Fetch image
    let res = await fetch(url)

    if(!res.ok) {
        throw new Error(`Failed to fetch image: server returned ${res.statusText}`)
    }

    let imageResponse = await res.arrayBuffer()

    // Get buffer
    const img = await sharp(imageResponse).toFormat('png').toBuffer();

    if(pngCached) {
        loadPngToCache(url, img)
    }

    return await loadImage(img)
}
