var e=`// RV32I emulator starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
const MEM_SIZE = 64 * 1024;

/** Sign-extend the low \`bits\` bits of value. */
const sext = (value: number, bits: number): number => (value << (32 - bits)) >> (32 - bits);

class CPU {
  x = new Uint32Array(32);
  pc = 0;
  mem = new Uint8Array(MEM_SIZE);
  view = new DataView(this.mem.buffer);

  constructor(program: number[]) {
    program.forEach((word, i) => this.view.setUint32(i * 4, word, true));
  }

  /** Execute one instruction. Returns false to halt. */
  step(): boolean {
    const inst = this.view.getUint32(this.pc, true);
    const opcode = inst & 0x7f;
    const rd = (inst >>> 7) & 31, funct3 = (inst >>> 12) & 7;
    const rs1 = (inst >>> 15) & 31, rs2 = (inst >>> 20) & 31;
    if (opcode === 0x13 && funct3 === 0) {          // ADDI
      this.x[rd] = this.x[rs1] + sext(inst >>> 20, 12);
    }
    // TODO step 3: the other OP-IMM (0x13) and OP (0x33) instructions
    // TODO step 4: branches (0x63), JAL (0x6f), JALR (0x67), LUI (0x37), AUIPC (0x17)
    // TODO step 5: loads (0x03), stores (0x23), ECALL (0x73)
    else {
      console.log(\`unknown instruction \${inst.toString(16).padStart(8, "0")} at pc=0x\${this.pc.toString(16)}\`);
      return false;
    }
    this.x[0] = 0;
    this.pc += 4;
    return true;
  }
}

const PROGRAM = [
  0x00500093, // addi x1, x0, 5
  0x00700113, // addi x2, x0, 7
  0x002081b3, // add  x3, x1, x2    <- not implemented yet
  0x00000073, // ecall
];

const cpu = new CPU(PROGRAM);
while (cpu.step()) { /* run until halt */ }
console.log(\`x1..x3 = \${cpu.x[1]} \${cpu.x[2]} \${cpu.x[3]} (want 5 7 12)\`);
`;export{e as default};