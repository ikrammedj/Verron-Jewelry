from lxml import etree

xml_file = "/Users/macbookair/Downloads/verron jewelry/backend/bijoux.xml"
tree = etree.parse(xml_file)

xslt_file = "/Users/macbookair/Downloads/verron jewelry/frontend/bijoux.xslt"
xslt_tree = etree.parse(xslt_file)

transform = etree.XSLT(xslt_tree)

html_tree = transform(tree)

with open("bijoux.html", "wb") as f:
    f.write(etree.tostring(html_tree))
