var e=`"""Quadcopter controller starter (altitude axis). Run: python3 main.py"""
DT = 0.002          # 500 Hz control loop
MASS = 1.2          # kg
G = 9.81
MAX_THRUST = 30.0   # N, all four rotors

class PID:
    def __init__(self, kp, ki, kd):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.integral, self.prev_error = 0.0, 0.0

    def update(self, error, dt):
        # TODO step 1: proportional + integral + derivative terms
        # TODO step 6: anti-windup (clamp the integral), filter the derivative
        return 0.0

class Quad:
    """Step 1 models height only. TODO step 2: full 3D state with a quaternion."""
    def __init__(self):
        self.z, self.vz = 0.0, 0.0

    def step(self, thrust, dt):
        thrust = min(max(thrust, 0.0), MAX_THRUST)
        self.vz += (thrust / MASS - G) * dt
        self.z += self.vz * dt
        if self.z < 0:
            self.z, self.vz = 0.0, 0.0     # on the ground

def mix(thrust, roll, pitch, yaw):
    # TODO step 3: four demands -> four rotor thrusts (X configuration)
    return [thrust / 4] * 4

def main():
    quad, pid, target = Quad(), PID(kp=0.0, ki=0.0, kd=0.0), 1.0
    for n in range(2501):
        hover = MASS * G * 0.9             # deliberately wrong: the I term must fix it
        thrust = hover + pid.update(target - quad.z, DT)
        quad.step(thrust, DT)
        if n % 250 == 0:
            print(f"t={n * DT:4.1f}s  z={quad.z:6.3f} m  target {target:.1f} m")

if __name__ == "__main__":
    main()
`;export{e as default};