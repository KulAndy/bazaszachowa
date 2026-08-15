### Constants

$$
b = 10
$$

$$
c = \text{current year}
$$

$$
\alpha = \sqrt[b]{b}
$$

- **b** — A constant representing after how many years the probability of a move equalizes.
- **c** — A constant representing the current year.

### Total value

$$
T =
\sum_{i=1}^{n}
\left(
|s_i| \times \alpha^b
\right)
$$

- **T** — The sum of the maximum possible values.
- **sᵢ** — Year statistics for a given move.
- **|sᵢ|** — Number of years (occurrences of the move).
- **i** — A statistic index.

### Year weighting

$$
L(y) =
\begin{cases}
1, & y \leq c-b-1 \\
b-(c-y), & y > c-b-1
\end{cases}
$$

- **L(y)** — Function determining the weight of the year.
- **y** — Year.

### Value for a statistic

$$
v_i =
\sum_{j=1}^{|s_i|}
\alpha^{L(s_{ij})}
$$

- **vᵢ** — Array of values calculated for each statistic.
- **sᵢⱼ** — The j-th year in statistic `sᵢ`.
- **L(sᵢⱼ)** — Weight assigned to that year.

### Maximum value

$$
V = \max(v)
$$

- **V** — Maximum value among all values.

### Maximum year

$$
Y = \max(\text{year in }s)
$$

- **Y** — Maximum year among all statistics.

### Scaling denominator

$$
d =
1 +
\begin{cases}
b, & Y \leq c-b \\
c-Y+1, & Y > c-b
\end{cases}
$$

- **d** — Denominator used for scaling purposes.

### Scaling coefficient

$$
\lambda =
\begin{cases}
1, & V=0 \land V \geq \frac{T}{d} \\
\frac{T}{V \times d}, & \neg\left(V=0 \land V \geq \frac{T}{d}\right)
\end{cases}
$$

- **λ** — Scaling factor adjusted based on the maximum value.

### Final function

$$
f(x)=\frac{v_x \times \lambda}{T}
$$

- **f(x)** — Function calculating the scaled trend value for a move.
