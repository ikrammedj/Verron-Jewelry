--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: table_xml; Type: TABLE; Schema: public; Owner: macbookair
--

CREATE TABLE public.table_xml (
    id integer NOT NULL,
    fichier character varying,
    contenu xml
);


ALTER TABLE public.table_xml OWNER TO macbookair;

--
-- Name: table_xml_id_seq; Type: SEQUENCE; Schema: public; Owner: macbookair
--

CREATE SEQUENCE public.table_xml_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.table_xml_id_seq OWNER TO macbookair;

--
-- Name: table_xml_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: macbookair
--

ALTER SEQUENCE public.table_xml_id_seq OWNED BY public.table_xml.id;


--
-- Name: table_xml id; Type: DEFAULT; Schema: public; Owner: macbookair
--

ALTER TABLE ONLY public.table_xml ALTER COLUMN id SET DEFAULT nextval('public.table_xml_id_seq'::regclass);


--
-- Data for Name: table_xml; Type: TABLE DATA; Schema: public; Owner: macbookair
--

COPY public.table_xml (id, fichier, contenu) FROM stdin;
1	bijoux.xml	<magasin>\n    <bijoux>\n        <categorie>\n        <bagues>\n            <bague>\n                <image>images/IMG_6527.jpg</image>\n                <nom>Ensemble Soléa</nom>\n                <prix>1000.00</prix>\n                <description>Soléa capture le mouvement dans la matière. Des formes libres, audacieuses et élégantes pour sublimer chaque geste avec caractère. L’essence du style contemporain au bout des doigts.</description>\n            </bague>\n            <bague>\n                <image>images/IMG_6530.jpg</image>\n                <nom>Ensemble Onda</nom>\n                <prix>2500.00</prix>\n                <description>Onda s’inspire des vagues et des courbes naturelles. Des bagues à la présence subtile mais marquée, idéales pour une allure chic, organique et résolument moderne.</description>\n            </bague>\n            <bague>\n                <image>images/IMG_6532.jpg</image>\n                <nom>Ensemble Astre</nom>\n                <prix>800.00</prix>\n                <description>Avec Astre, chaque bague devient une constellation. Des pièces singulières, puissantes, qui attirent le regard et évoquent la magie des étoiles. Une aura galactique à portée de main.</description>\n            </bague>\n            <bague>\n                <image>images/IMG_6529.jpg</image>\n                <nom>Ensemble Aurea</nom>\n                <prix>1500.00</prix>\n                <description>Aurea, un éclat brut. Des formes instinctives, dorées, qui capturent la lumière et révèlent la matière.</description>\n            </bague>            \n        </bagues>\n\n        <boucles_oreilles>\n            <boucle_oreille>\n                <image>images/IMG_6668.jpg</image>\n                <nom>Aurore Nacrée</nom>\n                <prix>300.00</prix>\n                <description>Une paire de délicates créoles dorées, délicatement ornées de petites perles nacrées.</description>\n            </boucle_oreille>\n            <boucle_oreille>\n                <image>images/IMG_6669.jpg</image>\n                <nom>Tresse d'Or</nom>\n                <prix>250.00</prix>\n                <description>Une paire de créoles dorées au design torsadé élégant.</description>\n            </boucle_oreille>\n            <boucle_oreille>\n                <image>images/IMG_6674.jpg</image>\n                <nom>Halo Perlé</nom>\n                <prix>350.00</prix>\n                <description> Une paire de demi-créoles délicatement ornées de petites perles nacrées.</description>\n            </boucle_oreille>\n            <boucle_oreille>\n                <image>images/IMG_6673.jpg</image>\n                <nom>Flot d'Or</nom>\n                <prix>200.00</prix>\n                <description>Une paire de créoles dorées au design délicatement ondulé.</description>\n            </boucle_oreille>\n            <boucle_oreille>\n                <image>images/IMG_6680.jpg</image>\n                <nom>Angle d'Or</nom>\n                <prix>250.00</prix>\n                <description>Une paire de créoles de forme carrée, finies dans un éclatant doré.</description>\n            </boucle_oreille>\n        </boucles_oreilles>\n    </categorie>\n\n    </bijoux>\n    <orders>\n        <order>\n            <name>Hamchaoui Badreddine</name>\n            <address>123 Main St, Paris, France</address>\n            <items>\n                <item>\n                    <name>Gouttes d’Or</name>\n                    <price>200.00</price>\n                    <quantity>1</quantity>\n                </item>\n            </items>\n        </order>\n\n        <order>\n            <name>Medjahed Ikram</name>\n            <address>456 Elm St, Lyon, France</address>\n            <items>\n                <item>\n                    <name> Ensemble Soléa</name>\n                    <price>1000.00</price>\n                    <quantity>1</quantity>\n                </item>\n            </items>\n        </order>\n    </orders>\n</magasin>\n\n\n
\.


--
-- Name: table_xml_id_seq; Type: SEQUENCE SET; Schema: public; Owner: macbookair
--

SELECT pg_catalog.setval('public.table_xml_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

