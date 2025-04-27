from flask import Flask, Response, request, send_from_directory
import os
import psycopg2
import xml.etree.ElementTree as ET
from flask_cors import CORS
from datetime import datetime
from lxml import etree

app = Flask(__name__)
CORS(app)

xml_cache = None

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        database='postgres',
        user='macbookair',
        password='7403'
    )
    return conn

def get_xml_from_db():
    global xml_cache
    if xml_cache is not None:
        return xml_cache

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT contenu FROM table_xml LIMIT 1;")
    result = cur.fetchone()
    cur.close()
    conn.close()

    if result:
        xml_cache = etree.fromstring(result[0].encode('utf-8'))
        return xml_cache
    else:
        return None

def convert_bijoux_to_xml(bijoux):
    root = etree.Element("bijoux")

    for bijou in bijoux:
        bijou_el = etree.SubElement(root, "bijou")

        etree.SubElement(bijou_el, "nom").text = bijou["nom"]
        etree.SubElement(bijou_el, "prix").text = f"{bijou['prix']:.2f}"
        etree.SubElement(bijou_el, "description").text = bijou["description"]
        if "image" in bijou:
            etree.SubElement(bijou_el, "image").text = bijou["image"]

    return etree.tostring(root, pretty_print=True, encoding="unicode")

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'static'), filename)

@app.route('/xml-xslt', methods=['GET'])
def afficher_xml_avec_xslt():
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    # Déclaration XSLT
    xslt_pi = etree.ProcessingInstruction(
        'xml-stylesheet', 'type="text/xsl" href="/bijoux.xslt"'
    )

    # On construit un nouvel arbre pour injecter l'instruction
    tree = etree.ElementTree(root)
    root.addprevious(xslt_pi)

    xml_str = etree.tostring(
        tree, xml_declaration=True, encoding='UTF-8', pretty_print=True
    )

    return Response(xml_str, mimetype='application/xml')

@app.route('/xml', methods=['GET'])
def afficher_xml():
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')
    
    xml_str = etree.tostring(root, encoding='unicode')
    return Response(xml_str, mimetype='application/xml')

@app.route('/bijoux/<categorie>', methods=['GET'])
def get_bijoux_par_categorie(categorie):
    try:
        print("Route appelée avec catégorie :", categorie)
        
        root = get_xml_from_db()
        print("XML root chargé :", root.tag)

        if root is None:
            return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

        sort_order = request.args.get('sort', 'asc')
        keyword = request.args.get('search', '').lower()

        # XPath pour trouver les bijoux par catégorie
        xpath_expr = f"//categorie/{categorie}/*[contains(translate(nom, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{keyword}') or contains(translate(description, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{keyword}')]"
        
        if not keyword:
            xpath_expr = f"//categorie/{categorie}/*"

        bijoux_elements = root.xpath(xpath_expr)

        if not bijoux_elements:
            return Response("<message>Aucun bijou trouvé</message>", status=404, mimetype='application/xml')

        bijoux = []
        for item in bijoux_elements:
            bijou = {
                "nom": item.xpath("string(nom)").strip(),
                "prix": float(item.xpath("string(prix)") or '0'),
                "description": item.xpath("string(description)").strip(),
            }

            # Inclure l'élément image si présent dans l'XML
            image = item.xpath("string(image)").strip()
            if image:
                bijou["image"] = f"/static/{image}"

            bijoux.append(bijou)

        sort_order = request.args.get('sort', 'asc')
        reverse = sort_order == 'desc'
        bijoux.sort(key=lambda x: x["prix"], reverse=reverse)

        print("Bijoux triés, préparation XML...")
        xml_response = convert_bijoux_to_xml(bijoux)

        return Response(xml_response, mimetype='application/xml')

    except Exception as e:
        print("❌ ERREUR :", e)
        return Response(f"<message>Erreur serveur : {e}</message>", status=500, mimetype='application/xml')

