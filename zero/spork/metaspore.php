<?php

$spore = "<?php\n\n\$hypercube = ";

$hypercube = json_decode(file_get_contents("hypercube.json"), true);

$hypercube[1] = [];
$hypercube[2] = [];
$hypercube[3] = [];
$hypercube[4] = [];
$hypercube[5] = [];
$hypercube[6] = [];
$hypercube[7] = [];

$files = [
    "metaspore.php",
    "load-file.php",
    "save-file.php",
    "list-files.php",
    "fetch-spore.php",
    "geometron.js",
    "editor.html",
    "index.html",
    "mission.txt"
];

$zeroJson = [];

for ($fileIndex = 0; $fileIndex < count($files); $fileIndex++) {
    $fileName = $files[$fileIndex];
    if (file_exists($fileName)) {
        $filestring = file_get_contents($fileName);
        
        $zeroJson[] = (object) [
            'name'    => $fileName,
            'content' => $filestring
        ];
    }
}
$finalJsonString = json_encode($zeroJson, JSON_INVALID_UTF8_SUBSTITUTE);

$array = [];
for($index = 0; $index < strlen($finalJsonString); $index++){
    $array[] = 0o1000 + ord($finalJsonString[$index]);
}

$hypercube[0] = $array;
$array_string = json_encode($hypercube);
$spore .= $array_string.";\n\n";
$thisfile = file_get_contents("metaspore.php");
$spore_parts = explode('<spore>', $thisfile);
$spore .= explode('</spore>', $spore_parts[2])[0];  
file_put_contents('spore.php', $spore);

/*
<spore>

$array = $hypercube[0];
$jsonString = "";

for ($index = 0; $index < count($array); $index++) {
    $jsonString .= chr($array[$index] - 0o1000);
}

$json = json_decode($jsonString);

foreach ($json as $file) {
    $name = $file->name;
    $content = $file->content;
    file_put_contents($name,$content);
}

file_put_contents("wall.txt","THIS IS THE WALL!");
file_put_contents("icon.json","[]");
file_put_contents("feed.json","[]");
file_put_contents("README.md","#hypercube\n\n");

file_put_contents("hypercube.json", json_encode($hypercube));

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