## Integrate the <GradientASCII /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GradientASCII
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import GradientASCII from './GradientASCII';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <GradientASCII
    colors={['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']}
    shape="horizon"
    characters=" =+xX0S8#@"
    cellSize={18}
    density={0.8}
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| colors | string[] | ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'] | Two to eight colors for the light, from the edge of the shadow to the brightest or farthest point. Dark areas stay transparent. |
| shape | 'horizon' | 'pinch' | 'rise' | 'eclipse' | 'horizon' | Horizon glows over a dark curve, pinch is a band of light squeezed in the middle, rise glows up from the bottom and eclipse rings a dark disc. |
| characters | string | ' =+xX0S8#@' | Characters from dimmest to brightest. Brighter parts of the gradient use characters further along. |
| cellSize | number | 18 | Height of each character cell in px. |
| density | number | 0.8 | Share of cells that show a character, from 0 to 1. Brighter areas fill in first. |
| glyphOpacity | number | 0.85 | How strongly the characters stand out from the gradient. |
| gradientOpacity | number | 0.9 | Opacity of the gradient behind the characters. At 0 only the characters are left. |
| glow | number | 0.2 | Soft glow around the characters, from 0 to 1.5. |
| depthOfField | number | 0 | Share of characters drawn out of focus, from 0 to 1. |
| flicker | number | 0.2 | How often characters swap with their neighbors in brightness, from 0 to 1. |
| softness | number | 0.5 | How soft the edges of the shape are, from 0 to 1. |
| scale | number | 1 | Size of the shape, from 0.4 to 2.5. |
| flow | number | 0.5 | How much the light wavers as it drifts, from 0 to 2. |
| speed | number | 1 | Speed of the drift. 0 holds the shape still. |
| grain | number | 0.08 | Strength of the film grain, from 0 to 0.4. |
| variation | number | 0 | Picks a different drift and a different pattern of characters. |
| mouseInteraction | boolean | true | Scrambles the characters under the cursor as it moves. They settle back a moment later. |
| scrambleRadius | number | 0.1 | Size of the scrambled area around the cursor, relative to the container height. |
| clickEffect | 'wave' | 'burst' | 'none' | 'wave' | Wave sends a ring of scrambled characters out from the click, burst scrambles a patch under it. |
| intro | boolean | true | Fades the light in from its source while the characters decode. |
| lightMode | boolean | false | Draws the gradient as a wash on light backgrounds, with characters a shade darker. |
| fontFamily | string | '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' | Font used for the characters. Monospaced fonts keep the grid even. |
| dpr | number | auto | Maximum device pixel ratio, capped at 2. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import './GradientASCII.css';

const MAX_COLORS = 8;
const MAX_CLICKS = 4;
const MAX_TRAIL = 24;
const CLICK_LIFE = 1.2;
const TRAIL_LIFE = 0.7;
const TRAIL_STEP = 0.015;
const INTRO_SECONDS = 2.4;
const ATLAS_CELL_W = 60;
const ATLAS_CELL_H = 100;
const ATLAS_COLUMNS = 16;
const FONT_SCALE = 0.78;
const DEFAULT_COLORS = ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'];
const DEFAULT_CHARACTERS = ' =+xX0S8#@';
const DEFAULT_FONT = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SHAPES = { horizon: 0, pinch: 1, rise: 2, eclipse: 3 };
const CLICK_EFFECTS = { none: 0, wave: 1, burst: 2 };

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const COMMON = `
float hash12(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
`;

const FIELD = `#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uTime;
uniform int uShape;
uniform vec3 uRamp[8];
uniform int uCount;
uniform float uScale;
uniform float uSoftness;
uniform float uFlow;
uniform vec2 uSeed;
uniform vec4 uTrail[24];
uniform float uRadius;
uniform vec4 uClicks[4];
uniform int uClickEffect;
uniform float uIntro;
uniform float uFrame;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outAux;
${COMMON}
vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i), f);
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec3 labToRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

vec3 horizon(vec2 p, float time, out float order) {
  float span = 0.5 * max(uAspect, 1.0);
  float x = p.x / span;
  float arch = -0.17 - 0.2 * x * x + 0.02 * sin(time * 0.6);
  float soft = mix(0.05, 0.22, uSoftness);
  float edge = p.y - arch;
  float rim = 0.38 * smoothstep(-soft, 0.42, edge);
  vec2 sun = vec2(0.08 * sin(time * 0.31) * span, 0.58);
  float spread = length((p - sun) / vec2(0.95 * span, 0.75));
  float sky = mix(0.55, 1.0, smoothstep(0.2, 0.95, spread));
  order = clamp(edge * 1.3, 0.0, 1.0);
  return vec3(rim, sky, smoothstep(0.18, 0.62, edge));
}

vec3 pinch(vec2 p, float time, out float order) {
  float span = 0.5 * max(uAspect, 0.75);
  float x = p.x / span;
  float sway = 0.02 * sin(x * 1.7 + time * 0.55);
  float breathe = 1.0 + 0.06 * sin(time * 0.8);
  float width = (0.13 + 0.22 * x * x) * breathe * mix(0.85, 1.2, uSoftness);
  float y = abs(p.y - sway) / width;
  float t = exp(-pow(y, 2.2)) * (0.42 + 0.58 * exp(-x * x * 1.8));
  order = clamp(abs(p.y - sway) * 2.4 + abs(x) * 0.3, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec3 rise(vec2 p, float time, out float order) {
  float wide = max(uAspect, 0.9);
  vec2 center = vec2(0.05 * sin(time * 0.45) * wide, -0.7);
  vec2 radius = vec2(0.82 * wide, 0.64 * (1.0 + 0.04 * sin(time * 0.8)));
  float d = length((p - center) / radius);
  float soft = mix(0.6, 1.15, uSoftness);
  float t = clamp(pow(clamp(1.0 - d, 0.0, 1.0), soft) * 1.35, 0.0, 1.0);
  order = clamp((d - 0.2) * 1.3, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec3 eclipse(vec2 p, float time, out float order) {
  float fit = min(1.0, uAspect * 1.25);
  float r = 0.23 * fit * (1.0 + 0.015 * sin(time * 0.9));
  float angle = atan(p.y, p.x);
  float rays = noise(vec2(cos(angle), sin(angle)) * 2.2 + time * 0.08) * 0.8 + 0.6;
  float d = length(p) - r;
  float reach = mix(0.07, 0.15, uSoftness) * rays * fit;
  float t = smoothstep(-0.006, 0.006 + 0.02 * uSoftness, d) * exp(-max(d, 0.0) / reach);
  order = clamp(d * 2.0, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec4 tone(float t) {
  float x = smoothstep(0.3, 1.0, t) * float(uCount - 1);
  int index = int(floor(x));
  return vec4(mix(uRamp[index], uRamp[min(index + 1, uCount - 1)], fract(x)), smoothstep(0.0, 0.38, t));
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float time = uTime;
  vec2 q = p / uScale;
  vec2 warp = vec2(
    noise(q * 1.6 + uSeed + vec2(0.0, time * 0.3)),
    noise(q * 1.6 + uSeed.yx + vec2(4.3, -time * 0.24))
  ) - 0.5;
  q += warp * uFlow * (uShape == 3 ? 0.04 : 0.18);
  float order = 0.0;
  vec3 shape;
  if (uShape == 0) shape = horizon(q, time, order);
  else if (uShape == 1) shape = pinch(q, time, order);
  else if (uShape == 2) shape = rise(q, time, order);
  else shape = eclipse(q, time, order);

  float reveal = clamp((uIntro * 1.45 - order) / 0.45, 0.0, 1.0);
  reveal = reveal * reveal * (3.0 - 2.0 * reveal);

  float scramble = 0.0;
  for (int i = 0; i < 24; i++) {
    vec4 point = uTrail[i];
    if (point.z <= 0.0) continue;
    vec2 d = p - point.xy;
    scramble = max(scramble, point.z * exp(-dot(d, d) / (uRadius * uRadius)));
  }
  for (int i = 0; i < 4; i++) {
    vec4 c = uClicks[i];
    if (c.w <= 0.0) continue;
    float d = length(p - c.xy);
    if (uClickEffect == 1) {
      scramble = max(scramble, exp(-pow((d - c.z * 0.75) / 0.06, 2.0)) * c.w);
    } else if (uClickEffect == 2) {
      float size = 0.08 + 0.22 * (1.0 - exp(-c.z * 5.0));
      scramble = max(scramble, (1.0 - smoothstep(size * 0.6, size, d)) * c.w);
    }
  }
  vec2 t = clamp(shape.xy * mix(0.7, 1.0, reveal), 0.0, 1.0);
  vec4 mixed = mix(tone(t.x), tone(t.y), shape.z);
  vec3 color = encode(labToRgb(mixed.rgb));
  float alpha = mixed.a * reveal;
  float dither = (hash12(gl_FragCoord.xy + uFrame * 13.7) - 0.5) / 255.0;
  outColor = clamp(vec4(color * alpha + dither, alpha + dither), 0.0, 1.0);
  outAux = vec4(reveal, scramble, 0.0, 1.0);
}`;

const GLYPHS = `
uniform sampler2D uField;
uniform sampler2D uAux;
uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform vec2 uCell;
uniform vec2 uOffset;
uniform vec2 uAtlasGrid;
uniform float uCount;
uniform float uDensity;
uniform float uOpacity;
uniform float uFlicker;
uniform float uDepth;
uniform float uGlyphTime;
uniform float uSeedValue;
uniform float uLight;
${COMMON}
float sampleGlyph(float index, vec2 local, vec2 coord, float soft) {
  float column = mod(index, uAtlasGrid.x);
  float row = floor(index / uAtlasGrid.x);
  vec2 atlasUv = vec2((column + local.x) / uAtlasGrid.x, (row + 1.0 - local.y) / uAtlasGrid.y);
  vec2 continuous = coord / uAtlasGrid;
  float scale = exp2(soft);
  return textureGrad(uAtlas, atlasUv, dFdx(continuous) * scale, dFdy(continuous) * scale).a;
}

vec4 glyphAt(vec2 px) {
  vec2 coord = (px - uOffset) / uCell;
  vec2 cell = floor(coord);
  vec2 local = coord - cell;
  vec2 uv = clamp(((cell + 0.5) * uCell + uOffset) / uResolution, vec2(0.0), vec2(1.0));
  vec4 field = texture(uField, uv);
  vec4 aux = texture(uAux, uv);
  vec3 visible = uLight > 0.5 ? field.rgb + (1.0 - field.a) : field.rgb;
  float luma = dot(visible, vec3(0.2126, 0.7152, 0.0722));
  float value = uLight > 0.5 ? clamp((1.0 - luma) * 1.5, 0.0, 1.0) : luma;
  float pick = hash12(cell + uSeedValue * 7.31);
  float level = hash12(cell * 1.73 + 4.1 + uSeedValue);
  float tick = floor(uGlyphTime * 9.0 + level * 9.0);
  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * uFlicker * 0.4 + (level - 0.5) * 0.1;
  float tone = clamp(pow(value, 0.75) + wobble, 0.0, 1.0);
  float index = floor(tone * (uCount - 1.0) + 0.5);
  float decode = max(aux.g, 1.0 - aux.r);
  if (decode > 0.02) {
    float frame = floor(uGlyphTime * 20.0);
    if (hash12(cell * 3.7 + frame * 5.3) < decode * 1.25) index = 1.0 + floor(hash12(cell + frame * 1.37) * (uCount - 1.0));
  }
  float present = step(pick, uDensity * mix(1.0, 0.3 + tone * 1.1, 0.55));
  float cutoff = smoothstep(0.03, 0.1, value);
  float focus = step(hash12(cell * 0.71 + 9.2 + uSeedValue), uDepth);
  float coverage = sampleGlyph(index, local, coord, focus * 1.2);
  float alpha = uOpacity * present * cutoff * coverage * mix(1.0, 0.35 + 0.65 * level, 0.55) * (1.0 - focus * 0.5);
  if (uLight < 0.5) {
    vec3 light = field.rgb * 0.55 + vec3(0.03) * field.a;
    return vec4(light * alpha, 0.6 * field.a * alpha);
  }
  vec3 ink = visible * 0.8;
  return vec4(ink * alpha, alpha);
}
`;

const HALO = `#version 300 es
precision highp float;
uniform float uDownscale;
in vec2 vUv;
out vec4 outColor;
${GLYPHS}
void main() {
  outColor = glyphAt(gl_FragCoord.xy * uDownscale);
}`;

