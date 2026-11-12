/* Path tracer starter. Build: cc -O2 -o main main.c -lm && ./main  ->  out.ppm */
#include <math.h>
#include <stdio.h>

#define W 400
#define H 225

typedef struct { double x, y, z; } Vec;

static Vec add(Vec a, Vec b) { return (Vec){a.x + b.x, a.y + b.y, a.z + b.z}; }
static Vec sub(Vec a, Vec b) { return (Vec){a.x - b.x, a.y - b.y, a.z - b.z}; }
static Vec mul(Vec a, double s) { return (Vec){a.x * s, a.y * s, a.z * s}; }
static double dot(Vec a, Vec b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
static Vec unit(Vec a) { return mul(a, 1 / sqrt(dot(a, a))); }

/* Nearest positive t where the ray hits the sphere, or -1. */
static double hit_sphere(Vec center, double radius, Vec origin, Vec dir) {
    /* TODO step 3: solve |origin + t*dir - center|^2 = radius^2 */
    (void)center; (void)radius; (void)origin; (void)dir; (void)sub;
    return -1;
}

static Vec ray_color(Vec origin, Vec dir, int depth) {
    /* TODO step 3: shade by the normal when hit_sphere returns t > 0 */
    /* TODO step 4: scatter in a random direction and recurse (stop at depth 8) */
    /* TODO step 5: metal (reflect) and glass (refract + Schlick) */
    (void)origin; (void)depth; (void)hit_sphere;
    double t = 0.5 * (dir.y + 1);
    return add(mul((Vec){1, 1, 1}, 1 - t), mul((Vec){0.5, 0.7, 1.0}, t));
}

static int to_byte(double x) { return (int)(255.99 * fmin(fmax(x, 0), 1)); }

int main(void) {
    FILE *f = fopen("out.ppm", "w");
    if (!f) return 1;
    fprintf(f, "P3\n%d %d\n255\n", W, H);
    double aspect = (double)W / H;
    for (int j = 0; j < H; j++) {
        for (int i = 0; i < W; i++) {
            double u = (i + 0.5) / W * 2 - 1, v = 1 - (j + 0.5) / H * 2;
            /* TODO step 4: average many jittered samples, then gamma-correct */
            Vec c = ray_color((Vec){0, 0, 0}, unit((Vec){u * aspect, v, -1}), 0);
            fprintf(f, "%d %d %d\n", to_byte(c.x), to_byte(c.y), to_byte(c.z));
        }
    }
    fclose(f);
    puts("wrote out.ppm");
    return 0;
}
