/* Gray-Scott starter. Build: cc -O2 -o main main.c && ./main  ->  out.pgm */
#include <stdio.h>
#include <string.h>

#define N 256
#define DU 0.21f
#define DV 0.105f
#define F 0.037f
#define K 0.06f

static float u[N][N], v[N][N], nu[N][N], nv[N][N];

static float laplacian(float a[N][N], int i, int j) {
    /* TODO step 2: neighbours minus 4x centre, wrapping at the edges (use % N) */
    (void)a; (void)i; (void)j;
    return 0;
}

/* One Euler step with dt = 1. */
static void step(void) {
    memcpy(nu, u, sizeof u);
    memcpy(nv, v, sizeof v);
    /* TODO step 3: for every cell
         uvv = u*v*v
         nu = u + DU*lap(u) - uvv + F*(1 - u)
         nv = v + DV*lap(v) + uvv - (F + K)*v */
    (void)laplacian;
    memcpy(u, nu, sizeof u);
    memcpy(v, nv, sizeof v);
}

int main(void) {
    for (int j = 0; j < N; j++) for (int i = 0; i < N; i++) u[j][i] = 1;
    for (int j = N / 2 - 8; j < N / 2 + 8; j++)
        for (int i = N / 2 - 8; i < N / 2 + 8; i++) { u[j][i] = 0.5f; v[j][i] = 0.25f; }
    for (int n = 0; n < 5000; n++) step();
    FILE *f = fopen("out.pgm", "w");
    if (!f) return 1;
    fprintf(f, "P2\n%d %d\n255\n", N, N);
    double total = 0;
    for (int j = 0; j < N; j++) {
        for (int i = 0; i < N; i++) {
            float x = v[j][i] * 3;
            total += v[j][i];
            fprintf(f, "%d ", (int)((x > 1 ? 1 : x < 0 ? 0 : x) * 255));
        }
        fputc('\n', f);
    }
    fclose(f);
    printf("wrote out.pgm, total V = %.1f\n", total);
    return 0;
}
