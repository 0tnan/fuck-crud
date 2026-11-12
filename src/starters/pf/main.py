"""Particle filter starter. Run: python3 main.py"""
import math, random

BEACONS = [(-4.0, -3.0), (5.0, -2.0), (0.0, 5.0)]
RANGE_NOISE = 0.3
MOTION_NOISE = 0.05
N = 1000

def measure(x, y):
    return [math.hypot(x - bx, y - by) for bx, by in BEACONS]

def predict(particles, dx, dy):
    """Move every particle by the commanded motion, each with its own noise."""
    for p in particles:
        p[0] += dx + random.gauss(0, MOTION_NOISE)
        p[1] += dy + random.gauss(0, MOTION_NOISE)

def weigh(particles, z):
    # TODO step 3: w_i = product over beacons of exp(-(z - expected)^2 / (2 sigma^2)),
    #              computed in log space, then normalised to sum to 1
    return [1.0 / len(particles)] * len(particles)

def resample(particles, weights):
    # TODO step 4: systematic resampling (one random offset, N evenly spaced pointers)
    # TODO step 5: replace a few particles with random ones to survive kidnapping
    return particles

def main():
    random.seed(5)
    particles = [[random.uniform(-6, 6), random.uniform(-6, 6)] for _ in range(N)]
    x, y = 2.0, 0.0
    for step in range(60):
        a = step * 0.1
        dx, dy = -0.2 * math.sin(a), 0.2 * math.cos(a)        # drive in a circle
        x, y = x + dx, y + dy
        z = [r + random.gauss(0, RANGE_NOISE) for r in measure(x, y)]
        predict(particles, dx, dy)
        particles = resample(particles, weigh(particles, z))
        if step % 10 == 0:
            ex = sum(p[0] for p in particles) / N
            ey = sum(p[1] for p in particles) / N
            print(f"step {step:2d}  truth ({x:+.2f}, {y:+.2f})  estimate ({ex:+.2f}, {ey:+.2f})  error {math.hypot(ex - x, ey - y):.2f}")

if __name__ == "__main__":
    main()
