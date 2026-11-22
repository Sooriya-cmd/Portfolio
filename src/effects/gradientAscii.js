/**
 * gradientAscii.js — WebGL2 Procedural ASCII Gradient Field
 * Adapted from React Bits GradientASCII for Vanilla JavaScript.
 * Strictly uses portfolio palette (#3165E0, #2EE5EF, #DFD5F5, #6745A8) and shape 'eclipse'.
 * Confined strictly to the third illustration's background in entryScreen.js.
 */

const MAX_COLORS = 8;
const ATLAS_CELL_W = 60;
const ATLAS_CELL_H = 100;
const ATLAS_COLUMNS = 16;
const FONT_SCALE = 0.78;

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

vec3 eclipse(vec2 p, float time, out float order) {
  float fit = min(1.0, uAspect * 1.25);
  float r = 0.28 * fit * (1.0 + 0.015 * sin(time * 0.9));
  float angle = atan(p.y, p.x);
  float rays = noise(vec2(cos(angle), sin(angle)) * 2.2 + time * 0.08) * 0.8 + 0.6;
  float d = length(p) - r;
  float reach = mix(0.09, 0.20, uSoftness) * rays * fit;
  float t = smoothstep(-0.006, 0.006 + 0.02 * uSoftness, d) * exp(-max(d, 0.0) / reach);
  order = clamp(d * 2.0, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec4 tone(float t) {
  float x = smoothstep(0.15, 1.0, t) * float(uCount - 1);
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
  q += warp * uFlow * 0.06;
  float order = 0.0;
  vec3 shape = eclipse(q, time, order);

  float reveal = clamp((uIntro * 1.45 - order) / 0.45, 0.0, 1.0);
  reveal = reveal * reveal * (3.0 - 2.0 * reveal);

  vec2 t = clamp(shape.xy * mix(0.7, 1.0, reveal), 0.0, 1.0);
  vec4 mixed = mix(tone(t.x), tone(t.y), shape.z);
  vec3 color = encode(labToRgb(mixed.rgb));
  float alpha = mixed.a * reveal;
  float dither = (hash12(gl_FragCoord.xy + uFrame * 13.7) - 0.5) / 255.0;
  outColor = clamp(vec4(color * alpha + dither, alpha + dither), 0.0, 1.0);
  outAux = vec4(reveal, 0.0, 0.0, 1.0);
}`;

const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform vec2 uCell;
uniform vec2 uAtlasGrid;
uniform float uCount;
uniform float uDensity;
uniform float uGlyphOpacity;
uniform float uGradientOpacity;
uniform float uGlyphTime;
uniform float uFlicker;
in vec2 vUv;
out vec4 outColor;
${COMMON}

void main() {
  vec2 px = vUv * uResolution;
  vec2 coord = px / uCell;
  vec2 cell = floor(coord);
  vec2 local = coord - cell;
  vec2 uv = (cell + 0.5) * uCell / uResolution;

  vec4 field = texture(uField, uv);
  float luma = dot(field.rgb, vec3(0.2126, 0.7152, 0.0722));
  float pick = hash12(cell + 13.37);
  float wobble = (hash12(cell * 2.31 + floor(uGlyphTime * 8.0) * 17.7) - 0.5) * uFlicker;
  float tone = clamp(pow(luma, 0.75) + wobble, 0.0, 1.0);
  float index = floor(tone * (uCount - 1.0) + 0.5);

  float column = mod(index, uAtlasGrid.x);
  float row = floor(index / uAtlasGrid.x);
  vec2 atlasUv = vec2((column + local.x) / uAtlasGrid.x, (row + 1.0 - local.y) / uAtlasGrid.y);
  float glyph = texture(uAtlas, atlasUv).a;

  float present = step(pick, uDensity);
  float charAlpha = glyph * present * uGlyphOpacity * field.a;
  vec3 charColor = field.rgb * 1.35;

  vec4 gradColor = vec4(field.rgb * uGradientOpacity * field.a, field.a * uGradientOpacity);
  vec4 glyphColor = vec4(charColor * charAlpha, charAlpha);

  outColor = glyphColor + gradColor * (1.0 - glyphColor.a);
}`;

function compile(gl, type, source) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
  gl.deleteShader(s);
  return null;
}

function link(gl, vs, fs) {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram();
  if (!v || !f || !p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

// Color converter to sRGB / Oklab
function rgbToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  ];
}

export class GradientASCII {
  constructor(container, options = {}) {
    this.container = container;
    this.colors = options.colors || ['#3165E0', '#2EE5EF', '#DFD5F5', '#6745A8'];
    this.characters = options.characters || ' .:-=+*#@';
    this.cellSize = options.cellSize || 18;
    this.density = options.density || 0.55;
    this.glyphOpacity = options.glyphOpacity || 0.48;
    this.gradientOpacity = options.gradientOpacity || 0.22;
    this.softness = options.softness || 0.65;
    this.scale = options.scale || 1.1;
    this.flow = options.flow || 0.2;
    this.speed = options.speed || 0.4;
    this.flicker = options.flicker || 0.08;

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'gradient-ascii-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    this.container.appendChild(this.canvas);

    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!gl) return;
    this.gl = gl;

    this.fieldProgram = link(gl, VERTEX, FIELD);
    this.compositeProgram = link(gl, VERTEX, COMPOSITE);
    if (!this.fieldProgram || !this.compositeProgram) return;

    this.vao = gl.createVertexArray();

    // Textures & Framebuffers
    this.fieldTexture = gl.createTexture();
    this.auxTexture = gl.createTexture();
    this.fbo = gl.createFramebuffer();

    // Atlas texture
    this.atlasTexture = gl.createTexture();
    this.buildAtlas();

    this.alive = true;
    this.isVisible = true;
    this.startTime = performance.now();
    this.raf = null;

    this.resize();
    this.startLoop();

    this.observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    this.observer.observe(this.container);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  buildAtlas() {
    const gl = this.gl;
    const atlas = document.createElement('canvas');
    const cols = ATLAS_COLUMNS;
    const rows = Math.ceil(this.characters.length / cols);
    atlas.width = cols * ATLAS_CELL_W;
    atlas.height = rows * ATLAS_CELL_H;
    const ctx = atlas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${Math.round(ATLAS_CELL_H * FONT_SCALE)}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    for (let i = 0; i < this.characters.length; i++) {
      const char = this.characters[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      ctx.fillText(char, (col + 0.5) * ATLAS_CELL_W, (row + 0.5) * ATLAS_CELL_H);
    }

    gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
  }

  resize() {
    if (!this.canvas || !this.container) return;
    const gl = this.gl;
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = Math.max(1, Math.round(rect.width * dpr));
    this.height = Math.max(1, Math.round(rect.height * dpr));
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Rebuild FBO textures
    const setupTex = (tex) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    };

    setupTex(this.fieldTexture);
    setupTex(this.auxTexture);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fieldTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.auxTexture, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  startLoop() {
    const gl = this.gl;
    const loop = (now) => {
      if (!this.alive) return;
      if (!this.isVisible) {
        this.raf = requestAnimationFrame(loop);
        return;
      }

      const elapsed = (now - this.startTime) * 0.001;
      const time = elapsed * this.speed;

      // 1. Field pass (render eclipse gradient to FBO)
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.viewport(0, 0, this.width, this.height);
      gl.useProgram(this.fieldProgram);
      gl.bindVertexArray(this.vao);

      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uAspect'), this.width / this.height);
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uTime'), time);
      gl.uniform1i(gl.getUniformLocation(this.fieldProgram, 'uShape'), 3); // 3 = eclipse
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uScale'), this.scale);
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uSoftness'), this.softness);
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uFlow'), this.flow);
      gl.uniform2f(gl.getUniformLocation(this.fieldProgram, 'uSeed'), 1.2, 3.4);
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uIntro'), 1.0);
      gl.uniform1f(gl.getUniformLocation(this.fieldProgram, 'uFrame'), elapsed * 60);

      // Color ramp
      const ramp = [];
      const parsedColors = [
        [0.19, 0.40, 0.88], // #3165E0
        [0.18, 0.90, 0.94], // #2EE5EF
        [0.87, 0.84, 0.96], // #DFD5F5
        [0.40, 0.27, 0.66]  // #6745A8
      ];
      parsedColors.forEach(c => {
        const lab = rgbToOklab(c[0], c[1], c[2]);
        ramp.push(lab[0], lab[1], lab[2]);
      });
      while (ramp.length < MAX_COLORS * 3) ramp.push(0, 0, 0);

      gl.uniform3fv(gl.getUniformLocation(this.fieldProgram, 'uRamp'), new Float32Array(ramp));
      gl.uniform1i(gl.getUniformLocation(this.fieldProgram, 'uCount'), parsedColors.length);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 2. Composite pass (ASCII glyphs + gradient to screen)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.width, this.height);
      gl.useProgram(this.compositeProgram);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fieldTexture);
      gl.uniform1i(gl.getUniformLocation(this.compositeProgram, 'uField'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.uniform1i(gl.getUniformLocation(this.compositeProgram, 'uAtlas'), 1);

      gl.uniform2f(gl.getUniformLocation(this.compositeProgram, 'uResolution'), this.width, this.height);
      gl.uniform2f(gl.getUniformLocation(this.compositeProgram, 'uCell'), this.cellSize, this.cellSize * 1.5);
      gl.uniform2f(gl.getUniformLocation(this.compositeProgram, 'uAtlasGrid'), ATLAS_COLUMNS, Math.ceil(this.characters.length / ATLAS_COLUMNS));
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uCount'), this.characters.length);
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uDensity'), this.density);
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uGlyphOpacity'), this.glyphOpacity);
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uGradientOpacity'), this.gradientOpacity);
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uGlyphTime'), time);
      gl.uniform1f(gl.getUniformLocation(this.compositeProgram, 'uFlicker'), this.flicker);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      this.raf = requestAnimationFrame(loop);
    };

    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.observer) this.observer.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    const gl = this.gl;
    if (gl) {
      gl.deleteTexture(this.fieldTexture);
      gl.deleteTexture(this.auxTexture);
      gl.deleteTexture(this.atlasTexture);
      gl.deleteFramebuffer(this.fbo);
      gl.deleteVertexArray(this.vao);
      gl.deleteProgram(this.fieldProgram);
      gl.deleteProgram(this.compositeProgram);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
