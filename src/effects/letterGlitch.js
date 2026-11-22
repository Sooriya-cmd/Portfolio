/**
 * letterGlitch.js — WebGL2 animated character grid background
 * Adapted from React Bits LetterGlitch for Vanilla JavaScript.
 * Strictly uses existing portfolio palette (#3165E0, #2EE5EF, #FF4F92, #121324),
 * center fading, edge fading, transparent canvas background, and pauses offscreen.
 */

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
const DEFAULT_FONT = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
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
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 pos = frag - uOrigin;
  vec4 color = vec4(0.0);
  if (pos.x >= 0.0 && pos.y >= 0.0) {
    ivec2 cell = ivec2(int(pos.x) / uCell.x, int(pos.y) / uCell.y);
    if (cell.x < uGrid.x && cell.y < uGrid.y) {
      vec4 state = texelFetch(uState, cell, 0);
      int glyph = int(state.r * 255.0 + 0.5);
      ivec2 local = ivec2(int(pos.x) % uCell.x, int(pos.y) % uCell.y);
      ivec2 atlasCell = ivec2(glyph % uAtlasColumns, glyph / uAtlasColumns);
      ivec2 atlasCoord = atlasCell * uCell + local;
      float coverage = texelFetch(uAtlas, atlasCoord, 0).r;
      vec2 center = uOrigin + (vec2(cell) + 0.5) * vec2(uCell);
      vec2 norm = center / uResolution;
      float mask = 1.0;
      if (uEdge > 0.0) {
        float edgeD = min(min(norm.x, 1.0 - norm.x), min(norm.y, 1.0 - norm.y));
        mask *= smoothstep(0.0, uEdge, edgeD);
      }
      if (uCenter > 0.0) {
        float centerD = length((norm - 0.5) * vec2(uResolution.x / uResolution.y, 1.0));
        mask *= smoothstep(0.0, 0.55 * uCenter, centerD);
      }
      float rest = state.g * uBaseOpacity;
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

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function link(gl) {
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
}

export class LetterGlitch {
  constructor(container, options = {}) {
    this.container = container;
    this.options = Object.assign({
      glitchColors: ['#3165E0', '#2EE5EF', '#FF4F92'],
      baseColor: '#121324',
      characters: DEFAULT_CHARACTERS,
      fontFamily: DEFAULT_FONT,
      fontSize: 11,
      spacing: 0.65,
      density: 0.55,
      baseOpacity: 0.09,
      glitchAmount: 0.22,
      speed: 0.55,
      flow: 0.2,
      smooth: true,
      interactive: false,
      cursorRadius: 100,
      clickEffect: 'none',
      edgeFade: 0.18,
      centerFade: 0.75,
      intro: true,
      lightMode: true
    }, options);

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'letter-glitch-canvas';
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

    const programInfo = link(gl);
    if (!programInfo) return;
    this.programInfo = programInfo;

    const u = programInfo.uniforms;
    this.vao = gl.createVertexArray();

    const makeTexture = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };

    this.atlasTexture = makeTexture();
    this.stateTexture = makeTexture();
    const maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    const atlas = document.createElement('canvas');
    const atlasContext = atlas.getContext('2d');
    if (!atlasContext) return;

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colorCache = new Map();
    const parse = (value) => {
      const key = String(value);
      if (colorCache.has(key)) return colorCache.get(key);
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

    const s = this.options;
    const view = { width: 1, height: 1, ratio: 1 };
    const grid = { cols: 0, rows: 0, cellW: 0, cellH: 0, originX: 0, originY: 0, atlasColumns: 1 };
    const palette = new Float32Array(MAX_COLORS * 3);
    let pool = [0];
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
    let clock = 0;
    let time = 0;
    let restCarry = 0;
    let glitchCarry = 0;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let isVisible = true;
    let isAlive = true;

    const randomGlyph = () => pool[(Math.random() * pool.length) | 0];
    const randomColor = () => (Math.random() * s.glitchColors.length) | 0;

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

    const release = (k) => {
      const i = active[k];
      const moved = active[--activeCount];
      active[k] = moved;
      slot[moved] = k;
      slot[i] = -1;
      heat[i] = 0;
      data[i * 4 + 2] = 0;
    };

    const buildType = () => {
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
      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      const lookup = new Map(unique.map((char, i) => [char, i]));
      const nextPool = chars.map(char => lookup.get(char)).filter(index => index !== undefined);
      pool = nextPool.length ? nextPool : [0];
      grid.cellW = cellW;
      grid.cellH = cellH;
      grid.atlasColumns = columns;
    };

    const buildGrid = () => {
      const cols = Math.ceil(this.canvas.width / grid.cellW) + 1;
      const rows = Math.ceil(this.canvas.height / grid.cellH) + 1;
      grid.originX = Math.floor((this.canvas.width - cols * grid.cellW) / 2);
      grid.originY = Math.floor((this.canvas.height - rows * grid.cellH) / 2);
      if (cols === grid.cols && rows === grid.rows) return;
      const n = cols * rows;
      data = new Uint8Array(n * 4);
      luck = new Float32Array(n);
      level = new Float32Array(n);
      born = new Float32Array(n);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          data[i * 4] = randomGlyph();
          luck[i] = Math.random();
          level[i] = 0.55 + 0.45 * Math.random();
          born[i] = -1;
          data[i * 4 + 1] = luck[i] < s.density ? Math.round(level[i] * 255) : 0;
        }
      }

      grid.cols = cols;
      grid.rows = rows;
      count = n;
      heat = new Float32Array(n);
      peak = new Float32Array(n);
      hold = new Float32Array(n);
      fade = new Float32Array(n);
      wait = new Float32Array(n);
      delay = new Float32Array(n);
      slot = new Int32Array(n).fill(-1);
      active = new Int32Array(n);
      activeCount = 0;

      gl.bindTexture(gl.TEXTURE_2D, this.stateTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      dirty = false;
    };

    // Palette sync
    for (let i = 0; i < MAX_COLORS; i++) {
      const hex = s.glitchColors[Math.min(i, s.glitchColors.length - 1)];
      const rgb = parse(hex);
      palette[i * 3] = rgb[0];
      palette[i * 3 + 1] = rgb[1];
      palette[i * 3 + 2] = rgb[2];
    }

    const resize = () => {
      const rect = this.container.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      view.width = Math.max(10, rect.width);
      view.height = Math.max(10, rect.height);
      view.ratio = ratio;
      this.canvas.width = Math.round(view.width * ratio);
      this.canvas.height = Math.round(view.height * ratio);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      buildType();
      buildGrid();
    };

    resize();

    const loop = (timestamp) => {
      if (!isAlive) return;
      if (!isVisible) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const now = timestamp * 0.001;
      const dt = Math.min(now - (last || now), 0.1);
      last = now;
      clock += dt;
      time += dt * s.speed;

      // Ambient glitch updates
      if (s.speed > 0 && count > 0) {
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

        glitchCarry += count * Math.pow(s.glitchAmount, 1.6) * GLITCH_RATE * s.speed * dt;
        let events = Math.min(count, glitchCarry | 0);
        glitchCarry -= events;
        while (events-- > 0) {
          const i = (Math.random() * count) | 0;
          ignite(i, 0.45 + 0.55 * Math.random(), 0.05, 0.5, randomColor());
        }
      }

      // Settle active heat
      for (let k = 0; k < activeCount; ) {
        const i = active[k];
        let h = heat[i];
        if (hold[i] > 0) {
          hold[i] -= dt;
          h = s.smooth ? h + (peak[i] - h) * (1 - Math.exp(-dt / 0.05)) : peak[i];
        } else {
          h = s.smooth ? h * Math.exp((-dt * 4) / Math.max(fade[i], 0.05)) : 0;
        }
        if (h < 0.012 && hold[i] <= 0) {
          release(k);
          dirty = true;
          continue;
        }
        heat[i] = h;
        data[i * 4 + 2] = Math.round(h * 255);
        dirty = true;
        k++;
      }

      if (dirty && grid.cols > 0 && grid.rows > 0) {
        gl.bindTexture(gl.TEXTURE_2D, this.stateTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, grid.cols, grid.rows, gl.RGBA, gl.UNSIGNED_BYTE, data);
        dirty = false;
      }

      // Render WebGL
      gl.useProgram(programInfo.program);
      gl.bindVertexArray(this.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.atlasTexture);
      gl.uniform1i(u.uAtlas, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.stateTexture);
      gl.uniform1i(u.uState, 1);

      gl.uniform2i(u.uCell, grid.cellW, grid.cellH);
      gl.uniform2i(u.uGrid, grid.cols, grid.rows);
      gl.uniform1i(u.uAtlasColumns, grid.atlasColumns);
      gl.uniform2f(u.uResolution, this.canvas.width, this.canvas.height);
      gl.uniform2f(u.uOrigin, grid.originX, grid.originY);

      const baseRgb = parse(s.baseColor);
      gl.uniform3f(u.uBase, baseRgb[0], baseRgb[1], baseRgb[2]);
      gl.uniform1f(u.uBaseOpacity, s.baseOpacity);
      gl.uniform3fv(u.uColors, palette);
      gl.uniform1f(u.uEdge, s.edgeFade);
      gl.uniform1f(u.uCenter, s.centerFade);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uFlow, s.flow);
      gl.uniform1f(u.uFlowScale, 200 * view.ratio);
      gl.uniform4f(u.uBackground, 0, 0, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    // IntersectionObserver to pause offscreen
    this.observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    this.observer.observe(this.container);

    this.resizeObserver = new ResizeObserver(() => {
      resize();
    });
    this.resizeObserver.observe(this.container);

    this.cleanup = () => {
      isAlive = false;
      if (raf) cancelAnimationFrame(raf);
      if (this.observer) this.observer.disconnect();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      gl.deleteTexture(this.atlasTexture);
      gl.deleteTexture(this.stateTexture);
      gl.deleteVertexArray(this.vao);
      gl.deleteProgram(programInfo.program);
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    };
  }

  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}
