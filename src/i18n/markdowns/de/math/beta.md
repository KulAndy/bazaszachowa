### Konstante

$$
\epsilon = 0.1
$$

- **ε** — Minimale Wahrscheinlichkeit.

### Erstes Jahr

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

### Folgende Jahre

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

### Variablen

- **xᵢ** — Anzahl der Partien mit einem bestimmten Zug in einem Jahr.
- **yᵢ** — Anzahl der Punkte in Partien mit einem bestimmten Zug in einem Jahr.
- **nᵢ** — Anzahl der Partien in einem Jahr.
