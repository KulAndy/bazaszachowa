const RESOURCE = require("./resources");
const gm = require("gm").subClass({ imageMagick: true });
const domino = require("domino");

const document = domino.createDocument();

const DRAWER = {
  eloJPEG: async (data, player) => {
    const header = 10;
    const margin = 50;
    let width = 750;
    let heigth = 750;
    const img = gm(width + margin * 2, heigth + margin * 2, "white");
    heigth += header;
    initial_rating = null;
    let min_elo = 4000,
      max_elo = 0;

    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        initial_rating = data[i];
        min_elo = data[i].Elo;
        max_elo = data[i].Elo;
      } else {
        min_elo = Math.min(min_elo, data[i].Elo);
        max_elo = Math.max(max_elo, data[i].Elo);
      }
    }

    const month_number =
      12 -
      initial_rating.Month +
      (new Date().getFullYear() - initial_rating.Year - 1) * 12 +
      new Date().getMonth();
    const elo_range = Math.ceil((max_elo - min_elo) / 50) + 1;
    let k1 = month_number == 1 ? width : width / (month_number - 1);
    let k2 = (heigth - margin * 2) / elo_range;

    let max_graph_elo = 0;
    while (max_graph_elo < max_elo) {
      max_graph_elo += 50;
    }

    let min_graph_elo = 4000;
    while (min_graph_elo > min_elo) {
      min_graph_elo -= 50;
    }

    img
      .font("Helvetica-Bold")
      .fill("#000000")
      .fontSize(24)
      .drawText(0, 2, player, "North")
      .font("Helvetica")
      .fontSize(12)
      .drawText(0, 36, "Wykres elo", "North");
    img.stroke("black", 2).drawLine(margin, margin + header, margin, heigth);

    let max_point = header + margin;
    let min_point = header + margin;

    let start_date = new Date(`${initial_rating.Year}-${initial_rating.Month}`);
    let current_date = new Date();
    current_date.setDate(1);
    let i = 0;
    let period = Math.ceil(years_diff(start_date, current_date) / 22);

    while (start_date <= current_date) {
      if (start_date.getMonth() == 0) {
        if (years_diff(start_date, current_date) % period == 0) {
          img
            .stroke("transparent", 0)
            .drawText(margin + k1 * i, heigth + 20, start_date.getFullYear());
          if (period > 1) {
            img
              .stroke("red", 2)
              .drawLine(
                margin + k1 * i,
                margin + header,
                margin + k1 * i,
                heigth
              );
          } else {
            img
              .stroke("black", 2)
              .drawLine(
                margin + k1 * i,
                margin + header,
                margin + k1 * i,
                heigth
              );
          }
        } else {
          img
            .stroke("black", 2)
            .drawLine(
              margin + k1 * i,
              margin + header,
              margin + k1 * i,
              heigth
            );
        }
      } else if (
        start_date.getMonth() == initial_rating.Month &&
        start_date.getFullYear() == initial_rating.Year
      ) {
        if (initial_rating.Month < 5) {
          img
            .stroke("transparent", 0)
            .drawText(
              margin + k1 * i,
              heigth + 50,
              `${start_date.getFullYear()}-${start_date.getMonth()}`
            );
        } else {
          if (period == 1)
            img
              .stroke("transparent", 0)
              .drawText(margin + k1 * i, heigth + 20, start_date.getFullYear());
        }
      }
      start_date.setMonth(start_date.getMonth() + 1);
      if (
        start_date.getMonth() == current_date.getMonth() &&
        start_date.getFullYear() == current_date.getFullYear()
      ) {
        img
          .stroke("black", 2)
          .drawLine(margin + k1 * i, margin + header, margin + k1 * i, heigth);
        for (let j = 0; j <= elo_range; j++) {
          img
            .stroke("transparent", 0)
            .drawText(5, margin + header + k2 * j, max_graph_elo - j * 50);
          img
            .stroke("black", 2)
            .drawLine(
              margin,
              margin + header + k2 * j,
              margin + k1 * i,
              margin + header + k2 * j
            );
          min_point = margin + header + k2 * j;
          img.drawLine(margin, heigth, margin + k1 * i, heigth);
        }
      }
      i++;
    }
    if (start_date.getMonth() == 0) {
      img
        .stroke("transparent", 0)
        .drawText(margin + k1 * --i, heigth + 20, start_date.getFullYear());
    }

    start_date = new Date(`${initial_rating.Year}-${initial_rating.Month}`);
    let current_break = data[0];

    let current_point_x = margin;
    let current_percent =
      1 -
      (initial_rating.Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);
    let current_point_y = current_percent * (min_point - max_point) + max_point;
    img.stroke("blue", 3);

    console.log(data[0]);
    for (let i = 1; i < data.length; i++) {
      let new_break = data[i];
      let month_diff =
        (new_break.Year - current_break.Year) * 12 +
        (new_break.Month - current_break.Month);
      let new_current_point_x = current_point_x + k1 * month_diff;
      let new_current_percent =
        1 - (data[i].Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);

      let new_current_point_y =
        new_current_percent * (min_point - max_point) + max_point;
      img.drawLine(
        current_point_x,
        current_point_y,
        current_point_x + k1 * (month_diff - 1),
        current_point_y
      );
      img.drawLine(
        current_point_x + k1 * (month_diff - 1),
        current_point_y,
        new_current_point_x,
        new_current_point_y
      );

      current_point_x = new_current_point_x;
      current_point_y = new_current_point_y;
      current_break = new_break;
    }
    let new_break = {
      Year: new Date().getFullYear(),
      Month: new Date().getMonth(),
    };
    let month_diff =
      (new_break.Year - current_break.Year) * 12 +
      (new_break.Month - current_break.Month);
    let new_current_point_x = current_point_x + k1 * month_diff;

    img.drawLine(
      current_point_x,
      current_point_y,
      new_current_point_x,
      current_point_y
    );

    return new Promise((resolve, reject) => {
      img.toBuffer("jpeg", (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  },

  eloSVG: async (data, player) => {
    const header = 10;
    const margin = 50;
    let width = 750;
    let heigth = 750;
    const svg = document.createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", width + 2 * margin);
    svg.setAttribute("height", heigth + 2 * margin);
    svg.setAttribute("style", "background-color: white;");
    svg.setAttribute(
      "viewBox",
      `0 0 ${width + 2 * margin} ${heigth + 2 * margin}`
    );
    const background = document.createElement("rect");
    background.setAttribute("style", "fill:#fff");
    background.setAttribute("width", width + 2 * margin);
    background.setAttribute("height", heigth + 2 * margin);

    svg.appendChild(background);

    heigth += header;
    initial_rating = null;
    let min_elo = 4000,
      max_elo = 0;

    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        initial_rating = data[i];
        min_elo = data[i].Elo;
        max_elo = data[i].Elo;
      } else {
        min_elo = Math.min(min_elo, data[i].Elo);
        max_elo = Math.max(max_elo, data[i].Elo);
      }
    }

    const month_number =
      12 -
      initial_rating.Month +
      (new Date().getFullYear() - initial_rating.Year - 1) * 12 +
      new Date().getMonth();
    const elo_range = Math.ceil((max_elo - min_elo) / 50) + 1;
    let k1 = month_number == 1 ? width : width / (month_number - 1);
    let k2 = (heigth - margin * 2) / elo_range;

    let max_graph_elo = 0;
    while (max_graph_elo < max_elo) {
      max_graph_elo += 50;
    }

    let min_graph_elo = 4000;
    while (min_graph_elo > min_elo) {
      min_graph_elo -= 50;
    }

    const title = document.createElement("text");
    title.appendChild(document.createTextNode(player));
    title.setAttribute("x", (width - 5 * player.length) / 2);
    title.setAttribute("y", 30);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", 24);
    title.setAttribute("font-weight", "bold");

    const subtitle = document.createElement("text");
    subtitle.appendChild(document.createTextNode("Wykres Elo"));
    subtitle.setAttribute("x", (width - 5 * subtitle.textContent.length) / 2);
    subtitle.setAttribute("y", 50);
    subtitle.setAttribute("text-anchor", "middle");
    subtitle.setAttribute("font-size", 16);
    svg.appendChild(title);
    svg.appendChild(subtitle);

    let max_point = header + margin;
    let min_point = header + margin;

    let start_date = new Date(`${initial_rating.Year}-${initial_rating.Month}`);
    let current_date = new Date();
    current_date.setDate(1);
    let i = 0;
    let period = Math.ceil(years_diff(start_date, current_date) / 22);
    let line = document.createElement("line");
    line.setAttribute("x1", margin);
    line.setAttribute("y1", margin + header);
    line.setAttribute("x2", margin);
    line.setAttribute("y2", heigth);
    line.setAttribute("style", "stroke:#000;stroke-width:2");
    svg.appendChild(line);

    while (start_date <= current_date) {
      if (start_date.getMonth() == 0) {
        if (years_diff(start_date, current_date) % period == 0) {
          let year = document.createElement("text");
          year.setAttribute("x", margin + k1 * i);
          year.setAttribute("y", heigth + 20);
          year.appendChild(document.createTextNode(start_date.getFullYear()));
          svg.appendChild(year);
          if (period > 1) {
            let line = document.createElement("line");
            line.setAttribute("x1", margin + k1 * i);
            line.setAttribute("y1", margin + header);
            line.setAttribute("x2", margin + k1 * i);
            line.setAttribute("y2", heigth);
            line.setAttribute("style", "stroke:#f00;stroke-width:2");
            svg.appendChild(line);
          } else {
            let line = document.createElement("line");
            line.setAttribute("x1", margin + k1 * i);
            line.setAttribute("y1", margin + header);
            line.setAttribute("x2", margin + k1 * i);
            line.setAttribute("y2", heigth);
            line.setAttribute("style", "stroke:#000;stroke-width:2");
            svg.appendChild(line);
          }
        } else {
          let line = document.createElement("line");
          line.setAttribute("x1", margin + k1 * i);
          line.setAttribute("y1", margin + header);
          line.setAttribute("x2", margin + k1 * i);
          line.setAttribute("y2", heigth);
          line.setAttribute("style", "stroke:#000;stroke-width:2");
          svg.appendChild(line);
        }
      } else if (
        start_date.getMonth() == initial_rating.Month &&
        start_date.getFullYear() == initial_rating.Year
      ) {
        if (initial_rating.Month < 5) {
          let year_month = document.createElement("text");
          year_month.setAttribute("x", margin + k1 * i);
          year_month.setAttribute("y", heigth + 20);
          year_month.appendChild(
            document.createTextNode(
              `${start_date.getFullYear()}-${start_date.getMonth()}`
            )
          );
          svg.appendChild(year_month);
        } else {
          if (period == 1) {
            let year = document.createElement("text");
            year.setAttribute("x", margin + k1 * i);
            year.setAttribute("y", heigth + 20);
            year.appendChild(document.createTextNode(start_date.getFullYear()));
            svg.appendChild(year);
          }
        }
      }
      start_date.setMonth(start_date.getMonth() + 1);
      if (
        start_date.getMonth() == current_date.getMonth() &&
        start_date.getFullYear() == current_date.getFullYear()
      ) {
        let line = document.createElement("line");
        line.setAttribute("x1", margin + k1 * i);
        line.setAttribute("y1", margin + header);
        line.setAttribute("x2", margin + k1 * i);
        line.setAttribute("y2", heigth);
        line.setAttribute("style", "stroke:#000;stroke-width:2");
        svg.appendChild(line);

        for (let j = 0; j <= elo_range; j++) {
          let elo = document.createElement("text");
          elo.setAttribute("x", 5);
          elo.setAttribute("y", margin + header + k2 * j);
          elo.appendChild(document.createTextNode(max_graph_elo - j * 50));
          svg.appendChild(elo);

          let line = document.createElement("line");
          line.setAttribute("x1", margin);
          line.setAttribute("y1", margin + header + k2 * j);
          line.setAttribute("x2", margin + k1 * i);
          line.setAttribute("y2", margin + header + k2 * j);
          line.setAttribute("style", "stroke:#000;stroke-width:2");
          svg.appendChild(line);

          min_point = margin + header + k2 * j;
          let line2 = document.createElement("line");
          line2.setAttribute("x1", margin);
          line2.setAttribute("y1", heigth);
          line2.setAttribute("x2", margin + k1 * i);
          line2.setAttribute("y2", heigth);
          line2.setAttribute("style", "stroke:#000;stroke-width:2");
          svg.appendChild(line2);
        }
      }
      i++;
    }
    if (start_date.getMonth() == 0) {
      let year = document.createElement("text");
      year.setAttribute("x", margin + k1 * --i);
      year.setAttribute("y", heigth + 20);
      year.appendChild(document.createTextNode(start_date.getFullYear()));
      svg.appendChild(year);
    }

    let current_break = data[0];

    let current_point_x = margin;
    let current_percent =
      1 -
      (initial_rating.Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);
    let current_point_y = current_percent * (min_point - max_point) + max_point;

    for (let i = 1; i < data.length; i++) {
      let new_break = data[i];
      let month_diff =
        (new_break.Year - current_break.Year) * 12 +
        (new_break.Month - current_break.Month);
      let new_current_point_x = current_point_x + k1 * month_diff;
      let new_current_percent =
        1 - (data[i].Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);

      let new_current_point_y =
        new_current_percent * (min_point - max_point) + max_point;
      let line = document.createElement("line");
      line.setAttribute("x1", current_point_x);
      line.setAttribute("y1", current_point_y);
      line.setAttribute("x2", current_point_x + k1 * (month_diff - 1));
      line.setAttribute("y2", current_point_y);
      line.setAttribute("style", "stroke:#00f;stroke-width:4");
      svg.appendChild(line);

      let line2 = document.createElement("line");
      line2.setAttribute("x1", current_point_x + k1 * (month_diff - 1));
      line2.setAttribute("y1", current_point_y);
      line2.setAttribute("x2", new_current_point_x);
      line2.setAttribute("y2", new_current_point_y);
      line2.setAttribute("style", "stroke:#00f;stroke-width:4");
      svg.appendChild(line2);

      current_point_x = new_current_point_x;
      current_point_y = new_current_point_y;
      current_break = new_break;
    }
    let new_break = {
      Year: new Date().getFullYear(),
      Month: new Date().getMonth(),
    };
    let month_diff =
      (new_break.Year - current_break.Year) * 12 +
      (new_break.Month - current_break.Month);
    let new_current_point_x = current_point_x + k1 * month_diff;

    let line2 = document.createElement("line");
    line2.setAttribute("x1", current_point_x);
    line2.setAttribute("y1", current_point_y);
    line2.setAttribute("x2", new_current_point_x);
    line2.setAttribute("y2", current_point_y);
    line2.setAttribute("style", "stroke:#00f;stroke-width:4");
    svg.appendChild(line2);

    return svg.outerHTML;
  },
};

module.exports = DRAWER;

function years_diff(date1, date2) {
  if (date1 == date2) {
    return 0;
  }
  let diff = -1;
  let gDate =
    date1 > date2 ? new Date(date1.getTime()) : new Date(date2.getTime());
  let lDate =
    date1 < date2 ? new Date(date1.getTime()) : new Date(date2.getTime());

  while (lDate < gDate) {
    diff++;
    lDate.setYear(lDate.getFullYear() + 1);
  }
  return diff;
}

