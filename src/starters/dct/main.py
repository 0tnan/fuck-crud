"""Image codec starter. Run: python3 main.py"""
import math

QUANT = [
    [16, 11, 10, 16, 24, 40, 51, 61], [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56], [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77], [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101], [72, 92, 95, 98, 112, 100, 103, 99],
]

def dct2(block):
    """Forward 8x8 DCT of a block of values centred on zero."""
    # TODO step 2: F(u,v) = 1/4 C(u) C(v) sum f(x,y) cos((2x+1)u pi/16) cos((2y+1)v pi/16)
    #              with C(0) = 1/sqrt(2), otherwise 1
    return [[0.0] * 8 for _ in range(8)]

def idct2(coeffs):
    # TODO step 2: the inverse transform
    return [[0.0] * 8 for _ in range(8)]

def quantise(coeffs, table=QUANT):
    # TODO step 3: round(coeffs[v][u] / table[v][u])
    return [[0] * 8 for _ in range(8)]

def zigzag(block):
    # TODO step 4: return the 64 values in zigzag order, then run-length encode
    return [x for row in block for x in row]

def show(title, block, fmt="{:6.0f}"):
    print(title)
    for row in block:
        print(" ".join(fmt.format(x) for x in row))

def main():
    block = [[(x * 16 + y * 8) - 128 for x in range(8)] for y in range(8)]   # a smooth gradient
    show("pixels (minus 128):", block)
    coeffs = dct2(block)
    show("DCT coefficients:", coeffs, "{:6.1f}")
    q = quantise(coeffs)
    print("non-zero after quantisation:", sum(1 for x in zigzag(q) if x != 0), "of 64")
    back = idct2(coeffs)
    err = max(abs(a - b) for ra, rb in zip(block, back) for a, b in zip(ra, rb))
    print(f"round-trip error: {err:.3f} (want 0.000)")

if __name__ == "__main__":
    main()
