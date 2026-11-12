var e=`"""N-body starter. Run: python3 main.py"""
import math, random

G, EPS, DT = 1.0, 0.05, 0.01

def accelerations(pos, mass):
    """Direct O(N^2) sum. Reference for the Barnes-Hut version."""
    n = len(pos)
    acc = [[0.0, 0.0] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            dx, dy = pos[j][0] - pos[i][0], pos[j][1] - pos[i][1]
            inv = G * mass[j] / (dx * dx + dy * dy + EPS * EPS) ** 1.5
            acc[i][0] += dx * inv
            acc[i][1] += dy * inv
    return acc

def tree_accelerations(pos, mass, theta=0.5):
    # TODO step 3: build a quadtree storing mass and centre of mass per node
    # TODO step 4: walk it, opening a cell only when size / distance > theta
    return accelerations(pos, mass)

def energy(pos, vel, mass):
    kin = sum(0.5 * m * (v[0] ** 2 + v[1] ** 2) for m, v in zip(mass, vel))
    pot = 0.0
    for i in range(len(pos)):
        for j in range(i + 1, len(pos)):
            d = math.hypot(pos[i][0] - pos[j][0], pos[i][1] - pos[j][1])
            pot -= G * mass[i] * mass[j] / math.sqrt(d * d + EPS * EPS)
    return kin + pot

def step(pos, vel, mass):
    # TODO step 2: replace Euler with leapfrog (half kick, drift, half kick)
    acc = tree_accelerations(pos, mass)
    for p, v, a in zip(pos, vel, acc):
        p[0] += v[0] * DT; p[1] += v[1] * DT
        v[0] += a[0] * DT; v[1] += a[1] * DT

def main():
    random.seed(1)
    n = 60
    pos = [[random.uniform(-1, 1), random.uniform(-1, 1)] for _ in range(n)]
    vel = [[-p[1] * 0.8, p[0] * 0.8] for p in pos]       # TODO step 5: a real disc
    mass = [1.0 / n] * n
    for s in range(201):
        if s % 50 == 0:
            print(f"step {s:4d}  energy {energy(pos, vel, mass):+.6f}")
        step(pos, vel, mass)

if __name__ == "__main__":
    main()
`;export{e as default};