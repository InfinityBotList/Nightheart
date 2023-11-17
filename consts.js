"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraDataPositionMap = exports.bgs = exports.themes = exports.apiUrl = exports.cdnUrl = void 0;
exports.cdnUrl = 'https://cdn.infinitybots.gg';
exports.apiUrl = 'https://spider.infinitybots.gg';
exports.themes = {
    violet: '#8b5cec',
    blue: '#3b82f6',
    rose: '#ef4444',
    amber: '#f59e0b',
    emerald: '#10b981',
    summer: '#e35335',
    default: '#472782'
};
exports.bgs = {
    dark: '#000000',
    light: '#16151d',
    default: '#271B41'
};
exports.extraDataPositionMap = {
    "large": {
        size: [400, 240],
        posMap: [
            [20, 217],
            [197, -30] // [Start, offset], at y axis
        ],
        init: (c) => {
            return c.printRoundedRectangle(0, 215, 400, 25, 5)
                .printRoundedRectangle(0, 0, 400, 40, 10)
                .printRoundedRectangle(10, 180, 185, 25, 10)
                .printRoundedRectangle(207, 180, 185, 25, 10)
                .printRoundedRectangle(10, 150, 185, 25, 10)
                .printRoundedRectangle(207, 150, 185, 25, 10)
                .printRoundedRectangle(10, 120, 185, 25, 10)
                .printRoundedRectangle(207, 120, 185, 25, 10);
        },
        addIcons: (avatar, icon, c) => {
            return c.printCircularImage(avatar, 20, 20, 15)
                .printCircularImage(icon, 20, 227, 10);
        }
    },
    "medium": {
        size: [400, 180],
        posMap: [
            [20, 217],
            [137, -30]
        ],
        init: (c) => {
            return c.printRoundedRectangle(0, 155, 400, 25, 5)
                .printRoundedRectangle(0, 0, 400, 40, 10)
                .printRoundedRectangle(10, 120, 185, 25, 10)
                .printRoundedRectangle(207, 120, 185, 25, 10)
                .printRoundedRectangle(10, 90, 185, 25, 10)
                .printRoundedRectangle(207, 90, 185, 25, 10);
        },
        addIcons: (avatar, icon, c) => {
            return c.printCircularImage(avatar, 20, 20, 15)
                .printCircularImage(icon, 20, 167, 10);
        },
    },
    "small": {
        size: [400, 140],
        posMap: [
            [20, 217],
            [67, 30]
        ],
        init: (c) => {
            return c.printRoundedRectangle(0, 115, 400, 25, 5)
                .printRoundedRectangle(0, 0, 400, 40, 10)
                .printRoundedRectangle(10, 50, 185, 25, 10)
                .printRoundedRectangle(207, 50, 185, 25, 10)
                .printRoundedRectangle(10, 80, 185, 25, 10)
                .printRoundedRectangle(207, 80, 185, 25, 10);
        },
        addIcons: (avatar, icon, c) => {
            return c.printCircularImage(avatar, 20, 20, 15)
                .printCircularImage(icon, 20, 127, 10);
        }
    },
};
