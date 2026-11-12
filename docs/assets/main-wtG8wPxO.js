var e=`"""Inverse kinematics starter (planar arm). Run: python3 main.py"""
import math

LENGTHS = [1.0, 0.8, 0.6]

def forward(angles):
    """Joint positions for relative joint angles. Returns a list of (x, y)."""
    pts, x, y, total = [(0.0, 0.0)], 0.0, 0.0, 0.0
    for length, a in zip(LENGTHS, angles):
        total += a
        x += length * math.cos(total)
        y += length * math.sin(total)
        pts.append((x, y))
    return pts

def solve_two_link(l1, l2, tx, ty):
    # TODO step 2: law of cosines for the elbow, atan2 for the shoulder.
    #              Return None when the target is out of reach.
    return None

def fabrik(points, target, iterations=10):
    # TODO step 3: backward pass from the target, forward pass from the base
    return points

def jacobian_step(angles, target, damping=0.1):
    # TODO step 4: build J (2 x n), then angles += J^T (J J^T + damping^2 I)^-1 * error
    return angles

def main():
    target = (1.2, 1.1)
    angles = [0.3, 0.3, 0.3]
    for it in range(20):
        tip = forward(angles)[-1]
        err = math.dist(tip, target)
        if it % 5 == 0:
            print(f"iteration {it:2d}  tip ({tip[0]:+.3f}, {tip[1]:+.3f})  distance to target {err:.4f}")
        angles = jacobian_step(angles, target)

if __name__ == "__main__":
    main()
`;export{e as default};