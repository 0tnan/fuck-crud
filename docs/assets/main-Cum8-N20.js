var e=`/* RV32I emulator starter. Build: cc -O2 -o main main.c && ./main */
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define MEM_SIZE (64 * 1024)

typedef struct {
    uint32_t x[32];
    uint32_t pc;
    uint8_t mem[MEM_SIZE];
} CPU;

/* Sign-extend the low \`bits\` bits of value. */
static int32_t sext(uint32_t value, int bits) {
    uint32_t m = 1u << (bits - 1);
    value &= (1u << bits) - 1;
    return (int32_t)((value ^ m) - m);
}

static uint32_t load32(const CPU *c, uint32_t a) {
    return c->mem[a] | c->mem[a + 1] << 8 | c->mem[a + 2] << 16 | (uint32_t)c->mem[a + 3] << 24;
}

/* Execute one instruction. Returns 0 to halt. */
static int step(CPU *c) {
    uint32_t inst = load32(c, c->pc);
    uint32_t opcode = inst & 0x7f, rd = (inst >> 7) & 31, funct3 = (inst >> 12) & 7;
    uint32_t rs1 = (inst >> 15) & 31, rs2 = (inst >> 20) & 31;
    (void)rs2;
    if (opcode == 0x13 && funct3 == 0) {                   /* ADDI */
        c->x[rd] = c->x[rs1] + (uint32_t)sext(inst >> 20, 12);
    }
    /* TODO step 3: the other OP-IMM (0x13) and OP (0x33) instructions */
    /* TODO step 4: branches (0x63), JAL (0x6f), JALR (0x67), LUI (0x37), AUIPC (0x17) */
    /* TODO step 5: loads (0x03), stores (0x23), ECALL (0x73) */
    else {
        printf("unknown instruction %08x at pc=0x%x\\n", inst, c->pc);
        return 0;
    }
    c->x[0] = 0;
    c->pc += 4;
    return 1;
}

static const uint32_t PROGRAM[] = {
    0x00500093, /* addi x1, x0, 5 */
    0x00700113, /* addi x2, x0, 7 */
    0x002081b3, /* add  x3, x1, x2    <- not implemented yet */
    0x00000073, /* ecall */
};

int main(void) {
    static CPU cpu;
    for (size_t i = 0; i < sizeof PROGRAM / 4; i++)
        for (int b = 0; b < 4; b++) cpu.mem[i * 4 + b] = (PROGRAM[i] >> (8 * b)) & 255;
    while (step(&cpu)) {}
    printf("x1..x3 = %u %u %u (want 5 7 12)\\n", cpu.x[1], cpu.x[2], cpu.x[3]);
    return 0;
}
`;export{e as default};