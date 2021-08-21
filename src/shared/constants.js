export const CACHE_BLOCK_SIZE = 256;
export const DEFAULT_MAX_CACHE_SIZE = 10000;
export const ZOOM_FACTOR = 1000;
export const CLICK_ZOOM_FACTOR = 0.2;
export const DELAY_BETWEEN_UPDATES = 33;

export const CANVAS_DEFAULT_ZOOM = 256;
export const CANVAS_MIN_ZOOM = 64;
export const CANVAS_MAX_ZOOM = Number.MAX_SAFE_INTEGER;

export const FRACTAL_TYPES = {
    MANDLEBROT: 0,
    BURNING_SHIP: 1,
    MULTIBROT: 2,
    TRICORN: 3,
};

export const COLOR_PALLETS = {
    HSV_RED: 0,
    HSV_BLUE: 1,
    HSV_GREEN: 2,
};

export const DEFAULT_MAX_ITER = 256;
export const DEFAULT_CONTINUOUS_COLORING = true;
export const DEFAULT_COLOR_PALLET = COLOR_PALLETS.HSV_RED;
export const DEFAULT_FRACTAL = FRACTAL_TYPES.MANDLEBROT;

export const MANDLEBROT_CENTER_X = -1;
export const MANDLEBROT_CENTER_Y = 0;
export const MANDLEBROT_MIN_HEIGHT = 2.5;
export const MANDLEBROT_MIN_WIDTH = 4;

export const BURNING_SHIP_CENTER_X = 0;
export const BURNING_SHIP_CENTER_Y = -0.5;
export const BURNING_SHIP_MIN_HEIGHT = 3;
export const BURNING_SHIP_MIN_WIDTH = 3;

export const MULTIBROT_CENTER_X = 0;
export const MULTIBROT_CENTER_Y = 0;
export const MULTIBROT_MIN_HEIGHT = 4;
export const MULTIBROT_MIN_WIDTH = 4;

export const TRICORN_CENTER_X = 0;
export const TRICORN_CENTER_Y = 0;
export const TRICORN_MIN_HEIGHT = 4;
export const TRICORN_MIN_WIDTH = 4;
