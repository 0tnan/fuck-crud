"""Reed-Solomon starter. Run: python3 main.py"""
PRIM = 0x11D        # x^8 + x^4 + x^3 + x^2 + 1, the polynomial QR codes use

EXP = [0] * 512
LOG = [0] * 256

def init_tables():
    # TODO step 1: x = 1; for i in 0..254: EXP[i] = x, LOG[x] = i, x = x*2 (xor PRIM if it overflows 8 bits)
    #              then copy EXP[i + 255] = EXP[i] so sums of logs need no modulo
    pass

def gf_mul(a, b):
    # TODO step 1: 0 if either is 0, otherwise EXP[LOG[a] + LOG[b]]
    return 0

def gf_inv(a):
    return EXP[255 - LOG[a]]

def poly_mul(p, q):
    # TODO step 2: schoolbook multiplication, adding with xor
    return [0] * (len(p) + len(q) - 1)

def poly_eval(p, x):
    # TODO step 2: Horner's rule, highest degree first
    return 0

def generator(nsym):
    # TODO step 3: product of (x - 2^i) for i in 0..nsym-1
    return [1]

def encode(msg, nsym):
    # TODO step 3: remainder of msg * x^nsym divided by generator(nsym), appended to msg
    return list(msg) + [0] * nsym

def syndromes(block, nsym):
    return [poly_eval(block, EXP[i]) for i in range(nsym)]

def main():
    init_tables()
    print(f"2 * 128 in GF(256) = {gf_mul(2, 128)} (want 29)")
    block = encode(b"hello world", 10)
    print("codeword:", bytes(block).hex())
    print("syndromes all zero:", not any(syndromes(block, 10)), "(want True, with real parity bytes)")
    block[3] ^= 0xFF
    print("after corrupting a byte, syndromes non-zero:", any(syndromes(block, 10)), "(want True)")
    # TODO step 5: Berlekamp-Massey, Chien search, Forney -> repair the block

if __name__ == "__main__":
    main()
