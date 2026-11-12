"""Trajectory planner starter. Run: python3 main.py"""
import math

MU_SUN = 1.32712440018e20     # m^3/s^2
AU = 1.495978707e11           # m
R_EARTH, R_MARS = 1.0 * AU, 1.524 * AU
DAY = 86400.0

def circular_speed(r):
    return math.sqrt(MU_SUN / r)

def rk4_step(state, dt):
    """state = (x, y, vx, vy) around the Sun."""
    # TODO step 1: classic RK4 on d/dt (r, v) = (v, -mu r / |r|^3)
    return state

def solve_kepler(M, e):
    # TODO step 3: Newton's method on E - e sin E - M = 0
    return M

def hohmann(r1, r2):
    """Return (dv1, dv2, transfer_time, phase_angle_at_departure)."""
    # TODO step 4: a = (r1 + r2)/2, vis-viva v^2 = mu (2/r - 1/a) at both ends,
    #              time = pi sqrt(a^3/mu), phase = pi - n2 * time
    return 0.0, 0.0, 0.0, 0.0

def lambert(r1_vec, r2_vec, tof):
    # TODO step 5: universal variables. Return the velocity vectors at both ends
    return None

def main():
    print(f"Earth orbital speed: {circular_speed(R_EARTH) / 1000:.2f} km/s")
    print(f"Mars orbital speed:  {circular_speed(R_MARS) / 1000:.2f} km/s")
    dv1, dv2, tof, phase = hohmann(R_EARTH, R_MARS)
    print(f"Hohmann: dv1 {dv1 / 1000:.2f} + dv2 {dv2 / 1000:.2f} = {(dv1 + dv2) / 1000:.2f} km/s (want about 5.6)")
    print(f"transfer time: {tof / DAY:.0f} days (want about 259), phase angle {math.degrees(phase):.1f} deg (want about 44)")

if __name__ == "__main__":
    main()