const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.2270270270;
  sum += texture(uSource, vUv + uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv - uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv + uStep * 3.2307692308) * 0.0702702703;
  sum += texture(uSource, vUv - uStep * 3.2307692308) * 0.0702702703;
  outColor = sum;
}`;

const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uHalo;
uniform float uGlow;
uniform float uGradient;
uniform float uGrain;
uniform float uFrame;
in vec2 vUv;
out vec4 outColor;
${GLYPHS}
void main() {
  vec4 base = texture(uField, vUv) * uGradient;
  vec4 glyph = glyphAt(gl_FragCoord.xy);
  vec4 halo = texture(uHalo, vUv) * uGlow;
  vec4 color;
  if (uLight < 0.5) {
    color = base + glyph + halo;
  } else {
    color = glyph + base * (1.0 - glyph.a);
    color += halo * 0.6 * (1.0 - color.a);
  }
  float grain = (hash12(gl_FragCoord.xy + uFrame * vec2(17.0, 59.0)) + hash12(gl_FragCoord.xy * 1.31 + uFrame * 7.0) - 1.0) * uGrain;
  float body = clamp(color.a, 0.0, 1.0);
  color.rgb += grain * (0.25 + body) * 0.5;
  color.a = clamp(color.a, 0.0, 1.0);
  color.rgb = clamp(color.rgb, 0.0, color.a);
  outColor = color;
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toLinear = value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

const toLab = ([r, g, b]) => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const link = (gl, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return { program, uniforms: {} };
};

const resolve = (gl, item) => {
  if (!gl.getProgramParameter(item.program, gl.LINK_STATUS)) return false;
  const count = gl.getProgramParameter(item.program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(item.program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    item.uniforms[name] = gl.getUniformLocation(item.program, name);
  }
  return true;
};

const createTarget = (gl, count) => {
  const textures = Array.from({ length: count }, () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  });
  return { textures, framebuffer: gl.createFramebuffer(), width: 0, height: 0 };
};

const sizeTarget = (gl, target, width, height) => {
  if (target.width === width && target.height === height) return;
  target.width = width;
  target.height = height;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
  target.textures.forEach((texture, i) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0);
  });
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

const buildAtlas = (gl, characters, fontFamily) => {
  const list = [...new Set([...characters].filter(char => char !== '\n' && char !== '\r'))];
  if (!list.length) list.push(' ');
  const font = `300 ${Math.round(ATLAS_CELL_H * FONT_SCALE)}px ${fontFamily}`;
  const columns = Math.min(ATLAS_COLUMNS, list.length);
  const rows = Math.ceil(list.length / columns);
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_CELL_W * columns;
  canvas.height = ATLAS_CELL_H * rows;
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#fff';
    list.forEach((char, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      context.fillText(char, column * ATLAS_CELL_W + ATLAS_CELL_W / 2, row * ATLAS_CELL_H + ATLAS_CELL_H / 2 + 3);
    });
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { texture, count: list.length, grid: [columns, rows] };
};

const GradientASCII = ({
  colors = DEFAULT_COLORS,
  shape = 'horizon',
  characters = DEFAULT_CHARACTERS,
  cellSize = 18,
  density = 0.8,
  glyphOpacity = 0.85,
  glow = 0.2,
  depthOfField = 0,
  flicker = 0.2,
  softness = 0.5,
  scale = 1,
  flow = 0.5,
  speed = 1,
  gradientOpacity = 0.9,
  grain = 0.08,
  variation = 0,
  mouseInteraction = true,
  scrambleRadius = 0.1,
  clickEffect = 'wave',
  intro = true,
  lightMode = false,
  fontFamily = DEFAULT_FONT,
  dpr,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const palette = (Array.isArray(colors) && colors.length ? colors : DEFAULT_COLORS).slice(0, MAX_COLORS);
  const settings = {
    colors: palette.length > 1 ? palette : [palette[0], palette[0]],
    shape: SHAPES[shape] ?? 0,
    characters: characters || DEFAULT_CHARACTERS,
    cellSize: clamp(cellSize, 6, 64),
    density: clamp(density, 0, 1),
    glyphOpacity: clamp(glyphOpacity, 0, 1),
    glow: clamp(glow, 0, 2),
    depthOfField: clamp(depthOfField, 0, 1),
    flicker: clamp(flicker, 0, 1),
    softness: clamp(softness, 0, 1),
    scale: clamp(scale, 0.4, 2.5),
    flow: clamp(flow, 0, 2),
    speed: Math.max(0, speed),
    gradientOpacity: clamp(gradientOpacity, 0, 1),
    grain: clamp(grain, 0, 0.4),
    variation: Math.max(0, variation),
    mouseInteraction,
    scrambleRadius: clamp(scrambleRadius, 0.02, 0.4),
    clickEffect: CLICK_EFFECTS[clickEffect] ?? 1,
    intro,
    lightMode,
    fontFamily: fontFamily || DEFAULT_FONT,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl) return undefined;

    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const field = link(gl, FIELD);
    const halo = link(gl, HALO);
    const blur = link(gl, BLUR);
    const composite = link(gl, COMPOSITE);
    if (!field || !halo || !blur || !composite) return undefined;
    const programs = [field, halo, blur, composite];
    if (!parallel && !programs.every(item => resolve(gl, item))) {
      programs.forEach(item => gl.deleteProgram(item.program));
      return undefined;
    }
    const vao = gl.createVertexArray();
    const fieldTarget = createTarget(gl, 2);
    const haloA = createTarget(gl, 1);
    const haloB = createTarget(gl, 1);

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colorCache = new Map();
    const parse = value => {
      const key = String(value);
      const cached = colorCache.get(key);
      if (cached) return cached;
      let rgb = [0, 0, 0];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = key;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(key, rgb);
      return rgb;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const ramp = new Float32Array(MAX_COLORS * 3);
    const clickData = new Float32Array(MAX_CLICKS * 4);
    const clicks = [];
    const trailData = new Float32Array(MAX_TRAIL * 4);
    const trail = [];
    const pointer = { x: 0, y: 0, inside: false };
    let atlas = null;
    let atlasKey = '';
    let paletteKey = '';
    let time = 0;
    let glyphTime = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let frameSeed = 0;
    let grainClock = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    let ready = !parallel;

    const linked = () =>
      !parallel || programs.every(item => gl.getProgramParameter(item.program, parallel.COMPLETION_STATUS_KHR));

    const release = () => {
      if (gl.isContextLost()) return;
      if (!ready && !linked()) {
        requestAnimationFrame(release);
        return;
      }
      programs.forEach(item => gl.deleteProgram(item.program));
    };

    const syncAtlas = () => {
      const s = settingsRef.current;
      const key = `${s.fontFamily}|${s.characters}`;
      if (key === atlasKey && atlas) return;
      atlasKey = key;
      if (atlas) gl.deleteTexture(atlas.texture);
      atlas = buildAtlas(gl, s.characters, s.fontFamily);
      document.fonts?.load?.(`300 64px ${s.fontFamily}`, s.characters).then(
        () => {
          if (disposed || atlasKey !== key) return;
          if (atlas) gl.deleteTexture(atlas.texture);
          atlas = buildAtlas(gl, s.characters, s.fontFamily);
          draw();
        },
        () => {}
      );
    };

    const syncPalette = () => {
      const s = settingsRef.current;
      const key = s.colors.join(',');
      if (key === paletteKey) return;
      paletteKey = key;
      s.colors.forEach((color, i) => ramp.set(toLab(parse(color)), i * 3));
    };

    const bindGlyphs = (program, width, height) => {
      if (!atlas) return;
      const s = settingsRef.current;
      const u = program.uniforms;
      const cellH = s.cellSize * view.ratio;
      const cellW = cellH * (ATLAS_CELL_W / ATLAS_CELL_H);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldTarget.textures[0]);
      gl.uniform1i(u.uField, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fieldTarget.textures[1]);
      gl.uniform1i(u.uAux, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, atlas.texture);
      gl.uniform1i(u.uAtlas, 2);
      gl.uniform2f(u.uResolution, width, height);
      gl.uniform2f(u.uCell, cellW, cellH);
      gl.uniform2f(
        u.uOffset,
        (width - Math.ceil(width / cellW) * cellW) / 2,
        (height - Math.ceil(height / cellH) * cellH) / 2
      );
      gl.uniform2f(u.uAtlasGrid, atlas.grid[0], atlas.grid[1]);
      gl.uniform1f(u.uCount, atlas.count);
      gl.uniform1f(u.uDensity, s.density);
      gl.uniform1f(u.uOpacity, s.glyphOpacity);
      gl.uniform1f(u.uFlicker, reduce ? 0 : s.flicker);
      gl.uniform1f(u.uDepth, s.depthOfField);
      gl.uniform1f(u.uGlyphTime, glyphTime);
      gl.uniform1f(u.uSeedValue, s.variation);
      gl.uniform1f(u.uLight, s.lightMode ? 1 : 0);
    };

    const draw = () => {
      if (!ready) return;
      const s = settingsRef.current;
      const aspect = view.width / view.height;
      syncAtlas();
      syncPalette();
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fieldTarget.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.viewport(0, 0, fieldTarget.width, fieldTarget.height);
      gl.useProgram(field.program);
      const fu = field.uniforms;
      gl.uniform1f(fu.uAspect, aspect);
      gl.uniform1f(fu.uTime, time);
      gl.uniform1i(fu.uShape, s.shape);
      gl.uniform3fv(fu.uRamp, ramp);
      gl.uniform1i(fu.uCount, s.colors.length);
      gl.uniform1f(fu.uScale, s.scale);
      gl.uniform1f(fu.uSoftness, s.softness);
      gl.uniform1f(fu.uFlow, s.flow);
      gl.uniform2f(fu.uSeed, s.variation * 3.17, s.variation * 1.91);
      gl.uniform4fv(fu.uTrail, trailData);
      gl.uniform1f(fu.uRadius, s.scrambleRadius);
      gl.uniform4fv(fu.uClicks, clickData);
      gl.uniform1i(fu.uClickEffect, s.clickEffect);
      gl.uniform1f(fu.uIntro, introClock);
      gl.uniform1f(fu.uFrame, frameSeed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const glowing = s.glow > 0.001;
      if (glowing) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloA.framebuffer);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        gl.viewport(0, 0, haloA.width, haloA.height);
        gl.useProgram(halo.program);
        bindGlyphs(halo, canvas.width, canvas.height);
        gl.uniform1f(halo.uniforms.uDownscale, canvas.width / haloA.width);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.useProgram(blur.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(blur.uniforms.uSource, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloB.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, haloA.textures[0]);
        gl.uniform2f(blur.uniforms.uStep, 1 / haloA.width, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloA.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, haloB.textures[0]);
        gl.uniform2f(blur.uniforms.uStep, 0, 1 / haloA.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(composite.program);
      bindGlyphs(composite, canvas.width, canvas.height);
      const cu = composite.uniforms;
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, haloA.textures[0]);
      gl.uniform1i(cu.uHalo, 3);
      gl.uniform1f(cu.uGlow, glowing ? s.glow : 0);
      gl.uniform1f(cu.uGradient, s.gradientOpacity);
      gl.uniform1f(cu.uGrain, s.grain);
      gl.uniform1f(cu.uFrame, frameSeed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      sizeTarget(
        gl,
        fieldTarget,
        Math.max(1, Math.round(canvas.width / 2)),
        Math.max(1, Math.round(canvas.height / 2))
      );
      const haloWidth = Math.max(1, Math.round(canvas.width / 4));
      const haloHeight = Math.max(1, Math.round(canvas.height / 4));
      sizeTarget(gl, haloA, haloWidth, haloHeight);
      sizeTarget(gl, haloB, haloWidth, haloHeight);
      draw();
      wake();
    };

    const updateInput = dt => {
      trail.forEach(point => {
        point.age += dt;
      });
      while (trail.length && trail[trail.length - 1].age > TRAIL_LIFE) trail.pop();
      for (let i = 0; i < MAX_TRAIL; i++) {
        const point = trail[i];
        if (!point) {
          trailData[i * 4 + 2] = 0;
          continue;
        }
        const k = 1 - point.age / TRAIL_LIFE;
        trailData.set([point.x, point.y, k * k, 0], i * 4);
      }
      clicks.forEach(click => {
        click.age += dt;
      });
      while (clicks.length && clicks[clicks.length - 1].age > CLICK_LIFE) clicks.pop();
      for (let i = 0; i < MAX_CLICKS; i++) {
        const click = clicks[i];
        if (!click) {
          clickData[i * 4 + 3] = 0;
          continue;
        }
        const k = click.age / CLICK_LIFE;
        const envelope = Math.min(1, click.age / 0.08) * (1 - k) * (1 - k);
        clickData.set([click.x, click.y, click.age, envelope], i * 4);
      }
    };

    const frame = now => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      if (!ready) {
        if (!gl.isContextLost() && !linked()) {
          raf = requestAnimationFrame(frame);
          return;
        }
        if (!programs.every(item => resolve(gl, item))) {
          dispose();
          return;
        }
        ready = true;
      }
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.001, 0.05) : 1 / 60;
      last = now;
      if (!reduce) {
        time += dt * s.speed * 0.5;
        glyphTime += dt * Math.max(s.speed, 0.15);
      }
      if (introClock < 1) introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      grainClock += dt;
      if (!reduce && grainClock > 1 / 24) {
        grainClock = 0;
        frameSeed = (frameSeed + 1) % 97;
      }
      updateInput(dt);
      draw();
      const busy = !reduce || introClock < 1 || clicks.length > 0 || trail.length > 0;
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf && !disposed && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      const aspect = rect.width / Math.max(1, rect.height);
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointer.x = (x - 0.5) * aspect;
      pointer.y = y - 0.5;
    };

    const onPointerMove = event => {
      locate(event);
      const s = settingsRef.current;
      if (!pointer.inside || !s.mouseInteraction || reduce) return;
      const head = trail[0];
      const gap = head ? Math.hypot(pointer.x - head.x, pointer.y - head.y) : Infinity;
      if (gap < TRAIL_STEP) return;
      if (head && head.age < 0.1) {
        const steps = Math.min(6, Math.floor(gap / (TRAIL_STEP * 2)));
        for (let i = 1; i <= steps; i++) {
          const k = i / (steps + 1);
          trail.unshift({ x: head.x + (pointer.x - head.x) * k, y: head.y + (pointer.y - head.y) * k, age: 0 });
        }
      }
      trail.unshift({ x: pointer.x, y: pointer.y, age: 0 });
      trail.length = Math.min(trail.length, MAX_TRAIL);
      wake();
    };

    const onPointerDown = event => {
      locate(event);
      const s = settingsRef.current;
      if (!pointer.inside || !s.clickEffect || reduce) return;
      clicks.unshift({ x: pointer.x, y: pointer.y, age: 0 });
      if (clicks.length > MAX_CLICKS) clicks.pop();
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    wakeRef.current = wake;

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
      [fieldTarget, haloA, haloB].forEach(target => {
        target.textures.forEach(texture => gl.deleteTexture(texture));
        gl.deleteFramebuffer(target.framebuffer);
      });
      if (atlas) gl.deleteTexture(atlas.texture);
      gl.deleteVertexArray(vao);
      if (canvas.isConnected) {
        release();
      } else {
        programs.forEach(item => gl.deleteProgram(item.program));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };

    return dispose;
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={`gradient-ascii-container${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      <canvas ref={canvasRef} className="gradient-ascii-canvas" aria-hidden="true" />
    </div>
  );
};

