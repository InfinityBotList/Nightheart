import { Canvas, Image } from "canvas-constructor/cairo";

export const cdnUrl = 'https://cdn.infinitybots.gg';
export const cdnDefaultAvatar = `${cdnUrl}/avatars/default.webp`
export const cdnFullLogo = `${cdnUrl}/core/full_logo.webp`
export const apiUrl = 'https://spider.infinitybots.gg';
export const cacheDir ='.cache'
export const pngCached = false // We don't need it right now
export const pngCacheClearAge = 28800000 // 8 hours (in ms)
export const pngCacheClearInterval = 3600000 // 1 hour (in ms)

interface KV {
    [key: string]: string
}

export const themes: KV = {
    violet: '#8b5cec',
    blue: '#3b82f6',
    rose: '#ef4444',
    amber: '#f59e0b',
    emerald: '#10b981',
    summer: '#e35335',
    default: '#472782'
}

export const bgs: KV = {
    dark: '#000000',
    light: '#16151d',
    default: '#271B41'
}

interface EDPM {
    [key: string]: {
        size: number[] // X, Y
        posMap: number[][]
        init: (c: Canvas) => Canvas
        addIcons: (avatar: Image, icon: Image, c: Canvas) => Canvas
    }
}

export const extraDataPositionMap: EDPM = {
    "large": {
        size: [400, 240],
        posMap: [
            [20, 217], // [Start, end], at x axis
            [197, -30] // [Start, offset], at y axis
        ],
        init: (c: Canvas) => {
            return c.printRoundedRectangle(0, 215, 400, 25, 5)
            .printRoundedRectangle(0, 0, 400, 40, 10)
            .printRoundedRectangle(10, 180, 185, 25, 10)
            .printRoundedRectangle(207, 180, 185, 25, 10)
            .printRoundedRectangle(10, 150, 185, 25, 10)
            .printRoundedRectangle(207, 150, 185, 25, 10)
            .printRoundedRectangle(10, 120, 185, 25, 10)
            .printRoundedRectangle(207, 120, 185, 25, 10)
        },
        addIcons: (avatar: Image, icon: Image, c: Canvas) => {
            return c.printCircularImage(avatar, 20, 20, 15)
            .printCircularImage(icon, 20, 227, 10)
        }
    },
    "medium": {
        size: [400, 180],
        posMap: [
            [20, 217],
            [137, -30]
        ],
        init: (c: Canvas) => {
            return c.printRoundedRectangle(0, 155, 400, 25, 5)
            .printRoundedRectangle(0, 0, 400, 40, 10)
            .printRoundedRectangle(10, 120, 185, 25, 10)
            .printRoundedRectangle(207, 120, 185, 25, 10)
            .printRoundedRectangle(10, 90, 185, 25, 10)
            .printRoundedRectangle(207, 90, 185, 25, 10)
        },
        addIcons: (avatar: Image, icon: Image, c: Canvas) => {
            return c.printCircularImage(avatar, 20, 20, 15)
            .printCircularImage(icon, 20, 167, 10)
        },
    },
    "small": {
        size: [400, 140],
        posMap: [
            [20, 217],
            [67, 30]
        ],
        init: (c: Canvas) => {
            return c.printRoundedRectangle(0, 115, 400, 25, 5)
            .printRoundedRectangle(0, 0, 400, 40, 10)
            .printRoundedRectangle(10, 50, 185, 25, 10)
            .printRoundedRectangle(207, 50, 185, 25, 10)
            .printRoundedRectangle(10, 80, 185, 25, 10)
            .printRoundedRectangle(207, 80, 185, 25, 10)
        },
        addIcons: (avatar: Image, icon: Image, c: Canvas) => {
            return c.printCircularImage(avatar, 20, 20, 15)
            .printCircularImage(icon, 20, 127, 10)

        }
    },
}