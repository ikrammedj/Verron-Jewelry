<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/bijoux">
    <html>
      <head>
        <title><xsl:value-of select="bijou/nom"/></title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            display: flex;
            gap: 20px;
            align-items: flex-start;
          }
          .image {
            flex: 1;
          }
          .details {
            flex: 2;
          }
          .price {
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
          }
          .quantity {
            margin: 20px 0;
          }
          .btn-buy {
            margin-top: 30px;
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
            margin-bottom: 0px;
          }
          .btn-buy:hover {
            background-color:rgb(128, 95, 95);
          }
          .footer {
            margin-top: 50px;
            font-size: 12px;
            text-align: center;
            color: #888;
          }

        </style>
      </head>
      <body>
        <div class="container">
          <div class="image">
            <img>
                <xsl:attribute name="src">
                    <xsl:value-of select="bijou/image"/>
                </xsl:attribute>
                <xsl:attribute name="alt">Image de <xsl:value-of select="bijou/nom"/></xsl:attribute>
                <xsl:attribute name="style">max-width:100%; border-radius:10px;</xsl:attribute>
            </img>
          </div>

          <div class="details">
            <h1 style="font-weight: bold; font-size: 1.5em; margin-top: 20px;"><xsl:value-of select="bijou/nom"/></h1>
            <div class="price">
              <xsl:value-of select="bijou/prix"/> DA
            </div>

            <h3 style="font-weight: bold; font-size: 1.5em; margin-top: 20px;">Détails du produit :</h3>
            <p className="mb-8"><xsl:value-of select="bijou/description"/></p>

            <button id="buyButton" class="btn-buy">Acheter maintenant</button>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
