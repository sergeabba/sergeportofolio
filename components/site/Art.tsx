/* Illustrations isométriques des deux métiers (SVG pur, rendu serveur). */

type Pt = [number, number];
type Layer = { label: string; sub: string };

const W = 300;
const H = 170;
const CX = 175;
const DEPTH = 14;

function iso(cy: number, u: number, v: number): Pt {
  // u : vers la droite-bas, v : vers la gauche-bas, depuis le sommet du losange
  const top: Pt = [CX, cy - H / 2];
  return [top[0] + u * (W / 2) - v * (W / 2), top[1] + u * (H / 2) + v * (H / 2)];
}

function quad(cy: number, u0: number, v0: number, u1: number, v1: number) {
  return [iso(cy, u0, v0), iso(cy, u1, v0), iso(cy, u1, v1), iso(cy, u0, v1)]
    .map((p) => p.join(","))
    .join(" ");
}

function Slab({ cy, color, side, k, children }: { cy: number; color: string; side: string; k: number; children?: React.ReactNode }) {
  const t = iso(cy, 0, 0);
  const r = iso(cy, 1, 0);
  const b = iso(cy, 1, 1);
  const l = iso(cy, 0, 1);
  const d = (p: Pt): Pt => [p[0], p[1] + DEPTH];
  const pts = (arr: Pt[]) => arr.map((p) => p.join(",")).join(" ");
  return (
    <g className="slab" style={{ ["--k" as string]: k }}>
      <g className="slab__float">
      <polygon points={pts([l, b, d(b), d(l)])} fill={side} />
      <polygon points={pts([b, r, d(r), d(b)])} fill={side} opacity={0.8} />
      <polygon points={pts([t, r, b, l])} fill="#161a38" stroke={color} strokeWidth={2} />
      {children}
      </g>
    </g>
  );
}

function Labels({ layers, ys, color }: { layers: readonly Layer[]; ys: number[]; color: string }) {
  return (
    <>
      {layers.map((layer, i) => {
        const [rx, ry] = iso(ys[i], 1, 0);
        return (
          <g key={layer.label} className="art-lab" style={{ ["--k" as string]: 2 - i }}>
            <line x1={rx + 4} y1={ry} x2={384} y2={ry} stroke={color} strokeWidth={2} />
            <text x={396} y={ry + 2} className="art-label">{layer.label}</text>
            <text x={396} y={ry + 26} className="art-sub">{layer.sub}</text>
          </g>
        );
      })}
    </>
  );
}

const YS = [110, 280, 450];

export function WritingArt({ layers }: { layers: readonly Layer[] }) {
  const c = "#ffb547";
  return (
    <svg viewBox="0 0 600 560" role="img" aria-label="Illustration : articles, annonces et publications réseaux sociaux">
      <Slab k={0} cy={YS[2]} color="#ff8a5b" side="#b4482a">
        {/* Réseaux sociaux : grille de publications */}
        {[0, 1, 2].map((i) =>
          [0, 1].map((j) => (
            <polygon
              key={`${i}${j}`}
              points={quad(YS[2], 0.14 + i * 0.25, 0.16 + j * 0.36, 0.34 + i * 0.25, 0.44 + j * 0.36)}
              fill={(i + j) % 2 ? "#ff8a5b" : "rgba(243,244,251,.5)"}
              opacity={0.85}
            />
          ))
        )}
      </Slab>
      <Slab k={1} cy={YS[1]} color="#ffcf7a" side="#a8701b">
        {/* Annonces : cartes avec titre et prix */}
        {[0, 1].map((i) => (
          <g key={i}>
            <polygon points={quad(YS[1], 0.12 + i * 0.42, 0.14, 0.46 + i * 0.42, 0.42)} fill="rgba(243,244,251,.55)" />
            <polygon points={quad(YS[1], 0.12 + i * 0.42, 0.5, 0.4 + i * 0.42, 0.58)} fill="#ffcf7a" />
            <polygon points={quad(YS[1], 0.12 + i * 0.42, 0.66, 0.32 + i * 0.42, 0.72)} fill="rgba(243,244,251,.35)" />
          </g>
        ))}
      </Slab>
      <Slab k={2} cy={YS[0]} color={c} side="#9a6312">
        {/* Article : titre, image, lignes de texte */}
        <polygon points={quad(YS[0], 0.12, 0.12, 0.7, 0.24)} fill={c} />
        <polygon points={quad(YS[0], 0.12, 0.32, 0.4, 0.62)} fill="rgba(243,244,251,.5)" />
        {[0, 1, 2, 3, 4].map((k) => (
          <polygon key={k} points={quad(YS[0], 0.48, 0.32 + k * 0.1, 0.88 - (k % 2) * 0.12, 0.36 + k * 0.1)} fill="rgba(243,244,251,.4)" />
        ))}
        {[0, 1].map((k) => (
          <polygon key={k} points={quad(YS[0], 0.12, 0.72 + k * 0.1, 0.86 - k * 0.2, 0.76 + k * 0.1)} fill="rgba(243,244,251,.4)" />
        ))}
      </Slab>
      <Labels layers={layers} ys={YS} color={c} />
    </svg>
  );
}