export default GradientASCII;

```

### Component CSS
```css
.gradient-ascii-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-ascii-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.

--------------------------------------------------------------------------------------
## Integrate the <LetterGlitch /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: LetterGlitch
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import LetterGlitch from './LetterGlitch';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LetterGlitch
    glitchColors={['#ffffff', '#61dca3']}
    glitchAmount={0.5}
    speed={1}
    flow={0.5}
    clickEffect="tear"
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| glitchColors | string[] | ['#ffffff', '#61dca3'] | Up to 8 colors that glitching letters light up in. Light mode defaults to dark ink tones. |
| baseColor | string | '#ffffff' | Color of the letters at rest. Light mode defaults to near black. |
| characters | string | 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789' | Characters to draw. Repeat a character to make it appear more often. |
| fontFamily | string | 'ui-monospace, ...' | CSS font family for the letters. Web fonts are drawn once they have loaded. |
| fontSize | number | 14 | Size of the letters in pixels. |
| spacing | number | 0.6 | Room around each letter relative to the font size. 0 packs them like lines of text. |
| density | number | 0.9 | Share of the grid that shows a letter at rest, from 0 to 1. Empty cells still flicker when they glitch. |
| baseOpacity | number | 0.16 | Opacity of the letters at rest, from 0 to 1. |
| glitchAmount | number | 0.5 | How often letters glitch, from 0 (never) to 1 (constantly). |
| speed | number | 1 | Tempo of the scrambling and glitches. 0 freezes the letters. |
| flow | number | 0.5 | Strength of the soft waves of light that drift across the letters, from 0 to 1. |
| smooth | boolean | true | Fades glitching letters in and out. When off, they flicker on and off instantly. |
| interactive | boolean | true | Lights up and scrambles the letters near the cursor, leaving a trail of glitches when it moves. |
| cursorRadius | number | 140 | Radius of the area around the cursor that reacts, in pixels. |
| clickEffect | 'tear' | 'burst' | 'none' | 'tear' | What a click does. Tear rips a horizontal glitch through the rows, burst sends glitches outward. |
| edgeFade | number | 0 | Fades the letters out toward the edges, from 0 to 0.5. |
| centerFade | number | 0 | Clears the letters behind the middle of the container to keep content readable, from 0 to 1. |
| intro | boolean | true | Boots the letters in with a flicker on mount. |
| lightMode | boolean | false | Switches the default colors to dark ink for light backgrounds. |
| backgroundColor | string | - | Paints an opaque background behind the letters. Leave it unset for a transparent canvas. |
| dpr | number | auto | Maximum device pixel ratio, capped at 2. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import './LetterGlitch.css';

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
const DEFAULT_FONT = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const DARK_COLORS = ['#ffffff', '#61dca3'];
const LIGHT_COLORS = ['#18181b', '#0f9f6e'];
const MAX_COLORS = 8;
const INTRO_SECONDS = 1.4;
const REST_RATE = 0.2;
const GLITCH_RATE = 0.1;
const MAX_WALKERS = 48;

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D uAtlas;
uniform sampler2D uState;
uniform ivec2 uCell;
uniform ivec2 uGrid;
uniform int uAtlasColumns;
uniform vec2 uResolution;
uniform vec2 uOrigin;
uniform vec3 uBase;
uniform float uBaseOpacity;
uniform vec3 uColors[8];
uniform float uEdge;
uniform float uCenter;
uniform vec2 uPointer;
uniform float uRadius;
uniform float uPresence;
uniform float uReveal;
uniform float uTime;
uniform float uFlow;
uniform float uFlowScale;
uniform vec4 uBackground;
out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) - uOrigin;
  ivec2 q = ivec2(floor(frag));
  ivec2 cell = q / uCell;
  vec4 color = vec4(0.0);
  if (all(greaterThanEqual(q, ivec2(0))) && all(lessThan(cell, uGrid))) {
    vec4 state = texelFetch(uState, cell, 0);
    int glyph = int(state.r * 255.0 + 0.5);
    ivec2 texel = ivec2(glyph % uAtlasColumns, glyph / uAtlasColumns) * uCell + (q - cell * uCell);
    float coverage = texelFetch(uAtlas, texel, 0).a;
    if (coverage > 0.0) {
      vec2 center = vec2(cell * uCell) + vec2(uCell) * 0.5 + uOrigin;
      float mask = 1.0;
      if (uEdge > 0.0) {
        vec2 edge = min(center, uResolution - center) / uEdge;
        mask = smoother(edge.x) * smoother(edge.y);
      }
      if (uCenter > 0.0) {
        vec2 room = max(abs(center - uResolution * 0.5) - uResolution * vec2(0.3, 0.24), 0.0);
        float soft = min(uResolution.x, uResolution.y) * 0.24;
        mask *= 1.0 - uCenter * (1.0 - smoother(length(room) / soft));
      }
      float seed = hash(vec2(cell) + 17.0);
      float rest = state.g * uBaseOpacity * (0.8 + 0.2 * sin(uTime * (0.5 + 1.2 * seed) + seed * 40.0));
      if (uFlow > 0.0) {
        vec2 p = center / uFlowScale;
        float n = 0.65 * noise(p + vec2(uTime * 0.05, uTime * 0.03)) + 0.35 * noise(p * 2.03 - vec2(uTime * 0.04, -uTime * 0.06));
        rest *= mix(1.0, 0.1 + 1.7 * smoothstep(0.25, 0.8, n), uFlow);
      }
      if (uPresence > 0.0) {
        float d = length(center - uPointer) / uRadius;
        float f = clamp(1.0 - d * d, 0.0, 1.0);
        rest = mix(rest, max(rest, uReveal * step(0.004, state.g)), f * f * uPresence);
      }
      float heat = state.b;
      rest = min(rest, 1.0) * (1.0 - heat);
      vec3 tint = uColors[int(state.a * 255.0 + 0.5)];
      float weight = coverage * mask;
      color = vec4((uBase * rest + tint * heat) * weight, (rest + heat) * weight);
    }
  }
  outColor = color + uBackground * (1.0 - color.a);
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoother = value => {
  const x = clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = gl => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
};

