CREATE TABLE IF NOT EXISTS "table_xml" (
    id SERIAL NOT NULL PRIMARY KEY,
    fichier VARCHAR(255) NOT NULL,
    contenu XML NOT NULL,
);
INSERT INTO table_xml (id,fichier, contenu)
VALUES (
     1,
    'bijoux.xml',
    xmlparse(document $$
<magasin>
    <bijoux>
        <categorie>
            <bagues>
                <bague>
                    <image>/images/IMG_6527.jpg</image>
                    <nom>Ensemble Soléa</nom>
                    <prix>1000.00</prix>
                    <description>Soléa capture le mouvement dans la matière. Des formes libres, audacieuses et élégantes pour sublimer chaque geste avec caractère. L’essence du style contemporain au bout des doigts.</description>
                </bague>
                <bague>
                    <image>/images/IMG_6530.jpg</image>
                    <nom>Ensemble Onda</nom>
                    <prix>2500.00</prix>
                    <description>Onda s’inspire des vagues et des courbes naturelles. Des bagues à la présence subtile mais marquée, idéales pour une allure chic, organique et résolument moderne.</description>
                </bague>
                <bague>
                    <image>/images/IMG_6532.jpg</image>
                    <nom>Ensemble Astre</nom>
                    <prix>800.00</prix>
                    <description>Avec Astre, chaque bague devient une constellation. Des pièces singulières, puissantes, qui attirent le regard et évoquent la magie des étoiles. Une aura galactique à portée de main.</description>
                </bague>
                <bague>
                    <image>/images/IMG_6529.jpg</image>
                    <nom>Ensemble Aurea</nom>
                    <prix>1500.00</prix>
                    <description>Aurea, un éclat brut. Des formes instinctives, dorées, qui capturent la lumière et révèlent la matière.</description>
                </bague>
            </bagues>
            <boucles_oreilles>
                <boucle_oreille>
                    <image>/images/IMG_6668.jpg</image>
                    <nom>Aurore Nacrée</nom>
                    <prix>300.00</prix>
                    <description>Une paire de délicates créoles dorées, délicatement ornées de petites perles nacrées.</description>
                </boucle_oreille>
                <boucle_oreille>
                    <image>/images/IMG_6669.jpg</image>
                    <nom>Tresse</nom>
                    <prix>250.00</prix>
                    <description>Une paire de créoles dorées au design torsadé élégant.</description>
                </boucle_oreille>
                <boucle_oreille>
                    <image>/images/IMG_6674.jpg</image>
                    <nom>Halo Perlé</nom>
                    <prix>350.00</prix>
                    <description> Une paire de demi-créoles délicatement ornées de petites perles nacrées.</description>
                </boucle_oreille>
                <boucle_oreille>
                    <image>/images/IMG_6673.jpg</image>
                    <nom>Flot</nom>
                    <prix>200.00</prix>
                    <description>Une paire de créoles dorées au design délicatement ondulé.</description>
                </boucle_oreille>
                <boucle_oreille>
                    <image>/images/IMG_6680.jpg</image>
                    <nom>Angle</nom>
                    <prix>250.00</prix>
                    <description>Une paire de créoles de forme carrée, finies dans un éclatant doré.</description>
                </boucle_oreille>
            </boucles_oreilles>
        </categorie>
    </bijoux>
    <orders>
        <order>
            <name>Hamchaoui Badreddine</name>
            <address>123 Main St, Paris, France</address>
            <items>
                <item>
                    <name>Gouttes d’Or</name>
                    <price>200.00</price>
                    <quantity>1</quantity>
                </item>
            </items>
        </order>
        <order>
            <name>Medjahed Ikram</name>
            <address>456 Elm St, Lyon, France</address>
            <items>
                <item>
                    <name> Ensemble Soléa</name>
                    <price>1000.00</price>
                    <quantity>1</quantity>
                </item>
            </items>
        </order>
        <order>
            <id>1</id>
            <nom>ikram</nom>
            <prenom>medjahed </prenom>
            <telephone>0659125801</telephone>
            <wilaya>Adrar</wilaya>
            <commune>Timekten</commune>
            <quantite>2</quantite>
            <type>domicile</type>
            <date>2025-04-27</date>
            <bijoux>
                <bijou>
                    <nom>Produit Aurore%20Nacr%C3%A9e</nom>
                    <prix>300</prix>
                </bijou>
            </bijoux>
        </order>
        <order>
            <id>2</id>
            <nom>ikram</nom>
            <prenom>med </prenom>
            <telephone>0659125801</telephone>
            <wilaya>Chlef</wilaya>
            <commune>Talassa</commune>
            <quantite>2</quantite>
            <type>bureau</type>
            <date>2025-04-28 13:59:35</date>
            <bijoux>
                <bijou>
                    <nom>Produit Aurore%20Nacr%C3%A9e</nom>
                    <prix>300</prix>
                </bijou>
            </bijoux>
        </order>
    </orders>
</magasin>
$$)
);
