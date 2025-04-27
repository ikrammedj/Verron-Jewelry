<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/bijoux">
    <html>
      <head>

        <title>Catalogue de Bijoux</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni&amp;display=swap" rel="stylesheet"/>

        <style>
          body { font-family: Arial, sans-serif; background: #F7F1EB; padding: 20px; }
          .card-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            column-gap: 1px;
            row-gap: 50px; 
            justify-items: center;
            margin-right: 60px;
          }
          .card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            max-width: 300px;
            transition: transform 0.3s ease;
            display: flex; /* Ajouté */
            flex-direction: column; /* Ajouté */
          }
          .card:hover {
            transform: translateY(-10px);
          }
          .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
            .card-body { 
            padding: 15px;
            display: flex; 
            flex-direction: column; 
            flex-grow: 1; 
            font-color: #4b4040;
          }

          .card-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
          }
          .card-price {
            font-size: 1.1em;
            color: #9E6F6F;
            margin: 10px 0;
          }
          .card-description {
            font-size: 0.9em;
            color: #555;
           
            
          }
            .buy-button {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #9E6F6F;
            color: white;
            text-align: center;
            font-size: 1em;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            margin-top: auto; /* Ajouté - ceci pousse le bouton vers le bas */
          }
  
          .buy-button:hover {
            background-color:rgb(128, 95, 95);
          }
        </style>
      </head>
      <body>
        <div class="card-container">
          <xsl:for-each select="bijou">
            <div class="card">
              <img src="{image}" alt="{nom}" />
              <div class="card-body">
                <div class="card-title">
                  <xsl:value-of select="nom"/>
                </div>
                <div class="card-price">
                  <xsl:value-of select="prix"/> DZD
                </div>
                <div class="card-description">
                  <xsl:value-of select="description"/>
                </div>
                <a href="products/{nom}"  class="buy-button">Acheter</a>
              </div>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>

