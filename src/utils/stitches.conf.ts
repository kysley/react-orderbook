import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      bg: '#111827',
      bg060: '#11182799',
      bgRed: '#3D1E28',
      bgGreen: '#123534',
      red: '#C13337',
      green: '#117E5B',
      text: '#BBBEC3',
      text200: '#4A505E',
      purple: '#5741D9',
      border: '#232B38',
      border200: '#171D28',
    },
  },
  media: {
    bp1: '(max-width: 480px)',
  },
});
