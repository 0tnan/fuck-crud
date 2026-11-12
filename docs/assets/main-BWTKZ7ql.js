var e=`//! Autodiff starter: a tape of operations. Build: rustc -O main.rs && ./main
#![allow(dead_code, unused_variables)]

#[derive(Clone, Copy)]
enum Op { Leaf, Add(usize, usize), Mul(usize, usize) }

struct Node { op: Op, data: f64, grad: f64 }

/// Nodes are appended in evaluation order, so the tape is already topologically sorted.
struct Tape { nodes: Vec<Node> }

impl Tape {
    fn new() -> Tape { Tape { nodes: Vec::new() } }

    fn push(&mut self, op: Op, data: f64) -> usize {
        self.nodes.push(Node { op, data, grad: 0.0 });
        self.nodes.len() - 1
    }

    fn value(&mut self, x: f64) -> usize { self.push(Op::Leaf, x) }
    fn add(&mut self, a: usize, b: usize) -> usize {
        let data = self.nodes[a].data + self.nodes[b].data;
        self.push(Op::Add(a, b), data)
    }
    fn mul(&mut self, a: usize, b: usize) -> usize {
        let data = self.nodes[a].data * self.nodes[b].data;
        self.push(Op::Mul(a, b), data)
    }
    // TODO step 3: sub, div, powf, exp, ln, tanh

    fn backward(&mut self, out: usize) {
        // TODO step 2: set nodes[out].grad = 1, then walk the tape from out down to 0.
        //              Add passes its grad to both inputs; Mul passes grad times the other input.
    }
}

fn f(t: &mut Tape, x: usize, y: usize) -> usize {
    let xy = t.mul(x, y);
    t.add(xy, x)
}

fn eval(x: f64, y: f64) -> f64 {
    let mut t = Tape::new();
    let (a, b) = (t.value(x), t.value(y));
    let out = f(&mut t, a, b);
    t.nodes[out].data
}

fn main() {
    let mut t = Tape::new();
    let (x, y) = (t.value(3.0), t.value(-2.0));
    let out = f(&mut t, x, y);
    t.backward(out);
    let h = 1e-6; // central finite differences, to check the analytic gradient
    let dx = (eval(3.0 + h, -2.0) - eval(3.0 - h, -2.0)) / (2.0 * h);
    let dy = (eval(3.0, -2.0 + h) - eval(3.0, -2.0 - h)) / (2.0 * h);
    println!("f = {}", t.nodes[out].data);
    println!("df/dx = {:+.4}  (numeric {:+.4})", t.nodes[x].grad, dx);
    println!("df/dy = {:+.4}  (numeric {:+.4})", t.nodes[y].grad, dy);
}
`;export{e as default};