var e=`// Autodiff starter. Run: node main.ts   (Node 23.6+ runs TypeScript directly)
class Value {
  data: number;
  grad = 0;
  parents: Value[];
  op: string;
  /** Adds this node's contribution to its parents' gradients. */
  backwardStep: () => void = () => {};

  constructor(data: number, parents: Value[] = [], op = "") {
    this.data = data;
    this.parents = parents;
    this.op = op;
  }

  add(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    const out = new Value(this.data + o.data, [this, o], "+");
    // TODO step 2: out.backwardStep should do this.grad += out.grad, o.grad += out.grad
    return out;
  }

  mul(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    const out = new Value(this.data * o.data, [this, o], "*");
    // TODO step 2: d(a*b)/da = b, d(a*b)/db = a
    return out;
  }

  // TODO step 3: sub, div, pow, exp, log, tanh

  backward(): void {
    // TODO step 2: topological sort from this node, set this.grad = 1,
    //              then call backwardStep on every node in reverse order
  }
}

const f = (x: Value, y: Value): Value => x.mul(y).add(x);

/** Central finite difference of f with respect to argument i. */
function numericGrad(args: [number, number], i: 0 | 1, h = 1e-6): number {
  const up: [number, number] = [...args], dn: [number, number] = [...args];
  up[i] += h;
  dn[i] -= h;
  return (f(new Value(up[0]), new Value(up[1])).data - f(new Value(dn[0]), new Value(dn[1])).data) / (2 * h);
}

const x = new Value(3), y = new Value(-2);
const out = f(x, y);
out.backward();
console.log("f =", out.data);
console.log(\`df/dx = \${x.grad.toFixed(4)}  (numeric \${numericGrad([3, -2], 0).toFixed(4)})\`);
console.log(\`df/dy = \${y.grad.toFixed(4)}  (numeric \${numericGrad([3, -2], 1).toFixed(4)})\`);
`;export{e as default};