/* eslint-disable i18next/no-literal-string */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import type { StatSummary } from "../../../stats";
import Histogram from "../Histogram";

import "./StatIndicators.scss";

interface StatIndicatorsProperties {
  readonly name: string;
  readonly summary: StatSummary;
}

const StatIndicators = ({ name, summary }: StatIndicatorsProperties) => {
  return (
    <div className="stat-section">
      <h4>{name}</h4>
      <TableContainer className="stat-table" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>x̄ </TableCell>
              <TableCell>Min</TableCell>
              <TableCell>Q1</TableCell>
              <TableCell>Q2</TableCell>
              <TableCell>Q3</TableCell>
              <TableCell>Max</TableCell>
              <TableCell>&sigma;²</TableCell>
              <TableCell>&sigma;</TableCell>
              <TableCell>Mo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{summary.avg.toFixed(2)}</TableCell>
              <TableCell>{summary.min.toFixed(2)}</TableCell>
              <TableCell>{summary.q1.toFixed(2)}</TableCell>
              <TableCell>{summary.median.toFixed(2)}</TableCell>
              <TableCell>{summary.q3.toFixed(2)}</TableCell>
              <TableCell>{summary.max.toFixed(2)}</TableCell>
              <TableCell>{summary.variance.toFixed(2)}</TableCell>
              <TableCell>{summary.stddev.toFixed(2)}</TableCell>
              <TableCell>{summary.dominant}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Histogram data={summary.histogram} />
    </div>
  );
};

export default StatIndicators;
