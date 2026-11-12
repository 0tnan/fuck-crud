var e=`"""Autodiff starter. Run: python3 main.py"""

class Value:
    def __init__(self, data, parents=(), op=""):
        self.data = data
        self.grad = 0.0
        self.parents = parents
        self.op = op
        self._backward = lambda: None     # adds this node's contribution to its parents' grads

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")
        # TODO step 2: out._backward should do self.grad += out.grad, other.grad += out.grad
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")
        # TODO step 2: d(a*b)/da = b, d(a*b)/db = a
        return out

    # TODO step 3: __sub__, __truediv__, __pow__, exp, log, tanh

    def backward(self):
        # TODO step 2: topological sort from self, set self.grad = 1,
        #              then call _backward on every node in reverse order
        pass

    def __repr__(self):
        return f"Value(data={self.data:.4f}, grad={self.grad:.4f})"

def numeric_grad(f, xs, i, h=1e-6):
    """Central finite difference of f with respect to xs[i]."""
    up = xs[:]; up[i] += h
    dn = xs[:]; dn[i] -= h
    return (f(*up) - f(*dn)) / (2 * h)

def main():
    f = lambda x, y: x * y + x
    x, y = Value(3.0), Value(-2.0)
    out = f(x, y)
    out.backward()
    print("f =", out.data)
    print(f"df/dx = {x.grad:+.4f}  (numeric {numeric_grad(f, [3.0, -2.0], 0):+.4f})")
    print(f"df/dy = {y.grad:+.4f}  (numeric {numeric_grad(f, [3.0, -2.0], 1):+.4f})")

if __name__ == "__main__":
    main()
`;export{e as default};