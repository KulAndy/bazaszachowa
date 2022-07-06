"use strict";
function search(white,black,ignore,minYear,maxYear,events,minEco,maxEco,base) {
    const xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", "/search/search.php", true);

    let messenge = "white=" + encodeURIComponent(white) + "&black=" + encodeURIComponent(black) + "&ignore=" + encodeURIComponent(ignore) + "&minYear=" + encodeURIComponent(minYear) + "&maxYear=" + encodeURIComponent(maxYear) + "&event=" + encodeURIComponent(events) + "&minEco=" + encodeURIComponent(minEco) + "&maxEco=" + encodeURIComponent(maxEco) + "&base=" + encodeURIComponent(base)

    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText)
            displayData(json.rows)
        }
    }
    xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp2.send(messenge);

    try{
        let rmTable = document.getElementById("table")
        rmTable.remove()
    }
    catch{

    }
    let content = document.getElementById("content")
    let loading = document.createElement("p")
    loading.id = "loading"
    loading.innerText = "Ładowanie "
    content.append(loading)
    let counter = 0
    const interval = setInterval( function (){
        loading.innerText = "Ładowanie "
        for(let i = 0; i < (counter % 10) + 1;i++){
            loading.innerText += "."
        }
        counter++
    }, 500)
    xhttp2.onloadend = function (){
        document.getElementById("loading").remove()
    }

}

function displayData(data){
    try{
        let rmTable = document.getElementById("table")
        rmTable.remove()
    }
    catch{
        
    }
    let pre = document.getElementById("pre")
    let table = document.createElement("table")
    table.id = "table"
    let caption = document.createElement("caption")
    caption.innerText = "Znalezionych partii: " + data.length
    if( data.length == 10000 ){
        caption.innerText += " (limit)"
    }
    caption.innerText += " "
    let save = document.createElement("a")
    save.innerText = "Pobierz"
    save.style.color = "blue"
    save.style.textDecoration = "underline"
    save.onclick = function(){
        download(data)
        save.style.color = "purple"
    }
    caption.append(save)
    table.append(caption)
    let colmns = document.createElement("tr")
    let th1 = document.createElement("th")
    th1.innerText = "Biały"
    let th2 = document.createElement("th")
    th2.innerText = "Elo białego"
    let th3 = document.createElement("th")
    th3.innerText = "Czarny"
    let th4 = document.createElement("th")
    th4.innerText = "Elo czarnego"
    let th5 = document.createElement("th")
    th5.innerText = "Wynik"
    let th6 = document.createElement("th")
    th6.innerText = "Data"
    let th7 = document.createElement("th")
    th7.innerText = "Turniej"
    let th8 = document.createElement("th")
    th8.innerText = "ECO"
    let th9 = document.createElement("th")
    th9.innerText = "Zobacz partię"
    let th10 = document.createElement("th")
    th10.innerText = "RAW"
    for(let i = 1; i <= 10;i++){
        eval("colmns.append(th"+i+")")
    }
    table.append(colmns)
    for( let i = 0; i < data.length;i++){
        let tr = document.createElement("tr")
        if( i % 2 == 0){
            tr.style.backgroundColor = "LemonChiffon"
        }
        else{
            tr.style.backgroundColor = "LightCyan"
        }
        let td1 = document.createElement("td")
        td1.innerText = data[i].White
        let td2 = document.createElement("td")
        td2.innerText = data[i].WhiteElo
        let td3 = document.createElement("td")
        td3.innerText = data[i].Black
        let td4 = document.createElement("td")
        td4.innerText = data[i].BlackElo
        let td5 = document.createElement("td")
        td5.innerText = data[i].Result
        let td6 = document.createElement("td")
        td6.innerText = data[i].Year + "." 
        if(data[i].Month == null ){
            td6.innerText += "?"
        }
        else{
            td6.innerText += data[i].Month
        }
        td6.innerText += "."
        if(data[i].Day == null ){
            td6.innerText += "?"
        }
        else{
            td6.innerText += data[i].Day
        }
        let td7 = document.createElement("td")
        td7.innerText = data[i].Event
        let td8 = document.createElement("td")
        td8.innerText = data[i].ECO
        let td9 = document.createElement("td")
        td9.innerHTML = "<a href='/game/index.php?id="+ data[i].id +"&table=" + data[i].table +"'>zobacz</a>"
        let td10 = document.createElement("td")
        td10.innerHTML ="<a href='/game_raw/index.php?id="+ data[i].id +"&table=" + data[i].table +"'>zobacz</a>"
        for(let i = 1; i <= 10;i++){
            eval("tr.append(td"+i+")")
        }
        table.append(tr)
    }
    pre.append(table)
    if ( document.getElementsByTagName("nav")[0].clientHeight + pre.clientHeight >= window.innerHeight ){
        document.getElementsByTagName("footer")[0]
        let pom = document.createElement("div")
        pom.style.height = document.getElementsByTagName("footer")[0].clientHeight
        pre.append(pom)
    }
}