const LetterGlitch = ({
  glitchColors,
  baseColor,
  characters = DEFAULT_CHARACTERS,
  fontFamily = DEFAULT_FONT,
  fontSize = 14,
  spacing = 0.6,
  density = 0.9,
  baseOpacity = 0.16,
  glitchAmount = 0.5,
  speed = 1,
  smooth = true,
  interactive = true,
  cursorRadius = 140,
  clickEffect = 'tear',
  flow = 0.5,
  edgeFade = 0,
  centerFade = 0,
  intro = true,
  lightMode = false,
  backgroundColor,
  dpr,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const customColors = Array.isArray(glitchColors) && glitchColors.length ? glitchColors : null;
  const settings = {
    colors: (customColors || (lightMode ? LIGHT_COLORS : DARK_COLORS)).slice(0, MAX_COLORS),
    baseColor: baseColor || (lightMode ? '#18181b' : '#ffffff'),
    characters: characters || DEFAULT_CHARACTERS,
    fontFamily: fontFamily || DEFAULT_FONT,
    fontSize: clamp(fontSize, 6, 96),
    spacing: clamp(spacing, 0, 2),
    density: clamp(density, 0, 1),
    baseOpacity: clamp(baseOpacity, 0, 1),
    glitchAmount: clamp(glitchAmount, 0, 1),
    speed: Math.max(0, speed),
    smooth,
    interactive,
    cursorRadius: Math.max(0, cursorRadius),
    clickEffect,
    flow: clamp(flow, 0, 1),
    edgeFade: clamp(edgeFade, 0, 0.5),
    centerFade: clamp(centerFade, 0, 1),
    intro,
    backgroundColor,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl) return undefined;

    const program = link(gl);
    if (!program) return undefined;
    const u = program.uniforms;
    const vao = gl.createVertexArray();
    const makeTexture = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };
    const atlasTexture = makeTexture();
    const stateTexture = makeTexture();
    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const atlas = document.createElement('canvas');
    const atlasContext = atlas.getContext('2d');
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!atlasContext) return undefined;

    const colorCache = new Map();
    const parse = value => {
      const key = String(value);
      const cached = colorCache.get(key);
      if (cached) return cached;
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#ffffff';
        probe.fillStyle = key;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(key, rgb);
      return rgb;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const grid = { cols: 0, rows: 0, cellW: 0, cellH: 0, originX: 0, originY: 0, atlasColumns: 1 };
    const pointer = { x: 0, y: 0, sx: 0, sy: 0, inside: false, presence: 0, stir: 0, fresh: true };
    const walkers = [];
    const palette = new Float32Array(MAX_COLORS * 3);
    const loadedFonts = new Set();
    let pool = [0];
    let typeKey = '';
    let paletteKey = '';
    let colorCount = 1;
    let count = 0;
    let data = new Uint8Array(0);
    let heat = new Float32Array(0);
    let peak = new Float32Array(0);
    let hold = new Float32Array(0);
    let fade = new Float32Array(0);
    let wait = new Float32Array(0);
    let delay = new Float32Array(0);
    let luck = new Float32Array(0);
    let level = new Float32Array(0);
    let born = new Float32Array(0);
    let slot = new Int32Array(0);
    let active = new Int32Array(0);
    let activeCount = 0;
    let introLeft = settingsRef.current.intro && !reduce;
    let clock = 0;
    let time = 0;
    let density = -1;
    let restCarry = 0;
    let glitchCarry = 0;
    let cursorCarry = 0;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;
    let alive = true;

    const randomGlyph = () => pool[(Math.random() * pool.length) | 0];
    const randomColor = () => (Math.random() * colorCount) | 0;

    const restValue = (i, appear = 1) =>
      luck[i] < settingsRef.current.density ? Math.round(level[i] * 255 * appear) : 0;

    const cellAt = (x, y) => {
      const c = Math.floor((x - grid.originX) / grid.cellW);
      const r = Math.floor((y - grid.originY) / grid.cellH);
      if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) return -1;
      return r * grid.cols + c;
    };

    const ignite = (i, strength, holdTime, fadeTime, color, after = 0) => {
      if (slot[i] < 0) {
        slot[i] = activeCount;
        active[activeCount++] = i;
        heat[i] = 0;
        hold[i] = holdTime;
        peak[i] = strength;
        fade[i] = fadeTime;
        wait[i] = 0;
        delay[i] = after;
        data[i * 4 + 3] = color;
        return;
      }
      if (heat[i] < 0.15) data[i * 4 + 3] = color;
      peak[i] = hold[i] > 0 ? Math.max(peak[i], strength) : strength;
      hold[i] = Math.max(hold[i], holdTime);
      fade[i] = Math.max(fade[i], fadeTime);
      delay[i] = Math.min(delay[i], after);
    };

    const release = k => {
      const i = active[k];
      const moved = active[--activeCount];
      active[k] = moved;
      slot[moved] = k;
      slot[i] = -1;
      heat[i] = 0;
      data[i * 4 + 2] = 0;
    };

    const buildType = () => {
      const s = settingsRef.current;
      const size = s.fontSize * view.ratio;
      const font = `${size}px ${s.fontFamily}`;
      const chars = Array.from(s.characters);
      const unique = Array.from(new Set(chars)).slice(0, 256);
      atlasContext.font = font;
      let advance = 1;
      unique.forEach(char => {
        advance = Math.max(advance, atlasContext.measureText(char).width);
      });
      const metrics = atlasContext.measureText('M');
      const cellW = Math.max(2, Math.ceil(advance + size * s.spacing));
      const cellH = Math.max(2, Math.ceil(size * (0.95 + s.spacing)));
      const columns = Math.max(1, Math.min(unique.length, Math.floor(maxSize / cellW)));
      atlas.width = columns * cellW;
      atlas.height = Math.ceil(unique.length / columns) * cellH;
      atlasContext.font = font;
      atlasContext.textAlign = 'center';
      atlasContext.textBaseline = 'alphabetic';
      atlasContext.fillStyle = '#ffffff';
      const baseline = cellH / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      unique.forEach((char, i) => {
        atlasContext.fillText(char, (i % columns) * cellW + cellW / 2, Math.floor(i / columns) * cellH + baseline);
      });
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      const lookup = new Map(unique.map((char, i) => [char, i]));
      const nextPool = chars.map(char => lookup.get(char)).filter(index => index !== undefined);
      const charsChanged = nextPool.length !== pool.length || nextPool.some((index, i) => index !== pool[i]);
      pool = nextPool.length ? nextPool : [0];
      const resized = cellW !== grid.cellW || cellH !== grid.cellH;
      grid.cellW = cellW;
      grid.cellH = cellH;
      grid.atlasColumns = columns;
      if (!loadedFonts.has(font) && document.fonts?.load) {
        loadedFonts.add(font);
        document.fonts
          .load(font, s.characters)
          .then(() => {
            if (!alive) return;
            typeKey = '';
            wake();
          })
          .catch(() => {});
      }
      return { resized, charsChanged };
    };

    const birthTime = (c, r, cols, rows) => {
      const dx = (c + 0.5) / cols - 0.5;
      const dy = (r + 0.5) / rows - 0.5;
      const radial = Math.min(1, Math.hypot(dx, dy * 0.8) * 1.6);
      return INTRO_SECONDS * (0.3 * radial + 0.7 * Math.random() ** 1.3);
    };

    const buildGrid = () => {
      const cols = Math.ceil(canvas.width / grid.cellW) + 1;
      const rows = Math.ceil(canvas.height / grid.cellH) + 1;
      grid.originX = Math.floor((canvas.width - cols * grid.cellW) / 2);
      grid.originY = Math.floor((canvas.height - rows * grid.cellH) / 2);
      if (cols === grid.cols && rows === grid.rows) return;
      const n = cols * rows;
      const nextData = new Uint8Array(n * 4);
      const nextLuck = new Float32Array(n);
      const nextLevel = new Float32Array(n);
      const nextBorn = new Float32Array(n);
      const shiftC = Math.floor((grid.cols - cols) / 2);
      const shiftR = Math.floor((grid.rows - rows) / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const oc = c + shiftC;
          const or = r + shiftR;
          if (oc >= 0 && or >= 0 && oc < grid.cols && or < grid.rows) {
            const j = or * grid.cols + oc;
            nextData[i * 4] = data[j * 4];
            nextData[i * 4 + 1] = data[j * 4 + 1];
            nextLuck[i] = luck[j];
            nextLevel[i] = level[j];
            nextBorn[i] = born[j];
          } else {
            nextData[i * 4] = randomGlyph();
            nextLuck[i] = Math.random();
            nextLevel[i] = 0.55 + 0.45 * Math.random();
            nextBorn[i] = introLeft ? birthTime(c, r, cols, rows) : -1;
          }
        }
      }
      grid.cols = cols;
      grid.rows = rows;
      count = n;
      data = nextData;
      luck = nextLuck;
      level = nextLevel;
      born = nextBorn;
      heat = new Float32Array(n);
      peak = new Float32Array(n);
      hold = new Float32Array(n);
      fade = new Float32Array(n);
      wait = new Float32Array(n);
      delay = new Float32Array(n);
      slot = new Int32Array(n).fill(-1);
      active = new Int32Array(n);
      activeCount = 0;
      walkers.length = 0;
      for (let i = 0; i < n; i++) data[i * 4 + 1] = born[i] >= 0 ? 0 : restValue(i);
      density = settingsRef.current.density;
      gl.bindTexture(gl.TEXTURE_2D, stateTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      dirty = false;
    };

    const syncType = () => {
      const s = settingsRef.current;
      const key = `${s.fontSize * view.ratio}|${s.fontFamily}|${s.spacing}|${s.characters}`;
      if (key === typeKey) return;
      typeKey = key;
      const { resized, charsChanged } = buildType();
      if (resized || !grid.cols) buildGrid();
      if (charsChanged) {
        for (let i = 0; i < count; i++) data[i * 4] = randomGlyph();
        dirty = true;
      }
    };

    const syncPalette = () => {
      const s = settingsRef.current;
      const key = s.colors.join(',');
      if (key === paletteKey) return;
      paletteKey = key;
      colorCount = Math.max(1, s.colors.length);
      for (let i = 0; i < MAX_COLORS; i++) {
        const rgb = parse(s.colors[Math.min(i, colorCount - 1)] ?? '#ffffff');
        palette[i * 3] = rgb[0];
        palette[i * 3 + 1] = rgb[1];
        palette[i * 3 + 2] = rgb[2];
      }
      for (let i = 0; i < count; i++) {
        if (data[i * 4 + 3] >= colorCount) data[i * 4 + 3] = randomColor();
      }
      dirty = true;
    };

    const addWalker = walker => {
      if (walkers.length < MAX_WALKERS) walkers.push({ carry: 0, after: 0, wiggle: 0, branch: 0, ...walker });
    };

    const spawnTear = (x, y) => {
      const center = cellAt(x, y);
      if (center < 0) return;
      const r0 = Math.floor(center / grid.cols);
      const width = grid.cols * grid.cellW;
      for (let dr = -2; dr <= 2; dr++) {
        const r = r0 + dr;
        if (r < 0 || r >= grid.rows) continue;
        const weight = 1 - Math.abs(dr) / 3;
        if (dr !== 0 && Math.random() > 0.3 + 0.6 * weight) continue;
        const color = randomColor();
        const rowY = grid.originY + (r + 0.5) * grid.cellH;
        const shift = (Math.random() - 0.5) * 6 * grid.cellW * (1 - weight);
        [0, Math.PI].forEach(angle => {
          const life = width * (0.12 + 0.5 * weight * (0.4 + 0.6 * Math.random()));
          addWalker({
            x: x + shift,
            y: rowY,
            angle,
            life,
            span: life,
            speed: (2200 + Math.random() * 1200) * view.ratio,
            after: Math.abs(dr) * 0.035 + Math.random() * 0.03,
            color
          });
        });
      }
    };

    const spawnRays = (x, y) => {
      const reach = Math.min(view.width, view.height) * view.ratio;
      const rays = 5 + ((Math.random() * 3) | 0);
      const turn = Math.random() * Math.PI * 2;
      for (let k = 0; k < rays; k++) {
        const life = reach * (0.25 + Math.random() * 0.3);
        addWalker({
          x,
          y,
          angle: turn + (k / rays) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
          life,
          span: life,
          speed: (700 + Math.random() * 400) * view.ratio,
          wiggle: 0.2,
          branch: 0.03,
          color: randomColor()
        });
      }
    };

    const spawnBurst = (x, y) => {
      const center = cellAt(x, y);
      if (center < 0) return;
      ignite(center, 1, 0.08, 0.8, randomColor());
      if (settingsRef.current.clickEffect === 'burst') spawnRays(x, y);
      else spawnTear(x, y);
    };

    const stepWalkers = dt => {
      for (let k = walkers.length - 1; k >= 0; k--) {
        const w = walkers[k];
        if (w.after > 0) {
          w.after -= dt;
          continue;
        }
        const step = Math.max(
          1,
          Math.abs(Math.cos(w.angle)) * grid.cellW + Math.abs(Math.sin(w.angle)) * grid.cellH * 0.6
        );
        w.carry += w.speed * dt;
        while (w.carry >= step && w.life > 0) {
          w.carry -= step;
          w.life -= step;
          w.angle += (Math.random() - 0.5) * w.wiggle;
          w.x += Math.cos(w.angle) * step;
          w.y += Math.sin(w.angle) * step;
          const i = cellAt(w.x, w.y);
          if (i < 0) {
            w.life = 0;
            break;
          }
          const left = w.life / w.span;
          ignite(i, 0.5 + 0.5 * left, 0.03 + Math.random() * 0.05, 0.5 + 0.5 * left, w.color);
          if (w.branch && Math.random() < w.branch) {
            const side = Math.random() < 0.5 ? -1 : 1;
            const life = w.life * (0.45 + Math.random() * 0.3);
            addWalker({
              x: w.x,
              y: w.y,
              angle: w.angle + side * (0.5 + Math.random() * 0.5),
              life,
              span: w.span,
              speed: w.speed,
              wiggle: w.wiggle,
              color: w.color
            });
          }
        }
        if (w.life <= 0) walkers.splice(k, 1);
      }
    };

    const ambient = dt => {
      const s = settingsRef.current;
      if (reduce || s.speed <= 0 || !count) return;
      restCarry += count * REST_RATE * s.speed * dt;
      let changes = Math.min(count, restCarry | 0);
      restCarry -= changes;
      while (changes-- > 0) {
        const i = (Math.random() * count) | 0;
        if (slot[i] < 0) {
          data[i * 4] = randomGlyph();
          dirty = true;
        }
      }
      const tempo = Math.max(s.speed, 0.2);
      glitchCarry += count * s.glitchAmount ** 1.6 * GLITCH_RATE * s.speed * dt;
      let events = Math.min(count, glitchCarry | 0);
      glitchCarry -= events;
      while (events-- > 0) {
        const i = (Math.random() * count) | 0;
        const color = randomColor();
        const strength = 0.45 + 0.55 * Math.random();
        const holdTime = (0.04 + Math.random() * 0.26) / tempo;
        const fadeTime = (0.45 + Math.random() * 0.6) / tempo;
        const roll = Math.random();
        if (roll < 0.24) {
          const c = i % grid.cols;
          const long = roll < 0.015;
          const length = Math.min(
            grid.cols - c,
            long ? 10 + ((Math.random() * 24) | 0) : 2 + ((Math.random() * 7) | 0)
          );
          const pace = (long ? 0.012 : 0.028) / tempo;
          for (let k = 0; k < length; k++) ignite(i + k, strength, holdTime, fadeTime, color, k * pace);
        } else {
          ignite(i, strength, holdTime, fadeTime, color);
        }
      }
    };

    const excite = dt => {
      const s = settingsRef.current;
      if (pointer.presence < 0.02 || reduce || !count) return;
      const radius = s.cursorRadius * view.ratio;
      if (radius < 1) return;
      const c0 = Math.max(0, Math.floor((pointer.sx - radius - grid.originX) / grid.cellW));
      const c1 = Math.min(grid.cols - 1, Math.floor((pointer.sx + radius - grid.originX) / grid.cellW));
      const r0 = Math.max(0, Math.floor((pointer.sy - radius - grid.originY) / grid.cellH));
      const r1 = Math.min(grid.rows - 1, Math.floor((pointer.sy + radius - grid.originY) / grid.cellH));
      const chance = pointer.presence * (3 + 9 * pointer.stir) * dt;
      for (let r = r0; r <= r1; r++) {
        const dy = (grid.originY + (r + 0.5) * grid.cellH - pointer.sy) / radius;
        for (let c = c0; c <= c1; c++) {
          const dx = (grid.originX + (c + 0.5) * grid.cellW - pointer.sx) / radius;
          const d = dx * dx + dy * dy;
          if (d >= 1) continue;
          const i = r * grid.cols + c;
          if (slot[i] < 0 && Math.random() < (1 - d) * (1 - d) * chance) {
            data[i * 4] = randomGlyph();
            dirty = true;
          }
        }
      }
      const cells = (Math.PI * radius * radius) / (grid.cellW * grid.cellH);
      cursorCarry += cells * pointer.presence * (0.15 + 4 * pointer.stir) * dt;
      let sparks = Math.min(512, cursorCarry | 0);
      cursorCarry -= sparks;
      while (sparks-- > 0) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.sqrt(Math.random());
        const falloff = (1 - distance * distance) ** 2;
        if (Math.random() > falloff) continue;
        const i = cellAt(
          pointer.sx + Math.cos(angle) * distance * radius,
          pointer.sy + Math.sin(angle) * distance * radius
        );
        if (i < 0) continue;
        ignite(
          i,
          (0.3 + 0.7 * Math.random()) * (0.45 + 0.55 * pointer.stir),
          0.02 + Math.random() * 0.08,
          0.35 + Math.random() * 0.4,
          randomColor()
        );
      }
    };

    const settle = dt => {
      const s = settingsRef.current;
      const tempo = Math.max(s.speed, 0.5);
      const attack = 1 - Math.exp(-dt / 0.05);
      for (let k = 0; k < activeCount; ) {
        const i = active[k];
        if (delay[i] > 0) {
          delay[i] -= dt;
          k++;
          continue;
        }
        let h = heat[i];
        if (hold[i] > 0) {
          hold[i] -= dt;
          h = s.smooth ? h + (peak[i] - h) * attack : peak[i];
        } else {
          h = s.smooth ? h * Math.exp((-dt * 4) / Math.max(fade[i], 0.05)) : 0;
        }
        if (h < 0.012 && hold[i] <= 0) {
          release(k);
          dirty = true;
          continue;
        }
        heat[i] = h;
        wait[i] -= dt;
        if (wait[i] <= 0) {
          data[i * 4] = randomGlyph();
          wait[i] = ((0.045 + 0.45 * (1 - h) * (1 - h)) * (0.6 + 0.8 * Math.random())) / tempo;
        }
        data[i * 4 + 2] = Math.round(h * 255);
        dirty = true;
        k++;
      }
    };

    const reveal = dt => {
      if (!introLeft) return;
      const s = settingsRef.current;
      let pending = false;
      for (let i = 0; i < count; i++) {
        const t = born[i];
        if (t < 0) continue;
        const age = clock - t;
        if (age < 0) {
          pending = true;
          continue;
        }
        if (age < dt && Math.random() < (luck[i] < s.density ? 0.45 : 0.12)) {
          ignite(i, 0.4 + 0.5 * Math.random(), 0.02, 0.35 + Math.random() * 0.35, randomColor());
        }
        const appear = s.smooth ? smoother(age / 0.35) : 1;
        data[i * 4 + 1] = restValue(i, appear);
        if (appear >= 1) born[i] = -1;
        else pending = true;
      }
      dirty = true;
      if (!pending) introLeft = false;
    };

    const frame = now => {
      raf = 0;
      if (resizePending) {
        resizePending = false;
        applyResize();
      }
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
      last = now;
      clock += dt;
      if (!reduce) time += dt * s.speed;
      syncType();
      syncPalette();
      if (s.density !== density) {
        density = s.density;
        for (let i = 0; i < count; i++) if (born[i] < 0) data[i * 4 + 1] = restValue(i);
        dirty = true;
      }
      const goal = s.interactive && pointer.inside && !reduce ? 1 : 0;
      pointer.presence += (goal - pointer.presence) * (1 - Math.exp(-dt / 0.25));
      if (Math.abs(goal - pointer.presence) < 0.002) pointer.presence = goal;
      const px = pointer.sx;
      const py = pointer.sy;
      const follow = 1 - Math.exp(-dt / 0.07);
      pointer.sx += (pointer.x - pointer.sx) * follow;
      pointer.sy += (pointer.y - pointer.sy) * follow;
      const moved = Math.hypot(pointer.sx - px, pointer.sy - py) / view.ratio / dt;
      pointer.stir += (clamp(moved / 1400, 0, 1) - pointer.stir) * (1 - Math.exp(-dt / 0.12));
      if (pointer.stir < 0.001) pointer.stir = 0;
      reveal(dt);
      ambient(dt);
      excite(dt);
      stepWalkers(dt);
      settle(dt);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.BLEND);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, stateTexture);
      if (dirty) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, grid.cols, grid.rows, gl.RGBA, gl.UNSIGNED_BYTE, data);
        dirty = false;
      }
      gl.uniform1i(u.uState, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
      gl.uniform1i(u.uAtlas, 0);
      gl.uniform2i(u.uCell, grid.cellW, grid.cellH);
      gl.uniform2i(u.uGrid, grid.cols, grid.rows);
      gl.uniform1i(u.uAtlasColumns, grid.atlasColumns);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform2f(u.uOrigin, grid.originX, grid.originY);
      gl.uniform3fv(u.uBase, parse(s.baseColor));
      gl.uniform1f(u.uBaseOpacity, s.baseOpacity);
      gl.uniform3fv(u.uColors, palette);
      gl.uniform1f(u.uEdge, s.edgeFade * Math.min(canvas.width, canvas.height));
      gl.uniform1f(u.uCenter, s.centerFade);
      gl.uniform2f(u.uPointer, pointer.sx, pointer.sy);
      gl.uniform1f(u.uRadius, Math.max(1, s.cursorRadius * view.ratio));
      gl.uniform1f(u.uPresence, pointer.presence);
      gl.uniform1f(u.uReveal, Math.min(1, s.baseOpacity * 3.5));
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uFlow, s.flow);
      gl.uniform1f(u.uFlowScale, Math.max(canvas.width, canvas.height) * 0.32);
      if (s.backgroundColor) {
        const [r, g, b] = parse(s.backgroundColor);
        gl.uniform4f(u.uBackground, r, g, b, 1);
      } else {
        gl.uniform4f(u.uBackground, 0, 0, 0, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const busy =
        (!reduce && s.speed > 0) ||
        activeCount > 0 ||
        walkers.length > 0 ||
        introLeft ||
        (pointer.presence !== 0 && pointer.presence !== 1) ||
        pointer.stir > 0;
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    let resizePending = false;
    const applyResize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      syncType();
      if (grid.cols) buildGrid();
    };

    const resize = () => {
      resizePending = true;
      wake();
    };

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x * view.ratio;
      pointer.y = y * view.ratio;
      if (pointer.fresh || pointer.presence < 0.02) {
        pointer.sx = pointer.x;
        pointer.sy = pointer.y;
        pointer.fresh = false;
      }
    };

    const onPointerMove = event => {
      locate(event);
      wake();
    };

    const onPointerDown = event => {
      locate(event);
      const s = settingsRef.current;
      if (!pointer.inside || s.clickEffect === 'none' || reduce || !count) return;
      spawnBurst(pointer.x, pointer.y);
      wake();
    };

    const onPointerUp = event => {
      if (event.pointerType !== 'mouse') pointer.inside = false;
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const onFonts = () => {
      typeKey = '';
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    document.fonts?.addEventListener?.('loadingdone', onFonts);
    resize();
    wakeRef.current = wake;

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      document.fonts?.removeEventListener?.('loadingdone', onFonts);
      gl.deleteTexture(atlasTexture);
      gl.deleteTexture(stateTexture);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program.program);
      if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div ref={containerRef} className={`letter-glitch${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="letter-glitch-canvas" aria-hidden="true" />
    </div>
  );
};

export default LetterGlitch;

```

### Component CSS
```css
.letter-glitch {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.letter-glitch-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
--------------------------------------------------------------------------------------
## Integrate the <Crosshair /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: Crosshair
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import { useRef } from 'react';
import Crosshair from './Crosshair';

const Hero = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: 400 }}>
      <Crosshair
        containerRef={containerRef}
        color="#ffffff"
        targetEffect="lock"
        thickness={1}
        opacity={0.85}
        smoothing={0.35}
        showCoordinates
      />
      <a href="/docs">Read the docs</a>
    </div>
  );
};
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| color | string | '#ffffff' | Color of the lines, labels and brackets. |
| containerRef | RefObject<HTMLElement> | null | Keeps the crosshair inside this element, which needs a position other than static. Without it the crosshair covers the whole viewport. |
| thickness | number | 1 | Line thickness in px. |
| opacity | number | 0.85 | Opacity of everything the crosshair draws. |
| lineStyle | 'solid' | 'dashed' | 'dotted' | 'solid' | Stroke style of the two lines. |
| gap | number | 0 | Empty space in px left around the pointer where the lines would cross. |
| fade | number | 0 | How much the lines fade out toward the edges, from 0 to 1. |
| smoothing | number | 0.35 | How far the lines trail behind the pointer. 0 sticks to it. |
| showCoordinates | boolean | true | Shows the pointer position where the lines meet the edges, and the size of a locked target. |
| targetEffect | 'lock' | 'glitch' | 'none' | 'lock' | What happens over a target. Lock frames it with corner brackets and measures it, glitch shakes the lines like a bad signal. |
| targetSelector | string | 'a, button, [data-crosshair-target]' | CSS selector for the elements the crosshair reacts to. |
| clickPulse | boolean | true | Sends a ring out from the pointer on every click or tap. |
| hideCursor | boolean | false | Hides the system cursor inside the crosshair area and marks the pointer with a dot instead. |
| blendMode | 'normal' | 'difference' | 'normal' | Difference inverts whatever is under the lines, so they stay visible on any background. |
| className | string | '' | Extra class names for the canvas. |
| style | CSSProperties | - | Inline styles for the canvas. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';

const LINE_STYLES = ['solid', 'dashed', 'dotted'];
const EFFECTS = ['lock', 'glitch', 'none'];
const FONT = '500 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const HIDDEN = 'crosshair-cursor-hidden';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toRgb = (ctx, color) => {
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  const value = String(ctx.fillStyle);
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1, 7), 16);
    return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255, a: 1 };
  }
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255, 1];
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
};

const Crosshair = ({
  color = '#ffffff',
  containerRef = null,
  thickness = 1,
  opacity = 0.85,
  lineStyle = 'solid',
  gap = 0,
  fade = 0,
  smoothing = 0.35,
  showCoordinates = true,
  targetEffect = 'lock',
  targetSelector = 'a, button, [data-crosshair-target]',
  clickPulse = true,
  hideCursor = false,
  blendMode = 'normal',
  className = '',
  style
}) => {
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const settings = {
    color,
    thickness: clamp(thickness, 0.5, 8),
    opacity: clamp(opacity, 0, 1),
    lineStyle: LINE_STYLES.includes(lineStyle) ? lineStyle : 'solid',
    gap: Math.max(0, gap),
    fade: clamp(fade, 0, 1),
    smoothing: clamp(smoothing, 0, 1),
    showCoordinates,
    targetEffect: EFFECTS.includes(targetEffect) ? targetEffect : 'lock',
    targetSelector,
    clickPulse,
    hideCursor
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    const host = containerRef?.current ?? null;
    const scope = host ?? window;
    const cursorOwner = host ?? document.documentElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      clientX: 0,
      clientY: 0,
      inside: false,
      seen: false,
      presence: 0,
      glitch: 0,
      target: null,
      lock: { x: 0, y: 0, w: 0, h: 0, alpha: 0 },
      pulses: []
    };
    const size = { w: 0, h: 0, dpr: 1 };
    let ink = toRgb(ctx, settingsRef.current.color);
    let inkSource = settingsRef.current.color;
    let raf = 0;
    let last = 0;
    let alive = true;

    let resizePending = false;
    const applyResize = () => {
      const rect = canvas.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * size.dpr));
      canvas.height = Math.max(1, Math.round(rect.height * size.dpr));
    };

    const resize = () => {
      resizePending = true;
      wake();
    };

    const rgba = alpha => `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${clamp(alpha * ink.a, 0, 1)})`;
    const crisp = (value, width) => {
      const device = Math.round(width * size.dpr);
      return (Math.round(value * size.dpr) + (device % 2 ? 0.5 : 0)) / size.dpr;
    };

    const tag = (text, x, y, align) => {
      ctx.font = FONT;
      const width = ctx.measureText(text).width + 10;
      const height = 16;
      let left = align === 'center' ? x - width / 2 : x;
      let top = align === 'middle' ? y - height / 2 : y;
      left = clamp(left, 4, size.w - width - 4);
      top = clamp(top, 4, size.h - height - 4);
      const light = ink.r * 0.2126 + ink.g * 0.7152 + ink.b * 0.0722 > 150;
      ctx.fillStyle = rgba(1);
      ctx.beginPath();
      ctx.roundRect(left, top, width, height, 3);
      ctx.fill();
      ctx.fillStyle = light ? '#0a0a0a' : '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, left + width / 2, top + height / 2 + 0.5);
    };

    const segment = (x1, y1, x2, y2, horizontal, s) => {
      const length = horizontal ? x2 - x1 : y2 - y1;
      if (length <= 0) return;
      if (s.fade > 0) {
        const gradient = horizontal
          ? ctx.createLinearGradient(0, 0, size.w, 0)
          : ctx.createLinearGradient(0, 0, 0, size.h);
        const at = clamp(horizontal ? state.x / size.w : state.y / size.h, 0.001, 0.999);
        gradient.addColorStop(0, rgba(1 - s.fade));
        gradient.addColorStop(at, rgba(1));
        gradient.addColorStop(1, rgba(1 - s.fade));
        ctx.strokeStyle = gradient;
      } else {
        ctx.strokeStyle = rgba(1);
      }
      ctx.beginPath();
      if (state.glitch > 0.01) {
        const pieces = Math.max(4, Math.round(length / 28));
        for (let i = 0; i < pieces; i++) {
          const jitter = (Math.random() - 0.5) * 14 * state.glitch;
          const from = i / pieces;
          const to = (i + 1) / pieces;
          if (horizontal) {
            ctx.moveTo(x1 + length * from, y1 + jitter);
            ctx.lineTo(x1 + length * to, y1 + jitter);
          } else {
            ctx.moveTo(x1 + jitter, y1 + length * from);
            ctx.lineTo(x1 + jitter, y1 + length * to);
          }
        }
      } else {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    };

    const brackets = (x, y, w, h, alpha) => {
      const arm = Math.min(14, w / 3, h / 3);
      ctx.strokeStyle = rgba(alpha);
      ctx.lineWidth = Math.max(1.5, settingsRef.current.thickness);
      ctx.setLineDash([]);
      ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(x, y + arm);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arm, y);
      ctx.moveTo(x + w - arm, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + arm);
      ctx.moveTo(x + w, y + h - arm);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w - arm, y + h);
      ctx.moveTo(x + arm, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + h - arm);
      ctx.stroke();
    };

    const draw = () => {
      const s = settingsRef.current;
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      if (state.presence > 0.001) {
        ctx.globalAlpha = state.presence * s.opacity * (1 - 0.6 * state.lock.alpha);
        ctx.lineWidth = s.thickness;
        ctx.lineCap = s.lineStyle === 'dotted' ? 'round' : 'butt';
        if (s.lineStyle === 'dashed') ctx.setLineDash([s.thickness * 6, s.thickness * 5]);
        else if (s.lineStyle === 'dotted') ctx.setLineDash([0, s.thickness * 4]);
        else ctx.setLineDash([]);
        const x = crisp(state.x, s.thickness);
        const y = crisp(state.y, s.thickness);
        segment(0, y, x - s.gap, y, true, s);
        segment(x + s.gap, y, size.w, y, true, s);
        segment(x, 0, x, y - s.gap, false, s);
        segment(x, y + s.gap, x, size.h, false, s);
        if (s.hideCursor) {
          ctx.fillStyle = rgba(1);
          ctx.beginPath();
          ctx.arc(state.x, state.y, Math.max(1.5, s.thickness * 1.5), 0, Math.PI * 2);
          ctx.fill();
        }
        if (s.showCoordinates && state.lock.alpha < 0.999) {
          ctx.globalAlpha = state.presence * s.opacity * (1 - state.lock.alpha);
          tag(String(Math.round(state.x)), state.x, 8, 'center');
          tag(String(Math.round(state.y)), 8, state.y, 'middle');
        }
      }
      if (state.lock.alpha > 0.001) {
        const { x, y, w, h, alpha } = state.lock;
        ctx.globalAlpha = alpha * s.opacity;
        brackets(x, y, w, h, 1);
        if (s.showCoordinates && state.target) {
          const box = state.target.getBoundingClientRect();
          tag(`${Math.round(box.width)} × ${Math.round(box.height)}`, x + w / 2, y + h + 8, 'center');
        }
      }
      state.pulses.forEach(pulse => {
        const t = pulse.age / 0.55;
        const eased = 1 - (1 - t) ** 3;
        ctx.globalAlpha = (1 - t) ** 2 * s.opacity;
        ctx.strokeStyle = rgba(1);
        ctx.lineWidth = Math.max(1, s.thickness);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 3 + 30 * eased, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    const relative = () => {
      const rect = canvas.getBoundingClientRect();
      state.tx = state.clientX - rect.left;
      state.ty = state.clientY - rect.top;
      return rect;
    };

    const tick = now => {
      raf = 0;
      if (resizePending) {
        resizePending = false;
        applyResize();
      }
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (s.color !== inkSource) {
        inkSource = s.color;
        ink = toRgb(ctx, s.color);
      }
      const rect = relative();
      const follow = reduce || s.smoothing === 0 ? 1 : 1 - Math.exp(-dt / (0.008 + s.smoothing * 0.16));
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      const wanted = state.inside ? 1 : 0;
      state.presence += (wanted - state.presence) * (reduce ? 1 : 1 - Math.exp(-dt / (wanted ? 0.12 : 0.25)));
      if (Math.abs(wanted - state.presence) < 0.002) state.presence = wanted;
      const lock = state.lock;
      const locked = s.targetEffect === 'lock' && state.inside ? state.target : null;
      let goal;
      if (locked) {
        const box = locked.getBoundingClientRect();
        goal = { x: box.left - rect.left - 6, y: box.top - rect.top - 6, w: box.width + 12, h: box.height + 12 };
      } else {
        goal = { x: state.x - 10, y: state.y - 10, w: 20, h: 20 };
      }
      const snap = reduce ? 1 : 1 - Math.exp(-dt / 0.085);
      lock.x += (goal.x - lock.x) * snap;
      lock.y += (goal.y - lock.y) * snap;
      lock.w += (goal.w - lock.w) * snap;
      lock.h += (goal.h - lock.h) * snap;
      const shown = locked ? 1 : 0;
      lock.alpha += (shown - lock.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / (shown ? 0.08 : 0.14)));
      if (Math.abs(shown - lock.alpha) < 0.002) lock.alpha = shown;
      state.glitch = reduce ? 0 : Math.max(0, state.glitch - dt / 0.5);
      state.pulses = state.pulses.filter(pulse => (pulse.age += dt) < 0.55);
      draw();
      const settling =
        Math.abs(state.tx - state.x) > 0.05 ||
        Math.abs(state.ty - state.y) > 0.05 ||
        state.presence !== wanted ||
        lock.alpha !== shown ||
        (locked && Math.abs(goal.w - lock.w) + Math.abs(goal.x - lock.x) + Math.abs(goal.y - lock.y) > 0.1) ||
        state.glitch > 0 ||
        state.pulses.length > 0;
      if (settling) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const setCursorHidden = hidden => {
      cursorOwner.classList.toggle(HIDDEN, hidden);
    };

    wakeRef.current = () => {
      setCursorHidden(state.inside && settingsRef.current.hideCursor);
      wake();
    };

    const pick = element => {
      const s = settingsRef.current;
      if (s.targetEffect === 'none' || !(element instanceof Element)) return null;
      let found = null;
      try {
        found = element.closest(s.targetSelector);
      } catch {
        found = null;
      }
      if (found && host && !host.contains(found)) return null;
      return found;
    };

    const retarget = element => {
      const next = pick(element);
      if (next === state.target) return;
      state.target = next;
      if (next && settingsRef.current.targetEffect === 'glitch') state.glitch = 1;
    };

    const enter = () => {
      if (!state.seen) {
        state.seen = true;
        relative();
        state.x = state.tx;
        state.y = state.ty;
        state.lock.x = state.x - 10;
        state.lock.y = state.y - 10;
        state.lock.w = 20;
        state.lock.h = 20;
      }
      state.inside = true;
      setCursorHidden(settingsRef.current.hideCursor);
    };

    const leave = () => {
      state.inside = false;
      state.target = null;
      setCursorHidden(false);
      wake();
    };

    const onMove = event => {
      state.clientX = event.clientX;
      state.clientY = event.clientY;
      if (event.pointerType === 'touch' && event.buttons === 0) return;
      enter();
      retarget(event.target);
      wake();
    };

    const onDown = event => {
      onMove(event);
      if (!settingsRef.current.clickPulse || reduce) return;
      relative();
      state.pulses.push({ x: state.tx, y: state.ty, age: 0 });
      wake();
    };

    const onUp = event => {
      if (event.pointerType !== 'mouse') leave();
    };

    const onWindowOut = event => {
      if (!event.relatedTarget) leave();
    };

    const onScroll = () => {
      if (!state.inside) return;
      retarget(document.elementFromPoint(state.clientX, state.clientY));
      wake();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    scope.addEventListener('pointermove', onMove);
    scope.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    if (host) host.addEventListener('pointerleave', leave);
    else document.addEventListener('pointerout', onWindowOut);
    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      scope.removeEventListener('pointermove', onMove);
      scope.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (host) host.removeEventListener('pointerleave', leave);
      else document.removeEventListener('pointerout', onWindowOut);
      setCursorHidden(false);
      wakeRef.current = null;
    };
  }, [containerRef]);

  return (
    <>
      <style>{`.${HIDDEN}, .${HIDDEN} * { cursor: none !important; }`}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{
          position: containerRef ? 'absolute' : 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: blendMode,
          ...style
        }}
      />
    </>
  );
};

export default Crosshair;

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import and render the component using the usage example above as a starting point.
4. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
--------------------------------------------------------------------------------------
## Integrate the <ScrollExpand /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: ScrollExpand
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import ScrollExpand from './ScrollExpand';

<ScrollExpand
  src="/hero.jpg"
  alt="Product hero"
  title="Built to scale"
  scrollHint="Scroll"
  useWindowScroll
>
  <h2>Every pixel, everywhere</h2>
  <p>The frame opens up as you scroll and hands the whole stage to your media.</p>
</ScrollExpand>

<div style={{ height: '520px' }}>
  <ScrollExpand src="/hero.jpg" title="Built to scale" mediaZoom={1.35} />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | '' | Image or video URL shown inside the frame. |
| mediaType | "image" | "video" | "image" | Whether the source is an image or a looping muted video. |
| poster | string | '' | Poster frame used while a video loads. |
| alt | string | '' | Alt text for the image. |
| title | string | '' | Headline held over the frame that lifts away as the media takes over. |
| scrollHint | string | '' | Small cue shown under the resting frame that fades away as soon as the scroll begins. |
| startWidth | number | 42 | Frame width before expanding, as a percentage of the stage. |
| startHeight | number | 58 | Frame height before expanding, as a percentage of the stage. |
| startRadius | number | 24 | Corner radius of the resting frame, in px. |
| endRadius | number | 0 | Corner radius once fully expanded, in px. |
| mediaZoom | number | 1.35 | How far the media is zoomed in at rest. It eases back to 1 as the frame opens up. |
| scrollDistance | number | 1.2 | Scroll length of the expansion, in multiples of the stage height. |
| holdDistance | number | 0.35 | Extra scroll the frame stays pinned at full bleed before releasing. |
| smoothing | number | 0.1 | Follow time in seconds. 0 locks the frame exactly to the scrollbar. |
| overlayScrim | number | 0.45 | Strength of the gradient scrim that fades in to keep overlay content readable. |
| useWindowScroll | boolean | false | Drive the expansion from the page scroll instead of the component’s own scroller. |
| enabled | boolean | true | Enable or disable the expansion. |
| children | React.ReactNode | — | Content that fades in over the media once it reaches full bleed. |
| className | string | '' | Additional class names for the container. |
| style | object | — | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useCallback, useEffect, useRef } from 'react';

import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const ScrollExpand = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;

```

### Component CSS
```css
.scroll-expand {
  position: relative;
  width: 100%;
  height: 100%;
}

.scroll-expand--scroller {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
}

.scroll-expand--scroller::-webkit-scrollbar {
  display: none;
}

.scroll-expand__track {
  position: relative;
  width: 100%;
}

.scroll-expand__stage {
  position: sticky;
  top: 0;
  width: 100%;
  overflow: hidden;
  --se-title-size: 4rem;
}

.scroll-expand__frame {
  position: absolute;
  inset: 0;
  clip-path: inset(21% 29% 21% 29% round 24px);
  will-change: clip-path;
}

.scroll-expand__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform-origin: center;
  user-select: none;
  -webkit-user-drag: none;
}

.scroll-expand__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.35));
  opacity: 0;
}

.scroll-expand__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6%;
  opacity: 0;
  will-change: opacity, transform;
}

.scroll-expand__title {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 6%;
  text-align: center;
  font-size: var(--se-title-size);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  will-change: opacity, transform;
}

.scroll-expand__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.25rem;
  text-align: center;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  will-change: opacity, transform;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
--------------------------------------------------------------------------------------
## Integrate the <SplitFlapText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: SplitFlapText
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import SplitFlapText from './SplitFlapText';

<SplitFlapText
  words={['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE']}
  flipDuration={0.12}
  stagger={0.06}
  cycleDelay={2400}
  charset="alphanumeric"
  flipsPerChar={8}
  order="left"
  align="left"
  tileStyle="board"
  tileColor="#111827"
  textColor="#f8fafc"
  glare={0}
  depth={0.5}
  tileRadius={8}
  gap={6}
  fontSize={52}
  loop
  padTo={12}
  intro
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| words | string[] | ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'] | Phrases to cycle through like a departure board. |
| text | string | undefined | Optional single phrase. When set, it takes precedence over words, and changing it flips the board. |
| flipDuration | number | 0.12 | Duration, in seconds, of each individual flap turn. |
| stagger | number | 0.06 | Delay, in seconds, between each tile starting its cascade. |
| cycleDelay | number | 2400 | Hold time, in milliseconds, before cycling to the next phrase. |
| charset | "alpha" | "alphanumeric" | "numeric" | string | "alphanumeric" | Characters used for the intermediate flip glyphs. |
| flipsPerChar | number | 8 | Number of intermediate glyphs each changed tile flips through. |
| align | "left" | "center" | "right" | "left" | Where phrases shorter than the board sit on it. |
| tileColor | string | "#111827" | Base color of each mechanical tile. |
| textColor | string | "#f8fafc" | Color of the glyphs on every flap. "currentColor" follows the surrounding text, handy for the minimal style. |
| tileRadius | number | string | 8 | Corner radius for each tile. |
| gap | number | string | 6 | Space between adjacent flap tiles. |
| fontSize | number | string | 52 | Tile type size. Numeric values are treated as pixels. |
| loop | boolean | true | Whether the phrase array repeats after the final phrase. |
| padTo | number | 12 | Fixed tile count used to keep the board width stable. |
| intro | boolean | true | Starts the board blank and flips it to the first phrase on mount. |
| order | "left" | "right" | "center" | "random" | "left" | Where the cascade starts: from the left, from the right, out from the middle, or in a random order. |
| tileStyle | "board" | "minimal" | "board" | Mechanical tiles, or bare characters that flip on their own, split by a hinge line. |
| glare | number | 0 | Strength, from 0 to 1, of the soft light sheen that sweeps down each tile as its flap falls. |
| depth | number | 0.5 | How physical the board feels, from 0 (flat) to 1: hinge shadow, flap shading as it turns, the shadow a falling flap casts and the thickness of its edge. |
| className | string | "" | Optional class name for custom styling. |
| style | CSSProperties | {} | Optional inline styles for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import './SplitFlapText.css';

const DEFAULT_WORDS = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'];

const CHARSETS = {
  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  numeric: '0123456789'
};

const toCssUnit = value => (typeof value === 'number' ? `${value}px` : value);

const resolveCharset = charset => {
  if (CHARSETS[charset]) return CHARSETS[charset];
  return typeof charset === 'string' && charset.length > 0 ? charset : CHARSETS.alphanumeric;
};

const normalizePhrase = (phrase, width, align = 'left') => {
  const safe = String(phrase ?? '').slice(0, width);
  if (align === 'right') return safe.padStart(width, ' ');
  if (align === 'center') {
    return safe.padStart(safe.length + Math.floor((width - safe.length) / 2), ' ').padEnd(width, ' ');
  }
  return safe.padEnd(width, ' ');
};

const createTiles = phrase =>
  phrase.split('').map(char => ({
    current: char,
    next: char,
    flipping: false,
    tick: 0
  }));

const sampleChar = charset => charset.charAt(Math.floor(Math.random() * charset.length)) || ' ';

const buildSequence = (target, flips, charset) => {
  const steps = [];
  for (let i = 0; i < flips; i += 1) {
    steps.push(sampleChar(charset));
  }
  steps.push(target);
  return steps;
};

const toGlyph = char => (char === ' ' ? ' ' : char);

const shuffleIndices = count => {
  const list = Array.from({ length: count }, (_, index) => index);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const cascadeStep = (index, width, order, randomOrder) => {
  if (order === 'right') return width - 1 - index;
  if (order === 'center') return Math.floor(Math.abs(index - (width - 1) / 2));
  if (order === 'random' && randomOrder) return randomOrder[index];
  return index;
};

const clampUnit = value => Math.min(1, Math.max(0, Number(value) || 0));

const round = value => Number(value.toFixed(3));

const getReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(getReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReduced(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};

const SplitFlapText = ({
  words = ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'],
  text,
  flipDuration = 0.12,
  stagger = 0.06,
  cycleDelay = 2400,
  charset = 'alphanumeric',
  flipsPerChar = 8,
  tileColor = '#111827',
  textColor = '#f8fafc',
  tileRadius = 8,
  gap = 6,
  fontSize = 52,
  loop = true,
  padTo = 12,
  align = 'left',
  intro = true,
  glare = 0,
  depth = 0.5,
  order = 'left',
  tileStyle = 'board',
  className = '',
  style = {},
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafRef = useRef(null);
  const shownRef = useRef(null);
  const fromRef = useRef(null);
  const indexRef = useRef(0);
  const phrasesRef = useRef(null);

  const sourceWords = Array.isArray(words) && words.length > 0 ? words : DEFAULT_WORDS;
  const phrasesKey = typeof text === 'string' ? text : sourceWords.map(word => String(word ?? '')).join('\u001f');
  const phrases = useMemo(() => phrasesKey.split('\u001f'), [phrasesKey]);

  const width = useMemo(() => {
    const longest = phrases.reduce((max, phrase) => Math.max(max, phrase.length), 1);
    return Math.max(1, Math.ceil(Number(padTo) || 0), longest);
  }, [padTo, phrases]);

  const normalizedPhrases = useMemo(
    () => phrases.map(phrase => normalizePhrase(phrase, width, align)),
    [phrases, width, align]
  );

  const timing = useMemo(
    () => ({
      flipMs: Math.max(40, (Number(flipDuration) || 0.12) * 1000),
      staggerMs: Math.max(0, (Number(stagger) || 0) * 1000),
      holdMs: Math.max(400, Number(cycleDelay) || 2400),
      flips: Math.max(0, Math.floor(Number(flipsPerChar) || 0)),
      glyphs: resolveCharset(charset),
      order
    }),
    [flipDuration, stagger, cycleDelay, flipsPerChar, charset, order]
  );
  const timingRef = useRef(timing);

  const [tiles, setTiles] = useState(() => createTiles(intro ? ' '.repeat(width) : normalizedPhrases[0]));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    timingRef.current = timing;
  }, [timing]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const stopFrame = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const animateTo = target => {
      const { flipMs, staggerMs, flips, glyphs, order: cascade } = timingRef.current;
      const from = normalizePhrase(shownRef.current ?? target, target.length);
      const randomOrder = cascade === 'random' ? shuffleIndices(target.length) : null;

      stopFrame();
      shownRef.current = target;
      fromRef.current = null;

      const plans = [];
      if (!prefersReducedMotion) {
        for (let index = 0; index < target.length; index += 1) {
          if (from[index] === target[index]) continue;
          plans.push({
            index,
            from: from[index],
            target: target[index],
            sequence: buildSequence(target[index], flips, glyphs),
            start: cascadeStep(index, target.length, cascade, randomOrder) * staggerMs,
            step: -1,
            done: false
          });
        }
      }

      if (!plans.length) {
        setTiles(createTiles(target));
        return 0;
      }

      fromRef.current = from;
      setTiles(createTiles(from));

      const totalDuration = plans.reduce((max, plan) => Math.max(max, plan.start + plan.sequence.length * flipMs), 0);
      const startedAt = performance.now();

      const tick = now => {
        if (cancelled) return;

        const elapsed = now - startedAt;
        const updates = [];
        let running = false;

        plans.forEach(plan => {
          const localElapsed = elapsed - plan.start;

          if (localElapsed < 0) {
            running = true;
            return;
          }

          const step = Math.floor(localElapsed / flipMs);

          if (step < plan.sequence.length) {
            running = true;

            if (step !== plan.step) {
              plan.step = step;
              updates.push({
                index: plan.index,
                current: step === 0 ? plan.from : plan.sequence[step - 1],
                next: plan.sequence[step],
                done: false
              });
            }
          } else if (!plan.done) {
            plan.done = true;
            updates.push({
              index: plan.index,
              current: plan.target,
              next: plan.target,
              done: true
            });
          }
        });

        if (updates.length > 0) {
          setTiles(previous => {
            const nextTiles = [...previous];
            updates.forEach(update => {
              const tile = nextTiles[update.index];
              if (!tile) return;

              nextTiles[update.index] = {
                current: update.current,
                next: update.next,
                flipping: !update.done,
                tick: tile.tick + 1
              };
            });
            return nextTiles;
          });
        }

        if (running) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          fromRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return totalDuration;
    };

    const show = index => {
      indexRef.current = index;
      setActiveIndex(index);
      return animateTo(normalizedPhrases[index]);
    };

    const scheduleNext = delay => {
      timer = window.setTimeout(() => {
        if (cancelled) return;

        if (document.hidden) {
          scheduleNext(timingRef.current.holdMs);
          return;
        }

        const nextIndex = indexRef.current + 1;
        if (nextIndex >= normalizedPhrases.length && !loop) return;

        const duration = show(nextIndex % normalizedPhrases.length);
        scheduleNext(timingRef.current.holdMs + duration);
      }, delay);
    };

    const samePhrases = phrasesRef.current === normalizedPhrases;
    phrasesRef.current = normalizedPhrases;

    if (shownRef.current === null) {
      shownRef.current = intro ? ' '.repeat(width) : normalizedPhrases[0];
    }

    if (!samePhrases || indexRef.current >= normalizedPhrases.length) {
      indexRef.current = 0;
    } else if (fromRef.current !== null) {
      shownRef.current = fromRef.current;
    }

    let startDuration = 0;
    if (shownRef.current === normalizedPhrases[indexRef.current]) {
      stopFrame();
      fromRef.current = null;
      setActiveIndex(indexRef.current);
      setTiles(createTiles(shownRef.current));
    } else {
      startDuration = show(indexRef.current);
    }

    if (normalizedPhrases.length > 1) {
      scheduleNext(timingRef.current.holdMs + startDuration);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      stopFrame();
    };
  }, [normalizedPhrases, width, loop, intro, prefersReducedMotion]);

  const label = String(phrases[activeIndex] ?? phrases[0] ?? '').trim();
  const minimal = tileStyle === 'minimal';
  const level = clampUnit(depth);
  const flat = Math.min(1, level * 2);
  const deep = Math.max(0, level - 0.5) * 2;
  const sheen = minimal ? 0 : clampUnit(glare);
  const shaded = !minimal && deep > 0;
  const rootClass = [
    'split-flap-text',
    minimal && 'split-flap-text--minimal',
    sheen > 0 && 'split-flap-text--glare',
    className
  ]
    .filter(Boolean)
    .join(' ');
  const componentStyle = {
    '--split-flap-tile-color': tileColor,
    '--split-flap-text-color': textColor,
    '--split-flap-radius': toCssUnit(tileRadius),
    '--split-flap-gap': toCssUnit(gap),
    '--split-flap-font-size': toCssUnit(fontSize),
    '--split-flap-flip-duration': `${Math.max(0.04, Number(flipDuration) || 0.12)}s`,
    '--split-flap-front-from': round(1 + 0.08 * flat),
    '--split-flap-front-to': round(1 - 0.48 * flat - 0.3 * deep),
    '--split-flap-back-from': round(1 - 0.42 * flat - 0.3 * deep),
    '--split-flap-hinge': `calc(1px + ${round(deep * 0.05)}em)`,
    '--split-flap-hinge-shade': round(0.25 + 0.39 * flat + 0.21 * deep),
    '--split-flap-drop': round(0.28 * flat + 0.2 * deep),
    '--split-flap-lift': round(0.4 + 0.6 * flat + 0.7 * deep),
    '--split-flap-cast': round(deep * 0.62),
    '--split-flap-edge': `${round(deep * 0.035)}em`,
    '--split-flap-split': `${round(0.015 + level * 0.06)}em`,
    '--split-flap-glare': round(sheen * 0.55),
    ...style
  };

  return (
    <div className={rootClass} style={componentStyle} {...props}>
      <span className="split-flap-text__sr">{label}</span>
      {tiles.map((tile, index) => (
        <span
          className={`split-flap-text__tile${tile.flipping ? ' is-flipping' : ''}`}
          aria-hidden="true"
          key={`${index}-${tiles.length}`}
        >
          <span className="split-flap-text__half split-flap-text__half--top" key={minimal ? `top-${tile.tick}` : 'top'}>
            <span className="split-flap-text__char">{toGlyph(tile.flipping ? tile.next : tile.current)}</span>
          </span>
          <span
            className="split-flap-text__half split-flap-text__half--bottom"
            key={minimal ? `bottom-${tile.tick}` : 'bottom'}
          >
            <span className="split-flap-text__char">{toGlyph(tile.current)}</span>
          </span>

          {tile.flipping && (
            <>
              {shaded && (
                <>
                  <span className="split-flap-text__shade split-flap-text__shade--top" key={`shade-top-${tile.tick}`} />
                  <span
                    className="split-flap-text__shade split-flap-text__shade--bottom"
                    key={`shade-bottom-${tile.tick}`}
                  />
                </>
              )}
              <span className="split-flap-text__flap split-flap-text__flap--front" key={`front-${index}-${tile.tick}`}>
                <span className="split-flap-text__char">{toGlyph(tile.current)}</span>
              </span>
              <span className="split-flap-text__flap split-flap-text__flap--back" key={`back-${index}-${tile.tick}`}>
                <span className="split-flap-text__char">{toGlyph(tile.next)}</span>
              </span>
            </>
          )}
        </span>
      ))}
    </div>
  );
};

export default SplitFlapText;

```

### Component CSS
```css
.split-flap-text {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--split-flap-gap, 6px);
  color: var(--split-flap-text-color, #f8fafc);
  font-family: 'SFMono-Regular', 'Roboto Mono', 'Cascadia Code', 'Liberation Mono', Menlo, monospace;
  font-size: var(--split-flap-font-size, 52px);
  font-weight: 760;
  line-height: 1;
  letter-spacing: 0.035em;
  white-space: pre;
  user-select: none;
  font-variant-numeric: tabular-nums;
}

.split-flap-text__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.split-flap-text__tile {
  position: relative;
  flex: none;
  width: 0.78em;
  height: 1.08em;
  overflow: hidden;
  border-radius: var(--split-flap-radius, 8px);
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.16), transparent 44%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--split-flap-tile-color, #111827) 82%, white),
      var(--split-flap-tile-color, #111827)
    );
  box-shadow:
    0 0.035em 0.08em rgba(255, 255, 255, 0.08) inset,
    0 -0.05em 0.1em rgba(0, 0, 0, 0.38) inset,
    0 calc(0.16em * var(--split-flap-lift, 1)) calc(0.38em * var(--split-flap-lift, 1))
      rgba(0, 0, 0, var(--split-flap-drop, 0.28));
  perspective: 10em;
  transform-style: preserve-3d;
  isolation: isolate;
}

.split-flap-text__tile::before {
  content: '';
  position: absolute;
  z-index: 8;
  top: calc(50% - var(--split-flap-hinge, 1px) / 2);
  left: 0;
  width: 100%;
  height: var(--split-flap-hinge, 1px);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.18) 18%,
    rgba(0, 0, 0, var(--split-flap-hinge-shade, 0.64)) 50%,
    rgba(255, 255, 255, 0.14) 82%,
    transparent
  );
  box-shadow:
    0 -1px 0 rgba(255, 255, 255, 0.08),
    0 1px 0 rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.split-flap-text__tile::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 9;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: inherit;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) inset;
  pointer-events: none;
}

.split-flap-text__half,
.split-flap-text__flap {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 34%), var(--split-flap-tile-color, #111827);
  backface-visibility: hidden;
}

.split-flap-text__half--top,
.split-flap-text__flap--front {
  top: 0;
}

.split-flap-text__half--bottom,
.split-flap-text__flap--back {
  bottom: 0;
}

.split-flap-text__half--bottom,
.split-flap-text__flap--back {
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.06), transparent 38%),
    color-mix(in srgb, var(--split-flap-tile-color, #111827) 92%, black);
}

.split-flap-text__char {
  position: absolute;
  left: 0;
  width: 100%;
  height: 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--split-flap-text-color, #f8fafc);
  text-shadow:
    0 0.025em 0 rgba(255, 255, 255, 0.16),
    0 0.09em 0.16em rgba(0, 0, 0, 0.42);
}

.split-flap-text__half--top .split-flap-text__char,
.split-flap-text__flap--front .split-flap-text__char {
  top: 0;
}

.split-flap-text__half--bottom .split-flap-text__char,
.split-flap-text__flap--back .split-flap-text__char {
  bottom: 0;
}

.split-flap-text__flap {
  z-index: 6;
  will-change: transform, filter;
  transform-style: preserve-3d;
}

.split-flap-text__flap--front {
  transform-origin: center bottom;
  box-shadow: inset 0 var(--split-flap-edge, 0em) 0 rgba(255, 255, 255, 0.16);
  animation: split-flap-front var(--split-flap-flip-duration, 0.12s) linear both;
}

.split-flap-text__flap--back {
  transform-origin: center top;
  transform: rotateX(90deg);
  box-shadow: inset 0 calc(var(--split-flap-edge, 0em) * -1) 0 rgba(0, 0, 0, 0.4);
  animation: split-flap-back var(--split-flap-flip-duration, 0.12s) linear both;
}

.split-flap-text__shade {
  position: absolute;
  z-index: 4;
  left: 0;
  width: 100%;
  height: 50%;
  pointer-events: none;
  animation: split-flap-shade-top var(--split-flap-flip-duration, 0.12s) linear both;
}

.split-flap-text__shade--top {
  top: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, var(--split-flap-cast, 0)), transparent 85%);
}

.split-flap-text__shade--bottom {
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, var(--split-flap-cast, 0)), transparent 90%);
  animation-name: split-flap-shade-bottom;
}

.split-flap-text--glare .split-flap-text__flap::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
      180deg,
      transparent 32%,
      rgba(255, 255, 255, var(--split-flap-glare, 0)) 50%,
      transparent 68%
    )
    0 100% / 100% 300% no-repeat;
  animation: split-flap-glare-front var(--split-flap-flip-duration, 0.12s) linear both;
}

.split-flap-text--glare .split-flap-text__flap--back::after {
  animation-name: split-flap-glare-back;
}

.split-flap-text--minimal .split-flap-text__tile {
  background: none;
  box-shadow: none;
  -webkit-mask:
    linear-gradient(#000 0 0) top / 100% calc(50% - var(--split-flap-split, 0.045em) / 2) no-repeat,
    linear-gradient(#000 0 0) bottom / 100% calc(50% - var(--split-flap-split, 0.045em) / 2) no-repeat;
  mask:
    linear-gradient(#000 0 0) top / 100% calc(50% - var(--split-flap-split, 0.045em) / 2) no-repeat,
    linear-gradient(#000 0 0) bottom / 100% calc(50% - var(--split-flap-split, 0.045em) / 2) no-repeat;
}

.split-flap-text--minimal .split-flap-text__tile::before,
.split-flap-text--minimal .split-flap-text__tile::after,
.split-flap-text--minimal .split-flap-text__flap::after {
  display: none;
}

.split-flap-text--minimal .split-flap-text__half,
.split-flap-text--minimal .split-flap-text__flap {
  background: none;
  box-shadow: none;
}

.split-flap-text--minimal .split-flap-text__char {
  text-shadow: none;
}

.split-flap-text--minimal .split-flap-text__tile.is-flipping .split-flap-text__half--top {
  animation: split-flap-reveal var(--split-flap-flip-duration, 0.12s) linear both;
}

.split-flap-text--minimal .split-flap-text__tile.is-flipping .split-flap-text__half--bottom {
  animation: split-flap-cover var(--split-flap-flip-duration, 0.12s) linear both;
}

@keyframes split-flap-front {
  0% {
    transform: rotateX(0deg);
    filter: brightness(var(--split-flap-front-from, 1.08));
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  50%,
  100% {
    transform: rotateX(-90deg);
    filter: brightness(var(--split-flap-front-to, 0.52));
  }
}

@keyframes split-flap-back {
  0%,
  50% {
    transform: rotateX(90deg);
    filter: brightness(var(--split-flap-back-from, 0.58));
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  100% {
    transform: rotateX(0deg);
    filter: brightness(1);
  }
}

@keyframes split-flap-shade-top {
  0%,
  32% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@keyframes split-flap-shade-bottom {
  0% {
    opacity: 0;
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  50%,
  100% {
    opacity: 1;
  }
}

@keyframes split-flap-glare-front {
  0% {
    background-position: 0 100%;
    opacity: 0;
  }

  30% {
    opacity: 1;
  }

  50%,
  100% {
    background-position: 0 0%;
    opacity: 0.75;
  }
}

@keyframes split-flap-glare-back {
  0%,
  50% {
    background-position: 0 100%;
    opacity: 0.75;
  }

  100% {
    background-position: 0 0%;
    opacity: 0;
  }
}

@keyframes split-flap-reveal {
  0% {
    clip-path: inset(0 0 100% 0);
  }

  23.14% {
    clip-path: inset(0 0 99.21% 0);
  }

  29.67% {
    clip-path: inset(0 0 95.55% 0);
  }

  33.95% {
    clip-path: inset(0 0 89.09% 0);
  }

  37.41% {
    clip-path: inset(0 0 79.46% 0);
  }

  40.56% {
    clip-path: inset(0 0 66.05% 0);
  }

  43.73% {
    clip-path: inset(0 0 47.69% 0);
  }

  47.38% {
    clip-path: inset(0 0 21.22% 0);
  }

  50%,
  100% {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes split-flap-cover {
  0%,
  50% {
    clip-path: inset(0 0 0 0);
  }

  54.42% {
    clip-path: inset(35.75% 0 0 0);
  }

  57.44% {
    clip-path: inset(55.86% 0 0 0);
  }

  60.39% {
    clip-path: inset(70.63% 0 0 0);
  }

  63.65% {
    clip-path: inset(81.86% 0 0 0);
  }

  67.65% {
    clip-path: inset(90.23% 0 0 0);
  }

  73.17% {
    clip-path: inset(96% 0 0 0);
  }

  82.62% {
    clip-path: inset(99.25% 0 0 0);
  }

  100% {
    clip-path: inset(100% 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .split-flap-text__flap,
  .split-flap-text__flap::after,
  .split-flap-text__shade,
  .split-flap-text__half {
    animation: none !important;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
