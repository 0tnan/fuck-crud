/* IMU fusion starter (one axis). Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

#define DT 0.01
#define GYRO_BIAS 0.03     /* rad/s, unknown to the filter */
#define ACCEL_NOISE 0.08   /* rad */
#define PI 3.14159265358979323846

/* Gaussian noise with the Box-Muller transform. */
static double gauss(double sigma) {
    double u = (rand() + 1.0) / (RAND_MAX + 2.0), v = (rand() + 1.0) / (RAND_MAX + 2.0);
    return sigma * sqrt(-2 * log(u)) * cos(2 * PI * v);
}

typedef struct { double alpha, angle; } Complementary;

static double complementary_update(Complementary *f, double gyro, double accel_angle) {
    /* TODO step 2: blend the integrated gyro with the accelerometer angle */
    (void)accel_angle;
    f->angle += gyro * DT;       /* gyro only: this drifts */
    return f->angle;
}

/* State: angle and bias. TODO step 3: predict with the gyro, correct with the accelerometer. */
typedef struct { double angle, bias, P[2][2]; } Kalman;

static double kalman_update(Kalman *k, double gyro, double accel_angle) {
    (void)gyro; (void)accel_angle;
    return k->angle;
}

int main(void) {
    Complementary f = {0.98, 0};
    Kalman k = {0, 0, {{1, 0}, {0, 1}}};
    double worst = 0;
    srand(7);
    for (int n = 0; n < 3000; n++) {
        double t = n * DT;
        double truth = 0.5 * sin(0.8 * t), rate = 0.4 * cos(0.8 * t);
        double gyro = rate + GYRO_BIAS + gauss(0.005), acc = truth + gauss(ACCEL_NOISE);
        double est = complementary_update(&f, gyro, acc);
        kalman_update(&k, gyro, acc);
        if (fabs(est - truth) > worst) worst = fabs(est - truth);
        if (n % 500 == 0) printf("t=%5.1fs  truth %+.3f  estimate %+.3f  error %+.3f\n", t, truth, est, est - truth);
    }
    printf("worst error: %.1f degrees\n", worst * 180 / PI);
    return 0;
}
