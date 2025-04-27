<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/magasin">
    <html>
      <head>
        <title>Magasin de Bijoux</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
          h2 { color: #a67c00; }
          .section { margin-bottom: 40px; }
          .produit, .commande { border: 1px solid #ddd; padding: 15px; margin: 10px 0; background-color: #fff; }
          .produit img { width: 100px; height: auto; display: block; margin-bottom: 10px; }
          .titre-produit { font-weight: bold; font-size: 1.2em; margin: 5px 0; }
        </style>
      </head>
      <body>
        <h1>Catalogue de Bijoux</h1>

        <div class="section">
          <h2>Bagues</h2>
          <xsl:for-each select="bijoux/categorie/bagues/bague">
            <div class="produit">
              <img src="{image}" alt="{nom}" />
              <div class="titre-produit"><xsl:value-of select="nom"/></div>
              <div><strong>Prix :</strong> <xsl:value-of select="prix"/> DZD</div>
              <p><xsl:value-of select="description"/></p>
            </div>
          </xsl:for-each>
        </div>

        <div class="section">
          <h2>Boucles d'oreilles</h2>
          <xsl:for-each select="bijoux/categorie/boucles_oreilles/boucle_oreille">
            <div class="produit">
              <img src="{image}" alt="{nom}" />
              <div class="titre-produit"><xsl:value-of select="nom"/></div>
              <div><strong>Prix :</strong> <xsl:value-of select="prix"/> DZD</div>
              <p><xsl:value-of select="description"/></p>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
