"""GPS solver starter. Run: python3 main.py"""
import math, random

C = 299_792_458.0           # speed of light, m/s
EARTH_R = 6_371_000.0
SAT_R = 26_571_000.0        # orbit radius of GPS satellites

def on_sphere(radius, lat_deg, lon_deg):
    lat, lon = math.radians(lat_deg), math.radians(lon_deg)
    return (radius * math.cos(lat) * math.cos(lon), radius * math.cos(lat) * math.sin(lon), radius * math.sin(lat))

def make_measurements():
    random.seed(3)
    truth = on_sphere(EARTH_R, 48.85, 2.35)
    clock_bias = 1e-4                                 # seconds, unknown to the solver
    sats = [on_sphere(SAT_R, lat, lon) for lat, lon in
            [(60, 10), (30, -40), (20, 50), (70, 120), (10, 0), (45, 80)]]
    rho = [math.dist(s, truth) + C * clock_bias + random.gauss(0, 2.0) for s in sats]
    return truth, sats, rho

def solve(sats, rho, iterations=8):
    """Return (x, y, z, clock_bias_metres)."""
    est = [0.0, 0.0, 0.0, 0.0]
    for _ in range(iterations):
        # TODO step 2: residuals r_i = rho_i - (|s_i - x| + b) and rows of H:
        #              [-(s_i - x)/|s_i - x|, 1]
        # TODO step 3: solve (H^T H) dx = H^T r (4x4, Gaussian elimination), est += dx
        pass
    return est

def main():
    truth, sats, rho = make_measurements()
    est = solve(sats, rho)
    print("pseudoranges (km):", " ".join(f"{r / 1000:.0f}" for r in rho))
    print(f"position error: {math.dist(est[:3], truth) / 1000:.3f} km")
    print(f"clock bias: {est[3] / C * 1e6:.2f} microseconds (truth 100.00)")
    # TODO step 4: convert est to latitude, longitude, height on WGS-84

if __name__ == "__main__":
    main()
