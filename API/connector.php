<?php
class Connector
{
    private $base;
    public function __construct($host, $user, $password, $base)
    {
        $this->base = new mysqli($host, $user, $password, $base);
        if (mysqli_connect_errno()) {
            echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
            exit;
        }
    }

    public function close()
    {
        $this->base->close();
    }

    public function prepare(string $query)
    {
        return $this->base->prepare($query);
    }

    public function set_charset(string $charset)
    {
        $this->base->set_charset($charset);
    }

    public function query(string $query)
    {
        return $this->base->query($query);
    }


    public function execute(object &$binded)
    {
        $binded->execute();
    }

    public function get_result(object &$executed)
    {
        return $executed->get_result();
    }
    public function fetch(object &$result)
    {
        return $result->fetch();
    }

    public function fetch_all(&$result){
        return $result->fetch_all();
    }

    public function fetch_assoc(object &$result)
    {
        return $result->fetch_assoc();
    }


    public function bind_param(object &$prepared, array $params)
    {
        $types = "";
        foreach ($params as &$param) {
            switch (gettype($param)) {
                case 'integer':
                    $types .= "i";
                    break;

                case "string":
                    $types .= "s";
                    break;
                case "double":
                    $types .= "d";
                    break;
                default:
                    unset($param);
                    break;
            }
        }

        $prepared->bind_param($types, ...$params);

    }

    public function bind_result(object &$executed, &...$args)
    {
        $executed->bind_result(...$args);
    }

    public function store_result(object &$result)
    {
        $result->store_result();
    }
}