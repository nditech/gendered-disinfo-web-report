'use strict'

// import lib
import { isMobile } from '../../libs/system.js';

// Nbr of columns
export const NBR_OF_TIME_STEPS = 60

// Half padding between blocks (in px)
export const block_half_padding = 2

// Padding between text and heatmap (in px)
export const text_left_padding = 8

// Enable click redirects
export const click_disabled = isMobile();

// --- Heatmap ---
export const canvas_width = isMobile() ? 320 : 700
export const canvas_height = 800
export const words_width = 128
export const margin = { top: 96, right: 8, bottom: 64, left: 8 }

// --- Color Scale ---
export const color_a = "#fff";
export const color_b = "#3d5c94";
export const color_c = "#293e65";


// --- Events ---
export const text_color = '#3d5c94';
