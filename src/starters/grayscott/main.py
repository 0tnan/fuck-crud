"""Gray-Scott starter. Run: python3 main.py  ->  out.pgm"""
N = 96
DU, DV, F, K = 0.21, 0.105, 0.037, 0.06

def laplacian(a, i, j):
    # TODO step 2: neighbours minus 4x centre, wrapping at the edges (use % N)
    return 0.0

def step(u, v):
    """One Euler step with dt = 1. Returns the new (u, v)."""
    nu = [row[:] for row in u]
    nv = [row[:] for row in v]
    # TODO step 3: for every cell
    #   uvv = u*v*v
    #   nu = u + DU*lap(u) - uvv + F*(1 - u)
    #   nv = v + DV*lap(v) + uvv - (F + K)*v
    return nu, nv

def write_pgm(path, v):
    with open(path, "w") as f:
        f.write(f"P2\n{N} {N}\n255\n")
        for row in v:
            f.write(" ".join(str(int(min(max(x * 3, 0), 1) * 255)) for x in row) + "\n")

def main():
    u = [[1.0] * N for _ in range(N)]
    v = [[0.0] * N for _ in range(N)]
    for j in range(N // 2 - 5, N // 2 + 5):
        for i in range(N // 2 - 5, N // 2 + 5):
            u[j][i], v[j][i] = 0.5, 0.25
    for n in range(1000):        # pure Python is slow: step 5 moves this to the GPU
        u, v = step(u, v)
    write_pgm("out.pgm", v)
    print(f"wrote out.pgm, total V = {sum(map(sum, v)):.1f}")

if __name__ == "__main__":
    main()
