var e=`"""2D physics engine starter. Run: python3 main.py"""
from dataclasses import dataclass

DT = 1 / 120
GRAVITY = -9.81

@dataclass
class Body:
    x: float
    y: float
    vx: float = 0.0
    vy: float = 0.0
    angle: float = 0.0
    omega: float = 0.0
    radius: float = 0.5
    inv_mass: float = 1.0     # 0 means static
    inv_inertia: float = 1.0
    restitution: float = 0.5

def integrate(b: Body):
    """Semi-implicit Euler: velocity first, then position."""
    if b.inv_mass == 0:
        return
    b.vy += GRAVITY * DT
    b.x += b.vx * DT
    b.y += b.vy * DT
    b.angle += b.omega * DT

def collide_floor(b: Body):
    # TODO step 2: if the circle goes below y = 0, push it out and reflect vy
    #              using the restitution coefficient
    pass

def collide(a: Body, b: Body):
    # TODO step 2: circle vs circle -> normal, penetration, impulse
    # TODO step 3: polygons with the separating axis theorem
    # TODO step 5: friction impulse along the tangent, clamped by mu * normal impulse
    pass

def main():
    bodies = [Body(0, 5)]
    for step in range(360):
        for b in bodies:
            integrate(b)
            collide_floor(b)
        for i in range(len(bodies)):
            for j in range(i + 1, len(bodies)):
                collide(bodies[i], bodies[j])
        if step % 12 == 0:
            print(f"t={step * DT:5.2f}  y={bodies[0].y:7.3f}")

if __name__ == "__main__":
    main()
`;export{e as default};