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
export const canvas_width = isMobile() ? 320 : 600
export const canvas_height = 800
export const words_width = 128
export const margin = { top: 128, right: 8, bottom: 64, left: 8 }

// --- Color Scale ---
export const color_a = "#eee";
export const color_b = "#444";
export const color_c = "#222";

// --- Events ---
export const text_color = '#222';
export const text_font_family = 'Roboto-Mono';
