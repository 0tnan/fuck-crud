"""RV32I emulator starter. Run: python3 main.py"""
MEM_SIZE = 64 * 1024
MASK = 0xFFFFFFFF

def sext(value, bits):
    """Sign-extend the low `bits` bits of value."""
    return (value ^ (1 << (bits - 1))) - (1 << (bits - 1))

class CPU:
    def __init__(self, program):
        self.x = [0] * 32
        self.pc = 0
        self.mem = bytearray(MEM_SIZE)
        for i, word in enumerate(program):
            self.mem[i * 4:i * 4 + 4] = word.to_bytes(4, "little")

    def fetch(self):
        return int.from_bytes(self.mem[self.pc:self.pc + 4], "little")

    def step(self):
        """Execute one instruction. Return False to halt."""
        inst = self.fetch()
        opcode = inst & 0x7F
        rd, funct3 = (inst >> 7) & 31, (inst >> 12) & 7
        rs1, rs2 = (inst >> 15) & 31, (inst >> 20) & 31
        if opcode == 0x13 and funct3 == 0:                 # ADDI
            self.x[rd] = (self.x[rs1] + sext(inst >> 20, 12)) & MASK
        # TODO step 3: the other OP-IMM (0x13) and OP (0x33) instructions
        # TODO step 4: branches (0x63), JAL (0x6F), JALR (0x67), LUI (0x37), AUIPC (0x17)
        # TODO step 5: loads (0x03), stores (0x23), ECALL (0x73)
        else:
            print(f"unknown instruction {inst:08x} at pc={self.pc:#x}")
            return False
        self.x[0] = 0
        self.pc += 4
        return True

PROGRAM = [
    0x00500093,   # addi x1, x0, 5
    0x00700113,   # addi x2, x0, 7
    0x002081B3,   # add  x3, x1, x2    <- not implemented yet
    0x00000073,   # ecall
]

if __name__ == "__main__":
    cpu = CPU(PROGRAM)
    while cpu.step():
        pass
    print("x1..x3 =", cpu.x[1:4], "(want [5, 7, 12])")
