<?php

$spore = "<?php\n\n\$hypercube = ";

$hypercube = json_decode(file_get_contents("hypercube.json"), true);

$zeropage = [
    "metaspore.php",
    "load-file.php",
    "save-file.php",
    "list-files.php",
    "geometron.js",
    "editor.html",
    "index.html",
    "mission.txt"
];

for($address = 0;$address < count($zeropage);$address++){

    $filestring = file_get_contents($zeropage[$address]);
    $array = [];
    for($index = 0; $index < strlen($filestring); $index++){
        $array[] =  0o1000 + ord($filestring[$index]);
    }
    $hypercube[$address] = $array;

    $array = [];
    for($index = 0; $index < strlen($zeropage[$address]); $index++){
        $array[] = 0o1000 + ord($zeropage[$address][$index]);
    }
    $hypercube[0o1000 + $address] = $array;
    
}

$array_string = json_encode($hypercube);

$spore .= $array_string.";\n\n";

$thisfile = file_get_contents("metaspore.php");
$spore_parts = explode('<spore>', $thisfile);
$spore .= explode('</spore>', $spore_parts[2])[0];  

file_put_contents('spore.php', $spore);

/*
<spore>
for ($index = 0; $index <= 7; $index++) {
    $filenamecode = $hypercube[0o1000 + $index];
    $filename = "";
    for($stringindex = 0;$stringindex < count($filenamecode);$stringindex++){
        $filename .= chr($filenamecode[$stringindex] - 0o1000);
    }
    $filecode = $hypercube[0o0 + $index];
    $filestring = "";
    for($stringindex = 0;$stringindex < count($filecode);$stringindex++){
        $filestring .= chr($filecode[$stringindex] - 0o1000);
    }
    file_put_contents($filename, $filestring);
}

file_put_contents("wall.txt","wall");
file_put_contents("icon.json","[]");
file_put_contents("links.json","[\"editor.html\",\"metaspore.php\"]");
file_put_contents("feed.json","[]");
file_put_contents("README.md","#hypercube\n\n");

file_put_contents("hypercube.json", json_encode($hypercube, JSON_PRETTY_PRINT));
?>
<a href  = "index.html">index.html</a>
<br>
<a href  = "editor.html">editor.html</a>

</spore>
*/
?>

<a href  = "editor.html">editor.html</a>
<style>
    body{
          font-family: Comic Sans MS;
          background-color: #9f8767;
    }
    a{
        color:blue;
        font-size:3em;
    }
</style>