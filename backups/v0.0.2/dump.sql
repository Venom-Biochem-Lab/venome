--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

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

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: tsm_system_rows; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tsm_system_rows WITH SCHEMA public;


--
-- Name: EXTENSION tsm_system_rows; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tsm_system_rows IS 'TABLESAMPLE method which accepts number of rows as a limit';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    date_published timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    refs text
);


ALTER TABLE public.articles OWNER TO myuser;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articles_id_seq OWNER TO myuser;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.components (
    id integer NOT NULL,
    article_id integer NOT NULL,
    component_order integer NOT NULL
);


ALTER TABLE public.components OWNER TO myuser;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_id_seq OWNER TO myuser;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: image_components; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.image_components (
    id integer NOT NULL,
    component_id integer NOT NULL,
    src bytea NOT NULL,
    width integer,
    height integer
);


ALTER TABLE public.image_components OWNER TO myuser;

--
-- Name: image_components_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.image_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_components_id_seq OWNER TO myuser;

--
-- Name: image_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.image_components_id_seq OWNED BY public.image_components.id;


--
-- Name: protein_components; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.protein_components (
    id integer NOT NULL,
    component_id integer NOT NULL,
    name text NOT NULL,
    aligned_with_name text
);


ALTER TABLE public.protein_components OWNER TO myuser;

--
-- Name: protein_components_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.protein_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.protein_components_id_seq OWNER TO myuser;

--
-- Name: protein_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.protein_components_id_seq OWNED BY public.protein_components.id;


