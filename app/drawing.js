const RESOURCE = require("./resources");
const gm = require("gm").subClass({ imageMagick: true });

const DRAWER = {
  eloCurve: async (data, player) => {
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
      //   .draw((context) => {
      //     context.fontWeight(100);
      //   })
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
              .stroke("green", 2)
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
    i = 0;
    let j = 0;
    let current_point_x = margin;
    let current_percent =
      1 -
      (initial_rating.Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);
    let current_point_y = current_percent * (min_point - max_point) + max_point;
    img.stroke("blue", 4);

    while (start_date < current_date) {
      let pom = new Date(`${data[j].Year}-${data[j].Month}`);
      if (
        start_date.getMonth() == pom.getMonth() &&
        start_date.getFullYear() == pom.getFullYear()
      ) {
        let new_current_point_x = margin + k1 * i;
        let new_current_percent =
          1 - (data[j].Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);

        let new_current_point_y =
          new_current_percent * (min_point - max_point) + max_point;
        if (current_point_x != new_current_point_x) {
          img.drawLine(
            current_point_x,
            current_point_y,
            new_current_point_x,
            new_current_point_y
          );
        }
        current_point_x = new_current_point_x;
        current_point_y = new_current_point_y;
        j++;
        j = Math.min(j, data.length - 1);
      } else {
        let new_current_point_x = margin + k1 * i;
        let new_current_percent =
          1 - (data[j].Elo - min_graph_elo) / (max_graph_elo - min_graph_elo);

        let new_current_point_y =
          new_current_percent * (min_point - max_point) + max_point;
        if (current_point_x != new_current_point_x)
          img.drawLine(
            current_point_x,
            current_point_y,
            new_current_point_x,
            new_current_point_y
          );
        current_point_x = new_current_point_x;
        current_point_y = new_current_point_y;
      }
      start_date.setMonth(start_date.getMonth() + 1);
      i++;
    }

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
