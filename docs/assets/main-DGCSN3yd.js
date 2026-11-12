var e=`/* Marching cubes starter. Build: cc -O2 -o main main.c -lm && ./main  ->  out.obj */
#include <math.h>
#include <stdio.h>

#define N 24                   /* cells per side */
#define ISO 0.0f

static float grid[N + 1][N + 1][N + 1];

/* Negative inside, positive outside. Start with a sphere of radius 0.7. */
static float density(float x, float y, float z) {
    return sqrtf(x * x + y * y + z * z) - 0.7f;
}

static void sample(void) {
    for (int i = 0; i <= N; i++)
        for (int j = 0; j <= N; j++)
            for (int k = 0; k <= N; k++)
                grid[i][j][k] = density(i * 2.0f / N - 1, j * 2.0f / N - 1, k * 2.0f / N - 1);
}

/* 8-bit case number: bit n is set when corner n is inside. */
static int cube_index(int i, int j, int k) {
    static const int corner[8][3] = {{0,0,0},{1,0,0},{1,1,0},{0,1,0},{0,0,1},{1,0,1},{1,1,1},{0,1,1}};
    int idx = 0;
    for (int n = 0; n < 8; n++)
        if (grid[i + corner[n][0]][j + corner[n][1]][k + corner[n][2]] < ISO) idx |= 1 << n;
    return idx;
}

/* Writes "v x y z" and "f a b c" lines. Returns the number of triangles. */
static int polygonise(FILE *out) {
    /* TODO step 2: get edgeTable and triTable (Paul Bourke, "Polygonising a scalar field") */
    /* TODO step 3: for each cell, interpolate a vertex on every crossed edge, emit triangles */
    /* TODO step 4: normals from the gradient of density() */
    (void)out;
    return 0;
}

int main(void) {
    sample();
    int crossed = 0;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            for (int k = 0; k < N; k++) {
                int c = cube_index(i, j, k);
                if (c != 0 && c != 255) crossed++;
            }
    printf("%d of %d cells contain the surface\\n", crossed, N * N * N);
    FILE *f = fopen("out.obj", "w");
    if (!f) return 1;
    printf("wrote out.obj: %d triangles\\n", polygonise(f));
    fclose(f);
    return 0;
}
`;export{e as default};