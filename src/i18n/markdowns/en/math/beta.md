### Constant

$$
\epsilon = 0.1
$$

- **ε** — Minimum probability.

### First year

$$
f(x_1,y_1)=
\begin{cases}
\epsilon^2,
& x_1=0 \lor n_1=0
\\[6pt]
\frac{1}{2}
+
\frac{1}{2}
\left[
\max\left(\frac{x_1}{n_1},\epsilon\right)
\right]
\left[
\max\left(\frac{y_1}{x_1},\epsilon\right)
\right],
& x_1\neq0 \land n_1\neq0
\end{cases}
$$

### Subsequent years

$$
f(x_i,y_i)=
\begin{cases}
\epsilon^2,
& x_i=0 \lor n_i=0
\\[6pt]
\frac{1}{2}
\left[
\max\left(\frac{x_i}{n_i},\epsilon\right)
\right]
\left[
\max\left(\frac{y_i}{x_i},\epsilon\right)
\right]
+
\frac{1}{2}
f(x_{i-1},y_{i-1}),
& x_i\neq0 \land n_i\neq0
\end{cases}
$$

### Variables

- **xᵢ** — Number of games with a given move in a year.
- **yᵢ** — Number of points in games with a given move in a year.
- **nᵢ** — Number of games in a year.