--
-- Name: proteins; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.proteins (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    length integer,
    mass numeric,
    content text,
    refs text,
    species_id integer NOT NULL,
    thumbnail bytea,
    date_published timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.proteins OWNER TO myuser;

--
-- Name: proteins_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.proteins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proteins_id_seq OWNER TO myuser;

--
-- Name: proteins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.proteins_id_seq OWNED BY public.proteins.id;


--
-- Name: species; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.species (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.species OWNER TO myuser;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_id_seq OWNER TO myuser;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.species_id_seq OWNED BY public.species.id;


--
-- Name: text_components; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.text_components (
    id integer NOT NULL,
    component_id integer NOT NULL,
    markdown text DEFAULT ''::text
);


ALTER TABLE public.text_components OWNER TO myuser;

--
-- Name: text_components_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.text_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.text_components_id_seq OWNER TO myuser;

--
-- Name: text_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.text_components_id_seq OWNED BY public.text_components.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    pword text NOT NULL,
    admin boolean NOT NULL
);


ALTER TABLE public.users OWNER TO myuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO myuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: image_components id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.image_components ALTER COLUMN id SET DEFAULT nextval('public.image_components_id_seq'::regclass);


--
-- Name: protein_components id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.protein_components ALTER COLUMN id SET DEFAULT nextval('public.protein_components_id_seq'::regclass);


--
-- Name: proteins id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.proteins ALTER COLUMN id SET DEFAULT nextval('public.proteins_id_seq'::regclass);


--
-- Name: species id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.species ALTER COLUMN id SET DEFAULT nextval('public.species_id_seq'::regclass);


--
-- Name: text_components id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.text_components ALTER COLUMN id SET DEFAULT nextval('public.text_components_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: image_components; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: protein_components; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: proteins; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.proteins VALUES (1, 'Gh_comp1090_c0_seq1', 'Gh comp1090 c0 seq1 from the ganaspis hookeri wasp venom', 2240, 242582.710399999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:26.736222+00');
INSERT INTO public.proteins VALUES (2, 'Gh_comp1045_c0_seq1', 'Gh comp1045 c0 seq1 from the ganaspis hookeri wasp venom', 1002, 109999.700000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:26.928835+00');
INSERT INTO public.proteins VALUES (3, 'Gh_comp10207_c0_seq2', 'Gh comp10207 c0 seq2 from the ganaspis hookeri wasp venom', 197, 22723.3332, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.012702+00');
INSERT INTO public.proteins VALUES (4, 'Gh_comp10_c1_seq1', 'Gh comp10 c1 seq1 from the ganaspis hookeri wasp venom', 718, 82567.6261000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.190266+00');
INSERT INTO public.proteins VALUES (5, 'Gh_comp1116_c0_seq1', 'Gh comp1116 c0 seq1 from the ganaspis hookeri wasp venom', 160, 17939.3471, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.250941+00');
INSERT INTO public.proteins VALUES (6, 'Gh_comp1068_c0_seq5', 'Gh comp1068 c0 seq5 from the ganaspis hookeri wasp venom', 1968, 225134.539800001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.610365+00');
INSERT INTO public.proteins VALUES (7, 'Gh_comp10466_c0_seq1', 'Gh comp10466 c0 seq1 from the ganaspis hookeri wasp venom', 562, 65470.3486000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.782806+00');
INSERT INTO public.proteins VALUES (8, 'Gh_comp1063_c0_seq1', 'Gh comp1063 c0 seq1 from the ganaspis hookeri wasp venom', 520, 56149.0249000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.867522+00');
INSERT INTO public.proteins VALUES (9, 'Gh_comp112_c1_seq1', 'Gh comp112 c1 seq1 from the ganaspis hookeri wasp venom', 162, 18538.5615, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.925907+00');
INSERT INTO public.proteins VALUES (10, 'Gh_comp112_c1_seq4', 'Gh comp112 c1 seq4 from the ganaspis hookeri wasp venom', 104, 12290.434, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:27.987764+00');
INSERT INTO public.proteins VALUES (11, 'Gh_comp1148_c0_seq4', 'Gh comp1148 c0 seq4 from the ganaspis hookeri wasp venom', 206, 23638.609, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.052234+00');
INSERT INTO public.proteins VALUES (12, 'Gh_comp1148_c1_seq1', 'Gh comp1148 c1 seq1 from the ganaspis hookeri wasp venom', 152, 17808.3706, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.106998+00');
INSERT INTO public.proteins VALUES (13, 'Gh_comp11645_c0_seq1', 'Gh comp11645 c0 seq1 from the ganaspis hookeri wasp venom', 1111, 129143.236300001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.344158+00');
INSERT INTO public.proteins VALUES (14, 'Gh_comp120_c0_seq1', 'Gh comp120 c0 seq1 from the ganaspis hookeri wasp venom', 376, 41821.3924, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.421996+00');
INSERT INTO public.proteins VALUES (15, 'Gh_comp1249_c0_seq1', 'Gh comp1249 c0 seq1 from the ganaspis hookeri wasp venom', 331, 38217.3227, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.497943+00');
INSERT INTO public.proteins VALUES (16, 'Gh_comp1166_c0_seq1', 'Gh comp1166 c0 seq1 from the ganaspis hookeri wasp venom', 148, 17176.1543, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.552576+00');
INSERT INTO public.proteins VALUES (17, 'Gh_comp1264_c0_seq11', 'Gh comp1264 c0 seq11 from the ganaspis hookeri wasp venom', 237, 27195.9507, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.61768+00');
INSERT INTO public.proteins VALUES (18, 'Gh_comp1264_c0_seq19', 'Gh comp1264 c0 seq19 from the ganaspis hookeri wasp venom', 109, 12744.204, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.670042+00');
INSERT INTO public.proteins VALUES (19, 'Gh_comp1272_c0_seq1', 'Gh comp1272 c0 seq1 from the ganaspis hookeri wasp venom', 493, 53547.402, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.831787+00');
INSERT INTO public.proteins VALUES (20, 'Gh_comp1264_c0_seq3', 'Gh comp1264 c0 seq3 from the ganaspis hookeri wasp venom', 549, 63188.9290000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.928739+00');
INSERT INTO public.proteins VALUES (21, 'Gh_comp1264_c0_seq24', 'Gh comp1264 c0 seq24 from the ganaspis hookeri wasp venom', 98, 11033.5228, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:28.96998+00');
INSERT INTO public.proteins VALUES (22, 'Gh_comp1276_c0_seq1', 'Gh comp1276 c0 seq1 from the ganaspis hookeri wasp venom', 891, 102916.622100001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.10254+00');
INSERT INTO public.proteins VALUES (23, 'Gh_comp1288_c0_seq1', 'Gh comp1288 c0 seq1 from the ganaspis hookeri wasp venom', 318, 36564.5929, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.226063+00');
INSERT INTO public.proteins VALUES (24, 'Gh_comp127_c1_seq2', 'Gh comp127 c1 seq2 from the ganaspis hookeri wasp venom', 247, 28132.2012, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.289191+00');
INSERT INTO public.proteins VALUES (25, 'Gh_comp1347_c0_seq1', 'Gh comp1347 c0 seq1 from the ganaspis hookeri wasp venom', 206, 22481.7011, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.350671+00');
INSERT INTO public.proteins VALUES (26, 'Gh_comp1319_c0_seq1', 'Gh comp1319 c0 seq1 from the ganaspis hookeri wasp venom', 195, 22191.0526, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.406605+00');
INSERT INTO public.proteins VALUES (27, 'Gh_comp1373_c0_seq1', 'Gh comp1373 c0 seq1 from the ganaspis hookeri wasp venom', 332, 36170.3558, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.484651+00');
INSERT INTO public.proteins VALUES (28, 'Gh_comp1408_c0_seq1', 'Gh comp1408 c0 seq1 from the ganaspis hookeri wasp venom', 495, 54987.2309, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.565214+00');
INSERT INTO public.proteins VALUES (29, 'Gh_comp140_c0_seq1', 'Gh comp140 c0 seq1 from the ganaspis hookeri wasp venom', 128, 14703.1462, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.613354+00');
INSERT INTO public.proteins VALUES (30, 'Gh_comp1440_c0_seq1', 'Gh comp1440 c0 seq1 from the ganaspis hookeri wasp venom', 362, 42925.9037, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.757442+00');
INSERT INTO public.proteins VALUES (31, 'Gh_comp1476_c0_seq1', 'Gh comp1476 c0 seq1 from the ganaspis hookeri wasp venom', 320, 35534.0371, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.841967+00');
INSERT INTO public.proteins VALUES (32, 'Gh_comp148_c1_seq1', 'Gh comp148 c1 seq1 from the ganaspis hookeri wasp venom', 164, 17814.0939, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:29.942269+00');
INSERT INTO public.proteins VALUES (33, 'Gh_comp1523_c0_seq1', 'Gh comp1523 c0 seq1 from the ganaspis hookeri wasp venom', 3396, 379702.413800004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.396093+00');
INSERT INTO public.proteins VALUES (34, 'Gh_comp1551_c0_seq1', 'Gh comp1551 c0 seq1 from the ganaspis hookeri wasp venom', 844, 97501.1682000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.593553+00');
INSERT INTO public.proteins VALUES (35, 'Gh_comp1559_c0_seq1', 'Gh comp1559 c0 seq1 from the ganaspis hookeri wasp venom', 268, 30707.2628, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.65736+00');
INSERT INTO public.proteins VALUES (36, 'Gh_comp1526_c0_seq1', 'Gh comp1526 c0 seq1 from the ganaspis hookeri wasp venom', 100, 12078.2558, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.703589+00');
INSERT INTO public.proteins VALUES (37, 'Gh_comp1571_c0_seq8', 'Gh comp1571 c0 seq8 from the ganaspis hookeri wasp venom', 528, 59774.6679000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.788536+00');
INSERT INTO public.proteins VALUES (38, 'Gh_comp1587_c0_seq1', 'Gh comp1587 c0 seq1 from the ganaspis hookeri wasp venom', 284, 32226.723, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.844395+00');
INSERT INTO public.proteins VALUES (39, 'Gh_comp1593_c0_seq1', 'Gh comp1593 c0 seq1 from the ganaspis hookeri wasp venom', 78, 8983.1842, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:30.886303+00');
INSERT INTO public.proteins VALUES (40, 'Gh_comp1621_c0_seq3', 'Gh comp1621 c0 seq3 from the ganaspis hookeri wasp venom', 788, 85639.6413000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.057083+00');
INSERT INTO public.proteins VALUES (41, 'Gh_comp1623_c0_seq1', 'Gh comp1623 c0 seq1 from the ganaspis hookeri wasp venom', 291, 33855.4029, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.121737+00');
INSERT INTO public.proteins VALUES (42, 'Gh_comp1668_c0_seq1', 'Gh comp1668 c0 seq1 from the ganaspis hookeri wasp venom', 462, 53520.6325000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.199465+00');
INSERT INTO public.proteins VALUES (43, 'Gh_comp1636_c0_seq1', 'Gh comp1636 c0 seq1 from the ganaspis hookeri wasp venom', 566, 67491.8062000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.284251+00');
INSERT INTO public.proteins VALUES (44, 'Gh_comp1699_c0_seq1', 'Gh comp1699 c0 seq1 from the ganaspis hookeri wasp venom', 173, 19047.5359, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.332149+00');
INSERT INTO public.proteins VALUES (45, 'Gh_comp171_c0_seq2', 'Gh comp171 c0 seq2 from the ganaspis hookeri wasp venom', 312, 34757.4202, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.453399+00');
INSERT INTO public.proteins VALUES (46, 'Gh_comp1724_c0_seq2', 'Gh comp1724 c0 seq2 from the ganaspis hookeri wasp venom', 1031, 115892.610200001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.586589+00');
INSERT INTO public.proteins VALUES (47, 'Gh_comp1786_c0_seq1', 'Gh comp1786 c0 seq1 from the ganaspis hookeri wasp venom', 441, 50256.9568999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.662061+00');
INSERT INTO public.proteins VALUES (48, 'Gh_comp1790_c0_seq1', 'Gh comp1790 c0 seq1 from the ganaspis hookeri wasp venom', 613, 68032.7116000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.807963+00');
INSERT INTO public.proteins VALUES (49, 'Gh_comp181_c0_seq1', 'Gh comp181 c0 seq1 from the ganaspis hookeri wasp venom', 196, 22408.7417, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.863495+00');
INSERT INTO public.proteins VALUES (50, 'Gh_comp191_c8_seq1', 'Gh comp191 c8 seq1 from the ganaspis hookeri wasp venom', 343, 37949.083, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.930086+00');
INSERT INTO public.proteins VALUES (51, 'Gh_comp1992_c0_seq1', 'Gh comp1992 c0 seq1 from the ganaspis hookeri wasp venom', 170, 19516.335, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:31.983799+00');
INSERT INTO public.proteins VALUES (52, 'Gh_comp2007_c0_seq1', 'Gh comp2007 c0 seq1 from the ganaspis hookeri wasp venom', 127, 13901.8987, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.032328+00');
INSERT INTO public.proteins VALUES (53, 'Gh_comp17281_c0_seq1', 'Gh comp17281 c0 seq1 from the ganaspis hookeri wasp venom', 702, 81565.9005000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.149358+00');
INSERT INTO public.proteins VALUES (54, 'Gh_comp200_c0_seq1', 'Gh comp200 c0 seq1 from the ganaspis hookeri wasp venom', 447, 50144.7646000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.227255+00');
INSERT INTO public.proteins VALUES (55, 'Gh_comp2027_c0_seq1', 'Gh comp2027 c0 seq1 from the ganaspis hookeri wasp venom', 286, 33078.4267, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.346897+00');
INSERT INTO public.proteins VALUES (56, 'Gh_comp2027_c0_seq10', 'Gh comp2027 c0 seq10 from the ganaspis hookeri wasp venom', 192, 22393.5331, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.403831+00');
INSERT INTO public.proteins VALUES (57, 'Gh_comp2027_c0_seq18', 'Gh comp2027 c0 seq18 from the ganaspis hookeri wasp venom', 136, 15216.4362, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.453471+00');
INSERT INTO public.proteins VALUES (58, 'Gh_comp2027_c0_seq2', 'Gh comp2027 c0 seq2 from the ganaspis hookeri wasp venom', 307, 35507.5875, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.518366+00');
INSERT INTO public.proteins VALUES (59, 'Gh_comp2027_c0_seq22', 'Gh comp2027 c0 seq22 from the ganaspis hookeri wasp venom', 80, 9411.7115, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.557982+00');
INSERT INTO public.proteins VALUES (60, 'Gh_comp2027_c0_seq4', 'Gh comp2027 c0 seq4 from the ganaspis hookeri wasp venom', 293, 33974.9736000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.621748+00');
INSERT INTO public.proteins VALUES (61, 'Gh_comp2027_c0_seq6', 'Gh comp2027 c0 seq6 from the ganaspis hookeri wasp venom', 152, 18049.737, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.670971+00');
INSERT INTO public.proteins VALUES (62, 'Gh_comp204_c0_seq1', 'Gh comp204 c0 seq1 from the ganaspis hookeri wasp venom', 247, 27636.9018, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.730718+00');
INSERT INTO public.proteins VALUES (63, 'Gh_comp2091_c0_seq1', 'Gh comp2091 c0 seq1 from the ganaspis hookeri wasp venom', 250, 28455.7775, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.787894+00');
INSERT INTO public.proteins VALUES (64, 'Gh_comp2172_c0_seq1', 'Gh comp2172 c0 seq1 from the ganaspis hookeri wasp venom', 376, 44912.3794, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:32.911275+00');
INSERT INTO public.proteins VALUES (65, 'Gh_comp2391_c0_seq1', 'Gh comp2391 c0 seq1 from the ganaspis hookeri wasp venom', 993, 111209.121400001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.051932+00');
INSERT INTO public.proteins VALUES (66, 'Gh_comp2459_c0_seq1', 'Gh comp2459 c0 seq1 from the ganaspis hookeri wasp venom', 943, 106471.007200001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.228834+00');
INSERT INTO public.proteins VALUES (67, 'Gh_comp2467_c0_seq1', 'Gh comp2467 c0 seq1 from the ganaspis hookeri wasp venom', 472, 53346.3513000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.310272+00');
INSERT INTO public.proteins VALUES (68, 'Gh_comp244_c0_seq1', 'Gh comp244 c0 seq1 from the ganaspis hookeri wasp venom', 335, 35631.3443, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.371892+00');
INSERT INTO public.proteins VALUES (69, 'Gh_comp247_c0_seq1', 'Gh comp247 c0 seq1 from the ganaspis hookeri wasp venom', 108, 13258.8705, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.415866+00');
INSERT INTO public.proteins VALUES (70, 'Gh_comp2470_c0_seq1', 'Gh comp2470 c0 seq1 from the ganaspis hookeri wasp venom', 292, 32738.3188, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.481395+00');
INSERT INTO public.proteins VALUES (71, 'Gh_comp247_c0_seq2', 'Gh comp247 c0 seq2 from the ganaspis hookeri wasp venom', 103, 12324.0035, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.524281+00');
INSERT INTO public.proteins VALUES (72, 'Gh_comp248_c0_seq1', 'Gh comp248 c0 seq1 from the ganaspis hookeri wasp venom', 214, 24774.3533, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.579488+00');
INSERT INTO public.proteins VALUES (73, 'Gh_comp24_c0_seq1', 'Gh comp24 c0 seq1 from the ganaspis hookeri wasp venom', 134, 14640.1564, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.62597+00');
INSERT INTO public.proteins VALUES (74, 'Gh_comp2501_c0_seq1', 'Gh comp2501 c0 seq1 from the ganaspis hookeri wasp venom', 305, 34561.1195, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.701943+00');
INSERT INTO public.proteins VALUES (75, 'Gh_comp2495_c0_seq1', 'Gh comp2495 c0 seq1 from the ganaspis hookeri wasp venom', 294, 35017.6095, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.832046+00');
INSERT INTO public.proteins VALUES (76, 'Gh_comp2524_c0_seq1', 'Gh comp2524 c0 seq1 from the ganaspis hookeri wasp venom', 237, 27607.6951, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.901198+00');
INSERT INTO public.proteins VALUES (77, 'Gh_comp2629_c0_seq1', 'Gh comp2629 c0 seq1 from the ganaspis hookeri wasp venom', 379, 42818.4720000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:33.974725+00');
INSERT INTO public.proteins VALUES (78, 'Gh_comp262_c0_seq1', 'Gh comp262 c0 seq1 from the ganaspis hookeri wasp venom', 246, 26644.6152, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.033694+00');
INSERT INTO public.proteins VALUES (79, 'Gh_comp271_c0_seq1', 'Gh comp271 c0 seq1 from the ganaspis hookeri wasp venom', 132, 15494.6043, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.082407+00');
INSERT INTO public.proteins VALUES (80, 'Gh_comp274_c0_seq1', 'Gh comp274 c0 seq1 from the ganaspis hookeri wasp venom', 161, 17725.8872, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.13113+00');
INSERT INTO public.proteins VALUES (81, 'Gh_comp2768_c0_seq1', 'Gh comp2768 c0 seq1 from the ganaspis hookeri wasp venom', 308, 33986.1309, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.201744+00');
INSERT INTO public.proteins VALUES (82, 'Gh_comp282_c0_seq1', 'Gh comp282 c0 seq1 from the ganaspis hookeri wasp venom', 141, 15331.5229, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.250129+00');
INSERT INTO public.proteins VALUES (83, 'Gh_comp284_c3_seq1', 'Gh comp284 c3 seq1 from the ganaspis hookeri wasp venom', 105, 12297.9249, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.296703+00');
INSERT INTO public.proteins VALUES (84, 'Gh_comp2919_c0_seq1', 'Gh comp2919 c0 seq1 from the ganaspis hookeri wasp venom', 557, 62367.3858000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.437262+00');
INSERT INTO public.proteins VALUES (85, 'Gh_comp3141_c0_seq2', 'Gh comp3141 c0 seq2 from the ganaspis hookeri wasp venom', 166, 19463.8605, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.49376+00');
INSERT INTO public.proteins VALUES (86, 'Gh_comp317_c0_seq1', 'Gh comp317 c0 seq1 from the ganaspis hookeri wasp venom', 149, 16942.4669, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.544477+00');
INSERT INTO public.proteins VALUES (87, 'Gh_comp3256_c0_seq1', 'Gh comp3256 c0 seq1 from the ganaspis hookeri wasp venom', 130, 14504.3632, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.593823+00');
INSERT INTO public.proteins VALUES (88, 'Gh_comp328_c0_seq1', 'Gh comp328 c0 seq1 from the ganaspis hookeri wasp venom', 247, 27304.5454, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.659306+00');
INSERT INTO public.proteins VALUES (89, 'Gh_comp346_c0_seq1', 'Gh comp346 c0 seq1 from the ganaspis hookeri wasp venom', 108, 11795.5041, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.717702+00');
INSERT INTO public.proteins VALUES (90, 'Gh_comp3548_c1_seq15', 'Gh comp3548 c1 seq15 from the ganaspis hookeri wasp venom', 95, 11361.7117, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.769927+00');
INSERT INTO public.proteins VALUES (91, 'Gh_comp3581_c0_seq1', 'Gh comp3581 c0 seq1 from the ganaspis hookeri wasp venom', 569, 65457.3290000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.860104+00');
INSERT INTO public.proteins VALUES (92, 'Gh_comp3581_c0_seq3', 'Gh comp3581 c0 seq3 from the ganaspis hookeri wasp venom', 343, 37949.083, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.921907+00');
INSERT INTO public.proteins VALUES (93, 'Gh_comp3581_c0_seq4', 'Gh comp3581 c0 seq4 from the ganaspis hookeri wasp venom', 321, 38105.0327, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:34.99011+00');
INSERT INTO public.proteins VALUES (94, 'Gh_comp3606_c0_seq1', 'Gh comp3606 c0 seq1 from the ganaspis hookeri wasp venom', 329, 38262.9780000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.119618+00');
INSERT INTO public.proteins VALUES (95, 'Gh_comp366_c0_seq1', 'Gh comp366 c0 seq1 from the ganaspis hookeri wasp venom', 503, 56873.1272000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.205728+00');
INSERT INTO public.proteins VALUES (96, 'Gh_comp3695_c0_seq1', 'Gh comp3695 c0 seq1 from the ganaspis hookeri wasp venom', 159, 18700.0047, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.25522+00');
INSERT INTO public.proteins VALUES (97, 'Gh_comp3727_c1_seq2', 'Gh comp3727 c1 seq2 from the ganaspis hookeri wasp venom', 614, 69764.8988000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.34626+00');
INSERT INTO public.proteins VALUES (98, 'Gh_comp391_c0_seq2', 'Gh comp391 c0 seq2 from the ganaspis hookeri wasp venom', 362, 39539.4591, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.409034+00');
INSERT INTO public.proteins VALUES (99, 'Gh_comp392_c0_seq1', 'Gh comp392 c0 seq1 from the ganaspis hookeri wasp venom', 195, 21651.5057, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.51471+00');
INSERT INTO public.proteins VALUES (100, 'Gh_comp393_c0_seq1', 'Gh comp393 c0 seq1 from the ganaspis hookeri wasp venom', 514, 55028.4775000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.602101+00');
INSERT INTO public.proteins VALUES (101, 'Gh_comp391_c0_seq1', 'Gh comp391 c0 seq1 from the ganaspis hookeri wasp venom', 362, 39539.4591, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.670179+00');
INSERT INTO public.proteins VALUES (102, 'Gh_comp4155_c0_seq1', 'Gh comp4155 c0 seq1 from the ganaspis hookeri wasp venom', 404, 46495.007, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.74365+00');
INSERT INTO public.proteins VALUES (103, 'Gh_comp427_c0_seq1', 'Gh comp427 c0 seq1 from the ganaspis hookeri wasp venom', 156, 17633.2052, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.792921+00');
INSERT INTO public.proteins VALUES (104, 'Gh_comp417_c0_seq1', 'Gh comp417 c0 seq1 from the ganaspis hookeri wasp venom', 154, 17700.4914, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.841922+00');
INSERT INTO public.proteins VALUES (105, 'Gh_comp438_c0_seq1', 'Gh comp438 c0 seq1 from the ganaspis hookeri wasp venom', 151, 15453.0756, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:35.890027+00');
INSERT INTO public.proteins VALUES (106, 'Gh_comp448_c0_seq1', 'Gh comp448 c0 seq1 from the ganaspis hookeri wasp venom', 548, 59398.8809000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.032779+00');
INSERT INTO public.proteins VALUES (107, 'Gh_comp451_c0_seq1', 'Gh comp451 c0 seq1 from the ganaspis hookeri wasp venom', 95, 11250.5092, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.078592+00');
INSERT INTO public.proteins VALUES (108, 'Gh_comp4554_c0_seq1', 'Gh comp4554 c0 seq1 from the ganaspis hookeri wasp venom', 877, 102773.486100001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.200044+00');
INSERT INTO public.proteins VALUES (109, 'Gh_comp4656_c0_seq11', 'Gh comp4656 c0 seq11 from the ganaspis hookeri wasp venom', 183, 21230.8083, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.255504+00');
INSERT INTO public.proteins VALUES (110, 'Gh_comp4656_c0_seq5', 'Gh comp4656 c0 seq5 from the ganaspis hookeri wasp venom', 298, 34540.4166, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.322659+00');
INSERT INTO public.proteins VALUES (111, 'Gh_comp4656_c0_seq2', 'Gh comp4656 c0 seq2 from the ganaspis hookeri wasp venom', 330, 38683.2105, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.38484+00');
INSERT INTO public.proteins VALUES (112, 'Gh_comp482_c0_seq1', 'Gh comp482 c0 seq1 from the ganaspis hookeri wasp venom', 148, 16831.9205, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.434801+00');
INSERT INTO public.proteins VALUES (113, 'Gh_comp486_c0_seq1', 'Gh comp486 c0 seq1 from the ganaspis hookeri wasp venom', 96, 10458.7993, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.534198+00');
INSERT INTO public.proteins VALUES (114, 'Gh_comp488_c0_seq2', 'Gh comp488 c0 seq2 from the ganaspis hookeri wasp venom', 365, 39493.6265000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.609617+00');
INSERT INTO public.proteins VALUES (115, 'Gh_comp492_c0_seq1', 'Gh comp492 c0 seq1 from the ganaspis hookeri wasp venom', 656, 72482.1998000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.706988+00');
INSERT INTO public.proteins VALUES (116, 'Gh_comp498_c0_seq1', 'Gh comp498 c0 seq1 from the ganaspis hookeri wasp venom', 396, 44493.0612, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.772865+00');
INSERT INTO public.proteins VALUES (117, 'Gh_comp506_c0_seq2', 'Gh comp506 c0 seq2 from the ganaspis hookeri wasp venom', 182, 20717.5394, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.820011+00');
INSERT INTO public.proteins VALUES (118, 'Gh_comp5109_c0_seq1', 'Gh comp5109 c0 seq1 from the ganaspis hookeri wasp venom', 248, 28759.8387, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.876785+00');
INSERT INTO public.proteins VALUES (119, 'Gh_comp512_c0_seq1', 'Gh comp512 c0 seq1 from the ganaspis hookeri wasp venom', 220, 24933.0199, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:36.985895+00');
INSERT INTO public.proteins VALUES (120, 'Gh_comp517_c0_seq1', 'Gh comp517 c0 seq1 from the ganaspis hookeri wasp venom', 287, 33462.601, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.05744+00');
INSERT INTO public.proteins VALUES (121, 'Gh_comp549_c0_seq1', 'Gh comp549 c0 seq1 from the ganaspis hookeri wasp venom', 200, 22705.546, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.110887+00');
INSERT INTO public.proteins VALUES (122, 'Gh_comp526_c0_seq1', 'Gh comp526 c0 seq1 from the ganaspis hookeri wasp venom', 184, 20536.309, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.165284+00');
INSERT INTO public.proteins VALUES (123, 'Gh_comp595_c0_seq1', 'Gh comp595 c0 seq1 from the ganaspis hookeri wasp venom', 463, 51436.9183, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.244384+00');
INSERT INTO public.proteins VALUES (124, 'Gh_comp59_c0_seq1', 'Gh comp59 c0 seq1 from the ganaspis hookeri wasp venom', 461, 50288.5037, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.315597+00');
INSERT INTO public.proteins VALUES (125, 'Gh_comp6061_c0_seq1', 'Gh comp6061 c0 seq1 from the ganaspis hookeri wasp venom', 410, 46215.4034, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.438057+00');
INSERT INTO public.proteins VALUES (126, 'Gh_comp572_c0_seq1', 'Gh comp572 c0 seq1 from the ganaspis hookeri wasp venom', 802, 88970.4010000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.553775+00');
INSERT INTO public.proteins VALUES (127, 'Gh_comp6082_c0_seq1', 'Gh comp6082 c0 seq1 from the ganaspis hookeri wasp venom', 281, 32168.7536, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.610076+00');
INSERT INTO public.proteins VALUES (128, 'Gh_comp615_c0_seq1', 'Gh comp615 c0 seq1 from the ganaspis hookeri wasp venom', 201, 23541.9493, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.666542+00');
INSERT INTO public.proteins VALUES (129, 'Gh_comp630_c0_seq1', 'Gh comp630 c0 seq1 from the ganaspis hookeri wasp venom', 151, 16996.1706, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.718785+00');
INSERT INTO public.proteins VALUES (130, 'Gh_comp636_c0_seq2', 'Gh comp636 c0 seq2 from the ganaspis hookeri wasp venom', 166, 18944.0035, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.769968+00');
INSERT INTO public.proteins VALUES (131, 'Gh_comp636_c0_seq1', 'Gh comp636 c0 seq1 from the ganaspis hookeri wasp venom', 278, 31755.4394, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.834106+00');
INSERT INTO public.proteins VALUES (132, 'Gh_comp653_c0_seq1', 'Gh comp653 c0 seq1 from the ganaspis hookeri wasp venom', 131, 14715.7324, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.876712+00');
INSERT INTO public.proteins VALUES (133, 'Gh_comp6627_c0_seq1', 'Gh comp6627 c0 seq1 from the ganaspis hookeri wasp venom', 174, 20015.0167, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:37.936282+00');
INSERT INTO public.proteins VALUES (134, 'Gh_comp668_c0_seq1', 'Gh comp668 c0 seq1 from the ganaspis hookeri wasp venom', 466, 53509.9538000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.086049+00');
INSERT INTO public.proteins VALUES (135, 'Gh_comp6860_c0_seq1', 'Gh comp6860 c0 seq1 from the ganaspis hookeri wasp venom', 115, 13037.9236, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.13548+00');
INSERT INTO public.proteins VALUES (136, 'Gh_comp6889_c0_seq1', 'Gh comp6889 c0 seq1 from the ganaspis hookeri wasp venom', 309, 36661.6557, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.20626+00');
INSERT INTO public.proteins VALUES (137, 'Gh_comp670_c0_seq1', 'Gh comp670 c0 seq1 from the ganaspis hookeri wasp venom', 126, 13685.5042, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.251708+00');
INSERT INTO public.proteins VALUES (138, 'Gh_comp692_c0_seq1', 'Gh comp692 c0 seq1 from the ganaspis hookeri wasp venom', 298, 32122.2635, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.322495+00');
INSERT INTO public.proteins VALUES (139, 'Gh_comp716_c0_seq2', 'Gh comp716 c0 seq2 from the ganaspis hookeri wasp venom', 227, 25837.4451, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.380858+00');
INSERT INTO public.proteins VALUES (140, 'Gh_comp725_c0_seq1', 'Gh comp725 c0 seq1 from the ganaspis hookeri wasp venom', 434, 47080.0777, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.456212+00');
INSERT INTO public.proteins VALUES (141, 'Gh_comp754_c0_seq1', 'Gh comp754 c0 seq1 from the ganaspis hookeri wasp venom', 571, 65698.8722000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.597988+00');
INSERT INTO public.proteins VALUES (142, 'Gh_comp72_c1_seq1', 'Gh comp72 c1 seq1 from the ganaspis hookeri wasp venom', 450, 49979.9815000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.682475+00');
INSERT INTO public.proteins VALUES (143, 'Gh_comp755_c0_seq1', 'Gh comp755 c0 seq1 from the ganaspis hookeri wasp venom', 355, 39780.749, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:38.753816+00');
INSERT INTO public.proteins VALUES (144, 'Gh_comp757_c0_seq1', 'Gh comp757 c0 seq1 from the ganaspis hookeri wasp venom', 1943, 217196.6561, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.027954+00');
INSERT INTO public.proteins VALUES (145, 'Gh_comp714_c0_seq1', 'Gh comp714 c0 seq1 from the ganaspis hookeri wasp venom', 184, 21089.2995, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.080755+00');
INSERT INTO public.proteins VALUES (146, 'Gh_comp763_c0_seq3', 'Gh comp763 c0 seq3 from the ganaspis hookeri wasp venom', 212, 25371.9569, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.136122+00');
INSERT INTO public.proteins VALUES (147, 'Gh_comp794_c0_seq1', 'Gh comp794 c0 seq1 from the ganaspis hookeri wasp venom', 496, 56271.3549000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.222719+00');
INSERT INTO public.proteins VALUES (148, 'Gh_comp829_c0_seq1', 'Gh comp829 c0 seq1 from the ganaspis hookeri wasp venom', 323, 35744.0975, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.35042+00');
INSERT INTO public.proteins VALUES (149, 'Gh_comp844_c0_seq1', 'Gh comp844 c0 seq1 from the ganaspis hookeri wasp venom', 487, 57314.7177, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.43928+00');
INSERT INTO public.proteins VALUES (150, 'Gh_comp844_c0_seq5', 'Gh comp844 c0 seq5 from the ganaspis hookeri wasp venom', 189, 21650.1347, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.490911+00');
INSERT INTO public.proteins VALUES (151, 'Gh_comp844_c0_seq6', 'Gh comp844 c0 seq6 from the ganaspis hookeri wasp venom', 146, 16854.8989, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.542038+00');
INSERT INTO public.proteins VALUES (152, 'Gh_comp844_c0_seq3', 'Gh comp844 c0 seq3 from the ganaspis hookeri wasp venom', 362, 42570.2464, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.613063+00');
INSERT INTO public.proteins VALUES (153, 'Gh_comp845_c0_seq1', 'Gh comp845 c0 seq1 from the ganaspis hookeri wasp venom', 219, 24959.3832, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.668722+00');
INSERT INTO public.proteins VALUES (154, 'Gh_comp8563_c0_seq1', 'Gh comp8563 c0 seq1 from the ganaspis hookeri wasp venom', 419, 48536.81, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.760728+00');
INSERT INTO public.proteins VALUES (155, 'Gh_comp866_c0_seq1', 'Gh comp866 c0 seq1 from the ganaspis hookeri wasp venom', 340, 37329.8627, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.834499+00');
INSERT INTO public.proteins VALUES (156, 'Gh_comp8831_c0_seq1', 'Gh comp8831 c0 seq1 from the ganaspis hookeri wasp venom', 361, 42660.1159, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:39.96153+00');
INSERT INTO public.proteins VALUES (157, 'Gh_comp918_c0_seq1', 'Gh comp918 c0 seq1 from the ganaspis hookeri wasp venom', 153, 17744.4359, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.014504+00');
INSERT INTO public.proteins VALUES (158, 'Gh_comp934_c0_seq1', 'Gh comp934 c0 seq1 from the ganaspis hookeri wasp venom', 93, 10082.5924, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.060313+00');
INSERT INTO public.proteins VALUES (159, 'Gh_comp943_c0_seq1', 'Gh comp943 c0 seq1 from the ganaspis hookeri wasp venom', 186, 19556.3949, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.114569+00');
INSERT INTO public.proteins VALUES (160, 'Gh_comp9352_c0_seq1', 'Gh comp9352 c0 seq1 from the ganaspis hookeri wasp venom', 241, 28038.1042, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.171457+00');
INSERT INTO public.proteins VALUES (161, 'Gh_comp95_c0_seq1', 'Gh comp95 c0 seq1 from the ganaspis hookeri wasp venom', 248, 27626.5209, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.22735+00');
INSERT INTO public.proteins VALUES (162, 'Gh_comp979_c0_seq1', 'Gh comp979 c0 seq1 from the ganaspis hookeri wasp venom', 340, 36087.0952999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.291686+00');
INSERT INTO public.proteins VALUES (163, 'Gh_comp9690_c0_seq1', 'Gh comp9690 c0 seq1 from the ganaspis hookeri wasp venom', 116, 13439.5783, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 1, NULL, '2024-05-22 04:17:40.336174+00');
INSERT INTO public.proteins VALUES (164, 'Lb17_comp10381_c0_seq1', 'Lb17 comp10381 c0 seq1 from the leptopilina boulardi wasp venom', 508, 58744.8325000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.480101+00');
INSERT INTO public.proteins VALUES (165, 'Lb17_comp1020_c0_seq1', 'Lb17 comp1020 c0 seq1 from the leptopilina boulardi wasp venom', 510, 57427.4701000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.565849+00');
INSERT INTO public.proteins VALUES (166, 'Lb17_comp10193_c0_seq4', 'Lb17 comp10193 c0 seq4 from the leptopilina boulardi wasp venom', 301, 34973.2875, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.625806+00');
INSERT INTO public.proteins VALUES (167, 'Lb17_comp10_c0_seq1', 'Lb17 comp10 c0 seq1 from the leptopilina boulardi wasp venom', 450, 49979.9815000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.702824+00');
INSERT INTO public.proteins VALUES (168, 'Lb17_comp11100_c0_seq1', 'Lb17 comp11100 c0 seq1 from the leptopilina boulardi wasp venom', 192, 21259.0402, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.751702+00');
INSERT INTO public.proteins VALUES (169, 'Lb17_comp1132_c0_seq1', 'Lb17 comp1132 c0 seq1 from the leptopilina boulardi wasp venom', 501, 56097.0363000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.915205+00');
INSERT INTO public.proteins VALUES (170, 'Lb17_comp1134_c0_seq10', 'Lb17 comp1134 c0 seq10 from the leptopilina boulardi wasp venom', 188, 21869.5987, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:40.973417+00');
INSERT INTO public.proteins VALUES (171, 'Lb17_comp11956_c0_seq4', 'Lb17 comp11956 c0 seq4 from the leptopilina boulardi wasp venom', 296, 32301.4756, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.040404+00');
INSERT INTO public.proteins VALUES (172, 'Lb17_comp1134_c0_seq2', 'Lb17 comp1134 c0 seq2 from the leptopilina boulardi wasp venom', 1149, 134174.434000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.183638+00');
INSERT INTO public.proteins VALUES (173, 'Lb17_comp1199_c0_seq1', 'Lb17 comp1199 c0 seq1 from the leptopilina boulardi wasp venom', 246, 27306.5082, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.236453+00');
INSERT INTO public.proteins VALUES (174, 'Lb17_comp1222_c0_seq1', 'Lb17 comp1222 c0 seq1 from the leptopilina boulardi wasp venom', 318, 36185.059, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.368234+00');
INSERT INTO public.proteins VALUES (175, 'Lb17_comp12513_c0_seq1', 'Lb17 comp12513 c0 seq1 from the leptopilina boulardi wasp venom', 764, 89614.0162000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.506882+00');
INSERT INTO public.proteins VALUES (176, 'Lb17_comp1218_c0_seq1', 'Lb17 comp1218 c0 seq1 from the leptopilina boulardi wasp venom', 328, 35670.6321, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.571593+00');
INSERT INTO public.proteins VALUES (177, 'Lb17_comp12_c0_seq1', 'Lb17 comp12 c0 seq1 from the leptopilina boulardi wasp venom', 461, 50424.6086000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.646799+00');
INSERT INTO public.proteins VALUES (178, 'Lb17_comp13092_c0_seq1', 'Lb17 comp13092 c0 seq1 from the leptopilina boulardi wasp venom', 395, 46887.7313000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.776666+00');
INSERT INTO public.proteins VALUES (179, 'Lb17_comp134_c0_seq1', 'Lb17 comp134 c0 seq1 from the leptopilina boulardi wasp venom', 175, 19495.3065, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.831672+00');
INSERT INTO public.proteins VALUES (180, 'Lb17_comp1360_c1_seq1', 'Lb17 comp1360 c1 seq1 from the leptopilina boulardi wasp venom', 891, 102866.603100001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:41.95371+00');
INSERT INTO public.proteins VALUES (181, 'Lb17_comp138_c0_seq1', 'Lb17 comp138 c0 seq1 from the leptopilina boulardi wasp venom', 410, 46509.9897, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.032201+00');
INSERT INTO public.proteins VALUES (182, 'Lb17_comp1290_c0_seq1', 'Lb17 comp1290 c0 seq1 from the leptopilina boulardi wasp venom', 788, 85508.4619000005, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.204513+00');
INSERT INTO public.proteins VALUES (183, 'Lb17_comp1404_c0_seq1', 'Lb17 comp1404 c0 seq1 from the leptopilina boulardi wasp venom', 259, 29688.8763, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.263421+00');
INSERT INTO public.proteins VALUES (184, 'Lb17_comp14167_c0_seq1', 'Lb17 comp14167 c0 seq1 from the leptopilina boulardi wasp venom', 853, 97609.7842000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.377965+00');
INSERT INTO public.proteins VALUES (185, 'Lb17_comp1584_c0_seq1', 'Lb17 comp1584 c0 seq1 from the leptopilina boulardi wasp venom', 198, 22112.4755, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.433438+00');
INSERT INTO public.proteins VALUES (186, 'Lb17_comp142_c1_seq1', 'Lb17 comp142 c1 seq1 from the leptopilina boulardi wasp venom', 159, 17861.479, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.487772+00');
INSERT INTO public.proteins VALUES (187, 'Lb17_comp14589_c0_seq1', 'Lb17 comp14589 c0 seq1 from the leptopilina boulardi wasp venom', 126, 14023.4629, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.590431+00');
INSERT INTO public.proteins VALUES (188, 'Lb17_comp159_c0_seq1', 'Lb17 comp159 c0 seq1 from the leptopilina boulardi wasp venom', 157, 17819.3706, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.645864+00');
INSERT INTO public.proteins VALUES (189, 'Lb17_comp1611_c0_seq1', 'Lb17 comp1611 c0 seq1 from the leptopilina boulardi wasp venom', 372, 41827.8146000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.722256+00');
INSERT INTO public.proteins VALUES (190, 'Lb17_comp1645_c0_seq14', 'Lb17 comp1645 c0 seq14 from the leptopilina boulardi wasp venom', 362, 40827.4042, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.789458+00');
INSERT INTO public.proteins VALUES (191, 'Lb17_comp16246_c0_seq1', 'Lb17 comp16246 c0 seq1 from the leptopilina boulardi wasp venom', 451, 49836.9480000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.861767+00');
INSERT INTO public.proteins VALUES (192, 'Lb17_comp1645_c0_seq15', 'Lb17 comp1645 c0 seq15 from the leptopilina boulardi wasp venom', 377, 43518.8489999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:42.939223+00');
INSERT INTO public.proteins VALUES (193, 'Lb17_comp1646_c0_seq1', 'Lb17 comp1646 c0 seq1 from the leptopilina boulardi wasp venom', 415, 44327.6771, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.07205+00');
INSERT INTO public.proteins VALUES (194, 'Lb17_comp1689_c0_seq1', 'Lb17 comp1689 c0 seq1 from the leptopilina boulardi wasp venom', 179, 21310.2982, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.133654+00');
INSERT INTO public.proteins VALUES (195, 'Lb17_comp1716_c0_seq1', 'Lb17 comp1716 c0 seq1 from the leptopilina boulardi wasp venom', 126, 15319.9146, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.186465+00');
INSERT INTO public.proteins VALUES (196, 'Lb17_comp1726_c0_seq1', 'Lb17 comp1726 c0 seq1 from the leptopilina boulardi wasp venom', 492, 53428.7405, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.268086+00');
INSERT INTO public.proteins VALUES (197, 'Lb17_comp1750_c0_seq2', 'Lb17 comp1750 c0 seq2 from the leptopilina boulardi wasp venom', 704, 82135.9645000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.366821+00');
INSERT INTO public.proteins VALUES (198, 'Lb17_comp168_c0_seq1', 'Lb17 comp168 c0 seq1 from the leptopilina boulardi wasp venom', 447, 50144.7646000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.495982+00');
INSERT INTO public.proteins VALUES (199, 'Lb17_comp1789_c0_seq11', 'Lb17 comp1789 c0 seq11 from the leptopilina boulardi wasp venom', 249, 29125.2897000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.562281+00');
INSERT INTO public.proteins VALUES (200, 'Lb17_comp1766_c0_seq1', 'Lb17 comp1766 c0 seq1 from the leptopilina boulardi wasp venom', 169, 18961.3635, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.616722+00');
INSERT INTO public.proteins VALUES (201, 'Lb17_comp1789_c0_seq20', 'Lb17 comp1789 c0 seq20 from the leptopilina boulardi wasp venom', 179, 20119.1903, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.67142+00');
INSERT INTO public.proteins VALUES (202, 'Lb17_comp1789_c0_seq4', 'Lb17 comp1789 c0 seq4 from the leptopilina boulardi wasp venom', 302, 35146.1574, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.738411+00');
INSERT INTO public.proteins VALUES (203, 'Lb17_comp1789_c0_seq21', 'Lb17 comp1789 c0 seq21 from the leptopilina boulardi wasp venom', 147, 17391.8336, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.787208+00');
INSERT INTO public.proteins VALUES (204, 'Lb17_comp1789_c0_seq8', 'Lb17 comp1789 c0 seq8 from the leptopilina boulardi wasp venom', 247, 28581.7813, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.845371+00');
INSERT INTO public.proteins VALUES (205, 'Lb17_comp1789_c0_seq9', 'Lb17 comp1789 c0 seq9 from the leptopilina boulardi wasp venom', 259, 29887.6621, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:43.904467+00');
INSERT INTO public.proteins VALUES (206, 'Lb17_comp1827_c0_seq1', 'Lb17 comp1827 c0 seq1 from the leptopilina boulardi wasp venom', 575, 68706.3254000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.055817+00');
INSERT INTO public.proteins VALUES (207, 'Lb17_comp18429_c0_seq1', 'Lb17 comp18429 c0 seq1 from the leptopilina boulardi wasp venom', 215, 24498.5236, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.114874+00');
INSERT INTO public.proteins VALUES (208, 'Lb17_comp193_c0_seq1', 'Lb17 comp193 c0 seq1 from the leptopilina boulardi wasp venom', 195, 21814.8792, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.174394+00');
INSERT INTO public.proteins VALUES (209, 'Lb17_comp194_c0_seq1', 'Lb17 comp194 c0 seq1 from the leptopilina boulardi wasp venom', 108, 11739.4408, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.218905+00');
INSERT INTO public.proteins VALUES (210, 'Lb17_comp2088_c0_seq1', 'Lb17 comp2088 c0 seq1 from the leptopilina boulardi wasp venom', 323, 35844.0892, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.284726+00');
INSERT INTO public.proteins VALUES (211, 'Lb17_comp2100_c0_seq1', 'Lb17 comp2100 c0 seq1 from the leptopilina boulardi wasp venom', 625, 69252.0412000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.376243+00');
INSERT INTO public.proteins VALUES (212, 'Lb17_comp21628_c0_seq1', 'Lb17 comp21628 c0 seq1 from the leptopilina boulardi wasp venom', 150, 17097.641, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.422953+00');
INSERT INTO public.proteins VALUES (213, 'Lb17_comp209_c0_seq1', 'Lb17 comp209 c0 seq1 from the leptopilina boulardi wasp venom', 463, 51444.9189, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.563465+00');
INSERT INTO public.proteins VALUES (214, 'Lb17_comp219_c0_seq1', 'Lb17 comp219 c0 seq1 from the leptopilina boulardi wasp venom', 148, 16831.9205, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.617625+00');
INSERT INTO public.proteins VALUES (215, 'Lb17_comp2224_c0_seq1', 'Lb17 comp2224 c0 seq1 from the leptopilina boulardi wasp venom', 266, 31262.0665, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.691909+00');
INSERT INTO public.proteins VALUES (216, 'Lb17_comp225_c0_seq1', 'Lb17 comp225 c0 seq1 from the leptopilina boulardi wasp venom', 146, 16626.9645, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.748275+00');
INSERT INTO public.proteins VALUES (217, 'Lb17_comp226_c0_seq1', 'Lb17 comp226 c0 seq1 from the leptopilina boulardi wasp venom', 627, 68055.7245000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.843414+00');
INSERT INTO public.proteins VALUES (218, 'Lb17_comp2347_c0_seq1', 'Lb17 comp2347 c0 seq1 from the leptopilina boulardi wasp venom', 626, 72279.0250000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.932353+00');
INSERT INTO public.proteins VALUES (219, 'Lb17_comp236_c0_seq1', 'Lb17 comp236 c0 seq1 from the leptopilina boulardi wasp venom', 76, 8361.11079999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:44.972656+00');
INSERT INTO public.proteins VALUES (220, 'Lb17_comp233_c0_seq1', 'Lb17 comp233 c0 seq1 from the leptopilina boulardi wasp venom', 265, 30564.0702000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.038411+00');
INSERT INTO public.proteins VALUES (221, 'Lb17_comp242_c2_seq28', 'Lb17 comp242 c2 seq28 from the leptopilina boulardi wasp venom', 90, 10411.83, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.085658+00');
INSERT INTO public.proteins VALUES (222, 'Lb17_comp2506_c0_seq1', 'Lb17 comp2506 c0 seq1 from the leptopilina boulardi wasp venom', 247, 27315.8092, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.203459+00');
INSERT INTO public.proteins VALUES (223, 'Lb17_comp263_c0_seq1', 'Lb17 comp263 c0 seq1 from the leptopilina boulardi wasp venom', 403, 46947.0012000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.282558+00');
INSERT INTO public.proteins VALUES (224, 'Lb17_comp2878_c1_seq1', 'Lb17 comp2878 c1 seq1 from the leptopilina boulardi wasp venom', 196, 22499.6754, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.33442+00');
INSERT INTO public.proteins VALUES (225, 'Lb17_comp3099_c0_seq1', 'Lb17 comp3099 c0 seq1 from the leptopilina boulardi wasp venom', 220, 24976.1274, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.39464+00');
INSERT INTO public.proteins VALUES (226, 'Lb17_comp2430_c0_seq1', 'Lb17 comp2430 c0 seq1 from the leptopilina boulardi wasp venom', 382, 45561.9547000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.471187+00');
INSERT INTO public.proteins VALUES (227, 'Lb17_comp3196_c0_seq1', 'Lb17 comp3196 c0 seq1 from the leptopilina boulardi wasp venom', 302, 34893.7604000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.533128+00');
INSERT INTO public.proteins VALUES (228, 'Lb17_comp31_c0_seq1', 'Lb17 comp31 c0 seq1 from the leptopilina boulardi wasp venom', 247, 28118.1746, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.588572+00');
INSERT INTO public.proteins VALUES (229, 'Lb17_comp3296_c0_seq1', 'Lb17 comp3296 c0 seq1 from the leptopilina boulardi wasp venom', 379, 43323.9079000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.719987+00');
INSERT INTO public.proteins VALUES (230, 'Lb17_comp337_c0_seq13', 'Lb17 comp337 c0 seq13 from the leptopilina boulardi wasp venom', 1954, 223196.347900001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:45.994254+00');
INSERT INTO public.proteins VALUES (231, 'Lb17_comp3389_c0_seq1', 'Lb17 comp3389 c0 seq1 from the leptopilina boulardi wasp venom', 56, 6309.2874, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.037622+00');
INSERT INTO public.proteins VALUES (232, 'Lb17_comp338_c0_seq1', 'Lb17 comp338 c0 seq1 from the leptopilina boulardi wasp venom', 151, 15511.1547, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.087943+00');
INSERT INTO public.proteins VALUES (233, 'Lb17_comp33_c1_seq1', 'Lb17 comp33 c1 seq1 from the leptopilina boulardi wasp venom', 376, 41821.3924, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.159199+00');
INSERT INTO public.proteins VALUES (234, 'Lb17_comp348_c0_seq1', 'Lb17 comp348 c0 seq1 from the leptopilina boulardi wasp venom', 184, 20906.554, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.211894+00');
INSERT INTO public.proteins VALUES (235, 'Lb17_comp3568_c0_seq1', 'Lb17 comp3568 c0 seq1 from the leptopilina boulardi wasp venom', 239, 27019.9768, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.275214+00');
INSERT INTO public.proteins VALUES (236, 'Lb17_comp3592_c0_seq1', 'Lb17 comp3592 c0 seq1 from the leptopilina boulardi wasp venom', 351, 39175.8222, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.381567+00');
INSERT INTO public.proteins VALUES (237, 'Lb17_comp3632_c0_seq1', 'Lb17 comp3632 c0 seq1 from the leptopilina boulardi wasp venom', 260, 29344.1386, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.455129+00');
INSERT INTO public.proteins VALUES (238, 'Lb17_comp3680_c0_seq1', 'Lb17 comp3680 c0 seq1 from the leptopilina boulardi wasp venom', 198, 22987.6521, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.515075+00');
INSERT INTO public.proteins VALUES (239, 'Lb17_comp3680_c0_seq22', 'Lb17 comp3680 c0 seq22 from the leptopilina boulardi wasp venom', 45, 5172.9481, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.557412+00');
INSERT INTO public.proteins VALUES (240, 'Lb17_comp379_c1_seq4', 'Lb17 comp379 c1 seq4 from the leptopilina boulardi wasp venom', 169, 20510.8385, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.61896+00');
INSERT INTO public.proteins VALUES (241, 'Lb17_comp4081_c0_seq3', 'Lb17 comp4081 c0 seq3 from the leptopilina boulardi wasp venom', 61, 7288.1692, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.658504+00');
INSERT INTO public.proteins VALUES (242, 'Lb17_comp4051_c0_seq1', 'Lb17 comp4051 c0 seq1 from the leptopilina boulardi wasp venom', 246, 28595.0067, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.798694+00');
INSERT INTO public.proteins VALUES (243, 'Lb17_comp413_c1_seq2', 'Lb17 comp413 c1 seq2 from the leptopilina boulardi wasp venom', 365, 39636.8531000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.871299+00');
INSERT INTO public.proteins VALUES (244, 'Lb17_comp4025_c0_seq1', 'Lb17 comp4025 c0 seq1 from the leptopilina boulardi wasp venom', 307, 35562.9875, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.935075+00');
INSERT INTO public.proteins VALUES (245, 'Lb17_comp426_c1_seq1', 'Lb17 comp426 c1 seq1 from the leptopilina boulardi wasp venom', 100, 11972.5579, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:46.97932+00');
INSERT INTO public.proteins VALUES (246, 'Lb17_comp428_c0_seq1', 'Lb17 comp428 c0 seq1 from the leptopilina boulardi wasp venom', 501, 55034.0819, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.065933+00');
INSERT INTO public.proteins VALUES (247, 'Lb17_comp4291_c0_seq1', 'Lb17 comp4291 c0 seq1 from the leptopilina boulardi wasp venom', 1351, 156984.931500001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.279909+00');
INSERT INTO public.proteins VALUES (248, 'Lb17_comp4291_c0_seq2', 'Lb17 comp4291 c0 seq2 from the leptopilina boulardi wasp venom', 1295, 150191.293700001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.4364+00');
INSERT INTO public.proteins VALUES (249, 'Lb17_comp431_c0_seq1', 'Lb17 comp431 c0 seq1 from the leptopilina boulardi wasp venom', 520, 56012.7863000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.584628+00');
INSERT INTO public.proteins VALUES (250, 'Lb17_comp433_c0_seq1', 'Lb17 comp433 c0 seq1 from the leptopilina boulardi wasp venom', 282, 32190.3932000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.650289+00');
INSERT INTO public.proteins VALUES (251, 'Lb17_comp435_c0_seq1', 'Lb17 comp435 c0 seq1 from the leptopilina boulardi wasp venom', 439, 49425.5022, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.727113+00');
INSERT INTO public.proteins VALUES (252, 'Lb17_comp4434_c0_seq1', 'Lb17 comp4434 c0 seq1 from the leptopilina boulardi wasp venom', 617, 70675.8921000003, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.816088+00');
INSERT INTO public.proteins VALUES (253, 'Lb17_comp4434_c0_seq2', 'Lb17 comp4434 c0 seq2 from the leptopilina boulardi wasp venom', 531, 62104.5283000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:47.992156+00');
INSERT INTO public.proteins VALUES (254, 'Lb17_comp464_c0_seq1', 'Lb17 comp464 c0 seq1 from the leptopilina boulardi wasp venom', 434, 47062.1055, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.071766+00');
INSERT INTO public.proteins VALUES (255, 'Lb17_comp450_c0_seq3', 'Lb17 comp450 c0 seq3 from the leptopilina boulardi wasp venom', 444, 48747.638, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.148154+00');
INSERT INTO public.proteins VALUES (256, 'Lb17_comp471_c0_seq1', 'Lb17 comp471 c0 seq1 from the leptopilina boulardi wasp venom', 340, 36132.1789999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.211761+00');
INSERT INTO public.proteins VALUES (257, 'Lb17_comp479_c0_seq1', 'Lb17 comp479 c0 seq1 from the leptopilina boulardi wasp venom', 127, 14164.1529, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.255303+00');
INSERT INTO public.proteins VALUES (258, 'Lb17_comp483_c0_seq1', 'Lb17 comp483 c0 seq1 from the leptopilina boulardi wasp venom', 164, 19072.6226, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.307506+00');
INSERT INTO public.proteins VALUES (259, 'Lb17_comp508_c0_seq1', 'Lb17 comp508 c0 seq1 from the leptopilina boulardi wasp venom', 185, 20746.4741, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.361472+00');
INSERT INTO public.proteins VALUES (260, 'Lb17_comp516_c0_seq1', 'Lb17 comp516 c0 seq1 from the leptopilina boulardi wasp venom', 274, 31218.4686000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.483836+00');
INSERT INTO public.proteins VALUES (261, 'Lb17_comp500_c0_seq1', 'Lb17 comp500 c0 seq1 from the leptopilina boulardi wasp venom', 355, 39789.693, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.557407+00');
INSERT INTO public.proteins VALUES (262, 'Lb17_comp535_c2_seq1', 'Lb17 comp535 c2 seq1 from the leptopilina boulardi wasp venom', 203, 23429.5861, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.614262+00');
INSERT INTO public.proteins VALUES (263, 'Lb17_comp552_c0_seq2', 'Lb17 comp552 c0 seq2 from the leptopilina boulardi wasp venom', 397, 44630.5595000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.694133+00');
INSERT INTO public.proteins VALUES (264, 'Lb17_comp5779_c0_seq1', 'Lb17 comp5779 c0 seq1 from the leptopilina boulardi wasp venom', 275, 31780.8610000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.757017+00');
INSERT INTO public.proteins VALUES (265, 'Lb17_comp617_c0_seq1', 'Lb17 comp617 c0 seq1 from the leptopilina boulardi wasp venom', 217, 24649.7604, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.811947+00');
INSERT INTO public.proteins VALUES (266, 'Lb17_comp626_c0_seq1', 'Lb17 comp626 c0 seq1 from the leptopilina boulardi wasp venom', 358, 39708.0621, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:48.880146+00');
INSERT INTO public.proteins VALUES (267, 'Lb17_comp6415_c0_seq1', 'Lb17 comp6415 c0 seq1 from the leptopilina boulardi wasp venom', 311, 35063.7079, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.000348+00');
INSERT INTO public.proteins VALUES (268, 'Lb17_comp692_c0_seq1', 'Lb17 comp692 c0 seq1 from the leptopilina boulardi wasp venom', 489, 55446.5263, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.088279+00');
INSERT INTO public.proteins VALUES (269, 'Lb17_comp6993_c0_seq1', 'Lb17 comp6993 c0 seq1 from the leptopilina boulardi wasp venom', 149, 16884.1095, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.133419+00');
INSERT INTO public.proteins VALUES (270, 'Lb17_comp786_c0_seq3', 'Lb17 comp786 c0 seq3 from the leptopilina boulardi wasp venom', 67, 7284.9212, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.172609+00');
INSERT INTO public.proteins VALUES (271, 'Lb17_comp6910_c0_seq1', 'Lb17 comp6910 c0 seq1 from the leptopilina boulardi wasp venom', 445, 52464.0519, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.253036+00');
INSERT INTO public.proteins VALUES (272, 'Lb17_comp7_c0_seq1', 'Lb17 comp7 c0 seq1 from the leptopilina boulardi wasp venom', 657, 71687.3055000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.345727+00');
INSERT INTO public.proteins VALUES (273, 'Lb17_comp817_c0_seq1', 'Lb17 comp817 c0 seq1 from the leptopilina boulardi wasp venom', 318, 36245.2833, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.468354+00');
INSERT INTO public.proteins VALUES (274, 'Lb17_comp81_c0_seq1', 'Lb17 comp81 c0 seq1 from the leptopilina boulardi wasp venom', 133, 14456.7117, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.51864+00');
INSERT INTO public.proteins VALUES (275, 'Lb17_comp8251_c0_seq1', 'Lb17 comp8251 c0 seq1 from the leptopilina boulardi wasp venom', 449, 52708.3775, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.5979+00');
INSERT INTO public.proteins VALUES (276, 'Lb17_comp8251_c0_seq4', 'Lb17 comp8251 c0 seq4 from the leptopilina boulardi wasp venom', 553, 65028.1459000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.6824+00');
INSERT INTO public.proteins VALUES (277, 'Lb17_comp6804_c0_seq1', 'Lb17 comp6804 c0 seq1 from the leptopilina boulardi wasp venom', 488, 57357.4357, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.76352+00');
INSERT INTO public.proteins VALUES (278, 'Lb17_comp90_c0_seq1', 'Lb17 comp90 c0 seq1 from the leptopilina boulardi wasp venom', 334, 35635.3066, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:49.880291+00');
INSERT INTO public.proteins VALUES (279, 'Lb17_comp9004_c0_seq1', 'Lb17 comp9004 c0 seq1 from the leptopilina boulardi wasp venom', 1157, 135270.991700001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.03177+00');
INSERT INTO public.proteins VALUES (280, 'Lb17_comp8713_c0_seq1', 'Lb17 comp8713 c0 seq1 from the leptopilina boulardi wasp venom', 735, 86703.7511000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.190434+00');
INSERT INTO public.proteins VALUES (281, 'Lb17_comp937_c0_seq1', 'Lb17 comp937 c0 seq1 from the leptopilina boulardi wasp venom', 173, 18247.5339, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.24505+00');
INSERT INTO public.proteins VALUES (282, 'Lb17_comp9461_c0_seq1', 'Lb17 comp9461 c0 seq1 from the leptopilina boulardi wasp venom', 95, 10578.1546, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.294651+00');
INSERT INTO public.proteins VALUES (283, 'Lb17_comp9525_c0_seq1', 'Lb17 comp9525 c0 seq1 from the leptopilina boulardi wasp venom', 748, 87594.4068000005, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.401008+00');
INSERT INTO public.proteins VALUES (284, 'Lb17_comp953_c0_seq1', 'Lb17 comp953 c0 seq1 from the leptopilina boulardi wasp venom', 222, 25385.0447, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.457997+00');
INSERT INTO public.proteins VALUES (285, 'Lb17_comp9544_c0_seq1', 'Lb17 comp9544 c0 seq1 from the leptopilina boulardi wasp venom', 379, 43883.0496, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.531628+00');
INSERT INTO public.proteins VALUES (286, 'Lb17_comp96_c0_seq1', 'Lb17 comp96 c0 seq1 from the leptopilina boulardi wasp venom', 164, 18028.3818, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.580674+00');
INSERT INTO public.proteins VALUES (287, 'Lb17_comp9759_c1_seq1', 'Lb17 comp9759 c1 seq1 from the leptopilina boulardi wasp venom', 710, 85061.7592000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.76155+00');
INSERT INTO public.proteins VALUES (288, 'Lb17_comp9947_c0_seq1', 'Lb17 comp9947 c0 seq1 from the leptopilina boulardi wasp venom', 1189, 140275.520700001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:50.912002+00');
INSERT INTO public.proteins VALUES (289, 'Lh14_comp1024_c0_seq1', 'Lh14 comp1024 c0 seq1 from the leptopilina heterotoma wasp venom', 377, 40313.2183, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.036328+00');
INSERT INTO public.proteins VALUES (290, 'Lh14_comp1040_c0_seq26', 'Lh14 comp1040 c0 seq26 from the leptopilina heterotoma wasp venom', 696, 81948.8390000003, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.143509+00');
INSERT INTO public.proteins VALUES (291, 'Lh14_comp1062_c0_seq1', 'Lh14 comp1062 c0 seq1 from the leptopilina heterotoma wasp venom', 894, 101176.472000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.257759+00');
INSERT INTO public.proteins VALUES (292, 'Lb17_comp9759_c1_seq4', 'Lb17 comp9759 c1 seq4 from the leptopilina boulardi wasp venom', 706, 84144.7469000003, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 2, NULL, '2024-05-22 04:17:51.416435+00');
INSERT INTO public.proteins VALUES (293, 'Lh14_comp10736_c0_seq1', 'Lh14 comp10736 c0 seq1 from the leptopilina heterotoma wasp venom', 306, 35959.236, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.484944+00');
INSERT INTO public.proteins VALUES (294, 'Lh14_comp1078_c0_seq1', 'Lh14 comp1078 c0 seq1 from the leptopilina heterotoma wasp venom', 298, 29709.8071, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.547076+00');
INSERT INTO public.proteins VALUES (295, 'Lh14_comp107_c0_seq1', 'Lh14 comp107 c0 seq1 from the leptopilina heterotoma wasp venom', 844, 94829.2794000005, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.657347+00');
INSERT INTO public.proteins VALUES (296, 'Lh14_comp1098_c0_seq2', 'Lh14 comp1098 c0 seq2 from the leptopilina heterotoma wasp venom', 471, 53383.2055000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.792764+00');
INSERT INTO public.proteins VALUES (297, 'Lh14_comp1100_c0_seq1', 'Lh14 comp1100 c0 seq1 from the leptopilina heterotoma wasp venom', 788, 85311.1693000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:51.900919+00');
INSERT INTO public.proteins VALUES (298, 'Lh14_comp1191_c0_seq1', 'Lh14 comp1191 c0 seq1 from the leptopilina heterotoma wasp venom', 844, 97465.0181000006, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.015818+00');
INSERT INTO public.proteins VALUES (299, 'Lh14_comp1253_c0_seq1', 'Lh14 comp1253 c0 seq1 from the leptopilina heterotoma wasp venom', 166, 18738.39, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.066992+00');
INSERT INTO public.proteins VALUES (300, 'Lh14_comp12467_c0_seq3', 'Lh14 comp12467 c0 seq3 from the leptopilina heterotoma wasp venom', 422, 46621.9625000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.204792+00');
INSERT INTO public.proteins VALUES (301, 'Lh14_comp1266_c0_seq1', 'Lh14 comp1266 c0 seq1 from the leptopilina heterotoma wasp venom', 508, 54067.5816, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.290511+00');
INSERT INTO public.proteins VALUES (302, 'Lh14_comp1269_c0_seq1', 'Lh14 comp1269 c0 seq1 from the leptopilina heterotoma wasp venom', 550, 62040.0486000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.372446+00');
INSERT INTO public.proteins VALUES (303, 'Lh14_comp128_c2_seq1', 'Lh14 comp128 c2 seq1 from the leptopilina heterotoma wasp venom', 376, 41770.3272, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.443882+00');
INSERT INTO public.proteins VALUES (304, 'Lh14_comp128_c2_seq4', 'Lh14 comp128 c2 seq4 from the leptopilina heterotoma wasp venom', 375, 41674.2186000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.5082+00');
INSERT INTO public.proteins VALUES (305, 'Lh14_comp131_c0_seq1', 'Lh14 comp131 c0 seq1 from the leptopilina heterotoma wasp venom', 197, 22220.9476, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.653484+00');
INSERT INTO public.proteins VALUES (306, 'Lh14_comp1323_c0_seq2', 'Lh14 comp1323 c0 seq2 from the leptopilina heterotoma wasp venom', 626, 72509.7704000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.770512+00');
INSERT INTO public.proteins VALUES (307, 'Lh14_comp1346_c0_seq1', 'Lh14 comp1346 c0 seq1 from the leptopilina heterotoma wasp venom', 670, 75839.4423000003, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.869536+00');
INSERT INTO public.proteins VALUES (308, 'Lh14_comp1331_c0_seq1', 'Lh14 comp1331 c0 seq1 from the leptopilina heterotoma wasp venom', 209, 23775.0682, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.927612+00');
INSERT INTO public.proteins VALUES (309, 'Lh14_comp137_c2_seq1', 'Lh14 comp137 c2 seq1 from the leptopilina heterotoma wasp venom', 163, 18896.4872, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:52.98446+00');
INSERT INTO public.proteins VALUES (310, 'Lh14_comp1380_c0_seq1', 'Lh14 comp1380 c0 seq1 from the leptopilina heterotoma wasp venom', 71, 7908.8582, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.028349+00');
INSERT INTO public.proteins VALUES (311, 'Lh14_comp138_c0_seq1', 'Lh14 comp138 c0 seq1 from the leptopilina heterotoma wasp venom', 161, 17723.9143, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.080457+00');
INSERT INTO public.proteins VALUES (312, 'Lh14_comp141_c1_seq1', 'Lh14 comp141 c1 seq1 from the leptopilina heterotoma wasp venom', 447, 50130.7380000002, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.223856+00');
INSERT INTO public.proteins VALUES (313, 'Lh14_comp1437_c0_seq1', 'Lh14 comp1437 c0 seq1 from the leptopilina heterotoma wasp venom', 501, 57446.0507, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.310723+00');
INSERT INTO public.proteins VALUES (314, 'Lh14_comp1442_c0_seq1', 'Lh14 comp1442 c0 seq1 from the leptopilina heterotoma wasp venom', 388, 44628.9878, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.377429+00');
INSERT INTO public.proteins VALUES (315, 'Lh14_comp1442_c0_seq2', 'Lh14 comp1442 c0 seq2 from the leptopilina heterotoma wasp venom', 256, 29701.1764, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.43756+00');
INSERT INTO public.proteins VALUES (316, 'Lh14_comp144_c0_seq1', 'Lh14 comp144 c0 seq1 from the leptopilina heterotoma wasp venom', 164, 17852.0789, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.488679+00');
INSERT INTO public.proteins VALUES (317, 'Lh14_comp1495_c0_seq1', 'Lh14 comp1495 c0 seq1 from the leptopilina heterotoma wasp venom', 694, 78017.7843000004, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.645139+00');
INSERT INTO public.proteins VALUES (318, 'Lh14_comp1525_c0_seq1', 'Lh14 comp1525 c0 seq1 from the leptopilina heterotoma wasp venom', 500, 56871.8666, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.732889+00');
INSERT INTO public.proteins VALUES (319, 'Lh14_comp155_c0_seq1', 'Lh14 comp155 c0 seq1 from the leptopilina heterotoma wasp venom', 320, 36414.0224000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.797198+00');
INSERT INTO public.proteins VALUES (320, 'Lh14_comp150_c0_seq1', 'Lh14 comp150 c0 seq1 from the leptopilina heterotoma wasp venom', 259, 29649.9094, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.854059+00');
INSERT INTO public.proteins VALUES (321, 'Lh14_comp155_c0_seq3', 'Lh14 comp155 c0 seq3 from the leptopilina heterotoma wasp venom', 284, 32242.6041, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.910805+00');
INSERT INTO public.proteins VALUES (322, 'Lh14_comp155_c0_seq4', 'Lh14 comp155 c0 seq4 from the leptopilina heterotoma wasp venom', 71, 8180.4607, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:53.95114+00');
INSERT INTO public.proteins VALUES (323, 'Lh14_comp1564_c0_seq1', 'Lh14 comp1564 c0 seq1 from the leptopilina heterotoma wasp venom', 219, 24328.7318, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.010253+00');
INSERT INTO public.proteins VALUES (324, 'Lh14_comp15705_c0_seq1', 'Lh14 comp15705 c0 seq1 from the leptopilina heterotoma wasp venom', 120, 14037.8569, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.059754+00');
INSERT INTO public.proteins VALUES (325, 'Lh14_comp1578_c0_seq3', 'Lh14 comp1578 c0 seq3 from the leptopilina heterotoma wasp venom', 428, 49322.2491, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.19812+00');
INSERT INTO public.proteins VALUES (326, 'Lh14_comp1602_c1_seq12', 'Lh14 comp1602 c1 seq12 from the leptopilina heterotoma wasp venom', 149, 17614.3854, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.25186+00');
INSERT INTO public.proteins VALUES (327, 'Lh14_comp1621_c0_seq1', 'Lh14 comp1621 c0 seq1 from the leptopilina heterotoma wasp venom', 114, 13570.4765, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.299655+00');
INSERT INTO public.proteins VALUES (328, 'Lh14_comp1630_c0_seq4', 'Lh14 comp1630 c0 seq4 from the leptopilina heterotoma wasp venom', 514, 59369.8781000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.384968+00');
INSERT INTO public.proteins VALUES (329, 'Lh14_comp1630_c0_seq5', 'Lh14 comp1630 c0 seq5 from the leptopilina heterotoma wasp venom', 434, 50233.1528, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.460505+00');
INSERT INTO public.proteins VALUES (330, 'Lh14_comp1605_c0_seq1', 'Lh14 comp1605 c0 seq1 from the leptopilina heterotoma wasp venom', 1954, 223415.410900001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.764046+00');
INSERT INTO public.proteins VALUES (331, 'Lh14_comp1635_c0_seq1', 'Lh14 comp1635 c0 seq1 from the leptopilina heterotoma wasp venom', 492, 56351.8892, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.854327+00');
INSERT INTO public.proteins VALUES (332, 'Lh14_comp167_c0_seq1', 'Lh14 comp167 c0 seq1 from the leptopilina heterotoma wasp venom', 99, 11100.8305, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.899537+00');
INSERT INTO public.proteins VALUES (333, 'Lh14_comp1721_c2_seq1', 'Lh14 comp1721 c2 seq1 from the leptopilina heterotoma wasp venom', 93, 10112.6184, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:54.943146+00');
INSERT INTO public.proteins VALUES (334, 'Lh14_comp1728_c0_seq3', 'Lh14 comp1728 c0 seq3 from the leptopilina heterotoma wasp venom', 419, 49656.3596, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.08923+00');
INSERT INTO public.proteins VALUES (335, 'Lh14_comp1758_c1_seq3', 'Lh14 comp1758 c1 seq3 from the leptopilina heterotoma wasp venom', 262, 29869.7722, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.152718+00');
INSERT INTO public.proteins VALUES (336, 'Lh14_comp1779_c0_seq1', 'Lh14 comp1779 c0 seq1 from the leptopilina heterotoma wasp venom', 315, 35702.5321, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.215929+00');
INSERT INTO public.proteins VALUES (337, 'Lh14_comp178_c0_seq3', 'Lh14 comp178 c0 seq3 from the leptopilina heterotoma wasp venom', 247, 26541.4687, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.270949+00');
INSERT INTO public.proteins VALUES (338, 'Lh14_comp1824_c0_seq1', 'Lh14 comp1824 c0 seq1 from the leptopilina heterotoma wasp venom', 355, 39777.6392, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.338166+00');
INSERT INTO public.proteins VALUES (339, 'Lh14_comp1887_c0_seq1', 'Lh14 comp1887 c0 seq1 from the leptopilina heterotoma wasp venom', 457, 52781.0742, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.41632+00');
INSERT INTO public.proteins VALUES (340, 'Lh14_comp18_c0_seq1', 'Lh14 comp18 c0 seq1 from the leptopilina heterotoma wasp venom', 368, 40415.3094, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.542773+00');
INSERT INTO public.proteins VALUES (341, 'Lh14_comp191_c0_seq1', 'Lh14 comp191 c0 seq1 from the leptopilina heterotoma wasp venom', 195, 21820.7976, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.600801+00');
INSERT INTO public.proteins VALUES (342, 'Lh14_comp2023_c0_seq2', 'Lh14 comp2023 c0 seq2 from the leptopilina heterotoma wasp venom', 224, 26320.8041, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.66144+00');
INSERT INTO public.proteins VALUES (343, 'Lh14_comp202_c0_seq1', 'Lh14 comp202 c0 seq1 from the leptopilina heterotoma wasp venom', 81, 9233.72209999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.705263+00');
INSERT INTO public.proteins VALUES (344, 'Lh14_comp1995_c0_seq1', 'Lh14 comp1995 c0 seq1 from the leptopilina heterotoma wasp venom', 219, 23807.2382, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.762074+00');
INSERT INTO public.proteins VALUES (345, 'Lh14_comp2068_c0_seq1', 'Lh14 comp2068 c0 seq1 from the leptopilina heterotoma wasp venom', 160, 18250.768, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.812964+00');
INSERT INTO public.proteins VALUES (346, 'Lh14_comp2120_c1_seq1', 'Lh14 comp2120 c1 seq1 from the leptopilina heterotoma wasp venom', 339, 38220.3534, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.87784+00');
INSERT INTO public.proteins VALUES (347, 'Lh14_comp2080_c0_seq1', 'Lh14 comp2080 c0 seq1 from the leptopilina heterotoma wasp venom', 211, 24018.8201, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:55.93197+00');
INSERT INTO public.proteins VALUES (348, 'Lh14_comp2171_c0_seq1', 'Lh14 comp2171 c0 seq1 from the leptopilina heterotoma wasp venom', 491, 53247.1516, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.015752+00');
INSERT INTO public.proteins VALUES (349, 'Lh14_comp2178_c0_seq1', 'Lh14 comp2178 c0 seq1 from the leptopilina heterotoma wasp venom', 498, 56584.5024999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.158307+00');
INSERT INTO public.proteins VALUES (350, 'Lh14_comp222_c0_seq1', 'Lh14 comp222 c0 seq1 from the leptopilina heterotoma wasp venom', 156, 17697.289, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.210783+00');
INSERT INTO public.proteins VALUES (351, 'Lh14_comp224_c1_seq1', 'Lh14 comp224 c1 seq1 from the leptopilina heterotoma wasp venom', 411, 46310.4016000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.286097+00');
INSERT INTO public.proteins VALUES (352, 'Lh14_comp2257_c0_seq1', 'Lh14 comp2257 c0 seq1 from the leptopilina heterotoma wasp venom', 399, 45703.9908, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.358249+00');
INSERT INTO public.proteins VALUES (353, 'Lh14_comp2336_c0_seq1', 'Lh14 comp2336 c0 seq1 from the leptopilina heterotoma wasp venom', 216, 24563.5803, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.410276+00');
INSERT INTO public.proteins VALUES (354, 'Lh14_comp242_c0_seq1', 'Lh14 comp242 c0 seq1 from the leptopilina heterotoma wasp venom', 427, 48710.7602000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.539444+00');
INSERT INTO public.proteins VALUES (355, 'Lh14_comp255_c0_seq1', 'Lh14 comp255 c0 seq1 from the leptopilina heterotoma wasp venom', 165, 18012.7227, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.594018+00');
INSERT INTO public.proteins VALUES (356, 'Lh14_comp2613_c1_seq2', 'Lh14 comp2613 c1 seq2 from the leptopilina heterotoma wasp venom', 166, 18829.5478, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.64745+00');
INSERT INTO public.proteins VALUES (357, 'Lh14_comp2613_c1_seq4', 'Lh14 comp2613 c1 seq4 from the leptopilina heterotoma wasp venom', 78, 8977.1452, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.692872+00');
INSERT INTO public.proteins VALUES (358, 'Lh14_comp2614_c0_seq1', 'Lh14 comp2614 c0 seq1 from the leptopilina heterotoma wasp venom', 125, 14580.758, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.743958+00');
INSERT INTO public.proteins VALUES (359, 'Lh14_comp261_c0_seq1', 'Lh14 comp261 c0 seq1 from the leptopilina heterotoma wasp venom', 151, 15477.1169, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.793514+00');
INSERT INTO public.proteins VALUES (360, 'Lh14_comp265_c0_seq1', 'Lh14 comp265 c0 seq1 from the leptopilina heterotoma wasp venom', 104, 11471.149, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.841445+00');
INSERT INTO public.proteins VALUES (361, 'Lh14_comp2829_c0_seq2', 'Lh14 comp2829 c0 seq2 from the leptopilina heterotoma wasp venom', 424, 46854.6062, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.919929+00');
INSERT INTO public.proteins VALUES (362, 'Lh14_comp2898_c0_seq7', 'Lh14 comp2898 c0 seq7 from the leptopilina heterotoma wasp venom', 403, 47863.0764, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:56.998235+00');
INSERT INTO public.proteins VALUES (363, 'Lh14_comp303_c0_seq1', 'Lh14 comp303 c0 seq1 from the leptopilina heterotoma wasp venom', 262, 29443.929, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.059675+00');
INSERT INTO public.proteins VALUES (364, 'Lh14_comp2636_c0_seq1', 'Lh14 comp2636 c0 seq1 from the leptopilina heterotoma wasp venom', 270, 31264.8684, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.118968+00');
INSERT INTO public.proteins VALUES (365, 'Lh14_comp3064_c0_seq1', 'Lh14 comp3064 c0 seq1 from the leptopilina heterotoma wasp venom', 356, 40622.273, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.247062+00');
INSERT INTO public.proteins VALUES (366, 'Lh14_comp284_c1_seq1', 'Lh14 comp284 c1 seq1 from the leptopilina heterotoma wasp venom', 133, 14451.8279, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.296542+00');
INSERT INTO public.proteins VALUES (367, 'Lh14_comp307_c0_seq1', 'Lh14 comp307 c0 seq1 from the leptopilina heterotoma wasp venom', 366, 39905.2303000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.365777+00');
INSERT INTO public.proteins VALUES (368, 'Lh14_comp3065_c0_seq1', 'Lh14 comp3065 c0 seq1 from the leptopilina heterotoma wasp venom', 452, 52358.2862, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.443374+00');
INSERT INTO public.proteins VALUES (369, 'Lh14_comp312_c1_seq1', 'Lh14 comp312 c1 seq1 from the leptopilina heterotoma wasp venom', 505, 57017.1323, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.522962+00');
INSERT INTO public.proteins VALUES (370, 'Lh14_comp326_c0_seq1', 'Lh14 comp326 c0 seq1 from the leptopilina heterotoma wasp venom', 405, 46986.1503000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.644797+00');
INSERT INTO public.proteins VALUES (371, 'Lh14_comp33_c0_seq1', 'Lh14 comp33 c0 seq1 from the leptopilina heterotoma wasp venom', 83, 9140.29329999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.692082+00');
INSERT INTO public.proteins VALUES (372, 'Lh14_comp332_c0_seq1', 'Lh14 comp332 c0 seq1 from the leptopilina heterotoma wasp venom', 323, 35832.9806000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.758998+00');
INSERT INTO public.proteins VALUES (373, 'Lh14_comp321_c0_seq1', 'Lh14 comp321 c0 seq1 from the leptopilina heterotoma wasp venom', 335, 35671.4248, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.821487+00');
INSERT INTO public.proteins VALUES (374, 'Lh14_comp354_c0_seq1', 'Lh14 comp354 c0 seq1 from the leptopilina heterotoma wasp venom', 293, 33375.3224000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.884179+00');
INSERT INTO public.proteins VALUES (375, 'Lh14_comp3315_c0_seq1', 'Lh14 comp3315 c0 seq1 from the leptopilina heterotoma wasp venom', 242, 27570.135, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:57.950325+00');
INSERT INTO public.proteins VALUES (376, 'Lh14_comp3535_c0_seq1', 'Lh14 comp3535 c0 seq1 from the leptopilina heterotoma wasp venom', 173, 19899.861, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.003876+00');
INSERT INTO public.proteins VALUES (377, 'Lh14_comp3668_c0_seq5', 'Lh14 comp3668 c0 seq5 from the leptopilina heterotoma wasp venom', 201, 22677.9862, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.061329+00');
INSERT INTO public.proteins VALUES (378, 'Lh14_comp366_c2_seq1', 'Lh14 comp366 c2 seq1 from the leptopilina heterotoma wasp venom', 148, 16831.9205, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.111983+00');
INSERT INTO public.proteins VALUES (379, 'Lh14_comp3668_c0_seq1', 'Lh14 comp3668 c0 seq1 from the leptopilina heterotoma wasp venom', 329, 37428.4872000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.238503+00');
INSERT INTO public.proteins VALUES (380, 'Lh14_comp367_c0_seq1', 'Lh14 comp367 c0 seq1 from the leptopilina heterotoma wasp venom', 106, 11897.5247, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.284284+00');
INSERT INTO public.proteins VALUES (381, 'Lh14_comp3755_c0_seq1', 'Lh14 comp3755 c0 seq1 from the leptopilina heterotoma wasp venom', 366, 40226.2316, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.354878+00');
INSERT INTO public.proteins VALUES (382, 'Lh14_comp393_c0_seq1', 'Lh14 comp393 c0 seq1 from the leptopilina heterotoma wasp venom', 108, 11754.4522, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.400699+00');
INSERT INTO public.proteins VALUES (383, 'Lh14_comp408_c0_seq1', 'Lh14 comp408 c0 seq1 from the leptopilina heterotoma wasp venom', 215, 24223.548, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.458561+00');
INSERT INTO public.proteins VALUES (384, 'Lh14_comp409_c0_seq1', 'Lh14 comp409 c0 seq1 from the leptopilina heterotoma wasp venom', 238, 26326.6876, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.5165+00');
INSERT INTO public.proteins VALUES (385, 'Lh14_comp4268_c1_seq1', 'Lh14 comp4268 c1 seq1 from the leptopilina heterotoma wasp venom', 393, 46788.544, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.590222+00');
INSERT INTO public.proteins VALUES (386, 'Lh14_comp436_c0_seq1', 'Lh14 comp436 c0 seq1 from the leptopilina heterotoma wasp venom', 340, 36040.1085, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.652122+00');
INSERT INTO public.proteins VALUES (387, 'Lh14_comp42_c0_seq1', 'Lh14 comp42 c0 seq1 from the leptopilina heterotoma wasp venom', 346, 38653.4682, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.777982+00');
INSERT INTO public.proteins VALUES (388, 'Lh14_comp447_c0_seq1', 'Lh14 comp447 c0 seq1 from the leptopilina heterotoma wasp venom', 170, 20023.7531, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.833351+00');
INSERT INTO public.proteins VALUES (389, 'Lh14_comp455_c2_seq1', 'Lh14 comp455 c2 seq1 from the leptopilina heterotoma wasp venom', 247, 28118.1746, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.895281+00');
INSERT INTO public.proteins VALUES (390, 'Lh14_comp4650_c0_seq1', 'Lh14 comp4650 c0 seq1 from the leptopilina heterotoma wasp venom', 258, 29634.6708, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:58.960137+00');
INSERT INTO public.proteins VALUES (391, 'Lh14_comp468_c0_seq1', 'Lh14 comp468 c0 seq1 from the leptopilina heterotoma wasp venom', 127, 14331.3169, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.008719+00');
INSERT INTO public.proteins VALUES (392, 'Lh14_comp469_c0_seq1', 'Lh14 comp469 c0 seq1 from the leptopilina heterotoma wasp venom', 463, 51446.8917, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.090182+00');
INSERT INTO public.proteins VALUES (393, 'Lh14_comp4862_c0_seq1', 'Lh14 comp4862 c0 seq1 from the leptopilina heterotoma wasp venom', 284, 32269.7477, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.150297+00');
INSERT INTO public.proteins VALUES (394, 'Lh14_comp493_c2_seq4', 'Lh14 comp493 c2 seq4 from the leptopilina heterotoma wasp venom', 206, 22529.5776, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.201215+00');
INSERT INTO public.proteins VALUES (395, 'Lh14_comp500_c0_seq2', 'Lh14 comp500 c0 seq2 from the leptopilina heterotoma wasp venom', 415, 47708.8116, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.333948+00');
INSERT INTO public.proteins VALUES (396, 'Lh14_comp500_c0_seq8', 'Lh14 comp500 c0 seq8 from the leptopilina heterotoma wasp venom', 147, 16449.9986, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.385517+00');
INSERT INTO public.proteins VALUES (397, 'Lh14_comp528_c0_seq1', 'Lh14 comp528 c0 seq1 from the leptopilina heterotoma wasp venom', 184, 20565.2823, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.443345+00');
INSERT INTO public.proteins VALUES (398, 'Lh14_comp5065_c0_seq1', 'Lh14 comp5065 c0 seq1 from the leptopilina heterotoma wasp venom', 169, 18976.335, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.497122+00');
INSERT INTO public.proteins VALUES (399, 'Lh14_comp513_c0_seq1', 'Lh14 comp513 c0 seq1 from the leptopilina heterotoma wasp venom', 388, 42870.4382, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.567147+00');
INSERT INTO public.proteins VALUES (400, 'Lh14_comp548_c0_seq1', 'Lh14 comp548 c0 seq1 from the leptopilina heterotoma wasp venom', 128, 13639.5051, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.612112+00');
INSERT INTO public.proteins VALUES (401, 'Lh14_comp54_c0_seq1', 'Lh14 comp54 c0 seq1 from the leptopilina heterotoma wasp venom', 461, 50316.557, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.690099+00');
INSERT INTO public.proteins VALUES (402, 'Lh14_comp553_c0_seq1', 'Lh14 comp553 c0 seq1 from the leptopilina heterotoma wasp venom', 202, 23461.7992, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.743075+00');
INSERT INTO public.proteins VALUES (403, 'Lh14_comp563_c0_seq1', 'Lh14 comp563 c0 seq1 from the leptopilina heterotoma wasp venom', 495, 56136.9398, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.882566+00');
INSERT INTO public.proteins VALUES (404, 'Lh14_comp575_c0_seq1', 'Lh14 comp575 c0 seq1 from the leptopilina heterotoma wasp venom', 185, 21737.5255, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:17:59.937722+00');
INSERT INTO public.proteins VALUES (405, 'Lh14_comp5838_c0_seq1', 'Lh14 comp5838 c0 seq1 from the leptopilina heterotoma wasp venom', 494, 56446.0870999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.028453+00');
INSERT INTO public.proteins VALUES (406, 'Lh14_comp586_c0_seq13', 'Lh14 comp586 c0 seq13 from the leptopilina heterotoma wasp venom', 120, 13177.6202, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.075326+00');
INSERT INTO public.proteins VALUES (407, 'Lh14_comp576_c0_seq1', 'Lh14 comp576 c0 seq1 from the leptopilina heterotoma wasp venom', 520, 55823.6202000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.157708+00');
INSERT INTO public.proteins VALUES (408, 'Lh14_comp586_c0_seq14', 'Lh14 comp586 c0 seq14 from the leptopilina heterotoma wasp venom', 92, 10440.0142, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.196399+00');
INSERT INTO public.proteins VALUES (409, 'Lh14_comp586_c0_seq2', 'Lh14 comp586 c0 seq2 from the leptopilina heterotoma wasp venom', 321, 36981.5767, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.25844+00');
INSERT INTO public.proteins VALUES (410, 'Lh14_comp586_c0_seq8', 'Lh14 comp586 c0 seq8 from the leptopilina heterotoma wasp venom', 200, 23114.7535, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.367645+00');
INSERT INTO public.proteins VALUES (411, 'Lh14_comp6251_c0_seq1', 'Lh14 comp6251 c0 seq1 from the leptopilina heterotoma wasp venom', 215, 24852.1754, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.430798+00');
INSERT INTO public.proteins VALUES (412, 'Lh14_comp6288_c0_seq1', 'Lh14 comp6288 c0 seq1 from the leptopilina heterotoma wasp venom', 268, 29684.3461, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.494536+00');
INSERT INTO public.proteins VALUES (413, 'Lh14_comp635_c0_seq1', 'Lh14 comp635 c0 seq1 from the leptopilina heterotoma wasp venom', 167, 19150.6283, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.575002+00');
INSERT INTO public.proteins VALUES (414, 'Lh14_comp644_c0_seq1', 'Lh14 comp644 c0 seq1 from the leptopilina heterotoma wasp venom', 434, 46977.0408, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.654969+00');
INSERT INTO public.proteins VALUES (415, 'Lh14_comp63_c0_seq1', 'Lh14 comp63 c0 seq1 from the leptopilina heterotoma wasp venom', 449, 50567.1588000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.732291+00');
INSERT INTO public.proteins VALUES (416, 'Lh14_comp66_c0_seq1', 'Lh14 comp66 c0 seq1 from the leptopilina heterotoma wasp venom', 450, 49979.9815000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.803913+00');
INSERT INTO public.proteins VALUES (417, 'Lh14_comp683_c0_seq1', 'Lh14 comp683 c0 seq1 from the leptopilina heterotoma wasp venom', 302, 34969.852, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.920127+00');
INSERT INTO public.proteins VALUES (418, 'Lh14_comp679_c0_seq1', 'Lh14 comp679 c0 seq1 from the leptopilina heterotoma wasp venom', 131, 14651.7314, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:00.971114+00');
INSERT INTO public.proteins VALUES (419, 'Lh14_comp7069_c0_seq1', 'Lh14 comp7069 c0 seq1 from the leptopilina heterotoma wasp venom', 401, 47726.3529, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.055302+00');
INSERT INTO public.proteins VALUES (420, 'Lh14_comp708_c0_seq1', 'Lh14 comp708 c0 seq1 from the leptopilina heterotoma wasp venom', 202, 23382.8294, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.106113+00');
INSERT INTO public.proteins VALUES (421, 'Lh14_comp719_c0_seq1', 'Lh14 comp719 c0 seq1 from the leptopilina heterotoma wasp venom', 223, 25499.1473, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.157093+00');
INSERT INTO public.proteins VALUES (422, 'Lh14_comp712_c0_seq1', 'Lh14 comp712 c0 seq1 from the leptopilina heterotoma wasp venom', 310, 35902.3761, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.222225+00');
INSERT INTO public.proteins VALUES (423, 'Lh14_comp6201_c0_seq1', 'Lh14 comp6201 c0 seq1 from the leptopilina heterotoma wasp venom', 198, 22916.4792, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.271264+00');
INSERT INTO public.proteins VALUES (424, 'Lh14_comp768_c0_seq1', 'Lh14 comp768 c0 seq1 from the leptopilina heterotoma wasp venom', 271, 31557.5476000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.329424+00');
INSERT INTO public.proteins VALUES (425, 'Lh14_comp7731_c0_seq1', 'Lh14 comp7731 c0 seq1 from the leptopilina heterotoma wasp venom', 242, 27343.7075, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.445075+00');
INSERT INTO public.proteins VALUES (426, 'Lh14_comp7757_c0_seq1', 'Lh14 comp7757 c0 seq1 from the leptopilina heterotoma wasp venom', 82, 9400.20819999999, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.490482+00');
INSERT INTO public.proteins VALUES (427, 'Lh14_comp797_c0_seq3', 'Lh14 comp797 c0 seq3 from the leptopilina heterotoma wasp venom', 230, 25261.2349, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.549121+00');
INSERT INTO public.proteins VALUES (428, 'Lh14_comp802_c0_seq1', 'Lh14 comp802 c0 seq1 from the leptopilina heterotoma wasp venom', 142, 16094.6096, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.600834+00');
INSERT INTO public.proteins VALUES (429, 'Lh14_comp8050_c0_seq2', 'Lh14 comp8050 c0 seq2 from the leptopilina heterotoma wasp venom', 356, 39714.1133, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.675219+00');
INSERT INTO public.proteins VALUES (430, 'Lh14_comp804_c1_seq1', 'Lh14 comp804 c1 seq1 from the leptopilina heterotoma wasp venom', 449, 48624.9356000001, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.749255+00');
INSERT INTO public.proteins VALUES (431, 'Lh14_comp82_c1_seq3', 'Lh14 comp82 c1 seq3 from the leptopilina heterotoma wasp venom', 311, 35339.7576, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.809256+00');
INSERT INTO public.proteins VALUES (432, 'Lh14_comp82_c1_seq1', 'Lh14 comp82 c1 seq1 from the leptopilina heterotoma wasp venom', 313, 35534.4964, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.919542+00');
INSERT INTO public.proteins VALUES (433, 'Lh14_comp835_c0_seq1', 'Lh14 comp835 c0 seq1 from the leptopilina heterotoma wasp venom', 220, 25004.0977, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:01.983186+00');
INSERT INTO public.proteins VALUES (434, 'Lh14_comp862_c0_seq1', 'Lh14 comp862 c0 seq1 from the leptopilina heterotoma wasp venom', 180, 20364.2413, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:02.078204+00');
INSERT INTO public.proteins VALUES (435, 'Lh14_comp873_c0_seq1', 'Lh14 comp873 c0 seq1 from the leptopilina heterotoma wasp venom', 118, 13204.3142, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:02.137178+00');
INSERT INTO public.proteins VALUES (436, 'Lh14_comp918_c0_seq1', 'Lh14 comp918 c0 seq1 from the leptopilina heterotoma wasp venom', 296, 33245.8178, 'From the [Venom Biochemistry & Molecular Biology Laboratory](https://venombiochemistrylab.weebly.com/) and predicted using [AlphaFold](https://github.com/google-deepmind/alphafold).', '', 3, NULL, '2024-05-22 04:18:02.201725+00');


--
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.species VALUES (1, 'ganaspis hookeri');
INSERT INTO public.species VALUES (2, 'leptopilina boulardi');
INSERT INTO public.species VALUES (3, 'leptopilina heterotoma');
INSERT INTO public.species VALUES (4, 'unknown');


--
-- Data for Name: text_components; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.users VALUES (1, 'test', 'test', '$2b$12$PFoNf7YM0KNIPP8WGsJjveIOhiJjitsMtfwRcCjdcyTuqjdk/q//u', true);


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.articles_id_seq', 1, false);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.components_id_seq', 1, false);


--
-- Name: image_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.image_components_id_seq', 1, false);


--
-- Name: protein_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.protein_components_id_seq', 1, false);


--
-- Name: proteins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.proteins_id_seq', 436, true);


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.species_id_seq', 440, true);


--
-- Name: text_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.text_components_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_title_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_title_key UNIQUE (title);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);


--
-- Name: image_components image_components_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.image_components
    ADD CONSTRAINT image_components_pkey PRIMARY KEY (id);


--
-- Name: protein_components protein_components_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.protein_components
    ADD CONSTRAINT protein_components_pkey PRIMARY KEY (id);


--
-- Name: proteins proteins_name_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_name_key UNIQUE (name);


--
-- Name: proteins proteins_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_pkey PRIMARY KEY (id);


--
-- Name: species species_name_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_name_key UNIQUE (name);


--
-- Name: species species_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: text_components text_components_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.text_components
    ADD CONSTRAINT text_components_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: components components_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image_components image_components_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.image_components
    ADD CONSTRAINT image_components_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: protein_components protein_components_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.protein_components
    ADD CONSTRAINT protein_components_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proteins proteins_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: text_components text_components_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.text_components
    ADD CONSTRAINT text_components_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

