var e=`"""Path tracer starter. Run: python3 main.py  ->  out.ppm"""
import math

W, H = 400, 225

def add(a, b): return (a[0] + b[0], a[1] + b[1], a[2] + b[2])
def sub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def mul(a, s): return (a[0] * s, a[1] * s, a[2] * s)
def dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def unit(a): return mul(a, 1 / math.sqrt(dot(a, a)))

def hit_sphere(center, radius, origin, direction):
    """Return the nearest positive t where the ray hits, or None."""
    # TODO step 3: solve |origin + t*direction - center|^2 = radius^2
    return None

def ray_color(origin, direction, depth=0):
    # TODO step 3: shade by the normal when hit_sphere returns a t
    # TODO step 4: scatter in a random direction and recurse (stop at depth 8)
    # TODO step 5: metal (reflect) and glass (refract + Schlick)
    t = 0.5 * (direction[1] + 1)
    return add(mul((1, 1, 1), 1 - t), mul((0.5, 0.7, 1.0), t))

def main():
    aspect = W / H
    with open("out.ppm", "w") as f:
        f.write(f"P3\\n{W} {H}\\n255\\n")
        for j in range(H):
            for i in range(W):
                u = (i + 0.5) / W * 2 - 1
                v = 1 - (j + 0.5) / H * 2
                d = unit((u * aspect, v, -1))
                # TODO step 4: average many jittered samples, then gamma-correct
                c = ray_color((0, 0, 0), d)
                f.write(" ".join(str(int(255.99 * min(max(x, 0), 1))) for x in c) + "\\n")
    print("wrote out.ppm")

if __name__ == "__main__":
    main()
`;export{e as default};