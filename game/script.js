"use strict";
var gameMoves

function search(id,table) {
    const xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", "/game/get.php", true);

    let messenge = "id=" + encodeURIComponent(id) + "&table=" + encodeURIComponent(table)

    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText)
            viewGame(json.rows[0])
        }
    }
    xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp2.send(messenge);

    let content = document.getElementById("content2")
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

async function viewGame(data){
    let pre = document.getElementById("pre")
    let players = document.createElement("p")
    players.style.textAlign = "center"
    let playersData =  "<b>"  + data.White + "</b>"
    if( data.WhiteElo != null){
        playersData += " " + data.WhiteElo
    }
    playersData += " - " + "<b>" + data.Black + "</b>"
    if( data.BlackElo != null){
        playersData += " " + data.BlackElo
    }
    players.innerHTML = playersData 
    let siteDate = document.createElement("p")
    siteDate.style.textAlign = "center"
    let siteDateData = data.Year + "."
    if(data.Month == null){
        siteDateData += "?."
    }
    else{
        siteDateData += data.Month + "."
    }
    if( data.Day == null ){
        siteDateData += "?"
    }
    else{
        siteDateData += data.Day
    }
    siteDateData += " , " + data.Site
    siteDate.innerText = siteDateData
    siteDate.style.marginTop = "5px"

    let result = document.createElement("p")
    result.innerText += data.Result
    result.style.textAlign = "center"
    result.style.marginTop = "5px"

    pre.prepend(result)
    pre.prepend(siteDate)
    pre.prepend(players)
    let pgnView = PGNV.pgnView;
    pgnView("board", {pgn: data.moves, pieceStyle: "chessicons"});
    let notation = document.getElementById("boardMoves")
    notation.style.width = "25em"
    let board = document.getElementsByClassName("outerBoard")[0]
    if ( notation.clientWidth + board.clientWidth + 30 < window.innerWidth){
        let base = window.innerWidth - notation.clientWidth - board.clientWidth
        notation.style.position = "absolute"
        notation.style.right = base/2 - 15 + "px"
        board.style.position = "absolute"
        board.style.left = base/2 - 15 + "px"
        let boardButton = document.getElementById("boardButton")
        boardButton.style.position = "relative"
        boardButton.style.left = board.clientWidth/2 + base/2 + "px"
        document.body.style.overflowY = "hidden"
    }
    window.addEventListener("resize", function(){
        let notation = document.getElementById("boardMoves")
        let board = document.getElementsByClassName("outerBoard")[0]
        let boardButton = document.getElementById("boardButton")

        if ( notation.clientWidth + board.clientWidth + 30 < window.innerWidth){
            let base = window.innerWidth - notation.clientWidth - board.clientWidth
            notation.style.position = "absolute"
            notation.style.right = base/2 - 15 + "px"
            board.style.position = "absolute"
            board.style.left = base/2 - 15 + "px"
            boardButton.style.position = "relative"
            boardButton.style.left = board.clientWidth/2 + base/2 + "px"
            document.body.style.overflowY = "hidden"
        }
        else{
            notation.style.position = ''
            notation.style.right = ''
            board.style.position = ''
            board.style.left = ''
            boardButton.style.position = ''
            boardButton.style.left = ''
            document.body.style.overflowY = ''
        }
     
    })

}

if( window.innerWidth < 450){
    let board = document.getElementById("board")
    board.style.width = document.innerWidth + "px"
    board.style.margin = "0!important"
}
let url_string = window.location.href
let url = new URL(url_string)
let id = url.searchParams.get('id')
let table = url.searchParams.get('table')
search(id, table)