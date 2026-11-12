var e=`//! RV32I emulator starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const MEM_SIZE: usize = 64 * 1024;

struct Cpu {
    x: [u32; 32],
    pc: u32,
    mem: Vec<u8>,
}

/// Sign-extend the low \`bits\` bits of value.
fn sext(value: u32, bits: u32) -> i32 {
    let shift = 32 - bits;
    ((value << shift) as i32) >> shift
}

impl Cpu {
    fn new(program: &[u32]) -> Cpu {
        let mut mem = vec![0u8; MEM_SIZE];
        for (i, word) in program.iter().enumerate() {
            mem[i * 4..i * 4 + 4].copy_from_slice(&word.to_le_bytes());
        }
        Cpu { x: [0; 32], pc: 0, mem }
    }

    fn load32(&self, addr: u32) -> u32 {
        let a = addr as usize;
        u32::from_le_bytes([self.mem[a], self.mem[a + 1], self.mem[a + 2], self.mem[a + 3]])
    }

    /// Execute one instruction. Returns false to halt.
    fn step(&mut self) -> bool {
        let inst = self.load32(self.pc);
        let opcode = inst & 0x7f;
        let rd = ((inst >> 7) & 31) as usize;
        let funct3 = (inst >> 12) & 7;
        let rs1 = ((inst >> 15) & 31) as usize;
        let rs2 = ((inst >> 20) & 31) as usize;
        match (opcode, funct3) {
            (0x13, 0) => self.x[rd] = self.x[rs1].wrapping_add(sext(inst >> 20, 12) as u32), // ADDI
            // TODO step 3: the other OP-IMM (0x13) and OP (0x33) instructions
            // TODO step 4: branches (0x63), JAL (0x6f), JALR (0x67), LUI (0x37), AUIPC (0x17)
            // TODO step 5: loads (0x03), stores (0x23), ECALL (0x73)
            _ => {
                println!("unknown instruction {:08x} at pc={:#x}", inst, self.pc);
                return false;
            }
        }
        self.x[0] = 0;
        self.pc = self.pc.wrapping_add(4);
        true
    }
}

const PROGRAM: [u32; 4] = [
    0x00500093, // addi x1, x0, 5
    0x00700113, // addi x2, x0, 7
    0x002081b3, // add  x3, x1, x2    <- not implemented yet
    0x00000073, // ecall
];

fn main() {
    let mut cpu = Cpu::new(&PROGRAM);
    while cpu.step() {}
    println!("x1..x3 = {} {} {} (want 5 7 12)", cpu.x[1], cpu.x[2], cpu.x[3]);
}
`;export{e as default};