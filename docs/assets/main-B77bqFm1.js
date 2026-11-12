var e=`/* FM receiver starter. Build: cc -O2 -o main main.c -lm && ./main */
#include <complex.h>
#include <math.h>
#include <stdio.h>

#define RATE 240000        /* sample rate of the I/Q stream */
#define DEVIATION 75000.0  /* Hz, broadcast FM */
#define TONE 1000          /* Hz, the message */
#define COUNT (RATE / 10)
#define PI 3.14159265358979323846

/* An FM transmitter: integrate the message into a phase. */
static void modulate(const float *message, float complex *iq, int n) {
    double phase = 0;
    for (int i = 0; i < n; i++) {
        phase += 2 * PI * DEVIATION * message[i] / RATE;
        iq[i] = (float)cos(phase) + (float)sin(phase) * I;
    }
}

static void demodulate(const float complex *iq, float *audio, int n) {
    /* TODO step 3: for each sample, the angle of iq[n] * conj(iq[n-1]),
       scaled by RATE / (2*pi*DEVIATION) to get back to [-1, 1] */
    (void)iq;
    for (int i = 0; i < n; i++) audio[i] = 0;
}

static int lowpass_taps(float cutoff, float *taps, int n_taps) {
    /* TODO step 4: windowed sinc. Then filter and decimate 240 kHz -> 48 kHz */
    (void)cutoff; (void)n_taps;
    taps[0] = 1;
    return 1;
}

int main(void) {
    static float message[COUNT], audio[COUNT], taps[101];
    static float complex iq[COUNT];
    for (int i = 0; i < COUNT; i++) message[i] = (float)sin(2 * PI * TONE * i / RATE);
    modulate(message, iq, COUNT);
    demodulate(iq, audio, COUNT);
    lowpass_taps(15000, taps, 101);
    int crossings = 0;
    float peak = 0;
    for (int i = 1; i < COUNT; i++) {
        if (audio[i - 1] < 0 && audio[i] >= 0) crossings++;
        if (fabsf(audio[i]) > peak) peak = fabsf(audio[i]);
    }
    printf("%d I/Q samples, |iq| = %.3f (constant envelope)\\n", COUNT, cabsf(iq[100]));
    printf("recovered tone: %d Hz (want %d), peak %.2f (want 1.00)\\n", crossings * 10, TONE, peak);
    /* TODO step 5: de-emphasis, then write audio to a WAV file */
    return 0;
}
`;export{e as default};