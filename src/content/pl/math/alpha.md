### Stałe

$$
b = 10
$$

$$
c = \text{aktualny rok}
$$

$$
\alpha = \sqrt[b]{b}
$$

- **b** — Stała reprezentująca, po ilu latach prawdopodobieństwo ruchu się wyrównuje.
- **c** — Stała reprezentująca aktualny rok.

### Suma wartości

$$
T =
\sum_{i=1}^{n}
\left(
|s_i| \times \alpha^b
\right)
$$

- **T** — Suma maksymalnych możliwych wartości.
- **sᵢ** — Statystyka lat dla danego ruchu.
- **|sᵢ|** — Liczba lat (wystąpień ruchu).
- **i** — Indeks statystyki.

### Waga roku

$$
L(y) =
\begin{cases}
1, & y \leq c-b-1 \\
b-(c-y), & y > c-b-1
\end{cases}
$$

- **L(y)** — Funkcja określająca wagę roku.
- **y** — Rok.

### Wartość statystyki

$$
v_i =
\sum_{j=1}^{|s_i|}
\alpha^{L(s_{ij})}
$$

- **vᵢ** — Tablica wartości obliczonych dla każdej statystyki.
- **sᵢⱼ** — j-ty rok w statystyce `sᵢ`.
- **L(sᵢⱼ)** — Waga przypisana danemu rokowi.

### Maksymalna wartość

$$
V = \max(v)
$$

- **V** — Maksymalna wartość spośród wszystkich wartości.

### Maksymalny rok

$$
Y = \max(\text{rok w }s)
$$

- **Y** — Maksymalny rok wśród wszystkich statystyk.

### Mianownik skalowania

$$
d =
1 +
\begin{cases}
b, & Y \leq c-b \\
c-Y+1, & Y > c-b
\end{cases}
$$

- **d** — Mianownik używany do celów skalowania.

### Współczynnik skalowania

$$
\lambda =
\begin{cases}
1, & V=0 \land V \geq \frac{T}{d} \\
\frac{T}{V \times d}, & \neg\left(V=0 \land V \geq \frac{T}{d}\right)
\end{cases}
$$

- **λ** — Współczynnik skalowania dostosowany na podstawie maksymalnej wartości.

### Funkcja końcowa

$$
f(x)=\frac{v_x \times \lambda}{T}
$$

- **f(x)** — Funkcja obliczająca skalowaną wartość trendu dla ruchu.
