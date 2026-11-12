var e=`/* Particle filter starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define N 1000
#define NB 3
#define RANGE_NOISE 0.3
#define MOTION_NOISE 0.05
#define PI 3.14159265358979323846

static const double BEACONS[NB][2] = {{-4, -3}, {5, -2}, {0, 5}};

static double uniform(double lo, double hi) { return lo + (hi - lo) * rand() / RAND_MAX; }
static double gauss(double sigma) {
    double u = (rand() + 1.0) / (RAND_MAX + 2.0), v = (rand() + 1.0) / (RAND_MAX + 2.0);
    return sigma * sqrt(-2 * log(u)) * cos(2 * PI * v);
}

typedef struct { double x, y, w; } Particle;

/* Move every particle by the commanded motion, each with its own noise. */
static void predict(Particle *p, double dx, double dy) {
    for (int i = 0; i < N; i++) { p[i].x += dx + gauss(MOTION_NOISE); p[i].y += dy + gauss(MOTION_NOISE); }
}

static void weigh(Particle *p, const double z[NB]) {
    /* TODO step 3: w_i = product over beacons of exp(-(z - expected)^2 / (2 sigma^2)),
       computed in log space, then normalised to sum to 1 */
    (void)z; (void)BEACONS;
    for (int i = 0; i < N; i++) p[i].w = 1.0 / N;
}

static void resample(Particle *p) {
    /* TODO step 4: systematic resampling (one random offset, N evenly spaced pointers) */
    /* TODO step 5: replace a few particles with random ones to survive kidnapping */
    (void)p;
}

int main(void) {
    static Particle p[N];
    srand(5);
    for (int i = 0; i < N; i++) { p[i].x = uniform(-6, 6); p[i].y = uniform(-6, 6); }
    double x = 2, y = 0, z[NB];
    for (int step = 0; step < 60; step++) {
        double a = step * 0.1, dx = -0.2 * sin(a), dy = 0.2 * cos(a);    /* drive in a circle */
        x += dx; y += dy;
        for (int b = 0; b < NB; b++) z[b] = hypot(x - BEACONS[b][0], y - BEACONS[b][1]) + gauss(RANGE_NOISE);
        predict(p, dx, dy);
        weigh(p, z);
        resample(p);
        if (step % 10 == 0) {
            double ex = 0, ey = 0;
            for (int i = 0; i < N; i++) { ex += p[i].x / N; ey += p[i].y / N; }
            printf("step %2d  truth (%+.2f, %+.2f)  estimate (%+.2f, %+.2f)  error %.2f\\n",
                   step, x, y, ex, ey, hypot(ex - x, ey - y));
        }
    }
    return 0;
}
`;export{e as default};