import { CACHE_BLOCK_SIZE } from '../shared/constants.js';

const mapBlockToCanvas = (block, pallet) => {
    const canvas = document.createElement('canvas');

    canvas.height = CACHE_BLOCK_SIZE;
    canvas.width = CACHE_BLOCK_SIZE;

    const canvasCtx = canvas.getContext('2d');
    const imageData = canvasCtx.createImageData(
        CACHE_BLOCK_SIZE,
        CACHE_BLOCK_SIZE
    );

    const { data } = imageData;

    for (let i = 0; i < CACHE_BLOCK_SIZE * CACHE_BLOCK_SIZE; i += 1) {
        const iter = Math.max(block[i], 0);
        const iterFrac = iter - Math.floor(iter);

        const color0 = pallet[Math.floor(iter)];
        const color1 = pallet[Math.floor(iter) + 1];

        const j = i * 4;
        data[j] = color0.red + iterFrac * (color1.red - color0.red);
        data[j + 1] = color0.green + iterFrac * (color1.green - color0.green);
        data[j + 2] = color0.blue + iterFrac * (color1.blue - color0.blue);
        data[j + 3] = 255;
    }

    canvasCtx.putImageData(imageData, 0, 0);
    return canvas;
};

// eslint-disable-next-line
const lerp = (x, y, n) => {
    const { red: xr, green: xg, blue: xb } = x;
    const { red: yr, green: yg, blue: yb } = y;
    return new Array(n).fill(0).map((_, idx) => ({
        red: xr + (yr - xr) * (idx / n),
        green: xg + (yg - xg) * (idx / n),
        blue: xb + (yb - xb) * (idx / n),
    }));
};

// eslint-disable-next-line
const hsvToRgb = (h, s, v) => {
    const hp = h / 60.0;
    const c = Math.min(v, 1) * s;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let color = { red: 0, green: 0, blue: 0 };
    if (hp >= 0 && hp < 1) {
        color = { red: c, green: x, blue: 0 };
    } else if (hp >= 1 && hp < 2) {
        color = { red: x, green: c, blue: 0 };
    } else if (hp >= 2 && hp < 3) {
        color = { red: 0, green: c, blue: x };
    } else if (hp >= 3 && hp < 4) {
        color = { red: x, green: 0, blue: c };
    } else if (hp >= 4 && hp < 5) {
        color = { red: x, green: 0, blue: c };
    } else if (hp >= 5 && hp < 6) {
        color = { red: c, green: 0, blue: x };
    }

    const m = Math.min(v, 1) - c;

    color.red += m;
    color.green += m;
    color.blue += m;

    color.red *= 255;
    color.green *= 255;
    color.blue *= 255;

    return color;
};

const standardPallet = (() => {
    const pallet = [];
    pallet.push({ red: 0, green: 0, blue: 0 });
    for (let n = 0; n < 2 ** 16; n += 1) {
        pallet.push(hsvToRgb((360.0 * n) / 500, 1.0, (10 * n) / 500));
    }
    return pallet;

    /*
    const pallet = [];
    pallet.push({ red: 0, green: 0, blue: 0 });
    for (let n = 0; n < 3000; n += 1) {
        const t = (n % 800) / 800;
        const red = Math.floor(9 * (1 - t) * t * t * t * 255);
        const green = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
        const blue = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);

        pallet.push({ red, green, blue });
    }
    return pallet;
    */
})();

export { mapBlockToCanvas, standardPallet };
