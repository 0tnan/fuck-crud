// Reed-Solomon starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const PRIM = 0x11d; // x^8 + x^4 + x^3 + x^2 + 1, the polynomial QR codes use
const NSYM = 10;

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

function initTables(): void {
  // TODO step 1: x = 1; for i in 0..254: EXP[i] = x, LOG[x] = i, x = x*2 (xor PRIM if it overflows 8 bits)
  //              then copy EXP[i + 255] = EXP[i] so sums of logs need no modulo
}

function gfMul(a: number, b: number): number {
  // TODO step 1: 0 if either is 0, otherwise EXP[LOG[a] + LOG[b]]
  return 0;
}

function polyMul(p: number[], q: number[]): number[] {
  // TODO step 2: schoolbook multiplication, adding with xor
  return new Array<number>(p.length + q.length - 1).fill(0);
}

function polyEval(p: number[], x: number): number {
  // TODO step 2: Horner's rule, highest degree first
  return 0;
}

function generator(nsym: number): number[] {
  // TODO step 3: product of (x - 2^i) for i in 0..nsym-1
  return [1];
}

function encode(msg: number[], nsym: number): number[] {
  // TODO step 3: remainder of msg * x^nsym divided by generator(nsym), appended to msg
  return [...msg, ...new Array<number>(nsym).fill(0)];
}

const hasErrors = (block: number[], nsym: number): boolean =>
  Array.from({ length: nsym }, (_, i) => polyEval(block, EXP[i])).some((s) => s !== 0);

initTables();
console.log(`2 * 128 in GF(256) = ${gfMul(2, 128)} (want 29)`);
const block = encode([...Buffer.from("hello world")], NSYM);
console.log("codeword:", Buffer.from(block).toString("hex"));
console.log("syndromes all zero:", !hasErrors(block, NSYM), "(want true, with real parity bytes)");
block[3] ^= 0xff;
console.log("after corrupting a byte, syndromes non-zero:", hasErrors(block, NSYM), "(want true)");
// TODO step 5: Berlekamp-Massey, Chien search, Forney -> repair the block
