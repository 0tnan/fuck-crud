var e=`/* Stable fluids starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <stdio.h>
#include <string.h>

#define N 32                      /* interior cells per side; arrays have a 1-cell border */
#define SIZE ((N + 2) * (N + 2))
#define IX(i, j) ((i) + (N + 2) * (j))

static void set_bnd(int b, float *x) {
    /* TODO step 5: copy edges from the inside; negate u on left/right (b=1), v on top/bottom (b=2) */
    (void)b; (void)x;
}

static void diffuse(int b, float *x, const float *x0, float diff, float dt) {
    /* TODO step 2: about 20 Gauss-Seidel sweeps of
       x[i,j] = (x0[i,j] + a * (sum of 4 neighbours of x)) / (1 + 4a),  a = dt*diff*N*N */
    (void)diff; (void)dt;
    memcpy(x, x0, SIZE * sizeof(float));
    set_bnd(b, x);
}

static void advect(int b, float *d, const float *d0, const float *u, const float *v, float dt) {
    /* TODO step 3: trace each cell centre backwards by dt*N*(u,v), bilinear sample d0 */
    (void)u; (void)v; (void)dt;
    memcpy(d, d0, SIZE * sizeof(float));
    set_bnd(b, d);
}

static void project(float *u, float *v, float *p, float *div) {
    /* TODO step 4: div = -0.5*(du/dx + dv/dy)/N, solve for p, subtract grad p */
    (void)u; (void)v; (void)p; (void)div;
}

static float u[SIZE], v[SIZE], dens[SIZE], u0[SIZE], v0[SIZE], d0[SIZE];

static void step(float dt, float visc, float diff) {
    memcpy(u0, u, sizeof u); memcpy(v0, v, sizeof v);
    diffuse(1, u, u0, visc, dt); diffuse(2, v, v0, visc, dt);
    project(u, v, u0, v0);
    memcpy(u0, u, sizeof u); memcpy(v0, v, sizeof v);
    advect(1, u, u0, u0, v0, dt); advect(2, v, v0, u0, v0, dt);
    project(u, v, u0, v0);
    memcpy(d0, dens, sizeof dens);
    diffuse(0, dens, d0, diff, dt);
    memcpy(d0, dens, sizeof dens);
    advect(0, dens, d0, u, v, dt);
}

int main(void) {
    const char *ramp = " .:-=+*#%@";
    for (int n = 0; n < 20; n++) {
        dens[IX(N / 2, 4)] += 4.0f;      /* a source of smoke near the bottom */
        v[IX(N / 2, 4)] += 2.0f;         /* blowing upwards */
        step(0.1f, 0.0f, 0.0001f);
    }
    for (int j = N; j > 0; j -= 2) {
        for (int i = 1; i <= N; i++) {
            int k = (int)(dens[IX(i, j)] * 9);
            putchar(ramp[k > 9 ? 9 : k < 0 ? 0 : k]);
        }
        putchar('\\n');
    }
    return 0;
}
`;export{e as default};