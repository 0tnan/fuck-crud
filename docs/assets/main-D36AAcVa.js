var e=`/* Quadcopter controller starter (altitude axis). Build: cc -O2 -o main main.c -lm && ./main */
#include <stdio.h>

#define DT 0.002           /* 500 Hz control loop */
#define MASS 1.2           /* kg */
#define G 9.81
#define MAX_THRUST 30.0    /* N, all four rotors */

typedef struct { double kp, ki, kd, integral, prev_error; } PID;

static double pid_update(PID *p, double error, double dt) {
    /* TODO step 1: proportional + integral + derivative terms */
    /* TODO step 6: anti-windup (clamp the integral), filter the derivative */
    (void)p; (void)error; (void)dt;
    return 0;
}

/* Step 1 models height only. TODO step 2: full 3D state with a quaternion. */
typedef struct { double z, vz; } Quad;

static void quad_step(Quad *q, double thrust, double dt) {
    if (thrust < 0) thrust = 0;
    if (thrust > MAX_THRUST) thrust = MAX_THRUST;
    q->vz += (thrust / MASS - G) * dt;
    q->z += q->vz * dt;
    if (q->z < 0) { q->z = 0; q->vz = 0; }     /* on the ground */
}

static void mix(double thrust, double roll, double pitch, double yaw, double rotors[4]) {
    /* TODO step 3: four demands -> four rotor thrusts (X configuration) */
    (void)roll; (void)pitch; (void)yaw;
    for (int i = 0; i < 4; i++) rotors[i] = thrust / 4;
}

int main(void) {
    Quad quad = {0, 0};
    PID pid = {.kp = 0, .ki = 0, .kd = 0};
    double target = 1.0, rotors[4];
    for (int n = 0; n <= 2500; n++) {
        double hover = MASS * G * 0.9;         /* deliberately wrong: the I term must fix it */
        double thrust = hover + pid_update(&pid, target - quad.z, DT);
        mix(thrust, 0, 0, 0, rotors);
        quad_step(&quad, rotors[0] + rotors[1] + rotors[2] + rotors[3], DT);
        if (n % 250 == 0) printf("t=%4.1fs  z=%6.3f m  target %.1f m\\n", n * DT, quad.z, target);
    }
    return 0;
}
`;export{e as default};