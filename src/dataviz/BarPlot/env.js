'use strict';

// import lib
import { isMobile } from '../../libs/system.js';

// --- Heatmap ---
export const margin = {top: 8, right: 48, bottom: 72, left: 48};
export const width = isMobile() ? 220 : 300;
export const height = isMobile() ? 220 : 300;