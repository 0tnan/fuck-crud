"""IMU fusion starter (one axis). Run: python3 main.py"""
import math, random

DT = 0.01
GYRO_BIAS = 0.03      # rad/s, unknown to the filter
ACCEL_NOISE = 0.08    # rad

def simulate(steps):
    """Yield (true_angle, gyro_reading, accel_angle_reading)."""
    random.seed(7)
    for n in range(steps):
        t = n * DT
        angle = 0.5 * math.sin(0.8 * t)
        rate = 0.5 * 0.8 * math.cos(0.8 * t)
        yield angle, rate + GYRO_BIAS + random.gauss(0, 0.005), angle + random.gauss(0, ACCEL_NOISE)

class Complementary:
    def __init__(self, alpha=0.98):
        self.alpha, self.angle = alpha, 0.0
    def update(self, gyro, accel_angle):
        # TODO step 2: blend the integrated gyro with the accelerometer angle
        self.angle += gyro * DT          # gyro only: this drifts
        return self.angle

class Kalman:
    """State: [angle, bias]. TODO step 3: predict with the gyro, correct with the accelerometer."""
    def __init__(self):
        self.angle, self.bias = 0.0, 0.0
        self.P = [[1.0, 0.0], [0.0, 1.0]]
    def update(self, gyro, accel_angle):
        return self.angle

def main():
    f = Complementary()
    worst = 0.0
    for n, (truth, gyro, acc) in enumerate(simulate(3000)):
        est = f.update(gyro, acc)
        worst = max(worst, abs(est - truth))
        if n % 500 == 0:
            print(f"t={n * DT:5.1f}s  truth {truth:+.3f}  estimate {est:+.3f}  error {est - truth:+.3f}")
    print(f"worst error: {math.degrees(worst):.1f} degrees")

if __name__ == "__main__":
    main()
