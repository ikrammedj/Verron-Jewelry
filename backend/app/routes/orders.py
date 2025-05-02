from flask import Blueprint, Response, request
from ..utils.xml_utils import get_xml_from_db, convert_bijoux_to_xml
from ..utils.db_utils import get_db_connection
from lxml import etree
from datetime import datetime

orders_bp = Blueprint('orders', __name__, url_prefix='/orders')

@orders_bp.route('/', methods=['POST'])
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

    note = xml_input.findtext('note')
    if note:
        data['note'] = note
    date_value = xml_input.findtext('date')
    if date_value:
        data['date'] = date_value

    try:
        nom, prenom = data['nom_prenom'].split(' ', 1)
    except ValueError:
        return Response("<message>Le champ nom_prenom doit contenir nom et prénom séparés par un espace</message>", status=400, mimetype='application/xml')

    root = get_xml_from_db()
    if root is None:
        return Response("<message>Données XML introuvables</message>", status=500, mimetype='application/xml')

    orders_el = root.xpath("//orders")
    if not orders_el:
        orders_el = etree.SubElement(root, "orders")
    else:
        orders_el = orders_el[0]

    existing_ids = [int(id) for id in root.xpath("//orders/order/id/text()")]
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
    etree.SubElement(order_el, "date").text = data.get('date', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

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
    return Response("<message>Commande ajoutée avec succès</message>", status=201, mimetype='application/xml')
