from flask import Blueprint, Response, request
from lxml import etree
from ..utils.xml_utils import get_xml_from_db, convert_bijoux_to_xml
from ..utils.db_utils import get_db_connection
from unidecode import unidecode
from urllib.parse import quote_plus

bijoux_bp = Blueprint('bijoux', __name__, url_prefix='/bijoux')

@bijoux_bp.route('/', methods=['GET'])
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

@bijoux_bp.route('/categorie/<categorie>', methods=['GET'])
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

@bijoux_bp.route('/xml', methods=['GET'])
def afficher_xml():
    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')
    
    xml_str = etree.tostring(root, encoding='unicode')
    return Response(xml_str, mimetype='application/xml')

@bijoux_bp.route('/nom/<nom>', methods=['GET'])
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

    root_bijoux = etree.fromstring(xml_response)
    xslt_pi = etree.ProcessingInstruction('xml-stylesheet', 'type="text/xsl" href="bijou.xslt"')
    root_bijoux.addprevious(xslt_pi)
    
    tree = etree.ElementTree(root_bijoux)
    xml_str = etree.tostring(tree, xml_declaration=True, encoding='UTF-8', pretty_print=True)

    return Response(xml_str, mimetype='application/xml')

