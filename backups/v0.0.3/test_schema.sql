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
-- SELECT pg_catalog.set_config('search_path', '', false);
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
    atoms integer,
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


CREATE TYPE request_status AS ENUM ('Approved', 'Denied', 'Pending');


CREATE TABLE public.requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    protein_id integer NOT NULL,
    date_requested timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    comment text,
    status_type request_status NOT NULL
);

ALTER TABLE public.requests OWNER TO myuser;

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO myuser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;

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


ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);
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
-- Dummy Data for Name: proteins; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.proteins VALUES (1, 'test_seq1', 'fake approved sequence for testing', 1, 1.1, 1, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 1, '\x64', '2024-05-22 04:17:26.928835+00');
INSERT INTO public.proteins VALUES (2, 'test_seq2', 'fake approved sequence for testing', 2, 2.2, 2, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 2, '\x64', '2024-05-22 04:17:27.987764+00');
INSERT INTO public.proteins VALUES (3, 'test_seq3', 'fake approved sequence for testing', 3, 3.3, 3, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 1, '\x64', '2024-05-22 04:17:28.421996+00');
INSERT INTO public.proteins VALUES (4, 'test_seq4', 'fake pending sequence for testing', 4, 4.4, 4, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 2, '\x64', '2024-05-22 04:17:28.421996+00');
INSERT INTO public.proteins VALUES (5, 'test_seq5', 'fake pending sequence for testing', 5, 5.5, 5, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 2, '\x64', '2024-05-22 04:17:28.421996+00');
INSERT INTO public.proteins VALUES (6, 'test_seq6', 'fake denied sequence for testing', 6, 6.6, 6, 'From the [Testing Laboratory](https://venombiochemistrylab.weebly.com/)', '', 2, '\x64', '2024-05-22 04:17:28.421996+00');

-- Add dummy requests for proteins.
INSERT INTO public.requests (
    user_id,
    protein_id,
    comment,
    status_type
) SELECT 1, id, 'Original Proteins Added', 'Approved' FROM public.proteins WHERE id <= 2;
INSERT INTO public.requests VALUES (3, 2, 3, '2024-05-22 04:17:28.421996+00', 'Original Proteins Added', 'Approved');

INSERT INTO public.requests VALUES (4, 2, 4, '2024-05-22 04:17:28.421996+00', 'test protein', 'Pending');
INSERT INTO public.requests VALUES (5, 2, 5, '2024-05-22 04:17:28.421996+00','test protein', 'Pending');
INSERT INTO public.requests VALUES (6, 2, 6, '2024-05-22 04:17:28.421996+00', 'test protein', 'Denied');
-- View with at a glance info about a protein
DROP VIEW full_protein_info;

CREATE VIEW full_protein_info
AS
( SELECT proteins.id AS protein_id,
    proteins.name AS protein_name,
    proteins.content AS protein_content,
    species.name AS protein_species,
    requests.id AS request_id,
    requests.user_id AS request_user_id,
    ( SELECT users.username
           FROM users
          WHERE (users.id = requests.user_id)) AS request_user_name,
    requests.date_requested AS request_date,
    requests.status_type AS request_status,
    requests.comment AS request_comment
   FROM ((proteins
     JOIN requests ON ((proteins.id = requests.protein_id)))
     JOIN species ON ((proteins.species_id = species.id))));

--
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.species VALUES (1, 'test species 1');
INSERT INTO public.species VALUES (2, 'test species 2');


--
-- Data for Name: text_components; Type: TABLE DATA; Schema: public; Owner: myuser
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: myuser
--

INSERT INTO public.users VALUES (1, 'test_user1', 'test@test.com', '$2b$12$VWEzOn6WV//5xKVWZ1gCJOMfSwB4GPAAysZFbaV4Fhg.7tDfonia6', true);
INSERT INTO public.users VALUES (2, 'test_user2', 'test2@test.com', '$2b$12$VWEzOn6WV//5xKVWZ1gCJOMfSwB4GPAAysZFbaV4Fhg.7tDfonia6', true);

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

SELECT pg_catalog.setval('public.proteins_id_seq', 437, true);


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.species_id_seq', 1, false);


--
-- Name: text_components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.text_components_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


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


ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);

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


ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_protein_id_fkey FOREIGN KEY (protein_id) REFERENCES public.proteins(id) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: text_components text_components_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.text_components
    ADD CONSTRAINT text_components_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.components(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

