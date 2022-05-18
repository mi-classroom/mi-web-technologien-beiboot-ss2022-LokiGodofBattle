<html>
  <head>
    <link rel="stylesheet" href="./src/assets/styles/scss/abstracts/variables.scss" />
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    
  </head>
  <body>
  <?php
  if ($_POST["user"]=="cranach" && $_POST["password"]=="meisterwerke") {
  echo "<script src='sketch.js'></script>";
  } 
  else {echo "FEHLER";} 

  ?>
  </body>
</html>
