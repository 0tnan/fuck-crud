var e=`/* Autodiff starter: a tape of operations. Build: cc -O2 -o main main.c -lm && ./main */
#include <stdio.h>

#define MAX_NODES 1024

typedef enum { LEAF, ADD, MUL } Op;

/* Nodes are appended in evaluation order, so the tape is already topologically sorted. */
typedef struct { Op op; int a, b; double data, grad; } Node;

static Node tape[MAX_NODES];
static int count;

static int push(Op op, int a, int b, double data) {
    tape[count] = (Node){op, a, b, data, 0};
    return count++;
}

static int value(double x) { return push(LEAF, -1, -1, x); }
static int add(int a, int b) { return push(ADD, a, b, tape[a].data + tape[b].data); }
static int mul(int a, int b) { return push(MUL, a, b, tape[a].data * tape[b].data); }
/* TODO step 3: sub, div, pow, exp, log, tanh */

static void backward(int out) {
    /* TODO step 2: set tape[out].grad = 1, then walk the tape from out down to 0.
       ADD passes its grad to both inputs; MUL passes grad times the other input. */
    (void)out;
}

static int f(int x, int y) { return add(mul(x, y), x); }

/* Central finite difference, to check the analytic gradient. */
static double numeric(double x, double y, int wrt) {
    double h = 1e-6, hx = wrt == 0 ? h : 0, hy = wrt == 1 ? h : 0;
    int start = count;
    double up = tape[f(value(x + hx), value(y + hy))].data;
    double dn = tape[f(value(x - hx), value(y - hy))].data;
    count = start;
    return (up - dn) / (2 * h);
}

int main(void) {
    int x = value(3.0), y = value(-2.0);
    int out = f(x, y);
    backward(out);
    printf("f = %g\\n", tape[out].data);
    printf("df/dx = %+.4f  (numeric %+.4f)\\n", tape[x].grad, numeric(3.0, -2.0, 0));
    printf("df/dy = %+.4f  (numeric %+.4f)\\n", tape[y].grad, numeric(3.0, -2.0, 1));
    return 0;
}
`;export{e as default};