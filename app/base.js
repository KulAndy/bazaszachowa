const SETTINGS = require("./settings");
var mysql = require("mysql2");

var db = mysql.createPool({
  host: SETTINGS.host,
  user: SETTINGS.user,
  password: SETTINGS.password,
  database: SETTINGS.base,
  // waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  debug: false,
});

const BASE = {
  async close() {
    db.end();
  },
  async execSearch(query, params = []) {
    return new Promise((data) => {
      db.query(query, params, function (error, result, fields) {
        if (error) {
          throw error;
        }
        try {
          data(result);
        } catch (error) {
          data({});
          throw error;
        }
      });
    });
  },

  async fide_data(name) {
    let name_ful;
    if (name[1] == "'" || name[1] == "`") {
      name_ful = name.substring(1);
    } else {
      name_ful = name;
    }
    name_ful = name_ful.replace(/'/g, " ");
    name_ful = name_ful.replaceAll("-", " ");
    name_ful = name_ful.replace(/ \w?\.*$/g, "");
    name_ful = name_ful.replace(/\(.*/g, "");
    name_ful = name_ful.replace(/,$/g, "");
    name_ful = name_ful.replace(/\s+/g, " ");
    name_ful = name_ful.replace(/ *$/g, "");
    name_ful = name_ful.replace(/(^| |')\w{0,2}($| |')/g, "");
    name_ful = "+" + name_ful.replace(/ +/g, " +");
    name_ful = name_ful.trim();
    let query = `SELECT
      fideid,
      name,
      title,
      rating,
      rapid_rating,
      blitz_rating,
      birthday
      FROM
      fide_players
      WHERE
      MATCH(NAME) AGAINST(
          ? IN BOOLEAN MODE
      ) AND NAME LIKE ?`;
    let result = await this.execSearch(query, [name_ful, name]);
    return result;
  },

  async searchPlayer(player, table, forFulltext = false) {
    player += "%";

    let query = `
    SELECT
    fullname
    FROM ${
      table == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
    } WHERE fullname like ? `;

    let result = await this.execSearch(query, [player]);
    if (result.length == 0) {
      query = `
    SELECT
    fullname
    FROM ${SETTINGS.whole_players} WHERE fullname like ? `;

      result = await this.execSearch(query, [player]);
    }
    if (forFulltext) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].fullname[1] == "'" || result[i].fullname[1] == "`") {
          result[i].fullname = result[i].fullname.substring(1);
        }
        result[i].fullname = result[i].fullname.replace(/'/g, " ");
        result[i].fullname = result[i].fullname.replaceAll("-", " ");
        result[i].fullname = result[i].fullname.replace(/ \w?\.*$/g, "");
        result[i].fullname = result[i].fullname.replace(/\(.*/g, "");
        result[i].fullname = result[i].fullname.replace(/,$/g, "");
        result[i].fullname = result[i].fullname.replace(/\s+/g, " ");
        result[i].fullname = result[i].fullname.replace(/ *$/g, "");
        result[i].fullname = result[i].fullname.replace(
          /(^| |')\w{0,2}($| |')/g,
          ""
        );
        result[i].fullname = "+" + result[i].fullname.replace(/ +/g, " +");
        result[i].fullname = result[i].fullname.trim();
      }
    }
    result = [...new Set(result)];
    result = result.map((a) => a.fullname);

    return result;
  },

  async getGame(id, base) {
    let players_table =
      base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players;

    let table = base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table;
    let query = `SELECT
    ${table}.id, moves, ${SETTINGS.events_table}.name as Event, ${
      SETTINGS.sites_table
    }.site as Site, ${table}.Year, ${table}.Month, ${table}.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo,${
      SETTINGS.eco_table
    }.ECO as  ECO   
    FROM ${table}
    inner join ${players_table} as t1 on WhiteID = t1.id
    inner join ${players_table} as t2 on BlackID = t2.id
    LEFT join ${SETTINGS.events_table} on ${table}.EventID = ${
      SETTINGS.events_table
    }.id
    LEFT join ${SETTINGS.sites_table} on ${table}.siteID = ${
      SETTINGS.sites_table
    }.id
    LEFT join ${SETTINGS.eco_table} on ${table}.ecoID = ${SETTINGS.eco_table}.id
    WHERE ${table}.id = ${parseInt(id)}
    `;
    return await this.execSearch(query);
  },

  async player_opening_stats_color(player, color) {
    let query = `SELECT opening,
        COUNT(*) as count,
        Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
        FROM ${SETTINGS.all_table}
        inner join ${SETTINGS.all_players} as t1 on ${
      color == "white" ? "whiteID" : "BlackID"
    } = t1.id
        INNER JOIN ${SETTINGS.eco_table}
        on ${SETTINGS.all_table}.ecoID = ${SETTINGS.eco_table}.id
        WHERE MATCH(t1.fullname) against(? in boolean mode)
        AND t1.fullname like ?
        GROUP BY opening
        ORDER by COUNT(*) DESC, opening`;
    let fulltextPlayer = JSON.parse(JSON.stringify(player));
    if (fulltextPlayer.split(" ").length > 1) {
      if (fulltextPlayer[1] == "'" || fulltextPlayer[1] == "`") {
        fulltextPlayer = fulltextPlayer.substring(1);
      }
      fulltextPlayer = fulltextPlayer.replace(/'/g, " ");
      fulltextPlayer = fulltextPlayer.replace(/ \w?\.*$/g, "");
      fulltextPlayer = fulltextPlayer.replace(/\(.*/g, "");
      fulltextPlayer = fulltextPlayer.replace(/,$/g, "");
      fulltextPlayer = fulltextPlayer.replace(/\s+/g, " ");
      fulltextPlayer = fulltextPlayer.replace(/ *$/g, "");
      fulltextPlayer = fulltextPlayer.replaceAll("-", " ");
      fulltextPlayer = fulltextPlayer.replace(/(^| |')\w{0,2}($| |')/g, "");
      fulltextPlayer = fulltextPlayer.trim();

      fulltextPlayer = "+" + fulltextPlayer.replace(/ +/g, " +").trim();
    }

    return await this.execSearch(query, [fulltextPlayer, player]);
  },

  async player_opening_stats(player) {
    let whites = await this.player_opening_stats_color(player, "white");
    let blacks = await this.player_opening_stats_color(player, "black");
    let stats = {
      whites: whites,
      blacks: blacks,
    };
    return stats;
  },

  async search_player_opening_game(player, color = null, opening = null) {
    let query = `            
    SELECT
        ${SETTINGS.all_table}.id, moves, ${SETTINGS.events_table}.name as Event, ${SETTINGS.all_table}.Year, ${SETTINGS.all_table}.Month, ${SETTINGS.all_table}.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, ${SETTINGS.eco_table}.ECO   
        FROM ${SETTINGS.all_table}
        inner join ${SETTINGS.all_players} as t1 on WhiteID = t1.id
        inner join ${SETTINGS.all_players} as t2 on BlackID = t2.id
        LEFT join ${SETTINGS.events_table} on ${SETTINGS.all_table}.EventID = ${SETTINGS.events_table}.id        
        LEFT JOIN ${SETTINGS.eco_table} on ${SETTINGS.all_table}.ecoID = ${SETTINGS.eco_table}.ID
`;
    let fulltextPlayer = JSON.parse(JSON.stringify(player));
    if (fulltextPlayer.split(" ").length > 1) {
      if (fulltextPlayer[1] == "'" || (fulltextPlayer[1] == "`") == "'") {
        fulltextPlayer = fulltextPlayer.substring(1);
      }

      fulltextPlayer = "+" + fulltextPlayer.replace(/ /g, " +").trim();
    }
    let params = [fulltextPlayer, player];
    if (color == "white") {
      query += `
        WHERE match(t1.fullname) against(? in boolean mode) AND t1.fullname like ? 
`;
      if (opening) {
        query += "AND opening like ?";
        params.push(opening);
      }
      query +=
        "\norder by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
    } else if (color == "black") {
      query += `
        WHERE match(t2.fullname) against(? in boolean mode) AND t2.fullname like ? 
`;
      if (opening) {
        query += "AND opening like ?";
        params.push(opening);
      }
      query +=
        "\norder by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
    }
    return await this.execSearch(query, params);
  },

  async min_max_year_eco(player, base) {
    let fulltextPlayer = JSON.parse(JSON.stringify(player));
    if (fulltextPlayer.split(" ").length > 1) {
      if (fulltextPlayer[1] == "'" || (fulltextPlayer[1] == "`") == "'") {
        fulltextPlayer = fulltextPlayer.substring(1);
      }

      fulltextPlayer = fulltextPlayer
        .replace(/ +[a-z0-9\.]\.* +/i)
        .replace(/ +[a-z0-9\.]$/i, "");
      fulltextPlayer = fulltextPlayer.replaceAll(".", "");
      fulltextPlayer = fulltextPlayer.replaceAll("-", " ");
      fulltextPlayer = "+" + fulltextPlayer.replace(/ +/g, " +").trim();
    }
    let query = `
SELECT max(WhiteElo) as maxElo, min(Year) as minYear, max(Year) as maxYear 
FROM ${base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table} 
inner join ${
      base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
    } as t1 on WhiteID = t1.id 
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ? 
UNION 
SELECT max(BlackElo) as maxElo, min(Year) as minYear, max(Year) as maxYear
FROM ${base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table}  
inner join ${
      base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
    } as t1 on BlackID = t1.id 
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ?     `;
    return await this.execSearch(query, [
      fulltextPlayer,
      player,
      fulltextPlayer,
      player,
    ]);
  },
  async elo_history(player, base = "all") {
    let fulltextPlayer = JSON.parse(JSON.stringify(player));
    if (fulltextPlayer.split(" ").length > 1) {
      if (fulltextPlayer[1] == "'" || (fulltextPlayer[1] == "`") == "'") {
        fulltextPlayer = fulltextPlayer.substring(1);
      }

      fulltextPlayer = fulltextPlayer
        .replace(/ +[a-z0-9\.]\.* +/i)
        .replace(/ +[a-z0-9\.]$/i, "");
      fulltextPlayer = fulltextPlayer.replaceAll(".", "");
      fulltextPlayer = fulltextPlayer.replaceAll("-", " ");
      fulltextPlayer = "+" + fulltextPlayer.replace(/ +/g, " +").trim();
      let query = `
      SELECT MAX(Elo) as Elo, Year, Month FROM(
          SELECT WhiteElo as Elo, Year, Month FROM ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }
            INNER JOIN ${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }
            on WhiteID = ${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }.id
            WHERE MATCH(${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }.fullname) against(? in boolean mode) AND Month is not null AND WhiteElo is not null AND ${
        base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
      }.fullname like ?
            UNION DISTINCT
            SELECT BlackElo as Elo, Year, Month FROM ${
              base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
            }
            INNER JOIN ${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }
            on BlackID = ${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }.id
            WHERE MATCH(${
              base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
            }.fullname) against(? in boolean mode) AND Month is not null AND BlackElo is not null AND ${
        base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
      }.fullname like ?
      ) as pom
      group by Year, Month
            ORDER by Year, Month
    `;
      return await this.execSearch(query, [
        fulltextPlayer,
        player,
        fulltextPlayer,
        player,
      ]);
    }
  },

  async search_games(obj) {
    if (obj.searching) var searching = obj.searching;
    if (obj.ignore) var base = obj.base;
    if (obj.white) var whites = await this.searchPlayer(obj.white, base, true);
    if (obj.black) var blacks = await this.searchPlayer(obj.black, base, true);
    if (obj.ignore) var ignore = obj.ignore === "true" || obj.ignore === "True";
    if (obj.event) var event = obj.event;
    if (obj.minYear) var minYear = parseInt(obj.minYear);
    if (obj.maxYear) var maxYear = parseInt(obj.maxYear);
    if (obj.minEco) var minEco = parseInt(obj.minEco);
    if (obj.maxEco) var maxEco = parseInt(obj.maxEco);
    switch (searching) {
      case "classic":
        let query = "";
        let params = [];
        if (whites && blacks) {
          for (let i = 0; i < whites.length; i++) {
            for (let j = 0; j < blacks.length; j++) {
              let white = whites[i];

              let black = blacks[j];
              if (i != 0 || j != 0) {
                query += `
                            UNION distinct
                            `;
              }
              if (["'", "`"].indexOf(white[1]) >= 0) {
                white = white.substring(1);
              }
              if (["'", "`"].indexOf(black[1]) >= 0) {
                black = black.substring(1);
              }
              query += `SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.EventID = ${
                SETTINGS.events_table
              }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t1.fullname) against(? in boolean mode) and 
                    match(t2.fullname) against(? in boolean mode)               
                `;
              params.push(white);
              params.push(black);
              if (
                minYear &&
                maxYear &&
                !(minYear == 1475 && maxYear == new Date().getFullYear())
              ) {
                query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
              }
              if (event) {
                query += ` AND ${SETTINGS.events_table} LIKE ? `;
                params.push(event);
              }
              if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
                query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
            }
          }

          if (ignore) {
            for (let i = 0; i < whites.length; i++) {
              for (let j = 0; j < blacks.length; j++) {
                let white = whites[i];
                let black = blacks[j];
                if (["'", "`"].indexOf(white[1]) >= 0) {
                  white = white.substring(1);
                }
                if (["'", "`"].indexOf(black[1]) >= 0) {
                  black = black.substring(1);
                }
                query += `
                  UNION distinct
                  SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
                  base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
                }.EventID = ${
                  SETTINGS.events_table
                }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
                  base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
                }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t1.fullname) against(? in boolean mode) and 
                    match(t2.fullname) against(? in boolean mode)                
                `;
                params.push(black);
                params.push(white);
                if (
                  minYear &&
                  maxYear &&
                  !(minYear == 1475 && maxYear == new Date().getFullYear())
                ) {
                  query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
                }
                if (event) {
                  query += ` AND ${SETTINGS.events_table} LIKE ? `;
                  params.push(event);
                }
                if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
                  query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
              }
            }
          }
        } else if (whites) {
          for (let i = 0; i < whites.length; i++) {
            let white = whites[i];
            if (i != 0) {
              query += `
                            UNION distinct
                            `;
            }
            if (["'", "`"].indexOf(white[1]) >= 0) {
              white = white.substring(1);
            }
            query += `SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
              base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
            }.EventID = ${
              SETTINGS.events_table
            }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
              base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
            }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t1.fullname) against(? in boolean mode)           
                `;
            params.push(white);
            if (
              minYear &&
              maxYear &&
              !(minYear == 1475 && maxYear == new Date().getFullYear())
            ) {
              query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
            }
            if (event) {
              query += ` AND ${SETTINGS.events_table} LIKE ? `;
              params.push(event);
            }
            if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
              query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
          }

          if (ignore) {
            for (let i = 0; i < whites.length; i++) {
              let white = whites[i];
              query += `
                        UNION distinct
                        `;
              if (["'", "`"].indexOf(white[1]) >= 0) {
                white = white.substring(1);
              }
              query += `SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.EventID = ${
                SETTINGS.events_table
              }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t2.fullname) against(? in boolean mode)           
                `;
              params.push(white);
              if (
                minYear &&
                maxYear &&
                !(minYear == 1475 && maxYear == new Date().getFullYear())
              ) {
                query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
              }
              if (event) {
                query += ` AND ${SETTINGS.events_table} LIKE ? `;
                params.push(event);
              }
              if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
                query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
            }
          }
        } else if (blacks) {
          for (let i = 0; i < blacks.length; i++) {
            let black = blacks[i];
            if (i != 0) {
              query += `
                            UNION distinct
                            `;
            }
            if (["'", "`"].indexOf(black[1]) >= 0) {
              black = black.substring(1);
            }
            query += `SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
              base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
            }.EventID = ${
              SETTINGS.events_table
            }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
              base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
            }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t2.fullname) against(? in boolean mode)           
                `;
            params.push(black);
            if (
              minYear &&
              maxYear &&
              !(minYear == 1475 && maxYear == new Date().getFullYear())
            ) {
              query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
            }
            if (event) {
              query += ` AND ${SETTINGS.events_table} LIKE ? `;
              params.push(event);
            }
            if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
              query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
          }

          if (ignore) {
            for (let i = 0; i < blacks.length; i++) {
              let black = blacks[i];
              query += `
                        UNION distinct
                        `;
              if (["'", "`"].indexOf(black[1]) >= 0) {
                black = black.substring(1);
              }
              query += `SELECT
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.id, moves, 
                    ${SETTINGS.events_table}.name as Event, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Year, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Month, 
                    ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }.Day, 
                    Round, 
                    t1.fullname as White, 
                    t2.fullname as Black,  
                    Result, WhiteElo, 
                    BlackElo, ${SETTINGS.eco_table}.ECO as ECO   
                    FROM ${
                      base == "poland"
                        ? SETTINGS.poland_table
                        : SETTINGS.all_table
                    }
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t1 on WhiteID = t1.id
                    inner join ${
                      base == "poland"
                        ? SETTINGS.poland_players
                        : SETTINGS.all_players
                    } as t2 on BlackID = t2.id
                    LEFT join ${SETTINGS.events_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.EventID = ${
                SETTINGS.events_table
              }.id                                               
                    LEFT join ${SETTINGS.eco_table} on ${
                base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
              }.ecoID = ${SETTINGS.eco_table}.id
                    WHERE
                    match(t1.fullname) against(? in boolean mode)           
                `;
              params.push(black);
              if (
                minYear &&
                maxYear &&
                !(minYear == 1475 && maxYear == new Date().getFullYear())
              ) {
                query += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
              }
              if (event) {
                query += ` AND ${SETTINGS.events_table} LIKE ? `;
                params.push(event);
              }
              if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
                query += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
            }
          }
        }
        query +=
          " order BY year DESC,month DESC,day DESC,Event,Round desc, White, Black limit 10000";

        return params.length > 0 ? await this.execSearch(query, params) : [];

      case "fulltext":
        if (obj.white) var whites = JSON.parse(JSON.stringify(obj.white));
        if (obj.black) var blacks = JSON.parse(JSON.stringify(obj.black));

        let paramsFulltext = [];
        let queryFulltext = `
        SELECT                         
        ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.id, moves, ${SETTINGS.events_table}.name as Event, ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.Year, ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.Month, ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, ${
          SETTINGS.eco_table
        }.ECO as ECO   
        FROM ${base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table}
        inner join ${
          base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
        } as t1 on WhiteID = t1.id
        inner join ${
          base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
        } as t2 on BlackID = t2.id
        LEFT join ${SETTINGS.events_table} on ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.EventID = ${
          SETTINGS.events_table
        }.id                                       
        LEFT join ${SETTINGS.eco_table} on ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.ecoID = ${SETTINGS.eco_table}.id
        WHERE 
        `;

        if (whites) {
          if (whites.split(" ").length > 1) {
            if (whites[1] == "'" || whites[1] == "`") {
              whites = whites.substring(1);
            }
            whites = whites.replace(/'/g, " ");
            whites = whites.replace(/ \w?\.*$/g, "");
            whites = whites.replace(/\(.*/g, "");
            whites = whites.replace(/,$/g, "");
            whites = whites.replace(/\s+/g, " ");
            whites = whites.replace(/ *$/g, "");
            whites = whites.replace(/(^| |')\w{0,2}($| |')/g, "");
            whites = whites.replaceAll("-", " ");
            whites = whites.trim();

            whites = "+" + whites.replace(/ +/g, " +").trim();
          }
          queryFulltext +=
            " match(t1.fullname) against(? in boolean mode) AND t1.fullname like ? ";
          paramsFulltext.push(whites, obj.white);
        }
        if (blacks) {
          if (blacks.split(" ").length > 1) {
            if (blacks[1] == "'" || blacks[1] == "`") {
              blacks = blacks.substring(1);
            }
            blacks = blacks.replace(/'/g, " ");
            blacks = blacks.replace(/ \w?\.*$/g, "");
            blacks = blacks.replace(/\(.*/g, "");
            blacks = blacks.replace(/,$/g, "");
            blacks = blacks.replace(/\s+/g, " ");
            blacks = blacks.replace(/ *$/g, "");
            blacks = blacks.replace(/(^| |')\w{0,2}($| |')/g, "");
            blacks = blacks.replaceAll("-", " ");
            blacks = blacks.trim();

            blacks = "+" + blacks.replace(/ +/g, " +").trim();
          }
          if (whites) queryFulltext += " AND ";
          queryFulltext +=
            " match(t2.fullname) against(? in boolean mode) AND t2.fullname like ? ";
          paramsFulltext.push(blacks, obj.black);
        }
        if (
          minYear &&
          maxYear &&
          !(minYear == 1475 && maxYear == new Date().getFullYear())
        ) {
          queryFulltext += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
        }
        if (event) {
          queryFulltext += ` AND ${SETTINGS.events_table} LIKE ? `;
          paramsFulltext.push(event);
        }
        if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
          queryFulltext += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;

        if (ignore) {
          queryFulltext += `
            UNION DISTINCT
        SELECT                         
        ${
          base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
        }.id, moves, ${SETTINGS.events_table}.name as Event, ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }.Year, ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }.Month, ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, ${
            SETTINGS.eco_table
          }.ECO as ECO   
        FROM ${base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table}
        inner join ${
          base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
        } as t1 on WhiteID = t1.id
        inner join ${
          base == "poland" ? SETTINGS.poland_players : SETTINGS.all_players
        } as t2 on BlackID = t2.id
        LEFT join ${SETTINGS.events_table} on ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }.EventID = ${
            SETTINGS.events_table
          }.id                                       
        LEFT join ${SETTINGS.eco_table} on ${
            base == "poland" ? SETTINGS.poland_table : SETTINGS.all_table
          }.ecoID = ${SETTINGS.eco_table}.id
        WHERE 
        `;

          if (whites) {
            queryFulltext +=
              " match(t2.fullname) against(? in boolean mode) AND t2.fullname like ? ";

            paramsFulltext.push(whites, obj.white);
          }
          if (blacks) {
            if (whites) queryFulltext += " AND ";
            queryFulltext +=
              " match(t1.fullname) against(? in boolean mode) AND t1.fullname like ? ";

            paramsFulltext.push(blacks, obj.black);
          }
          if (
            minYear &&
            maxYear &&
            !(minYear == 1475 && maxYear == new Date().getFullYear())
          ) {
            queryFulltext += ` and Year BETWEEN ${minYear} AND ${maxYear} `;
          }
          if (event) {
            queryFulltext += ` AND ${SETTINGS.events_table} LIKE ? `;
            paramsFulltext.push(event);
          }
          if (minEco && maxEco && !(minEco == 1 && maxEco == 500))
            queryFulltext += ` and ${SETTINGS.eco_table}.id BETWEEN ${minEco} AND ${maxEco} `;
          queryFulltext +=
            " order BY year DESC,month DESC,day DESC,Event,Round desc, White, Black limit 10000";
        }

        return paramsFulltext.length > 0
          ? await this.execSearch(queryFulltext, paramsFulltext)
          : [];
    }
  },
};

module.exports = BASE;
