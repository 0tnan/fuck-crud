var e=`/* 2D physics engine starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <stdio.h>

#define DT (1.0 / 120)
#define GRAVITY (-9.81)

typedef struct {
    double x, y, vx, vy;
    double angle, omega;
    double radius;
    double inv_mass;      /* 0 means static */
    double inv_inertia;
    double restitution;
} Body;

/* Semi-implicit Euler: velocity first, then position. */
static void integrate(Body *b) {
    if (b->inv_mass == 0) return;
    b->vy += GRAVITY * DT;
    b->x += b->vx * DT;
    b->y += b->vy * DT;
    b->angle += b->omega * DT;
}

static void collide_floor(Body *b) {
    /* TODO step 2: if the circle goes below y = 0, push it out and reflect vy
       using the restitution coefficient */
    (void)b;
}

static void collide(Body *a, Body *b) {
    /* TODO step 2: circle vs circle -> normal, penetration, impulse */
    /* TODO step 3: polygons with the separating axis theorem */
    /* TODO step 5: friction impulse along the tangent, clamped by mu * normal impulse */
    (void)a; (void)b;
}

int main(void) {
    Body bodies[] = {{.x = 0, .y = 5, .radius = 0.5, .inv_mass = 1, .inv_inertia = 1, .restitution = 0.5}};
    int n = sizeof bodies / sizeof bodies[0];
    for (int step = 0; step < 360; step++) {
        for (int i = 0; i < n; i++) { integrate(&bodies[i]); collide_floor(&bodies[i]); }
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) collide(&bodies[i], &bodies[j]);
        if (step % 12 == 0) printf("t=%5.2f  y=%7.3f\\n", step * DT, bodies[0].y);
    }
    return 0;
}
`;export{e as default};