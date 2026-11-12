var e=`/* Image codec starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>

static const int QUANT[8][8] = {
    {16, 11, 10, 16, 24, 40, 51, 61}, {12, 12, 14, 19, 26, 58, 60, 55},
    {14, 13, 16, 24, 40, 57, 69, 56}, {14, 17, 22, 29, 51, 87, 80, 62},
    {18, 22, 37, 56, 68, 109, 103, 77}, {24, 35, 55, 64, 81, 104, 113, 92},
    {49, 64, 78, 87, 103, 121, 120, 101}, {72, 92, 95, 98, 112, 100, 103, 99},
};

/* Forward 8x8 DCT of a block of values centred on zero. */
static void dct2(const double in[8][8], double out[8][8]) {
    /* TODO step 2: F(u,v) = 1/4 C(u) C(v) sum f(x,y) cos((2x+1)u pi/16) cos((2y+1)v pi/16)
       with C(0) = 1/sqrt(2), otherwise 1 */
    (void)in;
    for (int v = 0; v < 8; v++) for (int u = 0; u < 8; u++) out[v][u] = 0;
}

static void idct2(const double in[8][8], double out[8][8]) {
    /* TODO step 2: the inverse transform */
    (void)in;
    for (int y = 0; y < 8; y++) for (int x = 0; x < 8; x++) out[y][x] = 0;
}

static void quantise(const double in[8][8], int out[8][8]) {
    /* TODO step 3: round(in[v][u] / QUANT[v][u]) */
    (void)in; (void)QUANT;
    for (int v = 0; v < 8; v++) for (int u = 0; u < 8; u++) out[v][u] = 0;
}

/* TODO step 4: zigzag order and run-length encoding. TODO step 5: Huffman. */

static void show(const char *title, const double b[8][8], const char *fmt) {
    puts(title);
    for (int y = 0; y < 8; y++) {
        for (int x = 0; x < 8; x++) printf(fmt, b[y][x]);
        putchar('\\n');
    }
}

int main(void) {
    double block[8][8], coeffs[8][8], back[8][8], err = 0;
    int q[8][8], nonzero = 0;
    for (int y = 0; y < 8; y++) for (int x = 0; x < 8; x++) block[y][x] = x * 16 + y * 8 - 128;
    show("pixels (minus 128):", block, "%6.0f ");
    dct2(block, coeffs);
    show("DCT coefficients:", coeffs, "%6.1f ");
    quantise(coeffs, q);
    idct2(coeffs, back);
    for (int y = 0; y < 8; y++) for (int x = 0; x < 8; x++) {
        if (q[y][x]) nonzero++;
        if (fabs(block[y][x] - back[y][x]) > err) err = fabs(block[y][x] - back[y][x]);
    }
    printf("non-zero after quantisation: %d of 64\\n", nonzero);
    printf("round-trip error: %.3f (want 0.000)\\n", err);
    return 0;
}
`;export{e as default};