@app.route('/bijoux', methods=['GET'])
def get_tous_les_bijoux():
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    keyword = request.args.get('search', '').lower()
    sort_order = request.args.get('sort', 'asc')

    xpath_expr = f"//categorie/*/*[contains(translate(nom, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{keyword}') or contains(translate(description, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{keyword}')]"
    
    if not keyword:
        xpath_expr = "//categorie/*/*"

    bijoux_elements = root.xpath(xpath_expr)

    bijoux = []
    for item in bijoux_elements:
        bijoux.append({
            "image": item.xpath("string(image)").strip(),
            "nom": item.xpath("string(nom)").strip(),
            "prix": float(item.xpath("string(prix)") or '0'),
            "description": item.xpath("string(description)").strip()
        })

    if not bijoux:
        return Response("<message>Aucun bijou trouvé</message>", status=404, mimetype='application/xml')

    reverse = sort_order == 'desc'
    bijoux.sort(key=lambda x: x["prix"], reverse=reverse)

    # Convertir en XML
    root_bijoux = etree.fromstring(convert_bijoux_to_xml(bijoux))

    # Ajouter l'instruction de feuille de style XSL
    xslt_pi = etree.ProcessingInstruction('xml-stylesheet', 'type="text/xsl" href="bijoux.xsl"')
    root_bijoux.addprevious(xslt_pi)

    tree = etree.ElementTree(root_bijoux)
    xml_str = etree.tostring(tree, xml_declaration=True, encoding='UTF-8', pretty_print=True)

    return Response(xml_str, mimetype='application/xml')

@app.route('/rechercher', methods=['GET'])
def rechercher_bijoux():
    mot = request.args.get('mot', '').strip().lower()
    if not mot:
        return Response("<message>Mot-clé requis</message>", status=400, mimetype='application/xml')

    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    xpath_expr = f"""//categorie/*/*[
        contains(translate(nom, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{mot}')
        or contains(translate(description, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{mot}')
    ]"""

    bijoux_elements = root.xpath(xpath_expr)
    
    if not bijoux_elements:
        return Response("<message>Aucun bijou trouvé</message>", status=404, mimetype='application/xml')

    bijoux = []
    for item in bijoux_elements:
        bijou = {
            "nom": item.xpath("string(nom)").strip(),
            "prix": float(item.xpath("string(prix)") or '0'),
            "description": item.xpath("string(description)").strip(),
        }

        # Ajouter image si présente
        image = item.xpath("string(image)").strip()
        if image:
            bijou["image"] = f"/static/{image}"

        bijoux.append(bijou)

    xml_response = convert_bijoux_to_xml(bijoux)
    return Response(xml_response, mimetype='application/xml')

@app.route('/bijou/<nom>', methods=['GET'])
def get_bijou_par_nom(nom):
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    # Traitement de la recherche par nom
    keyword = request.args.get('search', '').lower()
    sort_order = request.args.get('sort', 'asc')

    # Appliquer le filtre de recherche sur le nom du bijou
    bijou_el = root.xpath(f"//*[self::bague or self::boucle_oreille][translate(nom, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = translate('{nom}', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')]")
    
    # Si un mot-clé de recherche est spécifié, appliquer un filtrage supplémentaire
    if keyword:
        bijou_el = [bijou for bijou in bijou_el if keyword in bijou.xpath("string(nom)").lower() or keyword in bijou.xpath("string(description)").lower()]

    if not bijou_el:
        return Response("<message>Bijou non trouvé</message>", status=404, mimetype='application/xml')

    bijou = {
        "nom": bijou_el[0].xpath("string(nom)").strip(),
        "prix": float(bijou_el[0].xpath("string(prix)") or '0'),
        "description": bijou_el[0].xpath("string(description)").strip(),
        "image": bijou_el[0].xpath("string(image)").strip()
    }

    # Tri selon le prix, si nécessaire
    if sort_order == 'desc':
        bijou['prix'] = -bijou['prix']  # Inverser le prix pour trier en desc

    # Convertir en XML
    xml_response = convert_bijoux_to_xml([bijou])

    # Ajouter l'instruction de feuille de style XSL
    root_bijoux = etree.fromstring(xml_response)
    xslt_pi = etree.ProcessingInstruction('xml-stylesheet', 'type="text/xsl" href="bijou.xslt"')
    root_bijoux.addprevious(xslt_pi)
    
    tree = etree.ElementTree(root_bijoux)
    xml_str = etree.tostring(tree, xml_declaration=True, encoding='UTF-8', pretty_print=True)

    return Response(xml_str, mimetype='application/xml')

