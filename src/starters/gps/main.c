/* GPS solver starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <math.h>
#include <stdio.h>

#define C 299792458.0          /* speed of light, m/s */
#define EARTH_R 6371000.0
#define SAT_R 26571000.0       /* orbit radius of GPS satellites */
#define NSAT 6
#define PI 3.14159265358979323846

typedef struct { double x, y, z; } Vec;

static Vec on_sphere(double radius, double lat_deg, double lon_deg) {
    double lat = lat_deg * PI / 180, lon = lon_deg * PI / 180;
    return (Vec){radius * cos(lat) * cos(lon), radius * cos(lat) * sin(lon), radius * sin(lat)};
}

static double dist(Vec a, Vec b) {
    return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z));
}

/* est = {x, y, z, clock bias in metres} */
static void solve(const Vec *sats, const double *rho, int n, double est[4]) {
    for (int it = 0; it < 8; it++) {
        /* TODO step 2: residuals r_i = rho_i - (|s_i - x| + b) and rows of H:
           [-(s_i - x)/|s_i - x|, 1] */
        /* TODO step 3: solve (H^T H) dx = H^T r (4x4, Gaussian elimination), est += dx */
        (void)sats; (void)rho; (void)n; (void)est;
    }
}

int main(void) {
    static const double where[NSAT][2] = {{60, 10}, {30, -40}, {20, 50}, {70, 120}, {10, 0}, {45, 80}};
    static const double noise[NSAT] = {1.3, -2.1, 0.4, 2.6, -0.8, -1.5};   /* metres */
    Vec truth = on_sphere(EARTH_R, 48.85, 2.35), sats[NSAT];
    double rho[NSAT], bias = 1e-4, est[4] = {0, 0, 0, 0};                 /* bias in seconds */
    printf("pseudoranges (km):");
    for (int i = 0; i < NSAT; i++) {
        sats[i] = on_sphere(SAT_R, where[i][0], where[i][1]);
        rho[i] = dist(sats[i], truth) + C * bias + noise[i];
        printf(" %.0f", rho[i] / 1000);
    }
    solve(sats, rho, NSAT, est);
    printf("\nposition error: %.3f km\n", dist((Vec){est[0], est[1], est[2]}, truth) / 1000);
    printf("clock bias: %.2f microseconds (truth 100.00)\n", est[3] / C * 1e6);
    /* TODO step 4: convert est to latitude, longitude, height on WGS-84 */
    return 0;
}
