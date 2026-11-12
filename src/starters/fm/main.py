"""FM receiver starter. Run: python3 main.py"""
import cmath, math

RATE = 240_000          # sample rate of the I/Q stream
DEVIATION = 75_000      # Hz, broadcast FM
TONE = 1000             # Hz, the message

def modulate(message):
    """An FM transmitter: integrate the message into a phase."""
    phase, out = 0.0, []
    for m in message:
        phase += 2 * math.pi * DEVIATION * m / RATE
        out.append(cmath.exp(1j * phase))
    return out

def demodulate(iq):
    # TODO step 3: for each sample, the angle of iq[n] * conj(iq[n-1]),
    #              scaled by RATE / (2*pi*DEVIATION) to get back to [-1, 1]
    return [0.0] * len(iq)

def lowpass_taps(cutoff, n_taps=101):
    # TODO step 4: windowed sinc. Then filter and decimate 240 kHz -> 48 kHz
    return [1.0]

def measure_frequency(x, rate):
    crossings = sum(1 for a, b in zip(x, x[1:]) if a < 0 <= b)
    return crossings * rate / len(x)

def main():
    message = [math.sin(2 * math.pi * TONE * n / RATE) for n in range(RATE // 10)]
    iq = modulate(message)
    audio = demodulate(iq)
    peak = max(abs(a) for a in audio)
    print(f"{len(iq)} I/Q samples, |iq| = {abs(iq[100]):.3f} (constant envelope)")
    print(f"recovered tone: {measure_frequency(audio, RATE):.0f} Hz (want {TONE}), peak {peak:.2f} (want 1.00)")
    # TODO step 5: de-emphasis, then write audio to a WAV file

if __name__ == "__main__":
    main()
