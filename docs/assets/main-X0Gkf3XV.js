var e=`"""Stable fluids starter. Run: python3 main.py"""
N = 32                      # interior cells per side; arrays have a 1-cell border
SIZE = (N + 2) * (N + 2)

def ix(i, j): return i + (N + 2) * j

def set_bnd(b, x):
    # TODO step 5: copy edges from the inside; negate u on left/right (b=1), v on top/bottom (b=2)
    pass

def diffuse(b, x, x0, diff, dt):
    # TODO step 2: about 20 Gauss-Seidel sweeps of
    #   x[i,j] = (x0[i,j] + a * (sum of 4 neighbours of x)) / (1 + 4a),  a = dt*diff*N*N
    x[:] = x0

def advect(b, d, d0, u, v, dt):
    # TODO step 3: trace each cell centre backwards by dt*N*(u,v), bilinear sample d0
    d[:] = d0

def project(u, v, p, div):
    # TODO step 4: div = -0.5*(du/dx + dv/dy)/N, solve for p, subtract grad p
    pass

def step(u, v, dens, dt=0.1, visc=0.0, diff=0.0001):
    u0, v0, d0 = u[:], v[:], dens[:]
    diffuse(1, u, u0, visc, dt); diffuse(2, v, v0, visc, dt)
    project(u, v, u0, v0)
    u0, v0 = u[:], v[:]
    advect(1, u, u0, u0, v0, dt); advect(2, v, v0, u0, v0, dt)
    project(u, v, u0, v0)
    diffuse(0, dens, d0, diff, dt)
    d0 = dens[:]
    advect(0, dens, d0, u, v, dt)

def show(dens):
    ramp = " .:-=+*#%@"
    for j in range(N, 0, -2):
        print("".join(ramp[min(int(dens[ix(i, j)] * 9), 9)] for i in range(1, N + 1)))

def main():
    u, v, dens = [0.0] * SIZE, [0.0] * SIZE, [0.0] * SIZE
    for step_no in range(20):
        dens[ix(N // 2, 4)] += 4.0          # a source of smoke near the bottom
        v[ix(N // 2, 4)] += 2.0             # blowing upwards
        step(u, v, dens)
    show(dens)

if __name__ == "__main__":
    main()
`;export{e as default};