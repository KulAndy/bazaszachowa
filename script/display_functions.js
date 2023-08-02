"use strict";
import SETTINGS from "./settings.js";
import SEARCH from "./search_functions.js";
import STOCKFISH_CONTROLLER from "./stockfish_controller.js";
import GENERIC from "./generic_functions.js";

const DISPLAY = {
  games_list(data, base = "all", games_list_id = "games") {
    let table = document.getElementById(games_list_id);
    table.innerHTML = "";
    let caption = document.createElement("caption");
    caption.innerText = "Znalezionych partii: " + data.length;
    if (data.length == 10000) {
      caption.innerText += " (limit)";
    }
    caption.innerText += " ";
    let save = document.createElement("button");
    save.innerText = "Pobierz";
    save.onclick = function () {
      DISPLAY.download(data);
    };
    caption.append(save);
    table.append(caption);
    let columns = document.createElement("tr");
    let white_header = document.createElement("th");
    white_header.innerText = "Biały";
    let white_elo_header = document.createElement("th");
    white_elo_header.innerText = "Elo białego";
    white_elo_header.classList.add("not_mobile");
    let black_header = document.createElement("th");
    black_header.innerText = "Czarny";
    let black_elo_header = document.createElement("th");
    black_elo_header.innerText = "Elo czarnego";
    black_elo_header.classList.add("not_mobile");
    let result_header = document.createElement("th");
    result_header.style.whiteSpace = "nowrap";
    result_header.innerText = "Wynik";
    let date_header = document.createElement("th");
    date_header.innerText = "Data";
    let event_header = document.createElement("th");
    event_header.innerText = "Turniej";
    event_header.classList.add("not_mobile");
    let eco_header = document.createElement("th");
    eco_header.innerText = "ECO";
    eco_header.style.whiteSpace = "nowrap";
    eco_header.classList.add("not_mobile");
    let show_game_header = document.createElement("th");
    show_game_header.innerText = "Zobacz\npartię";
    let show_raw_header = document.createElement("th");
    show_raw_header.innerText = "RAW";
    show_raw_header.classList.add("not_mobile");
    columns.appendChild(white_elo_header);
    columns.appendChild(white_header);
    columns.appendChild(result_header);
    columns.appendChild(black_header);
    columns.appendChild(black_elo_header);
    columns.appendChild(event_header);
    columns.appendChild(date_header);
    columns.appendChild(eco_header);
    columns.appendChild(show_game_header);
    columns.appendChild(show_raw_header);
    table.append(columns);
    let ids = [];
    for (let i = 0; i < data.length; i++) {
      ids.push(data[i].id);
    }
    for (let i = 0; i < data.length; i++) {
      let tr = document.createElement("tr");
      let white = document.createElement("td");
      white.innerText = data[i].White;
      let white_elo = document.createElement("td");
      white_elo.innerText = data[i].WhiteElo;
      white_elo.classList.add("not_mobile");
      let black = document.createElement("td");
      black.innerText = data[i].Black;
      let black_elo = document.createElement("td");
      black_elo.innerText = data[i].BlackElo;
      black_elo.classList.add("not_mobile");
      let result = document.createElement("td");
      result.innerText = data[i].Result;
      let date = document.createElement("td");
      date.innerText = data[i].Year + ".";
      if (data[i].Month == null) {
        date.innerText += "? ";
      } else {
        date.innerText += data[i].Month;
      }
      date.innerText += ".";
      if (data[i].Day == null) {
        date.innerText += "? ";
      } else {
        date.innerText += data[i].Day;
      }
      let event = document.createElement("td");
      event.innerText = data[i].Event;
      event.classList.add("not_mobile");
      let eco = document.createElement("td");
      eco.innerText = data[i].ECO;
      eco.classList.add("not_mobile");
      let show_game = document.createElement("td");
      let viewButton = document.createElement("button");
      viewButton.innerText = "zobacz";
      viewButton.style.fontWeight = "bolder";
      viewButton.onclick = () => {
        let form = document.createElement("form");
        form.style.visibility = "hidden";
        form.method = "POST";
        form.action = `${SETTINGS.NOMENU_URLS.game}?id=${data[i].id}&base=${base}`;
        let inputList = document.createElement("input");
        let ids = data.map(function (value) {
          return value.id;
        });
        inputList.value = ids;
        inputList.name = "list";
        let inputCurrent = document.createElement("input");
        inputCurrent.value = i;
        let inputBase = document.createElement("input");
        inputBase.name = "base";
        inputBase.value = base;
        inputCurrent.name = "current";
        form.appendChild(inputList);
        form.appendChild(inputCurrent);
        form.appendChild(inputBase);
        document.body.append(form);
        form.submit();
      };
      show_game.append(viewButton);
      let show_raw = document.createElement("td");
      show_raw.innerHTML =
        `<button><a href='${SETTINGS.NOMENU_URLS.game_raw}?id=` +
        data[i].id +
        "&table=" +
        base +
        "'>zobacz</a></button>";
      show_raw.classList.add("not_mobile");
      tr.appendChild(white_elo);
      tr.appendChild(white);
      tr.appendChild(result);
      tr.appendChild(black);
      tr.appendChild(black_elo);
      tr.appendChild(event);
      tr.appendChild(date);
      tr.appendChild(eco);
      tr.appendChild(show_game);
      tr.appendChild(show_raw);
      table.append(tr);
    }
  },
  download(data) {
    let games = "";
    for (let i = 0; i < data.length; i++) {
      games += '[Event "' + data[i].Event + '"]\n';
      games += '[Site "' + data[i].Site + '"]\n';
      games += '[Date "' + data[i].Year + ".";
      if (data[i].Month == null) {
        games += "?.";
      } else {
        games += data[i].Month;
      }
      if (data[i].Day == null) {
        games += '? "]\n';
      } else {
        games += data[i].Day + '"]\n';
      }
      games += '[Round "' + data[i].Round + '"]\n';
      games += '[White "' + data[i].White + '"]\n';
      games += '[Black "' + data[i].Black + '"]\n';
      games += '[Result "' + data[i].Result + '"]\n';
      if (data[i].ECO != null) {
        games += '[ECO "' + data[i].ECO + '"]\n';
      }
      if (data[i].WhiteElo != null) {
        games += '[WhiteElo "' + data[i].WhiteElo + '"]\n';
      }
      if (data[i].BlackElo != null) {
        games += '[BlackElo "' + data[i].BlackElo + '"]\n';
      }
      games += "\n" + data[i].moves + "\n\n";
    }
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(
      new Blob([games], { type: "text/plain" })
    );
    a.download = "games.pgn";
    a.click();
  },
  async update_data_list(input, optlist, base = "all") {
    let searchbar = document.getElementById(input);
    let datalist = document.getElementById(optlist);
    let player = GENERIC.replaceNationalCharacters(searchbar.value);
    searchbar.value = player;
    datalist.innerHTML = "";

    if (player.length > 3) {
      const PLAYERS = await SEARCH.players(player, base);
      this.players_hints(PLAYERS, optlist);
    }
  },
  players_hints(players, optlist) {
    let datalist = document.getElementById(optlist);

    for (let finded of players) {
      let option = document.createElement("option");

      option.value = finded.fullname;
      datalist.append(option);
    }
  },
  async min_max_year_elo(
    data,
    max_elo_id = "maxElo",
    years_range_id = "yearRange"
  ) {
    try {
      let elo_div = document.getElementById(max_elo_id);
      if (data.maxElo)
        elo_div.innerText = `najwyższy osiągnięty ranking: ${data.maxElo}`;
    } catch {}
    try {
      let years_div = document.getElementById(years_range_id);
      if (data.minYear && data.maxYear)
        years_div.innerText = `gry z lat: ${data.minYear} - ${data.maxYear}`;
    } catch {}
  },
  async cr_data(containerID, data, display_home_page = false) {
    let container = this.create_cr_data_table(data, display_home_page);
    document.getElementById(containerID).append(container);
  },
  create_cr_data_table(data, display_home_page = false) {
    let container = document.createElement("table");
    container.classList.add("cr-data");

    if (display_home_page) {
      let caption = document.createElement("caption");
      caption.innerHTML = "<a href='https://www.cr-pzszach.pl'>CR</a>";
      container.append(caption);
    }

    let main_row = document.createElement("tr");
    let name = document.createElement("th");
    name.colSpan = "2";
    name.innerText = data.name;
    let photo_container = document.createElement("td");
    let photo = document.createElement("img");
    photo.src = `http://www.cr-pzszach.pl/ew/ew/images/${data.id}.jpg`;
    photo.onerror = function () {
      this.parentElement.remove();
    };
    photo.classList.add("cr-foto");
    photo_container.append(photo);
    photo_container.rowSpan = "4";

    main_row.append(name);
    main_row.append(photo_container);

    let title_row = document.createElement("tr");
    let title_header = document.createElement("th");
    title_header.innerText = "Tytuł/Kat.:";
    let title = document.createElement("td");
    title.innerText = data.kat;
    title_row.append(title_header);
    title_row.append(title);

    let cr_row = document.createElement("tr");
    let cr_header = document.createElement("th");
    cr_header.innerText = "CR ID:";
    let cr_page = document.createElement("td");
    let crLink = document.createElement("a");
    crLink.href = `http://www.cr-pzszach.pl/ew/viewpage.php?page_id=1&zwiazek=&typ_czlonka=&pers_id=${data.id}`;
    crLink.innerText = data.id;
    cr_page.append(crLink);
    cr_row.append(cr_header);
    cr_row.append(cr_page);

    container.append(main_row);
    container.append(title_row);
    container.append(cr_row);
    if (data.fide_id > 0) {
      let fide_row = document.createElement("tr");
      let fide_header = document.createElement("th");
      fide_header.innerText = "FIDE ID:";
      let fide_page = document.createElement("td");
      let fideLink = document.createElement("a");
      fideLink.href = `https://ratings.fide.com/profile/${data.fide_id}`;
      fideLink.innerText = data.fide_id;
      fide_page.append(fideLink);
      fide_row.append(fide_header);
      fide_row.append(fide_page);
      container.append(fide_row);
    }

    return container;
  },
  fide_data(data, container_id = "fide-data-container") {
    if (data.length > 0) {
      let container = document.createElement("table");
      container.id = "fide-data";
      container.style.border = "none";
      let caption = document.createElement("caption");
      caption.innerHTML =
        "<a href='https://ratings.fide.com/download_lists.phtml'>FIDE</a>";
      container.append(caption);
      let details = document.createElement("details");
      details.id = "ambigous2";
      let summary = document.createElement("summary");
      summary.innerText = "inni znalezieni";
      details.append(summary);
      for (let i = 0; i < data.length; i++) {
        let table = document.createElement("table");
        let tr1 = document.createElement("tr");
        let description1 = document.createElement("th");
        description1.colSpan = "2";
        description1.innerText = data[i].name;
        tr1.append(description1);
        let tr2 = document.createElement("tr");
        let description2 = document.createElement("th");
        description2.innerText = "ID";
        let value2 = document.createElement("td");
        value2.innerHTML = parseInt(data[i].fideid)
          ? `<a href="https://ratings.fide.com/profile/${parseInt(
              data[i].fideid
            )}">${parseInt(data[i].fideid)}</a>`
          : "brak";
        tr2.append(description2, value2);
        let tr3 = document.createElement("tr");
        let description3 = document.createElement("th");
        description3.innerText = "Tytuł";
        let value3 = document.createElement("td");
        value3.innerText = data[i].title ? data[i].title : "brak";
        tr3.append(description3, value3);
        let tr4 = document.createElement("tr");
        let description4 = document.createElement("th");
        description4.innerText = "Rocznik";
        let value4 = document.createElement("td");
        value4.innerText = data[i].birthday ? data[i].birthday : "brak";
        tr4.append(description4, value4);
        let tr5 = document.createElement("tr");
        let description5 = document.createElement("th");
        description5.colSpan = "2";
        description5.innerText = "Elo";
        tr5.append(description5);
        let tr6 = document.createElement("tr");
        let description6 = document.createElement("th");
        description6.innerText = "Klasyczne";
        let value6 = document.createElement("td");
        value6.innerText = parseInt(data[i].rating)
          ? parseInt(data[i].rating)
          : "brak";
        tr6.append(description6, value6);
        let tr7 = document.createElement("tr");
        let description7 = document.createElement("th");
        description7.innerText = "Szybkie";
        let value7 = document.createElement("td");
        value7.innerText = parseInt(data[i].rapid_rating)
          ? parseInt(data[i].rapid_rating)
          : "brak";
        tr7.append(description7, value7);
        let tr8 = document.createElement("tr");
        let description8 = document.createElement("th");
        description8.innerText = "Błyskawiczne";
        let value8 = document.createElement("td");
        value8.innerText = parseInt(data[i].blitz_rating)
          ? parseInt(data[i].blitz_rating)
          : "brak";
        tr8.append(description8, value8);
        table.append(tr1);
        table.append(tr2);
        table.append(tr3);
        table.append(tr4);
        table.append(tr5);
        table.append(tr6);
        table.append(tr7);
        table.append(tr8);
        if (i == 0) {
          container.append(table);
        } else {
          details.append(table);
        }
      }

      document.getElementById(container_id).append(container);
      if (data.length > 1) {
        document.getElementById(container_id).append(details);
      }
    }
  },
  opening_stats(data, fullname, container_id = "stats") {
    let table = document.createElement("table");
    table.id = "stats_table";
    if (data.whites.length > 0) {
      this.color_stats("white", data.whites, fullname, table);
    }

    if (data.blacks.length > 0) {
      this.color_stats("black", data.blacks, fullname, table);
    }

    let tr_sum = document.createElement("tr");
    tr_sum.style.textAlign = "center";
    let td_sum_summary = document.createElement("td");
    td_sum_summary.innerText = "Suma";
    let td_sum_count = document.createElement("td");
    const sum =
      data.whites.reduce((sum, obj) => (sum += obj.count), 0) +
      data.blacks.reduce((sum, obj) => (sum += obj.count), 0);

    td_sum_count.innerText = sum;
    let td_sum_reset = document.createElement("td");
    let resetFilter = document.createElement("a");
    resetFilter.innerText = "resetuj filtr";
    resetFilter.target = "_self";
    resetFilter.href = `/player_data/?fullname=${encodeURIComponent(fullname)}`;
    td_sum_reset.append(resetFilter);

    const average = (
      data.whites
        .concat(data.blacks)
        .reduce((acc, { count, percent }) => acc + count * percent, 0) / sum
    ).toFixed(2);

    let td_sum_average = document.createElement("td");
    td_sum_average.innerText = average;

    tr_sum.append(td_sum_summary);
    tr_sum.append(td_sum_count);
    tr_sum.append(td_sum_average);
    tr_sum.append(td_sum_reset);
    table.append(tr_sum);
    document.getElementById(container_id).append(table);
  },
  color_stats(color, data, fullname, container) {
    let table_row = document.createElement("tr");
    let table_cell = document.createElement("td");
    table_cell.colSpan = "4";
    table_cell.style.padding = 0;
    let details = document.createElement("details");
    details.classList.add("details");
    if (window.outerWidth >= 768) {
      details.open = true;
    }

    let summary = document.createElement("summary");
    let table = document.createElement("table");
    let headers = document.createElement("tr");
    let opening_header = document.createElement("th");
    opening_header.innerText = "debiut";
    let count_header = document.createElement("th");
    count_header.innerText = "ilość";
    count_header.style.whiteSpace = "nowrap";
    let percent_header = document.createElement("th");
    percent_header.innerText = "%";
    let filter_header = document.createElement("th");
    filter_header.innerText = "filtr";
    headers.append(opening_header, count_header, percent_header, filter_header);
    table.append(headers);

    let color_filter = document.createElement("a");
    color_filter.target = "_self";
    color_filter.innerText = "filtruj";
    color_filter.href = `/player_data/?fullname=${encodeURIComponent(
      fullname
    )}&color=${color}&opening=`;

    summary.innerHTML = `<b>${color == "white" ? "Białe" : "Czarne"}</b>`;
    summary.append(color_filter);
    details.append(table);
    details.append(summary);
    table_cell.append(details);
    table_row.append(table_cell);
    container.append(table_row);

    for (let i = 0; i < data.length; i++) {
      let stats_row = document.createElement("tr");
      let opening_cell = document.createElement("td");
      opening_cell.innerText = data[i].opening;
      let count_cell = document.createElement("td");
      count_cell.innerText = data[i].count;
      let percent_cell = document.createElement("td");
      percent_cell.innerText = data[i].percent;
      let filter_cell = document.createElement("td");
      let filter = document.createElement("a");
      filter.innerText = "filtruj";
      filter.target = "_self";
      filter.href = `/player_data/?fullname=${encodeURIComponent(
        fullname
      )}&color=${color}&opening=${encodeURIComponent(data[i].opening)}`;

      filter_cell.append(filter);
      stats_row.append(opening_cell);
      stats_row.append(count_cell);
      stats_row.append(percent_cell);
      stats_row.append(filter_cell);
      table.append(stats_row);
    }
  },
  async game(
    data,
    csrf_token,
    main_container = "pre",
    board_id = "board",
    engine_container_id = "engine_container",
    moves_id = "boardMoves"
  ) {
    const board_moves_id = "boardMoves";
    const board_buttons = "boardButton";
    const fen_id = "boardFen";
    const move_next_id = "boardButtonnext";
    const move_previous_id = "boardButtonprev";
    const move_first_id = "boardButtonfirst";
    const move_last_id = "boardButtonlast";
    const flip_id = "boardButtonflipper";
    const download_id = "download";
    const game_first_id = "first";
    const game_next_id = "next";
    const game_previous_id = "previous";
    const game_last_id = "last";

    let pre = document.getElementById(main_container);
    let info = document.createElement("div");
    info.id = "info";
    let players = document.createElement("p");
    players.style.textAlign = "center";
    let playersData =
      `<a href='${SETTINGS.NOMENU_URLS.profile}?fullname=${encodeURIComponent(
        data.White
      )}'>` +
      data.White +
      "</a> ";
    if (data.WhiteElo != null) {
      playersData += " " + data.WhiteElo + " ";
    }
    playersData +=
      data.Result +
      " " +
      `<a href='${SETTINGS.NOMENU_URLS.profile}?fullname=${encodeURIComponent(
        data.Black
      )}'>` +
      data.Black +
      "</a>";
    if (data.BlackElo != null) {
      playersData += " " + data.BlackElo;
    }
    players.innerHTML = playersData;
    let siteDate = document.createElement("p");
    siteDate.style.textAlign = "center";
    let siteDateData = data.Event + " " + data.Year + ".";
    if (data.Month == null) {
      siteDateData += "?.";
    } else {
      siteDateData += data.Month + ".";
    }
    if (data.Day == null) {
      siteDateData += "?";
    } else {
      siteDateData += data.Day;
    }
    siteDateData += " , " + data.Site;
    siteDate.innerText = siteDateData;
    siteDate.style.marginTop = "5px";

    let buttonP = document.createElement("p");
    buttonP.id = "buttonP";

    let button = document.createElement("button");
    button.id = download_id;
    button.innerText = "Pobierz";
    button.title = "Ctrl + S";

    let game = "";
    game += '[Event "' + data.Event + '"]\n';
    game += '[Site "' + data.Site + '"]\n';
    game += '[Date "' + data.Year + ".";
    if (data.Month == null) {
      game += "?.";
    } else {
      game += data.Month + ".";
    }
    if (data.Day == null) {
      game += '?"]\n';
    } else {
      game += data.Day + '"]\n';
    }
    game += '[Round "' + data.Round + '"]\n';
    game += '[White "' + data.White + '"]\n';
    game += '[Black "' + data.Black + '"]\n';
    game += '[Result "' + data.Result + '"]\n';
    if (data.ECO != null) {
      game += '[ECO "' + data.ECO + '"]\n';
    }
    if (data.WhiteElo != null) {
      game += '[WhiteElo "' + data.WhiteElo + '"]\n';
    }
    if (data.BlackElo != null) {
      game += '[BlackElo "' + data.BlackElo + '"]\n';
    }
    game += "\n" + data.moves + "\n\n";
    button.onclick = () => {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(
        new Blob([game], { type: "text/plain" })
      );
      a.download = "game.pgn";
      a.click();
    };

    let error = document.createElement("button");
    error.classList.add("error");
    error.innerText = "Zgłoś błąd";
    error.addEventListener("click", function () {
      const REQUEST_GET = get_data();

      DISPLAY.error_form(REQUEST_GET.id, REQUEST_GET.base, csrf_token);
    });

    buttonP.append(button);
    buttonP.append(error);

    pre.prepend(buttonP);
    info.append(players);
    info.append(siteDate);
    pre.prepend(info);
    let pgnView = PGNV.pgnEdit;
    if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
      pgnView(board_id, {
        pgn: data.moves,
        layout: "left",
        resizable: true,
        figurine: true,
        showCoords: false,
        notationLayout: "list",
      });
    } else {
      pgnView(board_id, {
        pgn: data.moves,
        resizable: true,
        figurine: true,
        showCoords: false,
      });
      document.getElementById(engine_container_id).classList.add("inactive");
      document.getElementById(board_id).parentElement.classList.add("mobile");
    }

    document.getElementById(moves_id).onwheel = (e) => {
      e.stopPropagation();
    };
    document.getElementById(engine_container_id).onwheel = (e) => {
      e.stopPropagation();
    };

    let div = document.createElement("div");
    div.id = "tabs";
    let bt1 = document.createElement("button");
    bt1.innerText = "notacja";
    bt1.onclick = () => {
      let engine_container = document.getElementById(engine_container_id);
      let moves = document.getElementById(board_moves_id);
      engine_container.classList.add("inactive");
      engine_container.classList.remove("active");
      moves.classList.add("active");
      moves.classList.remove("inactive");
    };
    let bt2 = document.createElement("button");
    bt2.innerText = "stockfish";
    bt2.onclick = () => {
      let engine_container = document.getElementById(engine_container_id);
      let moves = document.getElementById(board_moves_id);
      engine_container.classList.add("active");
      engine_container.classList.remove("inactive");
      moves.classList.add("inactive");
      moves.classList.remove("active");
    };
    div.appendChild(bt1);
    div.appendChild(bt2);

    document
      .getElementById(board_id)
      .insertBefore(div, document.getElementById(board_moves_id));

    document
      .getElementById(board_id)
      .insertBefore(
        document.getElementById(engine_container_id),
        document.getElementById(board_moves_id)
      );

    let input = document.getElementById(fen_id);

    window.setInterval(() => {
      STOCKFISH_CONTROLLER.analyze_board();
    }, 500);

    let current_fen =
      input.value == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : input.value;

    STOCKFISH_CONTROLLER.analyze_fen(current_fen);

    for (let san of document.getElementsByTagName("san")) {
      san.addEventListener("click", function () {
        STOCKFISH_CONTROLLER.analyze_board();
      });
    }

    for (let button of document.getElementsByClassName("pgnvbutton")) {
      button.addEventListener("click", function () {
        STOCKFISH_CONTROLLER.analyze_board();
      });
    }

    window.addEventListener("resize", function () {
      if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
        document.getElementById(board_moves_id).className = "moves list";
        document.getElementById(board_id).className =
          "blue pgnvjs viewMode layout-left";
        try {
          document
            .getElementById(engine_container_id)
            .classList.remove("inactive");
        } catch {}
      } else {
        document.getElementById(board_moves_id).className = "moves inline";
        document.getElementById(board_id).className =
          "blue pgnvjs viewMode layout-top";

        document.getElementById(engine_container_id).classList.add("inactive");
      }
    });

    window.addEventListener("wheel", function (e) {
      if (e.deltaY > 1) {
        document.getElementById(move_next_id).click();
      } else {
        document.getElementById(move_previous_id).click();
      }
      STOCKFISH_CONTROLLER.analyze_board();
    });

    window.addEventListener("keydown", function (e) {
      if (e.ctrlKey) {
        switch (e.which) {
          case 70:
            document.getElementById(flip_id).click();
            break;
          case 82:
            this.location.reload();
            break;
          case 83:
            document.getElementById(download_id).click();
            break;
          case 37:
            document.getElementById(game_previous_id).click();
            break;
          case 39:
            document.getElementById(game_next_id).click();
            break;
          case 38:
            document.getElementById(game_first_id).click();
            break;
          case 40:
            document.getElementById(game_last_id).click();
            break;
        }
      } else {
        switch (e.which) {
          case 37:
            document.getElementById(move_previous_id).click();
            break;
          case 39:
            document.getElementById(move_next_id).click();
            break;
          case 38:
            document.getElementById(move_first_id).click();
            break;
          case 40:
            document.getElementById(move_last_id).click();
            break;
        }
      }
      switch (e.which) {
        case 37:
        case 39:
        case 38:
        case 40:
          STOCKFISH_CONTROLLER.analyze_board();
      }
    });

    let buttons = document.getElementById(board_buttons);
    buttons.tabIndex = -1;
    buttons.focus();
    let style = document.createElement("style");
    style.innerText = "#board{width: fit-content!important}";

    document.body.append(style);
    document.getElementById(board_id).style.width = "fit-content";
  },
  async game_controls(
    table,
    list,
    current,
    first_game = "first",
    previous_game = "previous",
    next_game = "next",
    last_game = "last"
  ) {
    let first = document.getElementById(first_game);
    let previous = document.getElementById(previous_game);
    let next = document.getElementById(next_game);
    let last = document.getElementById(last_game);
    if (list.length > 1) {
      switch (current) {
        case 0:
          next.onclick = () => {
            nextGame(table, list, current);
          };
          last.onclick = () => {
            lastGame(table, list, current);
          };
          next.disabled = false;
          last.disabled = false;
          break;
        case list.length - 1:
          first.onclick = () => {
            firstGame(table, list, current);
          };
          previous.onclick = () => {
            previousGame(table, list, current);
          };
          first.disabled = false;
          previous.disabled = false;

          break;

        default:
          first.onclick = () => {
            firstGame(table, list, current);
          };
          previous.onclick = () => {
            previousGame(table, list, current);
          };
          next.onclick = () => {
            nextGame(table, list, current);
          };
          last.onclick = () => {
            lastGame(table, list, current);
          };
          next.disabled = false;
          last.disabled = false;
          first.disabled = false;
          previous.disabled = false;
          break;
      }
    }
  },
  error_form(game_id, table, csrf_token) {
    const form = document.createElement("form");
    form.method = "post";
    form.action = SETTINGS.NOMENU_URLS.bugs_report;

    const id_input = document.createElement("input");
    id_input.type = "hidden";
    id_input.name = "id";
    id_input.value = game_id;

    const table_input = document.createElement("input");
    table_input.type = "hidden";
    table_input.name = "table";
    table_input.value = table;

    const csrf_token_input = document.createElement("input");
    csrf_token_input.type = "hidden";
    csrf_token_input.name = "csrf_token";
    csrf_token_input.value = csrf_token;

    form.appendChild(id_input);
    form.appendChild(table_input);
    form.appendChild(csrf_token_input);

    document.body.appendChild(form);
    form.submit();
  },
};

function nextGame(table, list, current) {
  gotToGame(table, list, current + 1);
}

function lastGame(table, list, current) {
  gotToGame(table, list, list.length - 1);
}

function previousGame(table, list, current) {
  gotToGame(table, list, current - 1);
}

function firstGame(table, list, current) {
  gotToGame(table, list, 0);
}

function gotToGame(table, list, index) {
  let form = document.createElement("form");
  form.style.visibility = "hidden";
  form.method = "POST";
  form.action = `${SETTINGS.NOMENU_URLS.game}?id=${list[index]}&base=${table}`;
  form.target = "_self";
  let inputList = document.createElement("input");
  inputList.value = list;
  inputList.name = "list";
  let inputCurrent = document.createElement("input");
  inputCurrent.value = index;
  let inputBase = document.createElement("input");
  inputBase.name = "base";
  inputBase.value = table;
  inputCurrent.name = "current";
  form.appendChild(inputList);
  form.appendChild(inputCurrent);
  form.appendChild(inputBase);
  document.body.append(form);
  form.submit();
}

export default DISPLAY;
