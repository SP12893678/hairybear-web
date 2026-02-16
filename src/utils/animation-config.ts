/**
 * Animation Configuration with Color Schemes
 * Feature: 001-3d-bear-web-app
 *
 * Defines all 40 bear animations with their associated Prism background colors
 */

import type { Animation, ActionName, AnimationConfigMap } from '@/types/bear.types';

export const ANIMATION_CONFIG: AnimationConfigMap = {
  'hip-hop-dancing': {
    id: 'hip-hop-dancing',
    name: 'hip-hop-dancing',
    displayName: 'Hip Hop Dancing',
    duration: 3.5,
    colorScheme: {
      hueShift: 0.8,
      colorFrequency: 1.5,
      bloom: 1.8,
      saturation: 1.7
    },
    category: 'dance'
  },
  'jumping': {
    id: 'jumping',
    name: 'jumping',
    displayName: 'Jumping',
    duration: 1.2,
    colorScheme: {
      hueShift: 0.3,
      colorFrequency: 1.8,
      bloom: 1.5,
      saturation: 1.5
    },
    category: 'action'
  },
  'punching': {
    id: 'punching',
    name: 'punching',
    displayName: 'Punching',
    duration: 1.5,
    colorScheme: {
      hueShift: -0.5,
      colorFrequency: 1.6,
      bloom: 1.7,
      saturation: 1.8
    },
    category: 'action'
  },
  'running': {
    id: 'running',
    name: 'running',
    displayName: 'Running',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.4,
      colorFrequency: 1.7,
      bloom: 1.4,
      saturation: 1.6
    },
    category: 'movement'
  },
  'sitting-clap': {
    id: 'sitting-clap',
    name: 'sitting-clap',
    displayName: 'Sitting Clap',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.6,
      colorFrequency: 1.3,
      bloom: 1.5,
      saturation: 1.4
    },
    category: 'gesture'
  },
  'sitting-pose': {
    id: 'sitting-pose',
    name: 'sitting-pose',
    displayName: 'Sitting Pose',
    duration: 3.0,
    colorScheme: {
      hueShift: 0.2,
      colorFrequency: 1.0,
      bloom: 1.3,
      saturation: 1.3
    },
    category: 'gesture'
  },
  'walking': {
    id: 'walking',
    name: 'walking',
    displayName: 'Walking',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.1,
      colorFrequency: 1.2,
      bloom: 1.2,
      saturation: 1.4
    },
    category: 'movement'
  },
  'weaving': {
    id: 'weaving',
    name: 'weaving',
    displayName: 'Weaving',
    duration: 2.8,
    colorScheme: {
      hueShift: 0.7,
      colorFrequency: 1.4,
      bloom: 1.6,
      saturation: 1.5
    },
    category: 'movement'
  },
  'cheering': {
    id: 'cheering',
    name: 'cheering',
    displayName: 'Cheering',
    duration: 2.2,
    colorScheme: {
      hueShift: 0.9,
      colorFrequency: 1.6,
      bloom: 1.9,
      saturation: 1.9
    },
    category: 'emotion'
  },
  'crying': {
    id: 'crying',
    name: 'crying',
    displayName: 'Crying',
    duration: 3.0,
    colorScheme: {
      hueShift: -0.8,
      colorFrequency: 0.8,
      bloom: 1.1,
      saturation: 1.2
    },
    category: 'emotion'
  },
  'bowing': {
    id: 'bowing',
    name: 'bowing',
    displayName: 'Bowing',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.5,
      colorFrequency: 1.1,
      bloom: 1.4,
      saturation: 1.3
    },
    category: 'gesture'
  },
  'noding': {
    id: 'noding',
    name: 'noding',
    displayName: 'Nodding',
    duration: 1.5,
    colorScheme: {
      hueShift: 0.3,
      colorFrequency: 1.3,
      bloom: 1.3,
      saturation: 1.4
    },
    category: 'gesture'
  },
  'head-spinning': {
    id: 'head-spinning',
    name: 'head-spinning',
    displayName: 'Head Spinning',
    duration: 2.5,
    colorScheme: {
      hueShift: 1.0,
      colorFrequency: 1.9,
      bloom: 1.8,
      saturation: 1.8
    },
    category: 'action'
  },
  'welcome': {
    id: 'welcome',
    name: 'welcome',
    displayName: 'Welcome',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.6,
      colorFrequency: 1.4,
      bloom: 1.6,
      saturation: 1.6
    },
    category: 'gesture'
  },
  'clapping': {
    id: 'clapping',
    name: 'clapping',
    displayName: 'Clapping',
    duration: 1.8,
    colorScheme: {
      hueShift: 0.4,
      colorFrequency: 1.5,
      bloom: 1.5,
      saturation: 1.5
    },
    category: 'gesture'
  },
  'climbing': {
    id: 'climbing',
    name: 'climbing',
    displayName: 'Climbing',
    duration: 3.5,
    colorScheme: {
      hueShift: 0.2,
      colorFrequency: 1.3,
      bloom: 1.4,
      saturation: 1.5
    },
    category: 'action'
  },
  'run-away': {
    id: 'run-away',
    name: 'run-away',
    displayName: 'Run Away',
    duration: 2.3,
    colorScheme: {
      hueShift: -0.3,
      colorFrequency: 1.7,
      bloom: 1.6,
      saturation: 1.7
    },
    category: 'movement'
  },
  'praying': {
    id: 'praying',
    name: 'praying',
    displayName: 'Praying',
    duration: 3.0,
    colorScheme: {
      hueShift: 0.5,
      colorFrequency: 0.9,
      bloom: 1.3,
      saturation: 1.2
    },
    category: 'gesture'
  },
  'fall-down': {
    id: 'fall-down',
    name: 'fall-down',
    displayName: 'Fall Down',
    duration: 2.0,
    colorScheme: {
      hueShift: -0.6,
      colorFrequency: 1.4,
      bloom: 1.2,
      saturation: 1.3
    },
    category: 'action'
  },
  'looking-right': {
    id: 'looking-right',
    name: 'looking-right',
    displayName: 'Looking Right',
    duration: 1.5,
    colorScheme: {
      hueShift: 0.3,
      colorFrequency: 1.1,
      bloom: 1.3,
      saturation: 1.3
    },
    category: 'gesture'
  },
  'laying': {
    id: 'laying',
    name: 'laying',
    displayName: 'Laying',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.1,
      colorFrequency: 0.8,
      bloom: 1.2,
      saturation: 1.2
    },
    category: 'gesture'
  },
  'lying-down': {
    id: 'lying-down',
    name: 'lying-down',
    displayName: 'Lying Down',
    duration: 2.8,
    colorScheme: {
      hueShift: 0.0,
      colorFrequency: 0.7,
      bloom: 1.1,
      saturation: 1.1
    },
    category: 'gesture'
  },
  'salute': {
    id: 'salute',
    name: 'salute',
    displayName: 'Salute',
    duration: 1.8,
    colorScheme: {
      hueShift: 0.4,
      colorFrequency: 1.2,
      bloom: 1.4,
      saturation: 1.4
    },
    category: 'gesture'
  },
  'melee-attack': {
    id: 'melee-attack',
    name: 'melee-attack',
    displayName: 'Melee Attack',
    duration: 2.0,
    colorScheme: {
      hueShift: -0.7,
      colorFrequency: 1.8,
      bloom: 1.9,
      saturation: 1.9
    },
    category: 'action'
  },
  'heavy-hit': {
    id: 'heavy-hit',
    name: 'heavy-hit',
    displayName: 'Heavy Hit',
    duration: 1.5,
    colorScheme: {
      hueShift: -0.9,
      colorFrequency: 1.9,
      bloom: 2.0,
      saturation: 2.0
    },
    category: 'action'
  },
  'look-around': {
    id: 'look-around',
    name: 'look-around',
    displayName: 'Look Around',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.2,
      colorFrequency: 1.2,
      bloom: 1.3,
      saturation: 1.3
    },
    category: 'gesture'
  },
  'situp': {
    id: 'situp',
    name: 'situp',
    displayName: 'Sit Up',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.3,
      colorFrequency: 1.3,
      bloom: 1.4,
      saturation: 1.4
    },
    category: 'action'
  },
  'soul-spin': {
    id: 'soul-spin',
    name: 'soul-spin',
    displayName: 'Soul Spin',
    duration: 3.0,
    colorScheme: {
      hueShift: 1.2,
      colorFrequency: 1.8,
      bloom: 1.9,
      saturation: 1.9
    },
    category: 'dance'
  },
  'break-dance': {
    id: 'break-dance',
    name: 'break-dance',
    displayName: 'Break Dance',
    duration: 4.0,
    colorScheme: {
      hueShift: 0.9,
      colorFrequency: 1.7,
      bloom: 1.8,
      saturation: 1.8
    },
    category: 'dance'
  },
  'swing-dance': {
    id: 'swing-dance',
    name: 'swing-dance',
    displayName: 'Swing Dance',
    duration: 3.5,
    colorScheme: {
      hueShift: 0.7,
      colorFrequency: 1.6,
      bloom: 1.7,
      saturation: 1.7
    },
    category: 'dance'
  },
  'jogging-box': {
    id: 'jogging-box',
    name: 'jogging-box',
    displayName: 'Jogging Box',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.4,
      colorFrequency: 1.5,
      bloom: 1.5,
      saturation: 1.6
    },
    category: 'movement'
  },
  'clown-walk': {
    id: 'clown-walk',
    name: 'clown-walk',
    displayName: 'Clown Walk',
    duration: 2.8,
    colorScheme: {
      hueShift: 0.8,
      colorFrequency: 1.6,
      bloom: 1.7,
      saturation: 1.7
    },
    category: 'movement'
  },
  'jumping-jack': {
    id: 'jumping-jack',
    name: 'jumping-jack',
    displayName: 'Jumping Jack',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.5,
      colorFrequency: 1.6,
      bloom: 1.6,
      saturation: 1.6
    },
    category: 'action'
  },
  'strong-gesture': {
    id: 'strong-gesture',
    name: 'strong-gesture',
    displayName: 'Strong Gesture',
    duration: 1.8,
    colorScheme: {
      hueShift: 0.6,
      colorFrequency: 1.4,
      bloom: 1.7,
      saturation: 1.7
    },
    category: 'gesture'
  },
  'dancing': {
    id: 'dancing',
    name: 'dancing',
    displayName: 'Dancing',
    duration: 3.5,
    colorScheme: {
      hueShift: 0.8,
      colorFrequency: 1.5,
      bloom: 1.7,
      saturation: 1.7
    },
    category: 'dance'
  },
  'praying-down': {
    id: 'praying-down',
    name: 'praying-down',
    displayName: 'Praying Down',
    duration: 3.0,
    colorScheme: {
      hueShift: 0.4,
      colorFrequency: 0.9,
      bloom: 1.2,
      saturation: 1.2
    },
    category: 'gesture'
  },
  'silly-dancing': {
    id: 'silly-dancing',
    name: 'silly-dancing',
    displayName: 'Silly Dancing',
    duration: 3.2,
    colorScheme: {
      hueShift: 1.0,
      colorFrequency: 1.8,
      bloom: 1.9,
      saturation: 1.9
    },
    category: 'dance'
  },
  'standing-clap': {
    id: 'standing-clap',
    name: 'standing-clap',
    displayName: 'Standing Clap',
    duration: 2.0,
    colorScheme: {
      hueShift: 0.5,
      colorFrequency: 1.4,
      bloom: 1.5,
      saturation: 1.5
    },
    category: 'gesture'
  },
  'sneaking-right': {
    id: 'sneaking-right',
    name: 'sneaking-right',
    displayName: 'Sneaking Right',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.2,
      colorFrequency: 1.2,
      bloom: 1.3,
      saturation: 1.4
    },
    category: 'movement'
  },
  'standing-torch-run-forward': {
    id: 'standing-torch-run-forward',
    name: 'standing-torch-run-forward',
    displayName: 'Torch Run Forward',
    duration: 2.5,
    colorScheme: {
      hueShift: 0.6,
      colorFrequency: 1.5,
      bloom: 1.8,
      saturation: 1.7
    },
    category: 'movement'
  }
};

export const ANIMATIONS: Animation[] = Object.values(ANIMATION_CONFIG);

export function getAnimationByName(name: ActionName): Animation | undefined {
  return ANIMATION_CONFIG[name];
}

export const DEFAULT_ANIMATION: ActionName = 'hip-hop-dancing';
