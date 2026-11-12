var e=`/* Reed-Solomon starter. Build: cc -O2 -o main main.c && ./main */
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define PRIM 0x11d     /* x^8 + x^4 + x^3 + x^2 + 1, the polynomial QR codes use */
#define NSYM 10

static uint8_t EXP[512], LOG[256];

static void init_tables(void) {
    /* TODO step 1: x = 1; for i in 0..254: EXP[i] = x, LOG[x] = i, x = x*2 (xor PRIM on overflow)
       then copy EXP[i + 255] = EXP[i] so sums of logs need no modulo */
}

static uint8_t gf_mul(uint8_t a, uint8_t b) {
    /* TODO step 1: 0 if either is 0, otherwise EXP[LOG[a] + LOG[b]] */
    (void)a; (void)b; (void)LOG;
    return 0;
}

static uint8_t poly_eval(const uint8_t *p, int n, uint8_t x) {
    /* TODO step 2: Horner's rule, highest degree first */
    (void)p; (void)n; (void)x;
    return 0;
}

/* out has room for n + NSYM bytes. */
static void encode(const uint8_t *msg, int n, uint8_t *out) {
    /* TODO step 3: generator = product of (x - 2^i), then append
       the remainder of msg * x^NSYM divided by it */
    memcpy(out, msg, n);
    memset(out + n, 0, NSYM);
}

static int has_errors(const uint8_t *block, int n) {
    int any = 0;
    for (int i = 0; i < NSYM; i++) any |= poly_eval(block, n, EXP[i]);
    return any != 0;
}

int main(void) {
    const char *msg = "hello world";
    int n = (int)strlen(msg);
    uint8_t block[64];
    init_tables();
    printf("2 * 128 in GF(256) = %d (want 29)\\n", gf_mul(2, 128));
    encode((const uint8_t *)msg, n, block);
    printf("codeword: ");
    for (int i = 0; i < n + NSYM; i++) printf("%02x", block[i]);
    printf("\\nsyndromes all zero: %s (want yes, with real parity bytes)\\n", has_errors(block, n + NSYM) ? "no" : "yes");
    block[3] ^= 0xff;
    printf("after corrupting a byte, syndromes non-zero: %s (want yes)\\n", has_errors(block, n + NSYM) ? "yes" : "no");
    /* TODO step 5: Berlekamp-Massey, Chien search, Forney -> repair the block */
    return 0;
}
`;export{e as default};