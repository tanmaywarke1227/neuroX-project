--
-- PostgreSQL database dump
--

\restrict LECCcLIQOJZBIttq35fkLKLecCRQeIqQYU4H15RRSDOrwBd4yydGOiB5TIIYUx9

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: hvac_logs; Type: TABLE; Schema: public; Owner: devanshchawla
--

CREATE TABLE public.hvac_logs (
    id integer NOT NULL,
    "timestamp" timestamp without time zone,
    indoor_temp double precision NOT NULL,
    outdoor_temp double precision NOT NULL,
    occupancy integer NOT NULL,
    hvac_action double precision NOT NULL,
    reward double precision,
    energy_consumption double precision,
    comfort_score double precision
);


ALTER TABLE public.hvac_logs OWNER TO devanshchawla;

--
-- Name: hvac_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: devanshchawla
--

CREATE SEQUENCE public.hvac_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hvac_logs_id_seq OWNER TO devanshchawla;

--
-- Name: hvac_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devanshchawla
--

ALTER SEQUENCE public.hvac_logs_id_seq OWNED BY public.hvac_logs.id;


--
-- Name: hvac_logs id; Type: DEFAULT; Schema: public; Owner: devanshchawla
--

ALTER TABLE ONLY public.hvac_logs ALTER COLUMN id SET DEFAULT nextval('public.hvac_logs_id_seq'::regclass);


--
-- Name: hvac_logs hvac_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: devanshchawla
--

ALTER TABLE ONLY public.hvac_logs
    ADD CONSTRAINT hvac_logs_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict LECCcLIQOJZBIttq35fkLKLecCRQeIqQYU4H15RRSDOrwBd4yydGOiB5TIIYUx9

