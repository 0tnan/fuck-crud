var e=`/* FFT starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <complex.h>
#include <math.h>
#include <stdio.h>

#define RATE 8000
#define N 1024
#define PI 3.14159265358979323846

/* Slow reference transform, O(N^2). Keep it to test the fast one. */
static void dft(const double complex *x, double complex *out, int n) {
    for (int k = 0; k < n; k++) {
        out[k] = 0;
        for (int t = 0; t < n; t++) out[k] += x[t] * cexp(-2 * I * PI * k * t / n);
    }
}

static void fft(const double complex *x, double complex *out, int n) {
    /* TODO step 2: recursive radix-2 FFT (split even/odd, combine with twiddles) */
    /* TODO step 3: iterative in-place version with bit reversal */
    dft(x, out, n);
}

static double hann(int i, int n) {
    /* TODO step 4: return 0.5 - 0.5*cos(2*pi*i/(n-1)) */
    (void)i; (void)n;
    return 1.0;
}

int main(void) {
    static double complex x[N], X[N];
    for (int t = 0; t < N; t++)
        x[t] = (sin(2 * PI * 440 * t / RATE) + 0.5 * sin(2 * PI * 1250 * t / RATE)) * hann(t, N);
    fft(x, X, N);
    for (int k = 1; k < N / 2 - 1; k++) {
        double m = cabs(X[k]);
        if (m > 50 && m >= cabs(X[k - 1]) && m >= cabs(X[k + 1]))     /* local peaks */
            printf("bin %4d  %7.1f Hz  magnitude %8.1f\\n", k, (double)k * RATE / N, m);
    }
    return 0;
}
`;export{e as default};