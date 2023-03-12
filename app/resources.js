const fs = require("fs");
const { spawn } = require("child_process");
const iconv = require("iconv-lite");

const RESOURCE = {
  async sendFileWithHeader(response, before, filename, after) {
    const HEADER = fs.readFileSync(
      __dirname + "/templates/header.html",
      "utf8"
    );
    const MENU = fs.readFileSync(__dirname + "/templates/menu.html", "utf8");
    const FOOTER = fs.readFileSync(
      __dirname + "/templates/footer.html",
      "utf8"
    );

    fs.readFile(__dirname + filename, function (error, data) {
      if (error) {
        RESOURCE.httpError(response, 404);
      } else {
        response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        let page =
          HEADER +
          MENU +
          (before != null ? before : "") +
          data +
          (after != null ? after : "") +
          FOOTER;
        response.write(page);
        response.end();
      }
    });
  },

  async sendFile(response, filename, type) {
    fs.readFile(__dirname + filename, function (error, data) {
      if (error) {
        RESOURCE.httpError(response, 404);
      } else {
        response.writeHead(200, { "Content-Type": type });
        response.write(data);
        response.end();
      }
    });
  },

  async httpError(response, httpErr) {
    const HEADER = fs.readFileSync(
      __dirname + "/templates/header.html",
      "utf8"
    );
    const MENU = fs.readFileSync(__dirname + "/templates/menu.html", "utf8");
    const FOOTER = fs.readFileSync(
      __dirname + "/templates/footer.html",
      "utf8"
    );

    fs.readFile(
      __dirname + "/errors/" + httpErr + ".html",
      function (error, data) {
        if (error) {
          response.writeHead(httpErr, {
            "Content-Type": "text/html;charset=utf-8",
          });
          response.write(`<h1>błąd ${httpErr}<h1>`);
          response.end();
        } else {
          let page = HEADER + MENU + data + FOOTER;
          response.writeHead(404, {
            "Content-Type": "text/html;charset=utf-8",
          });
          response.write(page);
          response.end();
        }
      }
    );
  },

  getRequestData: async (req) => {
    return new Promise((resolve, reject) => {
      try {
        let body = "";

        req.on("data", (part) => {
          body += part.toString();
        });

        req.on("end", () => {
          resolve(body);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  async URIData2JSON(data) {
    let json = {};
    let keyParam = data.split("&");
    for (let i = 0; i < keyParam.length; i++) {
      let tmp = keyParam[i].split("=");
      json[tmp[0]] = decodeURIComponent(tmp[1].replace("+", " "));
    }
    return json;
  },

  async POSTData(req) {
    return await this.URIData2JSON(await this.getRequestData(req));
  },

  async GETData(req) {
    return req.url.indexOf("?") >= 0
      ? await this.URIData2JSON(req.url.split("?")[1])
      : {};
  },

  async RequestData(req) {
    return req.method == "GET" ? this.GETData(req) : this.POSTData(req);
  },

  async sendJSON(response, data) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(data));
    response.end();
  },
  async sendPGN(response, data) {
    let PGN = `
[Event "${data.Event ? data.Event : "?"}"]
[Site "${data.Site ? data.Site : "?"}"]
[Date "${data.Year}.${data.Month == null ? "??" : data.Month}.${
      data.Day == null ? "??" : data.Day
    }"]
[Round "${data.Round}"]
[Black "${data.White}"]
[Black "${data.Black}"]
[Result "${data.Result}"]
[ECO "${data.ECO}"]
[WhiteElo "${data.WhiteElo}"]
[BlackElo "${data.BlackElo}"]

${data.moves}
`;
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(PGN);
    response.end();
  },
  async cr_data(name) {
    return new Promise((resolve, reject) => {
      try {
        const curl = spawn("curl", [
          "-X",
          "POST",
          "-H",
          "Content-Type: application/x-www-form-urlencoded",
          "--data-urlencode",
          "typ_szukania=szukaj_czlonka",
          "--data-urlencode",
          `wyszukiwany_ciag=${name}`,
          "--data-urlencode",
          "szukaj=szukaj",
          "http://www.cr-pzszach.pl/ew/viewpage.php?page_id=3",
        ]);

        let body = "";

        curl.stdout.on("data", (data) => {
          body += iconv.decode(data, "iso-8859-2").toString();
        });

        // curl.stderr.on("data", (data) => {
        //   console.error(`stderr: ${data}`);
        // });

        curl.on("close", (code) => {
          resolve(body);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  async sendImage(response, image, type) {
    response.writeHead(200, { "Content-Type": `image/${type}` });
    // response.write(image);
    response.end(image);
  },
};

module.exports = RESOURCE;
