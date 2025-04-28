from lxml import etree

xml_cache = None

def get_xml_from_db():
    global xml_cache
    if xml_cache is not None:
        return xml_cache

    from ..utils.db_utils import get_db_connection
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT contenu FROM table_xml LIMIT 1;")
    result = cur.fetchone()
    cur.close()
    conn.close()

    if result:
        xml_cache = etree.fromstring(result[0].encode('utf-8'))
        return xml_cache
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