@app.route('/orders', methods=['POST'])
def ajouter_order():
    global xml_cache
    try:
        xml_input = etree.fromstring(request.data)
    except Exception as e:
        return Response(f"<message>Erreur parsing XML : {str(e)}</message>", status=400, mimetype='application/xml')

    required_fields = ['nom_prenom', 'telephone', 'wilaya', 'commune', 'quantite', 'type', 'bijoux']

    data = {}
    for field in required_fields:
        if field == 'bijoux':
            bijoux_elements = xml_input.xpath('//bijoux/bijou')
            if not bijoux_elements:
                return Response("<message>Liste de bijoux manquante ou vide</message>", status=400, mimetype='application/xml')
            data['bijoux'] = []
            for bijou in bijoux_elements:
                nom = bijou.findtext('nom')
                prix = bijou.findtext('prix')
                if not (nom and prix):
                    return Response("<message>Bijou incomplet</message>", status=400, mimetype='application/xml')
                data['bijoux'].append({
                    'nom': nom,
                    'prix': prix,
                })
        else:
            value = xml_input.findtext(field)
            if not value:
                return Response(f"<message>Champ {field} manquant</message>", status=400, mimetype='application/xml')
            data[field] = value

    # Champ optionnel
    note = xml_input.findtext('note')
    if note:
        data['note'] = note
    date_value = xml_input.findtext('date')
    if date_value:
        data['date'] = date_value

    # Maintenant séparer nom et prénom
    try:
        nom, prenom = data['nom_prenom'].split(' ', 1)  # Sépare en 2 parties
    except ValueError:
        return Response("<message>Le champ nom_prenom doit contenir nom et prénom séparés par un espace</message>", status=400, mimetype='application/xml')

    # Ensuite traitement XML base de données
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    orders_el = root.xpath("//orders")
    if not orders_el:
        orders_el = etree.SubElement(root, "orders")
    else:
        orders_el = orders_el[0]

    existing_ids = [int(id.text) for id in root.xpath("//orders/order/id/text()")]
    new_id = max(existing_ids) + 1 if existing_ids else 1

    order_el = etree.SubElement(orders_el, "order")
    etree.SubElement(order_el, "id").text = str(new_id)
    etree.SubElement(order_el, "nom").text = nom
    etree.SubElement(order_el, "prenom").text = prenom
    etree.SubElement(order_el, "telephone").text = data['telephone']
    etree.SubElement(order_el, "wilaya").text = data['wilaya']
    etree.SubElement(order_el, "commune").text = data['commune']
    etree.SubElement(order_el, "quantite").text = data['quantite']
    etree.SubElement(order_el, "type").text = data['type']

    if 'note' in data:
        etree.SubElement(order_el, "note").text = data['note']
    etree.SubElement(order_el, "date").text = data.get('date', datetime.today().strftime('%Y-%m-%d'))

    bijoux_el = etree.SubElement(order_el, "bijoux")
    for bijou in data['bijoux']:
        bijou_el = etree.SubElement(bijoux_el, "bijou")
        etree.SubElement(bijou_el, "nom").text = bijou['nom']
        etree.SubElement(bijou_el, "prix").text = str(bijou['prix'])

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        xml_str = etree.tostring(root, encoding='unicode')
        cur.execute("UPDATE table_xml SET contenu = %s;", (xml_str,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return Response(f"<message>Erreur BD : {str(e)}</message>", status=500, mimetype='application/xml')

    xml_cache = root
    return Response("<message>order ajoutée avec succès</message>", status=201, mimetype='application/xml')

@app.route('/bijoux', methods=['POST'])
def ajouter_bijou():
    global xml_cache
    data = request.get_json()

    required_fields = ['nom', 'prix', 'description']
    if not data or not all(field in data for field in required_fields):
        return Response("<message>Données du bijou incomplètes</message>", status=400, mimetype='application/xml')

    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    # Par défaut, on ajoute le bijou dans une catégorie "divers"
    categorie = 'divers'
    categorie_el = root.find(f".//categorie/{categorie}")
    if categorie_el is None:
        categorie_root = root.find(".//categorie")
        if categorie_root is None:
            categorie_root = etree.SubElement(root, "categorie")
        categorie_el = etree.SubElement(categorie_root, categorie)

    # Créer le bijou
    bijou_el = etree.SubElement(categorie_el, "bijou")
    etree.SubElement(bijou_el, "nom").text = data['nom']
    etree.SubElement(bijou_el, "prix").text = str(data['prix'])
    etree.SubElement(bijou_el, "description").text = data['description']

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        xml_str = etree.tostring(root, encoding='unicode')
        cur.execute("UPDATE ma_table_xml SET contenu = %s;", (xml_str,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return Response(f"<message>Erreur BD : {str(e)}</message>", status=500, mimetype='application/xml')

    xml_cache = root
    return Response("<message>Bijou ajouté avec succès</message>", status=201, mimetype='application/xml')

if __name__ == '__main__':
    app.run(debug=True)