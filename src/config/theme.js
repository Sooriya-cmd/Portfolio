/**
 * theme.js — Visual theme, colors, quality presets, and rendering parameters
 */

export const THEME = {
  colors: {
    skyDayZenith: '#3165E0',
    skyDayHorizon: '#DFD5F5',
    skyDuskZenith: '#5B2B85',
    skyDuskHorizon: '#E8A7A1',
    skyNightZenith: '#170C35',
    skyNightHorizon: '#331B58',
    
    polePurple: '#6745A8',
    poleCollarYellow: '#F1C40F',
    poleBandGreen: '#2ECC71',
    signalHousingYellow: '#FFD21F',
    
    cyanAccent: '#2EE5EF',
    pinkAccent: '#FF4F92',
    panelBg: '#FFFDF9',
    panelBorder: '#121324'
  },
  
  halftone: {
    enabled: true,
    opacity: 0.8,
    dotSize: 1.5,
    spacing: 16
  },
  
  quality: {
    maxPixelRatio: 2,
    shadows: false, // Per prompt: prefer fake soft shadows / baked look over expensive shadow maps
    antialias: true
  }
};
