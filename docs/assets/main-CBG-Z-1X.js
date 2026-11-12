var e=`// Image codec starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
type Block = number[][];

const QUANT: Block = [
  [16, 11, 10, 16, 24, 40, 51, 61], [12, 12, 14, 19, 26, 58, 60, 55],
  [14, 13, 16, 24, 40, 57, 69, 56], [14, 17, 22, 29, 51, 87, 80, 62],
  [18, 22, 37, 56, 68, 109, 103, 77], [24, 35, 55, 64, 81, 104, 113, 92],
  [49, 64, 78, 87, 103, 121, 120, 101], [72, 92, 95, 98, 112, 100, 103, 99],
];

const zeros = (): Block => Array.from({ length: 8 }, () => new Array<number>(8).fill(0));

/** Forward 8x8 DCT of a block of values centred on zero. */
function dct2(block: Block): Block {
  // TODO step 2: F(u,v) = 1/4 C(u) C(v) sum f(x,y) cos((2x+1)u pi/16) cos((2y+1)v pi/16)
  //              with C(0) = 1/sqrt(2), otherwise 1
  return zeros();
}

function idct2(coeffs: Block): Block {
  // TODO step 2: the inverse transform
  return zeros();
}

function quantise(coeffs: Block, table: Block = QUANT): Block {
  // TODO step 3: round(coeffs[v][u] / table[v][u])
  return zeros();
}

function zigzag(block: Block): number[] {
  // TODO step 4: return the 64 values in zigzag order, then run-length encode
  return block.flat();
}

function show(title: string, block: Block, decimals = 0): void {
  console.log(title);
  for (const row of block) console.log(row.map((x) => x.toFixed(decimals).padStart(6)).join(" "));
}

const block: Block = Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => x * 16 + y * 8 - 128)); // a smooth gradient
show("pixels (minus 128):", block);
const coeffs = dct2(block);
show("DCT coefficients:", coeffs, 1);
console.log("non-zero after quantisation:", zigzag(quantise(coeffs)).filter((x) => x !== 0).length, "of 64");
const back = idct2(coeffs);
let err = 0;
for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) err = Math.max(err, Math.abs(block[y][x] - back[y][x]));
console.log(\`round-trip error: \${err.toFixed(3)} (want 0.000)\`);
`;export{e as default};