//! GPS solver starter. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

const C: f64 = 299_792_458.0;      // speed of light, m/s
const EARTH_R: f64 = 6_371_000.0;
const SAT_R: f64 = 26_571_000.0;   // orbit radius of GPS satellites

type Vec3 = [f64; 3];

fn on_sphere(radius: f64, lat_deg: f64, lon_deg: f64) -> Vec3 {
    let (lat, lon) = (lat_deg.to_radians(), lon_deg.to_radians());
    [radius * lat.cos() * lon.cos(), radius * lat.cos() * lon.sin(), radius * lat.sin()]
}

fn dist(a: &Vec3, b: &Vec3) -> f64 {
    (0..3).map(|k| (a[k] - b[k]).powi(2)).sum::<f64>().sqrt()
}

/// Returns [x, y, z, clock bias in metres].
fn solve(sats: &[Vec3], rho: &[f64]) -> [f64; 4] {
    let est = [0.0; 4];
    for _ in 0..8 {
        // TODO step 2: residuals r_i = rho_i - (|s_i - x| + b) and rows of H:
        //              [-(s_i - x)/|s_i - x|, 1]
        // TODO step 3: solve (H^T H) dx = H^T r (4x4, Gaussian elimination), est += dx
    }
    est
}

fn main() {
    let places = [(60.0, 10.0), (30.0, -40.0), (20.0, 50.0), (70.0, 120.0), (10.0, 0.0), (45.0, 80.0)];
    let noise = [1.3, -2.1, 0.4, 2.6, -0.8, -1.5]; // metres
    let truth = on_sphere(EARTH_R, 48.85, 2.35);
    let bias = 1e-4; // seconds, unknown to the solver
    let sats: Vec<Vec3> = places.iter().map(|&(lat, lon)| on_sphere(SAT_R, lat, lon)).collect();
    let rho: Vec<f64> = sats.iter().zip(noise.iter()).map(|(s, n)| dist(s, &truth) + C * bias + n).collect();
    let km: Vec<String> = rho.iter().map(|r| format!("{:.0}", r / 1000.0)).collect();
    println!("pseudoranges (km): {}", km.join(" "));
    let est = solve(&sats, &rho);
    println!("position error: {:.3} km", dist(&[est[0], est[1], est[2]], &truth) / 1000.0);
    println!("clock bias: {:.2} microseconds (truth 100.00)", est[3] / C * 1e6);
    // TODO step 4: convert est to latitude, longitude, height on WGS-84
}
