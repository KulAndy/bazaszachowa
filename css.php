<?php
echo 
'<style>
html, body, div, span, applet, object, iframe,
p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sup, tt, var,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: "";
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
/*//////////////////////////////////////////////////////////////////////////////////////////////*/

body {
    overflow-x: hidden;
}

footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    background-color: orange;
    color: white;
    text-align: center;
}
footer p{
    margin: 2px;
    padding: 1px;
}
footer a{
    text-decoration: none;
    color: white;
    margin: 2px;
    padding: 1px;
}
footer a:hover{
    color: navy;
}
nav {
    display: flex;
    justify-content: space-evenly;
    position: sticky;
    left: 0;
    top: 0;
    width: 100vw;
    background-color: orange;
    color: white;
    text-align: center;

}
nav a{
    text-decoration: none;
    color: white;
    margin: 2px;
    padding: 1px;
    padding-top: 2px;
    padding-bottom: 2px;
}
nav a:hover{
    color: navy;
}
li {
    list-style: disc;
    margin-left: 5%;
}

pre table{
    margin: auto;
    width: fit-content;
}

table, tr, th, td {
    border: solid black 2px;
    border-collapse: collapse;
}

#content{
    margin-top: 15px!important;
    margin: auto;
    width: 60vw;
}

#content2 {
    margin-left: 10px;
}

#left_content{
    margin-top: 15px;
    padding-left: 1.5em;
    width: 20vw;
}

#left_content ul li{
    list-style: disc;
}

#pre{
    margin-top: 15px;
}

.float_left{
    float: left;
}
</style>';
?>