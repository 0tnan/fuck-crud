var e=`/* Inverse kinematics starter (planar arm). Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>

#define LINKS 3

static const double LENGTHS[LINKS] = {1.0, 0.8, 0.6};

typedef struct { double x, y; } Point;

/* Joint positions for relative joint angles. pts has LINKS + 1 entries. */
static void forward(const double *angles, Point *pts) {
    double x = 0, y = 0, total = 0;
    pts[0] = (Point){0, 0};
    for (int i = 0; i < LINKS; i++) {
        total += angles[i];
        x += LENGTHS[i] * cos(total);
        y += LENGTHS[i] * sin(total);
        pts[i + 1] = (Point){x, y};
    }
}

/* Returns 0 when the target is out of reach. */
static int solve_two_link(double l1, double l2, Point target, double *shoulder, double *elbow) {
    /* TODO step 2: law of cosines for the elbow, atan2 for the shoulder */
    (void)l1; (void)l2; (void)target; (void)shoulder; (void)elbow;
    return 0;
}

static void fabrik(Point *pts, Point target, int iterations) {
    /* TODO step 3: backward pass from the target, forward pass from the base */
    (void)pts; (void)target; (void)iterations;
}

static void jacobian_step(double *angles, Point target, double damping) {
    /* TODO step 4: build J (2 x n), then angles += J^T (J J^T + damping^2 I)^-1 * error */
    (void)angles; (void)target; (void)damping;
}

int main(void) {
    Point target = {1.2, 1.1}, pts[LINKS + 1];
    double angles[LINKS] = {0.3, 0.3, 0.3};
    (void)solve_two_link; (void)fabrik;
    for (int it = 0; it < 20; it++) {
        forward(angles, pts);
        Point tip = pts[LINKS];
        if (it % 5 == 0)
            printf("iteration %2d  tip (%+.3f, %+.3f)  distance to target %.4f\\n",
                   it, tip.x, tip.y, hypot(tip.x - target.x, tip.y - target.y));
        jacobian_step(angles, target, 0.1);
    }
    return 0;
}
`;export{e as default};