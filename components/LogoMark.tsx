export default function LogoMark({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  const nc  = dark ? "#4abb86" : "#7aaa84";   // network node color
  const ec  = dark ? "rgba(210,240,225,0.38)" : "#2a3828"; // network edge color
  const ew  = dark ? 1.1 : 1.3;               // network edge width
  const tc  = dark ? "#ffc030" : "#6b5010";   // TW edge color  — much darker in light
  const tw  = dark ? 2.6  : 2.1;              // TW edge width
  const tn  = dark ? "#ffaa18" : "#5a4210";   // TW node fill   — dark brown-gold in light
  const nr  = dark ? 4.8  : 4.4;             // network node radius
  const tr  = dark ? 5.2  : 4.8;             // TW node radius
  const id  = dark ? "dm" : "lm";            // unique filter id

  // ── coordinates ──────────────────────────────────────────
  // outer polygon nodes
  const O: [number,number][] = [
    [100,15],[137,22],[160,44],[170,72],[165,106],
    [150,138],[130,163],[100,173],[70,163],[50,138],
    [35,106],[30,72],[40,44],[63,22],
  ];
  // mid-ring nodes
  const M: [number,number][] = [
    [79,41],[121,41],[150,80],[150,124],
    [121,157],[79,157],[50,124],[50,80],
  ];
  // TW monogram nodes (golden)
  const TL:[number,number]=[64,76], TC:[number,number]=[82,76], TR:[number,number]=[97,76];
  const TV1:[number,number]=[82,92], TV2:[number,number]=[82,109], TV3:[number,number]=[82,125], TV4:[number,number]=[82,141];
  const W2:[number,number]=[109,117], W3:[number,number]=[121,93], W4:[number,number]=[133,117], W5:[number,number]=[147,76];

  // ── edge helpers ─────────────────────────────────────────
  const L = ([x1,y1]:[number,number],[x2,y2]:[number,number], key:string, sw:number, col:string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={sw} strokeLinecap="round"/>
  );

  // network edges
  const netEdges: [[number,number],[number,number]][] = [
    // outer perimeter
    ...(O.map((p,i) => [p, O[(i+1)%O.length]] as [[number,number],[number,number]])),
    // outer skip-2 chords
    ...(O.map((p,i) => [p, O[(i+2)%O.length]] as [[number,number],[number,number]])),
    // mid-ring
    ...(M.map((p,i) => [p, M[(i+1)%M.length]] as [[number,number],[number,number]])),
    // mid to outer
    [M[0],O[0]], [M[0],O[13]], [M[0],O[12]],
    [M[1],O[0]], [M[1],O[1]],  [M[1],O[2]],
    [M[2],O[2]], [M[2],O[3]],  [M[2],O[4]],
    [M[3],O[4]], [M[3],O[5]],  [M[3],O[6]],
    [M[4],O[6]], [M[4],O[7]],  [M[4],O[8]],
    [M[5],O[7]], [M[5],O[8]],  [M[5],O[9]],
    [M[6],O[9]], [M[6],O[10]], [M[6],O[11]],
    [M[7],O[11]],[M[7],O[12]], [M[7],O[13]],
    // mid to TW
    [M[0],TL], [M[0],TC],
    [M[1],W5], [M[1],TR],
    [M[7],TL], [M[7],TV1],
    [M[2],W5], [M[2],W3],
    [M[6],TV3],[M[6],TV4],
    [M[3],W4], [M[3],W3],
    [M[5],TV4],[M[5],TV3],
    [M[4],W2], [M[4],W4],
    // cross-center (non-TW)
    [TV1,TR], [TV2,W3], [TV3,W2],
    // outer to TW direct
    [O[0],TC],  [O[0],W5],
    [O[13],TL], [O[1],W5],
    [O[11],TV4],[O[7],TV4],
  ];

  // TW golden edges
  const twEdges: [[number,number],[number,number]][] = [
    [TL,TC],[TC,TR],                       // T crossbar
    [TC,TV1],[TV1,TV2],[TV2,TV3],[TV3,TV4],// T vertical
    [TR,W2],[W2,W3],[W3,W4],[W4,W5],       // W
  ];

  const twNodes: [number,number][] = [TL,TC,TR,TV1,TV2,TV3,TV4,W2,W3,W4,W5];
  const netNodes: [number,number][] = [...O,...M];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      {dark && (
        <defs>
          <filter id={`glow-${id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      )}

      {/* network edges */}
      <g strokeLinecap="round">
        {netEdges.map((e,i) => L(e[0],e[1],`ne${i}`,ew,ec))}
      </g>

      {/* TW golden edges */}
      <g strokeLinecap="round" filter={dark ? `url(#glow-${id})` : undefined}>
        {twEdges.map((e,i) => L(e[0],e[1],`te${i}`,tw,tc))}
      </g>

      {/* network nodes */}
      {netNodes.map(([x,y],i) => (
        <circle key={`nn${i}`} cx={x} cy={y} r={nr} fill={nc}/>
      ))}

      {/* TW nodes (golden) */}
      <g filter={dark ? `url(#glow-${id})` : undefined}>
        {twNodes.map(([x,y],i) => (
          <circle key={`tn${i}`} cx={x} cy={y} r={tr} fill={tn}/>
        ))}
      </g>
    </svg>
  );
}
