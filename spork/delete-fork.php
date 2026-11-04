<?php

$forkname = $_POST["fork"];//get name of fork to kill

rrmdir($forkname);//run recursive delet function

function rrmdir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);//this is the delete command
            }
        }
    }
    closedir($dir);
    rmdir($src);
}


?>