<?php
export_urls_to_js();

require_once(__DIR__ . "/create_request_js_module.php");

function create_header(): void
{
    include(__DIR__ . "/header.php");
}

function create_menu(): void
{
    include(__DIR__ . "/menu.php");
}

function create_footer()
{
    include(__DIR__ . "/footer.php");
}

function create_menu_content(): void
{
    foreach ($GLOBALS["urls"] as $url) {

        $regex_url = str_replace("/", "\\/", $url["url"]);
?>
        <li <?php if (preg_match("/^$regex_url(index.php)?$/", $_SERVER["DOCUMENT_URI"])) echo 'class="active"' ?>>
            <a target="_self" href="<?php echo $url["url"] ?>"><?php echo $url["name"] ?></a>
        </li>
    <?php

    }
}

function wrap_content(string $filename, string $container_id = "", array $classes = []): void
{
    ?>
    <div <?php if ($container_id != "") {
                echo "id='$container_id' ";
            }
            if (sizeof($classes) > 0) {
                echo "class='";
                foreach ($classes as $html_class) {
                    echo htmlentities($html_class) . " ";
                }
                echo "'";
            } ?>>


        <?php
        if (file_exists($filename)) {
            include($filename);
        } else {
            echo "Nie udało się załadować zawartości";
        }
        ?>
    </div>

<?php
}
function create_standard_content(string $dir, array $css_files = [],  array $js_modules = [], array $js_scripts = [], bool $req_js_module = false, bool $id_content = true): void
{
?>
    <html lang="pl">
    <?php
    create_header();
    ?>

    <body>
        <?php
        create_menu();
        if ($req_js_module) {
            create_request_js_module();
        }
        foreach ($css_files as $css) {
            echo "<link rel='stylesheet' href='/css/$css.css'>";
        }
        foreach ($js_modules as $module) {
            echo "<script type='module' src='/script/$module.js'></script>";
        }
        foreach ($js_scripts as $script) {
            echo "<script defer src='/script/$script.js'></script>";
        }
        wrap_content("$dir/content.php", $id_content ? "content" : "");
        create_footer();
        ?>
    </body>

    </html>
<?php
}

function export_urls_to_js()
{
    $settings_php = __DIR__ . "/../../data/settings.php";
    $settings_js = __DIR__ . "/../../script/settings.js";
    if (!file_exists($settings_js) || filemtime($settings_js) < filemtime($settings_php)) {

        $path = __DIR__ . "/../../script/settings.js";
        $script = "
        const URLS =" . json_encode($GLOBALS["urls"]) . ";
    const API =" . json_encode($GLOBALS["api"]) . ";
    const NOMENU_URLS = " . json_encode($GLOBALS["nomenu_urls"]) . ";
    export default {
        URLS,
        API,
        NOMENU_URLS
    }
    
    ";
        file_put_contents($path, $script);
    }
}