export function DataArt({ layers }: { layers: readonly Layer[] }) {
  const c = "#74c3ff";
  const bars = [0.35, 0.6, 0.45, 0.8, 0.68];
  return (
    <svg viewBox="0 0 600 560" role="img" aria-label="Illustration : collecte, analyse et restitution des données">
      <Slab k={0} cy={YS[2]} color="#5b8cff" side="#2b46a8">
        {/* Collecte : tableau */}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((col) => (
            <polygon
              key={`${r}${col}`}
              points={quad(YS[2], 0.12 + col * 0.26, 0.12 + r * 0.2, 0.34 + col * 0.26, 0.26 + r * 0.2)}
              fill={r === 0 ? "#5b8cff" : "rgba(243,244,251,.35)"}
            />
          ))
        )}
      </Slab>
      <Slab k={1} cy={YS[1]} color="#9ad4ff" side="#2a6c9e">
        {/* Analyse : nuage de points */}
        {[
          [0.2, 0.75], [0.3, 0.6], [0.38, 0.66], [0.48, 0.45], [0.55, 0.52], [0.64, 0.34], [0.72, 0.38], [0.82, 0.2],
        ].map(([u, v], k) => {
          const [x, y] = iso(YS[1], u, v);
          return <ellipse key={k} cx={x} cy={y} rx={7} ry={4} fill={k % 3 ? "#9ad4ff" : "rgba(243,244,251,.7)"} />;
        })}
        <line
          x1={iso(YS[1], 0.16, 0.82)[0]}
          y1={iso(YS[1], 0.16, 0.82)[1]}
          x2={iso(YS[1], 0.86, 0.16)[0]}
          y2={iso(YS[1], 0.86, 0.16)[1]}
          stroke="rgba(243,244,251,.6)"
          strokeWidth={2}
          strokeDasharray="6 6"
        />
      </Slab>
      <Slab k={2} cy={YS[0]} color={c} side="#1f5f8f">
        {/* Restitution : barres en relief */}
        {bars.map((hgt, k) => {
          const u0 = 0.14 + k * 0.15;
          const v0 = 0.62;
          const base = [iso(YS[0], u0, v0), iso(YS[0], u0 + 0.1, v0), iso(YS[0], u0 + 0.1, v0 + 0.14), iso(YS[0], u0, v0 + 0.14)];
          const lift = hgt * 90;
          const up = base.map(([x, y]) => [x, y - lift] as Pt);
          const p = (a: Pt[]) => a.map((q) => q.join(",")).join(" ");
          return (
            <g key={k}>
              <polygon points={p([base[3], base[2], up[2], up[3]])} fill="#2f7fbf" />
              <polygon points={p([base[2], base[1], up[1], up[2]])} fill="#3d9be0" />
              <polygon points={p(up)} fill={k === 3 ? "#ffb547" : c} />
            </g>
          );
        })}
      </Slab>
      <Labels layers={layers} ys={YS} color={c} />
    </svg>
  );
}
