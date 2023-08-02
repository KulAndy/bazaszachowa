<?php

require_once("../vendor/erusev/parsedown/Parsedown.php");

class MarkdownParser
{

    private $markdown;

    public function __construct($markdown)
    {
        $this->markdown = $markdown;
    }

    public function toHTML()
    {
        $Parsedown = new Parsedown();

        $html = $Parsedown->text($this->markdown);


        return $html;
    }
}