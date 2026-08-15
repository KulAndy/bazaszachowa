### Stała

$$
\epsilon = 0.1
$$

- **ε** — Minimalne prawdopodobieństwo.

### Pierwszy rok

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

### Kolejne lata

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

### Zmienne

- **xᵢ** — Liczba gier z danym ruchem w roku.
- **yᵢ** — Liczba punktów w grach z danym ruchem w roku.
- **nᵢ** — Liczba gier w roku.
