var e=`/* Trajectory planner starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>

#define MU_SUN 1.32712440018e20    /* m^3/s^2 */
#define AU 1.495978707e11          /* m */
#define R_EARTH (1.0 * AU)
#define R_MARS (1.524 * AU)
#define DAY 86400.0
#define PI 3.14159265358979323846

typedef struct { double x, y, vx, vy; } State;
typedef struct { double dv1, dv2, time, phase; } Transfer;

static double circular_speed(double r) { return sqrt(MU_SUN / r); }

static State rk4_step(State s, double dt) {
    /* TODO step 1: classic RK4 on d/dt (r, v) = (v, -mu r / |r|^3) */
    (void)dt;
    return s;
}

static double solve_kepler(double M, double e) {
    /* TODO step 3: Newton's method on E - e sin E - M = 0 */
    (void)e;
    return M;
}

static Transfer hohmann(double r1, double r2) {
    /* TODO step 4: a = (r1 + r2)/2, vis-viva v^2 = mu (2/r - 1/a) at both ends,
       time = pi sqrt(a^3/mu), phase = pi - n2 * time */
    (void)r1; (void)r2;
    return (Transfer){0, 0, 0, 0};
}

/* TODO step 5: Lambert's problem with universal variables */

int main(void) {
    (void)rk4_step; (void)solve_kepler;
    printf("Earth orbital speed: %.2f km/s\\n", circular_speed(R_EARTH) / 1000);
    printf("Mars orbital speed:  %.2f km/s\\n", circular_speed(R_MARS) / 1000);
    Transfer t = hohmann(R_EARTH, R_MARS);
    printf("Hohmann: dv1 %.2f + dv2 %.2f = %.2f km/s (want about 5.6)\\n",
           t.dv1 / 1000, t.dv2 / 1000, (t.dv1 + t.dv2) / 1000);
    printf("transfer time: %.0f days (want about 259), phase angle %.1f deg (want about 44)\\n",
           t.time / DAY, t.phase * 180 / PI);
    return 0;
}
`;export{e as default};