function download(data){
    let games = ""
    for(let i = 0; i < data.length;i++ ){
        games += "[Event \"" + data[i].Event + "\"]\n"
        games += "[Site \"" + data[i].Site + "\"]\n"
        games += "[Date \"" + data[i].Year + "."
        if( data[i].Month == null){
            games += "?."
        }
        else{
            games += data[i].Month
        }
        if( data[i].Day == null) {
            games += "?\"]\n"
        }
        else{
            games += data[i].Day + "\"]\n"
        }
        games += "[Round \"" + data[i].Round + "\"]\n"
        games += "[White \"" + data[i].White + "\"]\n"
        games += "[Black \"" + data[i].Black + "\"]\n"
        games += "[Result \"" + data[i].Result + "\"]\n"
        if( data[i].ECO != null ){
            games += "[ECO \"" + data[i].ECO + "\"]\n"
        }
        if( data[i].WhiteElo != null ){
            games += "[WhiteElo \"" + data[i].WhiteElo + "\"]\n"
        }
        if( data[i].BlackElo != null ){
            games += "[BlackElo \"" + data[i].BlackElo + "\"]\n"
        }
        games += "\n" + data[i].moves + "\n\n"
    }
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([games], {type: "text/plain"}));
    a.download = "games.pgn";
    a.click();

}

