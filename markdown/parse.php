<?php

$url = $_GET['url'];

$markdown = file_get_contents("../docs/" . basename($url));

require_once 'MarkdownParser.php';
$parser = new MarkdownParser($markdown);
$html = $parser->toHTML();
echo "<!DOCTYPE html><html>$html</html>";
