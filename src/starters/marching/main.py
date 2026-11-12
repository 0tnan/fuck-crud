"""Marching cubes starter. Run: python3 main.py  ->  out.obj"""
import math

N = 24                      # cells per side
ISO = 0.0

def density(x, y, z):
    """Negative inside, positive outside. Start with a sphere of radius 0.7."""
    return math.sqrt(x * x + y * y + z * z) - 0.7

def sample():
    """Values at the (N+1)^3 grid corners, over the cube [-1, 1]^3."""
    c = [i / N * 2 - 1 for i in range(N + 1)]
    return [[[density(x, y, z) for z in c] for y in c] for x in c]

def cube_index(g, i, j, k):
    """8-bit case number: bit n is set when corner n is inside."""
    idx = 0
    for n, (dx, dy, dz) in enumerate([(0,0,0),(1,0,0),(1,1,0),(0,1,0),(0,0,1),(1,0,1),(1,1,1),(0,1,1)]):
        if g[i + dx][j + dy][k + dz] < ISO:
            idx |= 1 << n
    return idx

def polygonise(g):
    """Return (vertices, triangles)."""
    verts, tris = [], []
    # TODO step 2: get EDGE_TABLE and TRI_TABLE (Paul Bourke, "Polygonising a scalar field")
    # TODO step 3: for each cell, interpolate a vertex on every crossed edge, emit triangles
    # TODO step 4: normals from the gradient of density()
    return verts, tris

def main():
    g = sample()
    crossed = sum(1 for i in range(N) for j in range(N) for k in range(N)
                  if cube_index(g, i, j, k) not in (0, 255))
    print(f"{crossed} of {N ** 3} cells contain the surface")
    verts, tris = polygonise(g)
    with open("out.obj", "w") as f:
        for v in verts:
            f.write(f"v {v[0]:.5f} {v[1]:.5f} {v[2]:.5f}\n")
        for a, b, c in tris:
            f.write(f"f {a + 1} {b + 1} {c + 1}\n")
    print(f"wrote out.obj: {len(verts)} vertices, {len(tris)} triangles")

if __name__ == "__main__":
    main()
