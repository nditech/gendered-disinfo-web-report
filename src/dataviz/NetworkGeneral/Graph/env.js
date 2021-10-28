'use strict'

// import lib
import { isMobile } from '../../../libs/system.js';

// --- Graph Renderer ---
export const canvas_width = isMobile() ? 420 : 660
export const canvas_height = isMobile() ? 320 : 500
export const margin = { top: 8, right: 8, bottom: 8, left: 8 }
export const separation_between_graph_and_words = 32

export const words_width = 128
export const graph_width = canvas_width - words_width - separation_between_graph_and_words

// Nodes
export const default_node_opacity = 0.7
export const default_node_non_opacity = 0.3
export const max_circle_radius = 100 // will automatically be lowered it, if needed
export const circle_padding = 16 // in px
export const default_node_color = '#3d5b94';

// Links
export const default_link_opacity = 0.3
export const default_link_non_opacity = 0.0
export const min_lines_width = 8
export const max_lines_width = 30

// Words
export const default_word_opacity = 1.0
export const default_word_non_opacity = 0.3
export const default_word_move_transition_in_ms = 1000

// --- Graph Physics ---

// optimizer
export const t_step_delay_ms = 0
export const displacement_constant = 1.0
export const displacement_to_stop = 0.1

export const max_nbr_of_steps_init = 6000
export const max_nbr_of_steps_drag = 1000

// physics constant
export const c_attr = 0.03
export const c_repu = 12.0

// Enable click redirects
export const click_disabled = isMobile();
