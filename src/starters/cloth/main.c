/* Cloth starter: a hanging rope first. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>

#define DT (1.0 / 60)
#define REST 0.1
#define COUNT 20

typedef struct { double pos[3], prev[3]; int pinned; } Particle;

static const double GRAVITY[3] = {0, -9.81, 0};

static void verlet(Particle *p, double damping) {
    if (p->pinned) return;
    for (int k = 0; k < 3; k++) {
        double cur = p->pos[k];
        p->pos[k] = cur + (cur - p->prev[k]) * damping + GRAVITY[k] * DT * DT;
        p->prev[k] = cur;
    }
}

static double dist(const Particle *a, const Particle *b) {
    double s = 0;
    for (int k = 0; k < 3; k++) s += (a->pos[k] - b->pos[k]) * (a->pos[k] - b->pos[k]);
    return sqrt(s);
}

static void satisfy(Particle *a, Particle *b, double rest) {
    /* TODO step 2: measure the distance between a and b, and move each
       (unless pinned) half of the error along the line joining them */
    (void)a; (void)b; (void)rest;
}

int main(void) {
    /* a horizontal rope pinned at one end */
    Particle rope[COUNT] = {0};
    for (int i = 0; i < COUNT; i++) {
        rope[i].pos[0] = rope[i].prev[0] = i * REST;
        rope[i].pinned = i == 0;
    }
    /* TODO step 3: build a W x H grid with structural, shear and bend links */
    /* TODO step 4: wind force per triangle, sphere collision */
    for (int frame = 0; frame < 240; frame++) {
        for (int i = 0; i < COUNT; i++) verlet(&rope[i], 0.99);
        for (int it = 0; it < 8; it++)
            for (int i = 0; i + 1 < COUNT; i++) satisfy(&rope[i], &rope[i + 1], REST);
        if (frame % 40 == 0) {
            double lowest = 0, length = 0;
            for (int i = 0; i < COUNT; i++) if (rope[i].pos[1] < lowest) lowest = rope[i].pos[1];
            for (int i = 0; i + 1 < COUNT; i++) length += dist(&rope[i], &rope[i + 1]);
            printf("frame %3d  lowest y %8.3f  rope length %7.3f (want 1.900)\n", frame, lowest, length);
        }
    }
    return 0;
}
