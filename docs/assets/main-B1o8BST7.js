var e=`"""Synthesizer starter. Run: python3 main.py  ->  out.wav"""
import math, struct

RATE = 44100

def write_wav(path, samples):
    data = b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in samples)
    with open(path, "wb") as f:
        f.write(b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVEfmt ")
        f.write(struct.pack("<IHHIIHH", 16, 1, 1, RATE, RATE * 2, 2, 16))
        f.write(b"data" + struct.pack("<I", len(data)) + data)

def oscillator(phase, shape="sine"):
    """phase is in [0, 1). Returns a sample in [-1, 1]."""
    # TODO step 2: saw, square, triangle, then PolyBLEP to remove aliasing
    return math.sin(2 * math.pi * phase)

def envelope(t, gate_time, a=0.01, d=0.1, s=0.7, r=0.3):
    # TODO step 3: ADSR. Return the level in [0, 1] at time t for a key held gate_time seconds
    return 1.0

def lowpass(samples, cutoff):
    # TODO step 4: one-pole first, y += alpha * (x - y), then a state variable filter
    return samples

def render(freq, seconds):
    out, phase = [], 0.0
    for n in range(int(seconds * RATE)):
        out.append(0.4 * oscillator(phase) * envelope(n / RATE, seconds * 0.7))
        phase = (phase + freq / RATE) % 1.0
    return lowpass(out, 2000)

if __name__ == "__main__":
    write_wav("out.wav", render(220.0, 1.0))
    print("wrote out.wav")
`;export{e as default};