if(confirm("Czy należysz do kręgu towarzyskiego autora strony?")){
    let content = document.getElementById("content")
    let br = document.createElement("br")
    let whiteLabel = document.createElement("label")
    whiteLabel.for= "white"
    whiteLabel.innerText = "biały:\t"
    let white = document.createElement("input")
    white.type = "text"
    white.id = "white"
    white.placeholder = "Nazwisko, Imię"
    content.append(whiteLabel)
    content.append(white)
    content.append(document.createElement("br"))
    let blackLabel = document.createElement("label")
    blackLabel.for = "black"
    blackLabel.innerText = "czarny:\t"
    let black = document.createElement("input")
    black.type = "text"
    black.id = "black"
    black.placeholder = "Nazwisko, Imię"
    content.append(blackLabel)
    content.append(black)
    content.append(document.createElement("br"))
    let ignoreColorLabel = document.createElement("label")
    ignoreColorLabel.for = "ignoreColor"
    ignoreColorLabel.innerText = "ignoruj kolory "
    let ignoreColor = document.createElement("input")
    ignoreColor.id = "ignoreColor"
    ignoreColor.type = "checkbox"
    content.append(ignoreColorLabel)
    content.append(ignoreColor)
    content.append(document.createElement("br"))
    let minYearLabel = document.createElement("label")
    minYearLabel.for = "minYear"
    minYearLabel.innerText = "lata:\t\t"
    let minYear = document.createElement("input")
    minYear.type = "number"
    minYear.id = "minYear"
    minYear.step = 1
    minYear.min = 1475
    minYear.style.width = "4em"
    let date = new Date
    minYear.max = date.getFullYear()

    let maxYearLabel = document.createElement("label")
    maxYearLabel.for = "minYear"
    maxYearLabel.innerText = " - "
    let maxYear = document.createElement("input")
    maxYear.type = "number"
    maxYear.id = "maxYear"
    maxYear.step = 1
    maxYear.style.width = "4em"
    maxYear.min = 1475
    maxYear.max = date.getFullYear()

    content.append(minYearLabel)
    content.append(minYear)
    content.append(maxYearLabel)
    content.append(maxYear)
    content.append(document.createElement("br"))
    let eventLabel = document.createElement("label")
    eventLabel.for = "event"
    eventLabel.innerText = "turniej:\t"
    let events = document.createElement("input")
    events.id = "event"
    events.type = "text"
    content.append(eventLabel)
    content.append(events)
    content.append(document.createElement("br"))

    let ECO_letters = ["A", "B", "C", "D", "E"]
    let select1Label = document.createElement("label")
    select1Label.for = "select1"
    select1Label.innerText = "ECO:\t"
    let select1 = document.createElement("select")
    select1.id = "select1"

    let select2Label = document.createElement("label")
    select2Label.for = "select1"
    select2Label.innerText = " - "
    let select2 = document.createElement("select")
    select2.id = "select2"

    ECO_letters.forEach( i => {
        for(let j = 0;j < 10;j++){
            for(let k = 0; k < 10; k++){
                let option1 = document.createElement("option")
                option1.value = i + j + k
                option1.innerText = i + j + k
                let option2 = document.createElement("option")
                option2.value = i + j + k
                option2.innerText = i + j + k
                select1.append(option1)    
                select2.append(option2)
            }
        }
    });

    select2.value = "E99"

    content.append(select1Label)
    content.append(select1)
    content.append(select2Label)
    content.append(select2)
    content.append(document.createElement("br"))

    let baseLabel = document.createElement("label")
    baseLabel.for = "radio1"
    baseLabel.innerText = "baza:\t"
    let radio1Label = document.createElement("label")
    radio1Label.for = "radio1"
    let abbr1 = document.createElement("abbr")
    abbr1.innerText = "Polska "
    abbr1.title = "szybsza baza (zalecana)"
    radio1Label.append(abbr1)
    let radio1 = document.createElement("input")
    radio1.type = "radio"
    radio1.checked = true
    radio1.id = "radio1"
    radio1.name = "base"
    let radio2Label = document.createElement("label")
    radio2Label.for = "radio2"
    let abbr2 = document.createElement("abbr")
    abbr2.innerText = " całość "
    abbr2.title = " większa, wolniejsza baza (niezalecana)"
    radio2Label.append(abbr2)
    let radio2 = document.createElement("input")
    radio2.type = "radio"
    radio2.id = "radio2"
    radio2.name = "base"

    content.append(baseLabel)
    content.append(radio1Label)
    content.append(radio1)
    content.append(radio2Label)
    content.append(radio2)
    content.append(document.createElement("br"))


    let button = document.createElement("button")
    button.innerText = "szukaj"
    button.style.marginLeft = "5em"
    button.style.marginTop = "10px"
    button.onclick = () =>{
        let white = document.getElementById("white")
        let black = document.getElementById("black")
        let ignoreColor = document.getElementById("ignoreColor")
        let year1 = document.getElementById("minYear")
        let year2 = document.getElementById("maxYear")
        let events = document.getElementById("event")
        let eco1 = document.getElementById("select1")
        let eco2 = document.getElementById("select2")
        let base
        if( document.getElementById("radio1").checked ){
            base = "poland"
        }
        else if( document.getElementById("radio2").checked){
            base = "all"
        }
        if( typeof(base) != "undefined"){
            if( white.value.trim() == "" && black.value.trim() == "" ){
                alert("Nie podano gracza do wyszukiwania")
            }
            else if( year1.value > year2.value){
                alert("Podano zły zakres lat")
            }
            else if( parseInt(eco1.value, 16) > parseInt(eco2.value, 16)){
                alert("Podano zły zakres kodów eco")
            }
            else{
                search(white.value,black.value,ignoreColor.checked,year1.value,year2.value,events.value,eco1.value,eco2.value,base)
            }
        }
        
    }
    content.append(button)

}
else{
    document.body.remove()
}

