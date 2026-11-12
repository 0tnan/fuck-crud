var e=`"""Cloth starter: a hanging rope first. Run: python3 main.py"""
import math

DT = 1 / 60
GRAVITY = (0.0, -9.81, 0.0)
REST = 0.1

class Particle:
    def __init__(self, x, y, z, pinned=False):
        self.pos = [x, y, z]
        self.prev = [x, y, z]
        self.pinned = pinned

def verlet(p, damping=0.99):
    if p.pinned:
        return
    for k in range(3):
        cur = p.pos[k]
        p.pos[k] = cur + (cur - p.prev[k]) * damping + GRAVITY[k] * DT * DT
        p.prev[k] = cur

def satisfy(a, b, rest):
    # TODO step 2: measure the distance between a and b, and move each
    #              (unless pinned) half of the error along the line joining them
    pass

def main():
    # a horizontal rope of 20 particles, pinned at one end
    rope = [Particle(i * REST, 0.0, 0.0, pinned=(i == 0)) for i in range(20)]
    links = [(i, i + 1) for i in range(19)]
    # TODO step 3: build a W x H grid with structural, shear and bend links
    # TODO step 4: wind force per triangle, sphere collision
    for frame in range(240):
        for p in rope:
            verlet(p)
        for _ in range(8):
            for i, j in links:
                satisfy(rope[i], rope[j], REST)
        if frame % 40 == 0:
            lowest = min(p.pos[1] for p in rope)
            length = sum(math.dist(rope[i].pos, rope[j].pos) for i, j in links)
            print(f"frame {frame:3d}  lowest y {lowest:8.3f}  rope length {length:7.3f} (want 1.900)")

if __name__ == "__main__":
    main()
`;export{e as default};