var e=`/* N-body starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define NB 60
#define G 1.0
#define EPS 0.05
#define DT 0.01

typedef struct { double x, y, vx, vy, ax, ay, m; } Body;

/* Direct O(N^2) sum. Reference for the Barnes-Hut version. */
static void accelerations(Body *b, int n) {
    for (int i = 0; i < n; i++) {
        b[i].ax = b[i].ay = 0;
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            double dx = b[j].x - b[i].x, dy = b[j].y - b[i].y;
            double inv = G * b[j].m / pow(dx * dx + dy * dy + EPS * EPS, 1.5);
            b[i].ax += dx * inv;
            b[i].ay += dy * inv;
        }
    }
}

static void tree_accelerations(Body *b, int n, double theta) {
    /* TODO step 3: build a quadtree storing mass and centre of mass per node */
    /* TODO step 4: walk it, opening a cell only when size / distance > theta */
    (void)theta;
    accelerations(b, n);
}

static double energy(const Body *b, int n) {
    double e = 0;
    for (int i = 0; i < n; i++) {
        e += 0.5 * b[i].m * (b[i].vx * b[i].vx + b[i].vy * b[i].vy);
        for (int j = i + 1; j < n; j++) {
            double dx = b[i].x - b[j].x, dy = b[i].y - b[j].y;
            e -= G * b[i].m * b[j].m / sqrt(dx * dx + dy * dy + EPS * EPS);
        }
    }
    return e;
}

static void step(Body *b, int n) {
    /* TODO step 2: replace Euler with leapfrog (half kick, drift, half kick) */
    tree_accelerations(b, n, 0.5);
    for (int i = 0; i < n; i++) {
        b[i].x += b[i].vx * DT; b[i].y += b[i].vy * DT;
        b[i].vx += b[i].ax * DT; b[i].vy += b[i].ay * DT;
    }
}

int main(void) {
    static Body b[NB];
    srand(1);
    for (int i = 0; i < NB; i++) {
        b[i].x = rand() / (double)RAND_MAX * 2 - 1;
        b[i].y = rand() / (double)RAND_MAX * 2 - 1;
        b[i].vx = -b[i].y * 0.8; b[i].vy = b[i].x * 0.8;   /* TODO step 5: a real disc */
        b[i].m = 1.0 / NB;
    }
    for (int s = 0; s <= 200; s++) {
        if (s % 50 == 0) printf("step %4d  energy %+.6f\\n", s, energy(b, NB));
        step(b, NB);
    }
    return 0;
}
`;export{e as default};