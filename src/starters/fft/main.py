"""FFT starter. Run: python3 main.py"""
import cmath, math

RATE = 8000
N = 1024

def dft(x):
    """Slow reference transform, O(N^2). Keep it to test the fast one."""
    n = len(x)
    return [sum(x[t] * cmath.exp(-2j * math.pi * k * t / n) for t in range(n)) for k in range(n)]

def fft(x):
    # TODO step 2: recursive radix-2 FFT (split even/odd, combine with twiddles)
    # TODO step 3: iterative in-place version with bit reversal
    return dft(x)

def hann(n):
    # TODO step 4: return the Hann window, 0.5 - 0.5*cos(2*pi*i/(n-1))
    return [1.0] * n

def main():
    signal = [math.sin(2 * math.pi * 440 * t / RATE) + 0.5 * math.sin(2 * math.pi * 1250 * t / RATE)
              for t in range(N)]
    w = hann(N)
    spectrum = fft([s * wi for s, wi in zip(signal, w)])
    mags = [abs(c) for c in spectrum[:N // 2]]
    top = sorted(range(len(mags)), key=lambda k: -mags[k])[:4]
    for k in sorted(top):
        print(f"bin {k:4d}  {k * RATE / N:7.1f} Hz  magnitude {mags[k]:8.1f}")

if __name__ == "__main__":
    main()
