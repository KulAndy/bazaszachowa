### Konstanten

$$
b = 10
$$

$$
c = \text{aktuelles Jahr}
$$

$$
\alpha = \sqrt[b]{b}
$$

- **b** — Konstante, die angibt, nach wie vielen Jahren sich die Zugwahrscheinlichkeit ausgleicht.
- **c** — Konstante, die das aktuelle Jahr darstellt.

### Gesamtwert

$$
T =
\sum_{i=1}^{n}
\left(
|s_i| \times \alpha^b
\right)
$$

- **T** — Summe der maximal möglichen Werte.
- **sᵢ** — Jahresstatistik für einen bestimmten Zug.
- **|sᵢ|** — Anzahl der Jahre (Vorkommen des Zuges).
- **i** — Index der Statistik.

### Jahresgewicht

$$
L(y) =
\begin{cases}
1, & y \leq c-b-1 \\
b-(c-y), & y > c-b-1
\end{cases}
$$

- **L(y)** — Funktion zur Bestimmung des Jahresgewichts.
- **y** — Jahr.

### Wert einer Statistik

$$
v_i =
\sum_{j=1}^{|s_i|}
\alpha^{L(s_{ij})}
$$

- **vᵢ** — Array der für jede Statistik berechneten Werte.
- **sᵢⱼ** — Das j-te Jahr der Statistik `sᵢ`.
- **L(sᵢⱼ)** — Gewicht des jeweiligen Jahres.

### Maximaler Wert

$$
V = \max(v)
$$

- **V** — Maximaler Wert unter allen Werten.

### Maximales Jahr

$$
Y = \max(\text{Jahr in }s)
$$

- **Y** — Maximales Jahr unter allen Statistiken.

### Skalierungsnenner

$$
d =
1 +
\begin{cases}
b, & Y \leq c-b \\
c-Y+1, & Y > c-b
\end{cases}
$$

- **d** — Nenner, der zu Skalierungszwecken verwendet wird.

### Skalierungskoeffizient

$$
\lambda =
\begin{cases}
1, & V=0 \land V \geq \frac{T}{d} \\
\frac{T}{V \times d}, & \neg\left(V=0 \land V \geq \frac{T}{d}\right)
\end{cases}
$$

- **λ** — Skalierungsfaktor, angepasst auf Basis des maximalen Werts.

### Endfunktion

$$
f(x)=\frac{v_x \times \lambda}{T}
$$

- **f(x)** — Funktion zur Berechnung des skalierten Trendwerts für einen Zug.
