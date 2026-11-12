var e=`/* Synthesizer starter. Build: cc -O2 -o main main.c -lm && ./main  ->  out.wav */
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define RATE 44100
#define PI 3.14159265358979323846

static void put32(FILE *f, uint32_t v) { for (int i = 0; i < 4; i++) fputc((v >> (8 * i)) & 255, f); }
static void put16(FILE *f, uint16_t v) { fputc(v & 255, f); fputc(v >> 8, f); }

static void write_wav(const char *path, const float *s, int n) {
    FILE *f = fopen(path, "wb");
    if (!f) exit(1);
    fputs("RIFF", f); put32(f, 36 + n * 2); fputs("WAVEfmt ", f);
    put32(f, 16); put16(f, 1); put16(f, 1); put32(f, RATE); put32(f, RATE * 2); put16(f, 2); put16(f, 16);
    fputs("data", f); put32(f, n * 2);
    for (int i = 0; i < n; i++) {
        float x = s[i] > 1 ? 1 : s[i] < -1 ? -1 : s[i];
        put16(f, (uint16_t)(int16_t)(x * 32767));
    }
    fclose(f);
}

/* phase is in [0, 1). Returns a sample in [-1, 1]. */
static float oscillator(float phase) {
    /* TODO step 2: saw, square, triangle, then PolyBLEP to remove aliasing */
    return sinf(2 * (float)PI * phase);
}

static float envelope(float t, float gate_time) {
    /* TODO step 3: ADSR. Level in [0, 1] at time t for a key held gate_time seconds */
    (void)t; (void)gate_time;
    return 1.0f;
}

static void lowpass(float *s, int n, float cutoff) {
    /* TODO step 4: one-pole first, y += alpha * (x - y), then a state variable filter */
    (void)s; (void)n; (void)cutoff;
}

int main(void) {
    int n = RATE;
    float *out = malloc(n * sizeof *out), phase = 0, freq = 220;
    for (int i = 0; i < n; i++) {
        out[i] = 0.4f * oscillator(phase) * envelope((float)i / RATE, 0.7f);
        phase += freq / RATE;
        if (phase >= 1) phase -= 1;
    }
    lowpass(out, n, 2000);
    write_wav("out.wav", out, n);
    free(out);
    puts("wrote out.wav");
    return 0;
}
`;export{e as default};