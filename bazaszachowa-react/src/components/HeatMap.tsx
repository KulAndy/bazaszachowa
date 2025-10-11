import "../styles/HeatMap.scss";
interface HeatMapProperties {
  readonly heatmap: Record<string, number>;
}

const HeatMap = ({ heatmap }: HeatMapProperties) => {
  const max = Math.max(...Object.values(heatmap));
  const squares = [];

  for (const rank of "87654321") {
    for (const file of "abcdefgh") {
      const sq = `${file}${rank}`;
      const value = heatmap[sq] || 0;
      const intensity = value / max;
      squares.push(
        <div
          className="heatmap-square"
          key={sq}
          style={
            {
              backgroundColor: `rgba(255, 0, 0, ${intensity})`,
            } as const
          }
        >
          <span className="coord">{sq}</span>
        </div>,
      );
    }
  }

  return <div className="heatmap-board">{squares}</div>;
};

export default HeatMap;
