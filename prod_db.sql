--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 17.2

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

--
-- Name: attack_type; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.attack_type AS ENUM (
    'explosive',
    'piercing',
    'mystic',
    'sonic'
);


ALTER TYPE public.attack_type OWNER TO arona;

--
-- Name: banner_kind; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.banner_kind AS ENUM (
    'global',
    'jp',
    'chroma'
);


ALTER TYPE public.banner_kind OWNER TO arona;

--
-- Name: combat_class; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.combat_class AS ENUM (
    'striker',
    'special'
);


ALTER TYPE public.combat_class OWNER TO arona;

--
-- Name: combat_position; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.combat_position AS ENUM (
    'front',
    'middle',
    'back'
);


ALTER TYPE public.combat_position OWNER TO arona;

--
-- Name: combat_role; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.combat_role AS ENUM (
    'attacker',
    'healer',
    'support',
    't.s.',
    'tank'
);


ALTER TYPE public.combat_role OWNER TO arona;

--
-- Name: defense_type; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.defense_type AS ENUM (
    'light',
    'heavy',
    'special',
    'elastic'
);


ALTER TYPE public.defense_type OWNER TO arona;

--
-- Name: difficulty; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.difficulty AS ENUM (
    'normal',
    'hard',
    'veryhard',
    'hardcode',
    'extreme',
    'insane',
    'torment'
);


ALTER TYPE public.difficulty OWNER TO arona;

--
-- Name: school; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.school AS ENUM (
    'abydos',
    'arius',
    'gehenna',
    'hyakkiyako',
    'millennium',
    'redwinter',
    'shanhaijing',
    'srt',
    'trinity',
    'valkyrie',
    'tokiwadai',
    'sakugawa',
    'etc'
);


ALTER TYPE public.school OWNER TO arona;

--
-- Name: skill_type; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.skill_type AS ENUM (
    'ex',
    'basic',
    'enhanced',
    'sub'
);


ALTER TYPE public.skill_type OWNER TO arona;

--
-- Name: terrain; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.terrain AS ENUM (
    'indoors',
    'outdoors',
    'urban'
);


ALTER TYPE public.terrain OWNER TO arona;

--
-- Name: weapon_type; Type: TYPE; Schema: public; Owner: arona
--

CREATE TYPE public.weapon_type AS ENUM (
    'AR',
    'FT',
    'GL',
    'HG',
    'MG',
    'MT',
    'RG',
    'RL',
    'SG',
    'SMG',
    'SR'
);


ALTER TYPE public.weapon_type OWNER TO arona;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: arona
--

CREATE TABLE public.banners (
    id character varying NOT NULL,
    name character varying NOT NULL,
    date character varying NOT NULL,
    three_star_rate integer DEFAULT 30 NOT NULL,
    pickup_rate integer DEFAULT 0 NOT NULL,
    extra_rate integer DEFAULT 0 NOT NULL,
    pickup_pool_students character varying[],
    extra_pool_students character varying[],
    additional_three_star_students character varying[],
    base_one_star_rate integer DEFAULT 785 NOT NULL,
    base_two_star_rate integer DEFAULT 185 NOT NULL,
    base_three_star_rate integer DEFAULT 30 NOT NULL,
    kind public.banner_kind NOT NULL,
    sort_key integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.banners OWNER TO arona;

--
-- Name: gifts; Type: TABLE; Schema: public; Owner: arona
--

CREATE TABLE public.gifts (
    id integer NOT NULL,
    name character varying NOT NULL,
    icon_url text,
    description text,
    rarity integer DEFAULT 1 NOT NULL,
    students_favorite character varying[],
    students_liked character varying[]
);


ALTER TABLE public.gifts OWNER TO arona;

--
-- Name: gifts_id_seq; Type: SEQUENCE; Schema: public; Owner: arona
--

CREATE SEQUENCE public.gifts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gifts_id_seq OWNER TO arona;

--
-- Name: gifts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arona
--

ALTER SEQUENCE public.gifts_id_seq OWNED BY public.gifts.id;


--
-- Name: missions; Type: TABLE; Schema: public; Owner: arona
--

CREATE TABLE public.missions (
    id integer NOT NULL,
    name character varying NOT NULL,
    cost integer NOT NULL,
    difficulty public.difficulty,
    terrain public.terrain,
    recommended_level integer NOT NULL,
    drops text[] NOT NULL,
    stage_image_url text
);


ALTER TABLE public.missions OWNER TO arona;

--
-- Name: missions_id_seq; Type: SEQUENCE; Schema: public; Owner: arona
--

CREATE SEQUENCE public.missions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.missions_id_seq OWNER TO arona;

--
-- Name: missions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arona
--

ALTER SEQUENCE public.missions_id_seq OWNED BY public.missions.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: arona
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    student_id character varying NOT NULL,
    kind public.skill_type NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    cost character varying
);


ALTER TABLE public.skills OWNER TO arona;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: arona
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO arona;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arona
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: arona
--

CREATE TABLE public.students (
    id character varying NOT NULL,
    name character varying NOT NULL,
    full_name character varying NOT NULL,
    school public.school NOT NULL,
    age character varying NOT NULL,
    birthday character varying NOT NULL,
    height character varying NOT NULL,
    hobbies text,
    wiki_image text,
    attack_type public.attack_type,
    defense_type public.defense_type,
    combat_class public.combat_class,
    combat_role public.combat_role,
    combat_position public.combat_position,
    uses_cover boolean DEFAULT false NOT NULL,
    weapon_type public.weapon_type,
    rarity integer NOT NULL,
    is_welfare boolean DEFAULT false NOT NULL,
    is_limited boolean DEFAULT false NOT NULL,
    release_date date,
    recorobi_level integer,
    base_variant_id character varying
);


ALTER TABLE public.students OWNER TO arona;

--
-- Name: gifts id; Type: DEFAULT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.gifts ALTER COLUMN id SET DEFAULT nextval('public.gifts_id_seq'::regclass);


--
-- Name: missions id; Type: DEFAULT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.missions ALTER COLUMN id SET DEFAULT nextval('public.missions_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: arona
--

COPY public.banners (id, name, date, three_star_rate, pickup_rate, extra_rate, pickup_pool_students, extra_pool_students, additional_three_star_students, base_one_star_rate, base_two_star_rate, base_three_star_rate, kind, sort_key) FROM stdin;
izumi_new_year	Izumi (New Year)	2025/03/19	30	7	0	{izumi_new_year}	\N	\N	785	185	30	jp	51
haruna_new_year	Haruna (New Year)	2025/03/19	30	7	0	{haruna_new_year}	\N	{fuuka_new_year}	785	185	30	jp	52
regular	Regular Recruitment (Global)	2024/09/25	30	0	0	\N	\N	\N	785	185	30	global	1
regular_jp	Regular Recruitment (JP)	2025/03/19	30	0	0	\N	\N	\N	785	185	30	jp	50
kisaki	Kisaki	2024/09/25	30	7	0	{kisaki}	\N	\N	785	185	30	global	2
reijo	Reijo	2024/09/25	30	7	0	{reijo}	\N	\N	785	185	30	global	3
shun_small	Shun (Small)	2024/09/25	30	7	0	{shun_small}	\N	\N	785	185	30	global	4
saya_casual	Saya (Casual)	2024/09/25	30	7	0	{saya_casual}	\N	\N	785	185	30	global	5
fuuka_new_year	Fuuka (New Year)	2025/03/19	30	7	0	{fuuka_new_year}	\N	{haruna_new_year}	785	185	30	jp	53
akari_new_year	Akari (New Year)	2025/03/19	30	7	0	{akari_new_year}	\N	\N	785	185	30	jp	54
\.


--
-- Data for Name: gifts; Type: TABLE DATA; Schema: public; Owner: arona
--

COPY public.gifts (id, name, icon_url, description, rarity, students_favorite, students_liked) FROM stdin;
8	Classical Poetry Anthology	https://static.miraheze.org/bluearchivewiki/thumb/b/bc/Item_Icon_Favor_23.png/81px-Item_Icon_Favor_23.png	An anthology of classical poetry. Very classy. Provides all the sophistication of classical literature right at your fingertips.	2	{atsuko_swimsuit,chise,chise_swimsuit,kaho,kikyou,mimori_swimsuit,noa,tomoe,ui,ui_swimsuit}	{ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,hanako,iroha,kanna_swimsuit,kotori,meru,minori,momiji,shimiko,tsubaki_guide}
2	Shiny Bouquet	https://static.miraheze.org/bluearchivewiki/thumb/0/0e/Item_Icon_Favor_SSR_1.png/81px-Item_Icon_Favor_SSR_1.png	A crystal bouquet perfect for giving to a special someone.It sparkles like a kaleidoscope in the light.This is a special event gift, it will be treated as favorite when given to any student.	3	{}	{}
6	Cute Dishware Set	https://static.miraheze.org/bluearchivewiki/thumb/e/e0/Item_Icon_Favor_24.png/81px-Item_Icon_Favor_24.png	A dishware set painted with adorable animal characters. This product has made the top ten list of best selling dishware in Kivotos year after year.	2	{akane,akane_bunny_girl,fuuka,fuuka_new_year,hinata_swimsuit,hiyori,midori_maid,mimori,renge,rumi}	{hibiki_cheer_squad,mimori_swimsuit}
4	Beautiful Bouquet	https://static.miraheze.org/bluearchivewiki/thumb/0/04/Item_Icon_Favor_Lv2_Package.png/81px-Item_Icon_Favor_Lv2_Package.png	A bouquet of ruby flowers, to be given to someone special.The beautiful red petals are sure to capture the heart of the recepient.	3	{}	{}
9	Brain Teaser Puzzle Cube	https://static.miraheze.org/bluearchivewiki/thumb/7/75/Item_Icon_Favor_25.png/81px-Item_Icon_Favor_25.png	"If you can solve this, then you deserve your place at Millennium!" A tricky cube for advanced puzzle-solvers certified by Millennium Science School.	2	{arisu_maid,karin,koyuki,yuuka,yuuka_track}	{ibuki,kaede,kotama,kotama_camping,kotori_cheer_squad,maki,megu,meru,mutsuki,mutsuki_new_year,neru,umika}
1	Hatsune Miku photo card	https://static.miraheze.org/bluearchivewiki/thumb/0/07/Item_Icon_Favor_SSR_2.png/81px-Item_Icon_Favor_SSR_2.png	A special photo card distributed Hatsune Miku's live concert in Kivotos. The concert was a great success, and it became a rare item that any Hatsune Miku fan would want.This is a special event gift, it will be treated as favorite when given to any student.	3	{}	{}
7	Astronomical Telescope	https://static.miraheze.org/bluearchivewiki/thumb/3/32/Item_Icon_Favor_10.png/81px-Item_Icon_Favor_10.png	This astronomical telescope is deemed the standard for hobbyists by the Kivotos Astronomy Observatory.	2	{nodoka,utaha,utaha_cheer_squad}	{arisu_maid,ibuki,kaede,kasumi,kotama,kotama_camping,koyuki,maki,megu,meru,mutsuki,mutsuki_new_year,neru,nodoka_hot_spring,umika}
13	30-Color Paint Set	https://static.miraheze.org/bluearchivewiki/thumb/f/fc/Item_Icon_Favor_22.png/81px-Item_Icon_Favor_22.png	A professional paint set with tubes in a variety of thirty colors. Time to go and paint the whole wide world!	2	{ibuki,juri,maki,meru}	{arisu_maid,kaede,kotama,kotama_camping,koyuki,megu,mutsuki,mutsuki_new_year,neru,umika}
3	Refreshing Bouquet	https://static.miraheze.org/bluearchivewiki/thumb/b/bf/Item_Icon_Favor_Lv2_Special.png/81px-Item_Icon_Favor_Lv2_Special.png	Bouquet of emerald flowers to commemorate day with a special someone.The neat buds will put your mind at ease.	3	{}	{}
12	A-Pods Pro	https://static.miraheze.org/bluearchivewiki/thumb/8/8c/Item_Icon_Favor_2.png/81px-Item_Icon_Favor_2.png	Wireless earphones that are all the rage among Kivotos students. A bit expensive to buy on a tight budget, since they retail for about three months worth of part-time pay.	2	{chihiro,hibiki,hibiki_cheer_squad,kayoko,kayoko_dress,kayoko_new_year,moe,reisa}	{eimi,eimi_swimsuit,ichika,kazusa_band,moe_swimsuit,utaha_cheer_squad,yuzu,yuzu_maid}
5	Cosplayer Coke-Bottle Glasses	https://static.miraheze.org/bluearchivewiki/thumb/3/3b/Item_Icon_Favor_18.png/81px-Item_Icon_Favor_18.png	Wear these to instantly look like a genius! Einstein's got nothing on you (in appearance, anyway)! ※ Note: Wearing these will not raise your IQ.	2	{kaede,megu,mutsuki,mutsuki_new_year,neru,saya_casual,umika}	{arisu_maid,atsuko_swimsuit,cherino,cherino_hot_spring,haruka,haruka_new_year,ibuki,kotama,kotama_camping,koyuki,maki,makoto,meru,mina,moe_swimsuit,tsukuyo}
11	Cherry-Rose Lip Gloss	https://static.miraheze.org/bluearchivewiki/thumb/8/86/Item_Icon_Favor_5.png/81px-Item_Icon_Favor_5.png	A lip gloss with a subtle yet striking hue. It's one of the hottest selling items among young ladies interested in beauty products.	2	{asuna,ichika,kirara,koharu,mine,nonomi,nonomi_swimsuit,saori,saori_swimsuit}	{hanae,hanako_swimsuit,kazusa,mika,mimori_swimsuit,momiji,shun,yoshimi_band}
43	Samuela "The Beyond"	https://static.miraheze.org/bluearchivewiki/thumb/5/5c/Item_Icon_Favor_Lv2_2.png/81px-Item_Icon_Favor_Lv2_2.png	The finest perfume released by the luxury cosmetics manufacturer "Samuela".It is a super-hit work famous for the catchphrase "Try it once and wear its charm", and it is one of the 12 masterpieces of Samuela made by the rare genius perfumer "The Beyond"...	3	{asuna_bunny_girl,hifumi,hina,hina_swimsuit,ichika,kirara,koharu_swimsuit,mine,serina}	{asuna,hanae,hanako_swimsuit,koharu,mika,mimori_swimsuit,nonomi,nonomi_swimsuit,saori,saori_swimsuit,shun}
15	Encyclopedia	https://static.miraheze.org/bluearchivewiki/thumb/8/8d/Item_Icon_Favor_32.png/81px-Item_Icon_Favor_32.png	From "that tie thing" for tying bread bags to "the grass thing" that goes in bento boxes, everything you've ever wanted to learn about can be found right here.	2	{atsuko,atsuko_swimsuit,kikyou,kotori,kotori_cheer_squad,minori}	{ako,ako_dress,ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,chise,chise_swimsuit,hanako,iroha,kaho,kanna,kanna_swimsuit,meru,mimori_swimsuit,momiji,noa,saki,saki_swimsuit,saya,sena,shigure,shigure_hot_spring,shimiko,toki,toki_bunny_girl,tsubaki_guide,ui,ui_swimsuit}
24	Hitgirls Gaming Magazine	https://static.miraheze.org/bluearchivewiki/thumb/9/95/Item_Icon_Favor_4.png/81px-Item_Icon_Favor_4.png	Stay up to date on the latest releases, strategies for classic games, new gaming merch and everything in between—this magazine covers it all!	2	{arisu,arisu_maid,hare,hare_camping,iroha}	{atsuko_swimsuit,ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,chise,chise_swimsuit,fubuki_swimsuit,hanako,kaede,kaho,kanna_swimsuit,kikyou,kotori,meru,midori_maid,mimori_swimsuit,minori,momiji,momoi,momoi_maid,neru_bunny_girl,noa,shimiko,tsubaki_guide,ui,ui_swimsuit,yuzu,yuzu_maid}
34	Military Camo Foundation Trio	https://static.miraheze.org/bluearchivewiki/thumb/0/0c/Item_Icon_Favor_7.png/81px-Item_Icon_Favor_7.png	A hit product from the luxury cosmetics brand Samuela. It provides lightweight camouflage capabilities that melt into your skin! Be camera-ready any time, any place!	2	{hoshino_battle_tank,hoshino_battle_dealer,mashiro,saki,saki_swimsuit,saori_swimsuit}	{asuna,hanae,hanako_swimsuit,ichika,iori,iori_swimsuit,kirara,koharu,mashiro_swimsuit,mika,mimori_swimsuit,mine,miyako,miyako_swimsuit,miyu,miyu_swimsuit,moe,moe_swimsuit,nonomi,nonomi_swimsuit,saori,shun}
52	World's Most Useless Gadget	https://static.miraheze.org/bluearchivewiki/thumb/9/98/Item_Icon_Favor_19.png/81px-Item_Icon_Favor_19.png	Absolutely useless, but cute! Still, it's completely pointless. And yet, its cuteness totally makes up for it! This trinket is among the top five best toys to give to a special friend.	2	{aru_dress,hanako,himari,hina,hina_dress,hina_swimsuit,koyuki,makoto}	{ako,ako_dress,aru,aru_new_year,cherino,chinatsu_hot_spring,eimi,eimi_swimsuit,hoshino_battle_tank,hoshino_battle_dealer,kasumi,marina,michiru,mina,nagisa,saki,saki_swimsuit,serika,serika_new_year,serika_swimsuit}
16	Embroidered Handkerchief	https://static.miraheze.org/bluearchivewiki/thumb/7/77/Item_Icon_Favor_31.png/81px-Item_Icon_Favor_31.png	An exquisitely embroidered handkerchief.	2	{haruna,haruna_new_year,izuna,izuna_swimsuit,kayoko_new_year,kirino,mari,mari_track,mimori,miyu,miyu_swimsuit,rumi,yukari}	{airi_band,arisu_maid,azusa,hanako_swimsuit,hinata,hinata_swimsuit,ichika,kirara,serika_swimsuit,tomoe}
25	Jellies Cushion	https://static.miraheze.org/bluearchivewiki/thumb/e/e0/Item_Icon_Favor_14.png/81px-Item_Icon_Favor_14.png	The star of "Fruitjellies" is back! In cushion form! They've managed to recreate the concept of a jelly eating another jelly of the same color in great detail!	2	{midori,serina,serina_christmas}	{momoi_maid,sena,tsubaki,tsubaki_guide}
35	Mille-Feuille Traditional Parfait	https://static.miraheze.org/bluearchivewiki/thumb/c/c8/Item_Icon_Favor_Lv2_4.png/81px-Item_Icon_Favor_Lv2_4.png	A parfait sold at the famous confectionery shop Cafe Mille-Feuille in Trinity. The harmony of pastry, syrup, whipped cream, and fruits piled on top of soft ice cream is truly historic!	3	{airi_band,akari,akari_new_year,asuna,fubuki_swimsuit,haruna_track,hasumi_track,hiyori_swimsuit,ibuki,junko_new_year,kazusa_band,kirino,kokona,mika,reisa,sakurako,yoshimi_band}	{airi,asuna_bunny_girl,fubuki,hasumi,iori,iori_swimsuit,izumi,izumi_swimsuit,junko,kazusa,natsu,nodoka,nodoka_hot_spring,shun_small,yoshimi,yukari}
45	Summer Tube	https://static.miraheze.org/bluearchivewiki/thumb/0/0f/Item_Icon_Favor_34.png/81px-Item_Icon_Favor_34.png	It's summer! To the beach!A safety device for swimmers of all experience levels. Ready for anything with its cute and fancy design!	2	{atsuko_swimsuit,ayane_swimsuit,azusa_swimsuit,chise_swimsuit,eimi_swimsuit,fubuki_swimsuit,hanako_swimsuit,hifumi_swimsuit,hina_swimsuit,hinata_swimsuit,hiyori_swimsuit,hoshino_swimsuit,iori_swimsuit,izumi_swimsuit,izuna_swimsuit,kanna_swimsuit,kirino_swimsuit,koharu_swimsuit,mashiro_swimsuit,mimori_swimsuit,miyako_swimsuit,miyu_swimsuit,moe_swimsuit,nonomi_swimsuit,saki_swimsuit,saori_swimsuit,serika_swimsuit,shiroko_swimsuit,shizuko_swimsuit,tsurugi_swimsuit,ui_swimsuit,wakamo_swimsuit}	{}
17	Fine Maple Bonsai	https://static.miraheze.org/bluearchivewiki/thumb/0/0d/Item_Icon_Favor_Lv2_8.png/81px-Item_Icon_Favor_Lv2_8.png	Just looking at this top-quality maple bonsai is calming. The ever-changing leaves, shifting with the seasons as if they were changing clothes, create an air of elegance.	3	{haruka_new_year,tsubaki}	{haruka,hinata,mari,mari_track,tsukuyo}
27	Luxury Buffet Ticket	https://static.miraheze.org/bluearchivewiki/thumb/1/1f/Item_Icon_Favor_27.png/81px-Item_Icon_Favor_27.png	This ticket grants access to a luxury buffet operated by the best chef in all of Kivotos. As you might expect, it's very expensive.	2	{akari,akari_new_year,nodoka_hot_spring}	{hasumi,hasumi_track,hina_dress,hiyori_swimsuit,renge}
37	Music Concert Ticket	https://static.miraheze.org/bluearchivewiki/thumb/6/61/Item_Icon_Favor_Lv2_10.png/81px-Item_Icon_Favor_Lv2_10.png	Admission ticket to regularly scheduled concerts in Kivotos. From classical to the latest popular music. The perfect gift for anyone who loves a variety of music of any kind.	3	{haruna,haruna_new_year,hina_dress,kayoko_new_year,suzumi}	{nodoka_hot_spring,renge}
18	Forbidden Love ~Beautiful Sin~	https://static.miraheze.org/bluearchivewiki/thumb/e/ef/Item_Icon_Favor_3.png/81px-Item_Icon_Favor_3.png	The latest work from the popular romance novelist who wrote "Koi About Love"!Delve into a dizzying tale of forbidden love!	2	{hanako,hiyori_swimsuit,koharu,koharu_swimsuit,momiji,renge,tsurugi,tsurugi_swimsuit}	{atsuko_swimsuit,ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,chise,chise_swimsuit,iroha,kaho,kanna_swimsuit,kikyou,kotori,meru,mimori_swimsuit,minori,noa,shimiko,tsubaki_guide,ui,ui_swimsuit}
26	Jumping Detective Rabbit ~A trip through the misty hot springs~	https://static.miraheze.org/bluearchivewiki/thumb/4/41/Item_Icon_Favor_15.png/81px-Item_Icon_Favor_15.png	Whenever there's a case, these snow-white bunny ears are sure to crack it! Volume 3 of the Extraordinary Cottontail Detective series! The stage is set at the hot springs!	2	{ako_dress,kanna_swimsuit,kikyou,shimiko}	{atsuko_swimsuit,ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,chise,chise_swimsuit,hanako,iroha,kaho,koharu,kotori,meru,mimori_swimsuit,minori,momiji,noa,tsubaki_guide,ui,ui_swimsuit}
36	Nutrient-rich Multivitamin Jellies	https://static.miraheze.org/bluearchivewiki/thumb/8/83/Item_Icon_Favor_Lv2_7.png/81px-Item_Icon_Favor_Lv2_7.png	Gummy candy that is enriched with vitamins. Contains an assortment of fruit-flavored jellies and is fun to eat. Be careful you don't eat the whole pack before even noticing it!	3	{ako_dress,fuuka_new_year,juri,kanna,mashiro,mashiro_swimsuit,minori,saki_swimsuit,saya_casual,sena,serina,shigure,shigure_hot_spring,yuuka}	{hanae_christmas,saya,serina_christmas,shizuko,shizuko_swimsuit}
44	Streets of Thugs Vol. 1	https://static.miraheze.org/bluearchivewiki/thumb/9/9e/Item_Icon_Favor_Lv2_1.png/81px-Item_Icon_Favor_Lv2_1.png	The first volume of the Streets of Thugs series, a popular work famous for the "We have nothing but loyalty and guts!" line. You wouldn't think this from the cover, but the series got a lot of favorable reviews, citing primarily that the main character is surprisingly cute.	3	{kaho,kanna_swimsuit,kikyou,momiji,ui_swimsuit}	{atsuko_swimsuit,ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,chise,chise_swimsuit,hanako,iroha,kotori,meru,mimori_swimsuit,minori,noa,shimiko,tsubaki_guide,ui}
46	Stylish Comb	https://static.miraheze.org/bluearchivewiki/thumb/2/24/Item_Icon_Favor_Lv2_6.png/81px-Item_Icon_Favor_Lv2_6.png	A compact comb with a luxurious and fashionable design. Popular as a gift.	3	{arisu_maid,azusa_swimsuit,hanako_swimsuit,kirara,mari_track,miyu,miyu_swimsuit,rumi,saori_swimsuit,tsurugi,tsurugi_swimsuit,wakamo,wakamo_swimsuit,yukari}	{azusa,ichika,izuna,izuna_swimsuit,kayoko_new_year,mimori}
19	Guns, Charm, and Zeal	https://static.miraheze.org/bluearchivewiki/thumb/4/4a/Item_Icon_Favor_9.png/81px-Item_Icon_Favor_9.png	Guns, charm, and zeal! The bestselling book of the year investigates and analyzes the origins and roots of Kivotos pop culture.	2	{ayane,ayane_swimsuit,chinatsu,chinatsu_hot_spring,kikyou,minori,miyako,miyako_swimsuit,ui,ui_swimsuit}	{atsuko_swimsuit,chise,chise_swimsuit,hanako,iroha,kaho,kanna_swimsuit,koharu_swimsuit,kotori,meru,mimori_swimsuit,momiji,noa,shimiko,tomoe,tsubaki_guide}
28	Lace Pillow	https://static.miraheze.org/bluearchivewiki/thumb/7/79/Item_Icon_Favor_Lv2_0.png/81px-Item_Icon_Favor_Lv2_0.png	Lace pillow made of luxury materials. The design looks simple at first glance, but it literally contains the dreams of girls.	3	{hoshino,hoshino_battle_tank,hoshino_battle_dealer,hoshino_swimsuit,misaki,miyako_swimsuit,serina_christmas,tsubaki_guide}	{momoi_maid,sena,tsubaki}
38	Potted Bug-Eating Plant	https://static.miraheze.org/bluearchivewiki/thumb/a/a5/Item_Icon_Favor_28.png/81px-Item_Icon_Favor_28.png	A potted plant that's popular among those with eccentric taste. Apparently, the way it devours insects is cuter than you'd think.	2	{haruka,haruka_new_year,hinata,tsukuyo}	{atsuko_swimsuit,cherino,cherino_hot_spring,kaede,makoto,mari,mari_track,megu,mina,moe_swimsuit,mutsuki,mutsuki_new_year,saya_casual,umika}
47	Teddy Bear with Bow	https://static.miraheze.org/bluearchivewiki/thumb/5/51/Item_Icon_Favor_20.png/81px-Item_Icon_Favor_20.png	An ordinary but absolutely darling teddy bear. A popular product among students who love all things cute and adorable.	2	{azusa,azusa_swimsuit,ibuki,karin_bunny_girl,kotama,kotama_camping,marina,misaki,suzumi,wakamo,wakamo_swimsuit}	{arisu_maid,kaede,koyuki,maki,megu,meru,mutsuki,mutsuki_new_year,neru,shun_small,umika}
48	"The Life" Board Game	https://static.miraheze.org/bluearchivewiki/thumb/1/11/Item_Icon_Favor_Lv2_12.png/81px-Item_Icon_Favor_Lv2_12.png	An entertaining board game where you can get a job, win a lottery, and even travel to space. Just like life, every dice roll leaves you just one step short of your goal.	3	{arisu,arisu_maid,atsuko,atsuko_swimsuit,ibuki,koyuki,megu,meru,midori,momoi,momoi_maid,neru_bunny_girl,umika}	{kaede,kotama,kotama_camping,maki,mutsuki,mutsuki_new_year,neru}
20	Glassy Glow BB Cream	https://static.miraheze.org/bluearchivewiki/thumb/6/64/Item_Icon_Favor_6.png/81px-Item_Icon_Favor_6.png	A hit product from the luxury cosmetics brand Samuela. This BB cream evens out skin tone and provides a natural finish for a healthy glow.	2	{hanae,hanako_swimsuit,kirara,mika,saori,saori_swimsuit,shun}	{asuna,ichika,koharu,mimori_swimsuit,mine,nonomi,nonomi_swimsuit}
30	Large Whole Cake	https://static.miraheze.org/bluearchivewiki/thumb/2/2f/Item_Icon_Favor_26.png/81px-Item_Icon_Favor_26.png	The mere sight of this massive cake is enough to satisfy the senses. Its caloric info is detailed underneath.	2	{airi_band,asuna_bunny_girl,hasumi,hasumi_track,hiyori_swimsuit,kazusa_band,sakurako,yoshimi_band}	{airi,akari,akari_new_year,cherino,fubuki,fubuki_swimsuit,haruna_track,ibuki,iori,iori_swimsuit,izumi,izumi_swimsuit,junko,junko_new_year,kazusa,kokona,mika,natsu,nodoka,nodoka_hot_spring,reisa,shun_small,yoshimi,yukari}
29	Luxury Cookie Set	https://static.miraheze.org/bluearchivewiki/thumb/9/9f/Item_Icon_Favor_8.png/81px-Item_Icon_Favor_8.png	Schrödinger's set of exquisite luxury cookies. There is a good chance that something else will be inside instead of the cookies. Contents can not be confirmed unless the box is opened.	2	{airi,airi_band,fubuki,fubuki_swimsuit,haruna_new_year,haruna_track,ibuki,junko,junko_new_year,kazusa,kazusa_band,kokona,shun_small,yoshimi,yoshimi_band}	{asuna_bunny_girl,hasumi,hasumi_track,hiyori_swimsuit,iori,iori_swimsuit,izumi,izumi_swimsuit,kirino,kirino_swimsuit,mika,nagisa,natsu,nodoka,nodoka_hot_spring,reisa,sakurako,saya_casual,yukari}
39	Peroro Wheel	https://static.miraheze.org/bluearchivewiki/thumb/9/99/Item_Icon_Favor_1.png/81px-Item_Icon_Favor_1.png	The ninth product of the smash hit Momo Friends collaboration line-up. This Peroro-shaped exercise wheel is this year's most popular fitness accessory!	2	{hifumi,hifumi_swimsuit,shiroko,shiroko_swimsuit,shiroko_terror,toki,toki_bunny_girl}	{azusa,azusa_swimsuit,hanae_christmas,haruna_track,kirino_swimsuit,kotori_cheer_squad,shiroko_cycling,sumire}
21	Gamegirl Color Replica	https://static.miraheze.org/bluearchivewiki/thumb/f/fc/Item_Icon_Favor_11.png/81px-Item_Icon_Favor_11.png	"Life is your arcade!" Go retromania wild with this vintage reproduction of the classic Gamegirl Color.	2	{momoi,momoi_maid,neru_bunny_girl,yuzu,yuzu_maid}	{arisu,arisu_maid,chihiro,fubuki_swimsuit,hare,hare_camping,hibiki,hibiki_cheer_squad,ichika,iroha,kaede,kayoko,kayoko_dress,kayoko_new_year,midori_maid,moe,moe_swimsuit,reisa,utaha_cheer_squad}
49	Wavecat Pillow	https://static.miraheze.org/bluearchivewiki/thumb/4/4c/Item_Icon_Favor_0.png/81px-Item_Icon_Favor_0.png	The seventh product of the smash hit Momo Friends collaboration line-up! This Wavecat-shaped pillow is this year's third most popular bedding item.	2	{sena,tsubaki,tsubaki_guide}	{azusa,azusa_swimsuit,hifumi,hifumi_swimsuit,momoi_maid,serina_christmas}
22	Health Food Supplement	https://static.miraheze.org/bluearchivewiki/thumb/c/cc/Item_Icon_Favor_33.png/81px-Item_Icon_Favor_33.png	Feel rejuvenated with just one bite! This supplement is the perfect gift for your special someone.	2	{ako,ako_dress,fuuka_new_year,kanna,saya,shigure,shigure_hot_spring,shizuko,shizuko_swimsuit}	{atsuko,atsuko_swimsuit,hanae_christmas,kikyou,kotori,kotori_cheer_squad,minori,saki,saki_swimsuit,sena,serina_christmas,toki,toki_bunny_girl}
31	Matcha Ramune	https://static.miraheze.org/bluearchivewiki/thumb/8/8b/Item_Icon_Favor_13.png/81px-Item_Icon_Favor_13.png	A matcha-flavored, carbonated soft drink. Green and refreshing!	2	{fubuki_swimsuit,izumi,izumi_swimsuit}	{airi,airi_band,asuna_bunny_girl,fubuki,haruna_track,hasumi,hasumi_track,hiyori_swimsuit,ibuki,iori,iori_swimsuit,junko,junko_new_year,kazusa,kazusa_band,kokona,mika,natsu,nodoka,nodoka_hot_spring,reisa,sakurako,shun_small,yoshimi,yoshimi_band,yukari}
41	Sewing Kit	https://static.miraheze.org/bluearchivewiki/thumb/e/e9/Item_Icon_Favor_Lv2_9.png/81px-Item_Icon_Favor_Lv2_9.png	An expert's sewing kit with a selection of necessary tools for all kinds of situations. With this, if your clothes get ripped or your socks get holes, no problem!	3	{akane_bunny_girl,hibiki_cheer_squad,hinata,hinata_swimsuit,karin,karin_bunny_girl,midori_maid,mimori_swimsuit,pina,renge,toki_bunny_girl}	{akane,fuuka,fuuka_new_year,hiyori,mimori}
23	I-book Rare	https://static.miraheze.org/bluearchivewiki/thumb/7/78/Item_Icon_Favor_Lv2_5.png/81px-Item_Icon_Favor_Lv2_5.png	A famous laptop computer featured on the "Top 3 Electronic Devices Most Wanted by Students in Kivotos". Quite a luxury item. Everyone wants it! But it is so expensive!	3	{ayane_swimsuit,hare,hare_camping,kasumi,kayoko_dress,kotama_camping,kotori,miyako,moe_swimsuit,utaha,utaha_cheer_squad,yuuka,yuzu_maid}	{chihiro,hibiki,hibiki_cheer_squad,ichika,kayoko,kayoko_new_year,moe,reisa,yuzu}
33	Movie Ticket	https://static.miraheze.org/bluearchivewiki/thumb/a/a1/Item_Icon_Favor_21.png/81px-Item_Icon_Favor_21.png	"Snuggle up with your special someone and watch a movie!" This movie ticket is accepted at any theater and admits two people!	2	{hina_dress,pina,renge}	{nodoka_hot_spring}
40	Ring Bit	https://static.miraheze.org/bluearchivewiki/thumb/3/3e/Item_Icon_Favor_16.png/81px-Item_Icon_Favor_16.png	"Make fitness fun with games!" This exercise equipment uses an O-ring to make working out at home easy and fun whether for strength training or slimming down!	2	{hanae_christmas,kirino_swimsuit,sumire}	{arisu,arisu_maid,fubuki_swimsuit,hare,hare_camping,haruna_track,iroha,kaede,kotori_cheer_squad,midori_maid,momoi,momoi_maid,neru_bunny_girl,shiroko,shiroko_cycling,shiroko_swimsuit,shiroko_terror,toki,toki_bunny_girl,yuzu,yuzu_maid}
51	Thrice-a-day Dumbbell Set	https://static.miraheze.org/bluearchivewiki/thumb/3/3f/Item_Icon_Favor_Lv2_11.png/81px-Item_Icon_Favor_Lv2_11.png	A set of dumbbells of various weights. Use it three times a day. Build nice muscles by repeating your workout in the morning, at lunch, and in the evening!	3	{hanae_christmas,kirino_swimsuit,kotori_cheer_squad,shiroko_swimsuit,toki,toki_bunny_girl}	{haruna_track,shiroko,shiroko_cycling,shiroko_terror,sumire}
10	Buried Treasure Map	https://static.miraheze.org/bluearchivewiki/thumb/6/68/Item_Icon_Favor_17.png/81px-Item_Icon_Favor_17.png	There's treasure out there somewhere! A map of the sites where the three great gold treasures of Kivotos are supposed to be buried.	2	{aru,aru_dress,aru_new_year,cherino_hot_spring,hoshino,hoshino_battle_tank,hoshino_battle_dealer,hoshino_swimsuit,kasumi,makoto,michiru,natsu,shiroko_cycling,ui_swimsuit}	{ako,ako_dress,cherino,chinatsu_hot_spring,eimi,eimi_swimsuit,himari,marina,mina,nagisa,saki,saki_swimsuit,serika,serika_new_year,serika_swimsuit}
14	Extravagant Gilded Jar of Greed	https://static.miraheze.org/bluearchivewiki/thumb/8/8d/Item_Icon_Favor_29.png/81px-Item_Icon_Favor_29.png	An obviously exorbitant-looking jar gilt with gold leaf. Watch out for counterfeits!	2	{aru_dress,cherino,makoto,mina,serika,serika_new_year,serika_swimsuit}	{ako,ako_dress,aru,aru_new_year,atsuko_swimsuit,cherino_hot_spring,chinatsu_hot_spring,eimi,eimi_swimsuit,haruka,haruka_new_year,himari,hoshino_battle_tank,hoshino_battle_dealer,kaede,marina,megu,michiru,moe_swimsuit,mutsuki,mutsuki_new_year,nagisa,saki,saki_swimsuit,saya_casual,tsukuyo,umika}
32	MX-Ration C-Type Dessert Flavor	https://static.miraheze.org/bluearchivewiki/thumb/1/1e/Item_Icon_Favor_12.png/81px-Item_Icon_Favor_12.png	Calories equal Combat Power!	2	{hoshino_battle_tank,hoshino_battle_dealer,iori,iori_swimsuit,mashiro_swimsuit}	{airi,airi_band,asuna_bunny_girl,fubuki,fubuki_swimsuit,haruna_track,hasumi,hasumi_track,hiyori_swimsuit,ibuki,izumi,izumi_swimsuit,junko,junko_new_year,kazusa,kazusa_band,kokona,mashiro,mika,miyako,miyako_swimsuit,miyu,miyu_swimsuit,moe,moe_swimsuit,natsu,nodoka,nodoka_hot_spring,reisa,saki,saki_swimsuit,sakurako,saori_swimsuit,shun_small,yoshimi,yoshimi_band,yukari}
42	Retro Jewelled Egg	https://static.miraheze.org/bluearchivewiki/thumb/b/b6/Item_Icon_Favor_Lv2_3.png/81px-Item_Icon_Favor_Lv2_3.png	A jewelled egg with beautiful jewels and geometric patterns on an oval body. Of course, even if you kept it warm, no chick will ever hatch.	3	{aru_dress,cherino_hot_spring,chinatsu,hifumi_swimsuit,himari,hoshino,hoshino_swimsuit,makoto,mina,nagisa,serika_swimsuit,tomoe,ui}	{ako,ako_dress,aru,aru_new_year,cherino,chinatsu_hot_spring,eimi,eimi_swimsuit,hoshino_battle_tank,hoshino_battle_dealer,marina,michiru,saki,saki_swimsuit,serika,serika_new_year}
50	Wind-Up Music Box	https://static.miraheze.org/bluearchivewiki/thumb/7/70/Item_Icon_Favor_30.png/81px-Item_Icon_Favor_30.png	A fancy solid wood music box with vintage charm. Very popular among collectors.	2	{chinatsu_hot_spring,eimi,eimi_swimsuit,kayoko_dress,mina,nagisa}	{ako,ako_dress,aru,aru_dress,aru_new_year,cherino,chihiro,hibiki_cheer_squad,himari,hoshino_battle_tank,hoshino_battle_dealer,kayoko,kayoko_new_year,kazusa_band,makoto,marina,michiru,reisa,saki,saki_swimsuit,serika,serika_new_year,serika_swimsuit}
\.


--
-- Data for Name: missions; Type: TABLE DATA; Schema: public; Owner: arona
--

COPY public.missions (id, name, cost, difficulty, terrain, recommended_level, drops, stage_image_url) FROM stdin;
1	1-3	10	normal	urban	3	{"Pink Sneakers","Plain Baseball Cap","Sports Gloves"}	https://static.miraheze.org/bluearchivewiki/6/69/CHAPTER01_Normal_Main_Stage03.png
2	1-2	10	normal	urban	2	{"Sports Gloves","Waterproof Sports Bag","Plain Baseball Cap"}	https://static.miraheze.org/bluearchivewiki/c/c7/CHAPTER01_Normal_Main_Stage02.png
3	1-1	10	normal	urban	1	{"Plain Baseball Cap","Sports Gloves","Pink Sneakers"}	https://static.miraheze.org/bluearchivewiki/b/b6/CHAPTER01_Normal_Main_Stage01.png
4	1-4	10	normal	urban	5	{"Waterproof Sports Bag","Pink Sneakers","Tennis Headband"}	https://static.miraheze.org/bluearchivewiki/f/f8/CHAPTER01_Normal_Main_Stage04.png
5	1-2H	20	hard	urban	5	{"Suzumi's Eleph","Sports Gloves","Waterproof Digital Watch","Serval Metal Badge"}	https://static.miraheze.org/bluearchivewiki/8/87/CHAPTER01_Hard_Main_Stage02.png
6	1-5	10	normal	urban	7	{"Serval Metal Badge","Waterproof Sports Bag","Plain Baseball Cap"}	https://static.miraheze.org/bluearchivewiki/8/8d/CHAPTER01_Normal_Main_Stage05.png
7	1-1H	20	hard	urban	3	{"Yuuka's Eleph","Plain Baseball Cap","Traffic Safety Amulet","Waterproof Sports Bag"}	https://static.miraheze.org/bluearchivewiki/1/17/CHAPTER01_Hard_Main_Stage01.png
9	2-2	10	normal	urban	8	{"Tennis Headband","Waterproof Digital Watch","Bluetooth Necklace"}	https://static.miraheze.org/bluearchivewiki/0/02/CHAPTER02_Normal_Main_Stage02.png
8	2-1	10	normal	urban	7	{"Tennis Headband","Serval Metal Badge","Waterproof Digital Watch"}	https://static.miraheze.org/bluearchivewiki/1/10/CHAPTER02_Normal_Main_Stage01.png
11	2-3	10	normal	urban	10	{"Traffic Safety Amulet","Waterproof Digital Watch","Tennis Headband"}	https://static.miraheze.org/bluearchivewiki/3/32/CHAPTER02_Normal_Main_Stage03.png
10	1-3H	20	hard	urban	10	{"Serika's Eleph","Pink Sneakers","Bluetooth Necklace","Tennis Headband"}	https://static.miraheze.org/bluearchivewiki/2/22/CHAPTER01_Hard_Main_Stage03.png
12	2-4	10	normal	urban	12	{"Waterproof Digital Watch","Traffic Safety Amulet","Bluetooth Necklace"}	https://static.miraheze.org/bluearchivewiki/f/f0/CHAPTER02_Normal_Main_Stage04.png
13	2-5	10	normal	urban	14	{"Bluetooth Necklace","Serval Metal Badge","Traffic Safety Amulet"}	https://static.miraheze.org/bluearchivewiki/b/b6/CHAPTER02_Normal_Main_Stage05.png
14	2-3H	20	hard	urban	20	{"Junko's Eleph","Tennis Headband","Pink Sneakers","Bluetooth Necklace"}	https://static.miraheze.org/bluearchivewiki/8/83/CHAPTER02_Hard_Main_Stage03.png
15	2-1H	20	hard	urban	8	{"Kotori's Eleph","Waterproof Sports Bag","Plain Baseball Cap","Traffic Safety Amulet"}	https://static.miraheze.org/bluearchivewiki/9/9b/CHAPTER02_Hard_Main_Stage01.png
16	3-1	10	normal	urban	17	{"Beginner Tactical Training Blu-ray (Trinity)","Beginner Tactical Training Blu-ray (Shanhaijing)","Nebra Sky Disk Piece","Nimrud Lens Piece"}	https://static.miraheze.org/bluearchivewiki/2/24/CHAPTER03_Normal_Main_Stage01.png
17	2-2H	20	hard	urban	14	{"Akari's Eleph","Serval Metal Badge","Sports Gloves","Waterproof Digital Watch"}	https://static.miraheze.org/bluearchivewiki/0/07/CHAPTER02_Hard_Main_Stage02.png
18	3-2	10	normal	urban	18	{"Beginner Tactical Training Blu-ray (Gehenna)","Beginner Tactical Training Blu-ray (Trinity)","Phaistos Disc Piece","Mandrake Seed"}	https://static.miraheze.org/bluearchivewiki/b/b1/CHAPTER03_Normal_Main_Stage02.png
19	3-3	10	normal	urban	20	{"Beginner Tactical Training Blu-ray (Millennium)","Beginner Tactical Training Blu-ray (Gehenna)","Wolfsegg Iron Ore"}	https://static.miraheze.org/bluearchivewiki/1/16/CHAPTER03_Normal_Main_Stage03.png
20	3-4	10	normal	urban	21	{"Beginner Tactical Training Blu-ray (Abydos)","Beginner Tactical Training Blu-ray (Millennium)","Totem Pole Fragment"}	https://static.miraheze.org/bluearchivewiki/a/a3/CHAPTER03_Normal_Main_Stage04.png
21	3-1H	20	hard	urban	18	{"Suzumi's Eleph","Beginner Tactical Training Blu-ray (Millennium)","Beginner Tactical Training Blu-ray (Hyakkiyako)","Nebra Sky Disk Piece","Nimrud Lens Piece","Ancient Battery Fragment"}	https://static.miraheze.org/bluearchivewiki/4/48/CHAPTER03_Hard_Main_Stage01.png
22	3-2H	20	hard	urban	23	{"Hasumi's Eleph","Beginner Tactical Training Blu-ray (Gehenna)","Beginner Tactical Training Blu-ray (Shanhaijing)","Phaistos Disc Piece","Mandrake Seed","Broken Okiku Doll"}	https://static.miraheze.org/bluearchivewiki/c/cc/CHAPTER03_Hard_Main_Stage02.png
23	3-5	10	normal	urban	23	{"Beginner Tactical Training Blu-ray (Hyakkiyako)","Beginner Tactical Training Blu-ray (Abydos)","Ancient Battery Fragment"}	https://static.miraheze.org/bluearchivewiki/a/a3/CHAPTER03_Normal_Main_Stage05.png
24	3-3H	20	hard	urban	28	{"Shiroko's Eleph","Beginner Tactical Training Blu-ray (Trinity)","Beginner Tactical Training Blu-ray (Abydos)","Wolfsegg Iron Ore","Totem Pole Fragment"}	https://static.miraheze.org/bluearchivewiki/d/d1/CHAPTER03_Hard_Main_Stage03.png
25	4-1	10	normal	outdoors	25	{"Knitted Wool Hat Blueprint","Knitted Wool Hat Blueprint","Knitted Mittens Blueprint","Mouton Boots Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/84/CHAPTER04_Normal_Main_Stage01.png
26	4-2	10	normal	outdoors	26	{"Knitted Mittens Blueprint","Knitted Mittens Blueprint","Insulated Messenger Bag Blueprint","Knitted Wool Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f1/CHAPTER04_Normal_Main_Stage02.png
27	3-A	10	\N	urban	26	{"Beginner Tactical Training Blu-ray (Valkyrie)","Beginner Tactical Training Blu-ray (Arius)","Broken Okiku Doll"}	\N
28	4-3	10	normal	outdoors	28	{"Mouton Boots Blueprint","Mouton Boots Blueprint","Knitted Wool Hat Blueprint","Knitted Mittens Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/04/CHAPTER04_Normal_Main_Stage03.png
29	4-4	10	normal	outdoors	29	{"Insulated Messenger Bag Blueprint","Insulated Messenger Bag Blueprint","Mouton Boots Blueprint","Scrunchie Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/c7/CHAPTER04_Normal_Main_Stage04.png
30	4-5	10	normal	outdoors	30	{"Manaslu Felt Badge Blueprint","Manaslu Felt Badge Blueprint","Insulated Messenger Bag Blueprint","Knitted Wool Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/55/CHAPTER04_Normal_Main_Stage05.png
31	4-2H	20	hard	outdoors	30	{"Pina's Eleph","Knitted Mittens Blueprint","Knitted Mittens Blueprint","Knitted Mittens Blueprint","Leather Wristwatch Blueprint","Leather Wristwatch Blueprint","Manaslu Felt Badge Blueprint","Manaslu Felt Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/e/e0/CHAPTER04_Hard_Main_Stage02.png
41	5-3H	20	hard	outdoors	40	{"Hifumi's Eleph","Scrunchie Blueprint","Scrunchie Blueprint","Scrunchie Blueprint","Mouton Boots Blueprint","Mouton Boots Blueprint","Snowflake Pendant Blueprint","Snowflake Pendant Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/24/CHAPTER05_Hard_Main_Stage03.png
51	7-1	10	normal	indoors	43	{"Big Brother Fedora Blueprint","Peroro Oven Mitts Blueprint","Pinky-Paca Slippers Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/26/CHAPTER07_Normal_Main_Stage01.png
61	8-3	10	normal	indoors	49	{"Peroro Feather Blueprint","Wavecat Wristwatch Blueprint","Momo Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/52/CHAPTER08_Normal_Main_Stage03.png
70	9-5	10	normal	urban	55	{"Advanced Tactical Training Blu-ray (Hyakkiyako)","Advanced Tactical Training Blu-ray (Abydos)","Normal Tactical Training Blu-ray (Hyakkiyako)","Normal Tactical Training Blu-ray (Abydos)","Damaged Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/3/3f/CHAPTER09_Normal_Main_Stage05.png
80	10-1H	20	hard	urban	55	{"Suzumi's Eleph","Ribbon Beret Blueprint","Ribbon Beret Blueprint","Cross Blueprint","Navy School Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/c0/CHAPTER10_Hard_Main_Stage01.png
90	11-2H	20	hard	urban	61	{"Hasumi's Eleph","Veronica Embroidered Badge Blueprint","Veronica Embroidered Badge Blueprint","Leather Gloves Blueprint","Antique Pocket Watch Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/07/CHAPTER11_Hard_Main_Stage02.png
100	12-A	10	\N	indoors	68	{"Advanced Tactical Training Blu-ray (Red Winter)","Advance Tactical Training Blu-ray (Arius)","Broken Atlantis Medal"}	\N
110	14-3	10	normal	indoors	72	{"Tactical Satchel Blueprint","Dog Tag Blueprint","Dustproof Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a5/CHAPTER14_Normal_Main_Stage03.png
120	15-3	10	normal	urban	74	{"Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Shanhaijing)","Low-Purity Wolfsegg Steel"}	https://static.miraheze.org/bluearchivewiki/4/4f/CHAPTER15_Normal_Main_Stage03.png
128	16-5	10	normal	outdoors	80	{"Coco Devil Silver Badge Blueprint","Lace Gloves Blueprint","Frilly Mini Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/5c/CHAPTER16_Normal_Main_Stage05.png
138	17-5	10	normal	indoors	82	{"Punk Choker Blueprint","Bat Hairpin Blueprint","Devil Wing Tote Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/38/CHAPTER17_Normal_Main_Stage05.png
148	18-2H	20	hard	urban	88	{"Ayane's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Red Winter)","Aether Shard","Repaired Crystal Haniwa","Damaged Atlantis Medal"}	https://static.miraheze.org/bluearchivewiki/5/57/CHAPTER18_Hard_Main_Stage02.png
159	19-3H	20	hard	outdoors	91	{"Izuna's Eleph","Casual Sneakers Blueprint","Bucket Hat Blueprint","Street Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/53/CHAPTER19_Hard_Main_Stage03.png
168	21-1	10	normal	urban	88	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Red Winter)","Damaged Nebra Sky Disk","Damaged Nimrud Lens"}	https://static.miraheze.org/bluearchivewiki/e/e5/CHAPTER21_Normal_Main_Stage01.png
178	22-3	10	normal	outdoors	91	{"Waterproof Hiking Boots Blueprint","Leaf-feathered Fedora Blueprint","Leaf Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/0b/CHAPTER22_Normal_Main_Stage03.png
188	23-3	10	normal	indoors	91	{"Butterfly Shoulder Bag Blueprint","Green Leaf Necklace Blueprint","Lorelei Watch Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/be/CHAPTER23_Normal_Main_Stage03.png
198	25-1	10	normal	urban	90	{"Sailor Hat Blueprint","Sailing Gloves Blueprint","Aqua Sandals Blueprint"}	https://static.miraheze.org/bluearchivewiki/e/e5/CHAPTER25_Normal_Main_Stage01.png
32	4-3H	20	hard	outdoors	34	{"Yuuka's Eleph","Mouton Boots Blueprint","Mouton Boots Blueprint","Mouton Boots Blueprint","Snowflake Pendant Blueprint","Snowflake Pendant Blueprint","Scrunchie Blueprint","Scrunchie Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f4/CHAPTER04_Hard_Main_Stage03.png
43	6-3	10	normal	outdoors	40	{"Normal Tactical Training Blu-ray (Millennium)","Normal Tactical Training Blu-ray (Gehenna)","Beginner Tactical Training Blu-ray (Millennium)","Beginner Tactical Training Blu-ray (Gehenna)","Antikythera Mechanism Piece"}	https://static.miraheze.org/bluearchivewiki/0/01/CHAPTER06_Normal_Main_Stage03.png
52	7-3	10	normal	indoors	45	{"Pinky-Paca Slippers Blueprint","Big Brother Fedora Blueprint","Peroro Oven Mitts Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/30/CHAPTER07_Normal_Main_Stage03.png
63	8-5	10	normal	indoors	51	{"Nikolai Locket Blueprint","Angry Adelie Button Blueprint","Peroro Feather Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/18/CHAPTER08_Normal_Main_Stage05.png
72	9-3H	20	hard	urban	57	{"Shiroko's Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Abydos)","Normal Tactical Training Blu-ray (Trinity)","Normal Tactical Training Blu-ray (Abydos)","Wolfsegg Iron","Broken Totem Pole"}	https://static.miraheze.org/bluearchivewiki/7/77/CHAPTER09_Hard_Main_Stage03.png
82	10-2H	20	hard	urban	58	{"Pina's Eleph","Leather Gloves Blueprint","Leather Gloves Blueprint","Antique Pocket Watch Blueprint","Veronica Embroidered Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/df/CHAPTER10_Hard_Main_Stage02.png
92	12-2	10	normal	indoors	62	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Gehenna)","Aether Piece","Broken Crystal Haniwa"}	https://static.miraheze.org/bluearchivewiki/5/54/CHAPTER12_Normal_Main_Stage02.png
102	13-4	10	normal	urban	69	{"Multi-Purpose Hairpin Blueprint","Tactical Boots Blueprint","Tactical Satchel Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/b4/CHAPTER13_Normal_Main_Stage04.png
112	14-5	10	normal	indoors	73	{"Dog Tag Blueprint","Multi-Purpose Hairpin Blueprint","Tactical Satchel Blueprint"}	https://static.miraheze.org/bluearchivewiki/e/e0/CHAPTER14_Normal_Main_Stage05.png
122	15-5	10	normal	urban	75	{"Advanced Tactical Training Blu-ray (Hyakkiyako)","Advanced Tactical Training Blu-ray (Trinity)","Depleted Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/f/fe/CHAPTER15_Normal_Main_Stage05.png
132	16-2H	20	hard	outdoors	84	{"Mutsuki's Eleph","Lace Gloves Blueprint","Heeled Pumps Blueprint","Coco Devil Silver Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/66/CHAPTER16_Hard_Main_Stage02.png
143	17-3H	20	hard	indoors	87	{"Karin's Eleph","Devil Wing Tote Bag Blueprint","Punk Choker Blueprint","Gothic Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/d9/CHAPTER17_Hard_Main_Stage03.png
152	19-2	10	normal	outdoors	84	{"Arm Cover Blueprint","Street Badge Blueprint","Bucket Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/2d/CHAPTER19_Normal_Main_Stage02.png
162	20-5	10	normal	indoors	88	{"Chain Necklace Blueprint","Calligraphy Hairpin Blueprint","Street Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/14/CHAPTER20_Normal_Main_Stage05.png
172	21-5	10	normal	urban	90	{"Advanced Tactical Training Blu-ray (Hyakkiyako)","Advanced Tactical Training Blu-ray (Trinity)","Depleted Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/c/c6/CHAPTER21_Normal_Main_Stage05.png
182	22-2H	20	hard	outdoors	93	{"Kirino's Eleph","Pearl Yarn Gloves Blueprint","Waterproof Hiking Boots Blueprint","Lorelei Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/34/CHAPTER22_Hard_Main_Stage02.png
192	24-2	10	normal	outdoors	90	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Valkyrie)","Aether Shard","Repaired Crystal Haniwa"}	https://static.miraheze.org/bluearchivewiki/0/06/CHAPTER24_Normal_Main_Stage02.png
202	25-2	10	normal	urban	90	{"Sailing Gloves Blueprint","Harpyia Flexible Badge Blueprint","Sailor Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/6b/CHAPTER25_Normal_Main_Stage02.png
33	4-1H	20	hard	outdoors	26	{"Asuna's Eleph","Knitted Wool Hat Blueprint","Knitted Wool Hat Blueprint","Knitted Wool Hat Blueprint","Heat Pack Blueprint","Heat Pack Blueprint","Insulated Messenger Bag Blueprint","Insulated Messenger Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/09/CHAPTER04_Hard_Main_Stage01.png
42	6-1	10	normal	outdoors	38	{"Normal Tactical Training Blu-ray (Trinity)","Normal Tactical Training Blu-ray (Shanhaijing)","Beginner Tactical Training Blu-ray (Trinity)","Beginner Tactical Training Blu-ray (Shanhaijing)","Rohonc Codex Page","Voynich Manuscript Page"}	https://static.miraheze.org/bluearchivewiki/f/fb/CHAPTER06_Normal_Main_Stage01.png
53	7-2	10	normal	indoors	44	{"Peroro Oven Mitts Blueprint","Peroro Backpack Blueprint","Big Brother Fedora Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/6d/CHAPTER07_Normal_Main_Stage02.png
62	8-4	10	normal	indoors	50	{"Wavecat Wristwatch Blueprint","Peroro Feather Blueprint","Nikolai Locket Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/bf/CHAPTER08_Normal_Main_Stage04.png
73	9-1H	20	hard	urban	51	{"Akari's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Normal Tactical Training Blu-ray (Millennium)","Normal Tactical Training Blu-ray (Hyakkiyako)","Broken Nebra Sky Disk","Broken Nimrud Lens","Damaged Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/9/91/CHAPTER09_Hard_Main_Stage01.png
83	11-1	10	normal	urban	59	{"Winged Hairpin Blueprint","Veronica Embroidered Badge Blueprint","Antique Pocket Watch Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/3d/CHAPTER11_Normal_Main_Stage01.png
93	12-1	10	normal	indoors	62	{"Advanced Tactical Training Blu-ray (Shanhaijing)","Advanced Tactical Training Blu-ray (Trinity)","Damaged Rohonc Codex","Damaged Voynich Manuscript"}	https://static.miraheze.org/bluearchivewiki/3/35/CHAPTER12_Normal_Main_Stage01.png
103	13-2	10	normal	urban	67	{"Tactical Gloves Blueprint","Kazeyama Patch Blueprint","Bulletproof Helmet Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/86/CHAPTER13_Normal_Main_Stage02.png
113	14-4	10	normal	indoors	73	{"Dustproof Wristwatch Blueprint","Camo Daruma Blueprint","Kazeyama Patch Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/42/CHAPTER14_Normal_Main_Stage04.png
123	15-2H	20	hard	urban	78	{"Tsubaki's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Red Winter)","Damaged Phaistos Disc","Mandrake Juice","Repaired Okiku Doll"}	https://static.miraheze.org/bluearchivewiki/f/f0/CHAPTER15_Hard_Main_Stage02.png
133	17-1	10	normal	indoors	80	{"Cursed Doll Blueprint","Punk Choker Blueprint","Gothic Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/cf/CHAPTER17_Normal_Main_Stage01.png
142	18-3	10	normal	urban	83	{"Advanced Tactical Training Blu-ray (Shanhaijing)","Advanced Tactical Training Blu-ray (Millennium)","Damaged Antikythera Mechanism"}	https://static.miraheze.org/bluearchivewiki/7/76/CHAPTER18_Normal_Main_Stage03.png
153	19-3	10	normal	outdoors	85	{"Casual Sneakers Blueprint","Bucket Hat Blueprint","Calligraphy Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/8d/CHAPTER19_Normal_Main_Stage03.png
163	20-3	10	normal	indoors	87	{"Street Bag Blueprint","Chain Necklace Blueprint","Street Fashion Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/73/CHAPTER20_Normal_Main_Stage03.png
173	21-2H	20	hard	urban	92	{"Kayoko's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Red Winter)","Damaged Phaistos Disc","Mandrake Juice","Repaired Okiku Doll"}	https://static.miraheze.org/bluearchivewiki/0/00/CHAPTER21_Hard_Main_Stage02.png
183	22-3H	20	hard	outdoors	94	{"Hibiki's Eleph","Waterproof Hiking Boots Blueprint","Leaf-feathered Fedora Blueprint","Butterfly Shoulder Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/ac/CHAPTER22_Hard_Main_Stage03.png
193	24-1	10	normal	outdoors	90	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Red Winter)","Annotated Rohonc Codex","Annotated Voynich Manuscript"}	https://static.miraheze.org/bluearchivewiki/4/4f/CHAPTER24_Normal_Main_Stage01.png
203	25-5	10	normal	urban	92	{"Harpyia Flexible Badge Blueprint","Sailing Gloves Blueprint","Sailor Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a1/CHAPTER25_Normal_Main_Stage05.png
34	5-2	10	normal	outdoors	33	{"Scrunchie Blueprint","Scrunchie Blueprint","Leather Wristwatch Blueprint","Snowflake Pendant Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/fa/CHAPTER05_Normal_Main_Stage02.png
45	6-2	10	normal	outdoors	39	{"Normal Tactical Training Blu-ray (Gehenna)","Normal Tactical Training Blu-ray (Trinity)","Beginner Tactical Training Blu-ray (Gehenna)","Beginner Tactical Training Blu-ray (Trinity)","Aether Dust","Crystal Haniwa Fragment"}	https://static.miraheze.org/bluearchivewiki/c/c7/CHAPTER06_Normal_Main_Stage02.png
55	7-4	10	normal	indoors	46	{"Peroro Backpack Blueprint","Pinky-Paca Slippers Blueprint","Momo Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f1/CHAPTER07_Normal_Main_Stage04.png
65	8-2H	20	hard	indoors	50	{"Hasumi's Eleph","Angry Adelie Button Blueprint","Angry Adelie Button Blueprint","Peroro Oven Mitts Blueprint","Peroro Oven Mitts Blueprint","Wavecat Wristwatch Blueprint","Wavecat Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/4d/CHAPTER08_Hard_Main_Stage02.png
74	9-2H	20	hard	urban	54	{"Serika's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Shanhaijing)","Normal Tactical Training Blu-ray (Gehenna)","Normal Tactical Training Blu-ray (Shanhaijing)","Broken Phaistos Disc","Mandrake Sprout","Damaged Okiku Doll"}	https://static.miraheze.org/bluearchivewiki/0/06/CHAPTER09_Hard_Main_Stage02.png
85	11-2	10	normal	urban	59	{"Winged Hairpin Blueprint","Antique Pocket Watch Blueprint","Cross Choker Blueprint"}	https://static.miraheze.org/bluearchivewiki/9/94/CHAPTER11_Normal_Main_Stage02.png
94	12-5	10	normal	indoors	65	{"Advanced Tactical Training Blu-ray (Abydos)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Broken Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/6/6e/CHAPTER12_Normal_Main_Stage05.png
105	13-3	10	normal	urban	68	{"Tactical Boots Blueprint","Bulletproof Helmet Blueprint","Multi-Purpose Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/2b/CHAPTER13_Normal_Main_Stage03.png
115	14-1H	20	hard	indoors	75	{"Kayoko's Eleph","Kazeyama Patch Blueprint","Dustproof Wristwatch Blueprint","Camo Daruma Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/ad/CHAPTER14_Hard_Main_Stage01.png
124	16-1	10	normal	outdoors	78	{"Frilly Mini Hat Blueprint","Lace Gloves Blueprint","Heeled Pumps Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/29/CHAPTER16_Normal_Main_Stage01.png
134	16-3H	20	hard	outdoors	85	{"Hina's Eleph","Heeled Pumps Blueprint","Frilly Mini Hat Blueprint","Devil Wing Tote Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/28/CHAPTER16_Hard_Main_Stage03.png
144	18-5	10	normal	urban	84	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Repaired Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/9/90/CHAPTER18_Normal_Main_Stage05.png
154	19-4	10	normal	outdoors	85	{"Calligraphy Hairpin Blueprint","Casual Sneakers Blueprint","Street Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/4e/CHAPTER19_Normal_Main_Stage04.png
165	20-1H	20	hard	indoors	90	{"Serina's Eleph","Street Badge Blueprint","Street Fashion Wristwatch Blueprint","Pocket Deodorant Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/5f/CHAPTER20_Hard_Main_Stage01.png
175	22-2	10	normal	outdoors	90	{"Pearl Yarn Gloves Blueprint","Lorelei Badge Blueprint","Leaf-feathered Fedora Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/31/CHAPTER22_Normal_Main_Stage02.png
185	23-1H	20	hard	indoors	92	{"Juri's Eleph","Lorelei Badge Blueprint","Lorelei Watch Blueprint","Dream Catcher Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/19/CHAPTER23_Hard_Main_Stage01.png
195	24-4	10	normal	outdoors	91	{"Advanced Tactical Training Blu-ray (Hyakkiyako)","Advanced Tactical Training Blu-ray (Abydos)","Damaged Disco Colgante"}	https://static.miraheze.org/bluearchivewiki/3/35/CHAPTER24_Normal_Main_Stage04.png
204	25-2H	20	hard	urban	93	{"Ayane's Eleph","Sailing Gloves Blueprint","Aqua Sandals Blueprint","Harpyia Flexible Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/48/CHAPTER25_Hard_Main_Stage02.png
35	5-1	10	normal	outdoors	32	{"Scrunchie Blueprint","Scrunchie Blueprint","Manaslu Felt Badge Blueprint","Leather Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/7e/CHAPTER05_Normal_Main_Stage01.png
44	6-4	10	normal	outdoors	41	{"Normal Tactical Training Blu-ray (Abydos)","Normal Tactical Training Blu-ray (Millennium)","Beginner Tactical Training Blu-ray (Abydos)","Beginner Tactical Training Blu-ray (Millennium)","Disco Colgante Piece"}	https://static.miraheze.org/bluearchivewiki/1/18/CHAPTER06_Normal_Main_Stage04.png
54	7-1H	20	hard	indoors	43	{"Asuna's Eleph","Big Brother Fedora Blueprint","Big Brother Fedora Blueprint","Peroro Feather Blueprint","Peroro Feather Blueprint","Peroro Backpack Blueprint","Peroro Backpack Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/31/CHAPTER07_Hard_Main_Stage01.png
64	8-1H	20	hard	indoors	47	{"Kotori's Eleph","Peroro Backpack Blueprint","Peroro Backpack Blueprint","Big Brother Fedora Blueprint","Big Brother Fedora Blueprint","Peroro Feather Blueprint","Peroro Feather Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/6c/CHAPTER08_Hard_Main_Stage01.png
75	9-A	10	\N	urban	58	{"Advanced Tactical Training Blu-ray (Valkyrie)","Advance Tactical Training Blu-ray (Arius)","Normal Tactical Training Blu-ray (Valkyrie)","Normal Tactical Training Blu-ray (Arius)","Damaged Okiku Doll"}	\N
84	10-3H	20	hard	urban	60	{"Hifumi's Eleph","Antique Enamel Loafers Blueprint","Antique Enamel Loafers Blueprint","Cross Choker Blueprint","Winged Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/e/e9/CHAPTER10_Hard_Main_Stage03.png
95	12-3	10	normal	indoors	63	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Millennium)","Broken Antikythera Mechanism"}	https://static.miraheze.org/bluearchivewiki/1/12/CHAPTER12_Normal_Main_Stage03.png
104	13-1H	20	hard	urban	66	{"Haruka's Eleph","Bulletproof Helmet Blueprint","Tactical Gloves Blueprint","Multi-Purpose Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/60/CHAPTER13_Hard_Main_Stage01.png
114	14-2H	20	hard	indoors	76	{"Chise's Eleph","Multi-Purpose Hairpin Blueprint","Camo Daruma Blueprint","Dog Tag Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/82/CHAPTER14_Hard_Main_Stage02.png
125	15-3H	20	hard	urban	80	{"Neru's Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Valkyrie)","Low-Purity Wolfsegg Steel","Repaired Totem Pole"}	https://static.miraheze.org/bluearchivewiki/a/a1/CHAPTER15_Hard_Main_Stage03.png
135	17-2	10	normal	indoors	80	{"Bat Hairpin Blueprint","Gothic Wristwatch Blueprint","Cursed Doll Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/b7/CHAPTER17_Normal_Main_Stage02.png
145	18-2	10	normal	urban	82	{"Advanced Tactical Training Blu-ray (Valkyrie)","Advanced Tactical Training Blu-ray (Gehenna)","Aether Shard","Repaired Crystal Haniwa"}	https://static.miraheze.org/bluearchivewiki/0/05/CHAPTER18_Normal_Main_Stage02.png
155	19-5	10	normal	outdoors	86	{"Street Badge Blueprint","Arm Cover Blueprint","Bucket Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/d9/CHAPTER19_Normal_Main_Stage05.png
164	21-2	10	normal	urban	88	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Valkyrie)","Damaged Phaistos Disc","Mandrake Juice"}	https://static.miraheze.org/bluearchivewiki/6/6e/CHAPTER21_Normal_Main_Stage02.png
174	21-3H	20	hard	urban	93	{"Hifumi's (Swimsuit) Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Abydos)","Low-Purity Wolfsegg Steel","Repaired Totem Pole"}	https://static.miraheze.org/bluearchivewiki/5/5e/CHAPTER21_Hard_Main_Stage03.png
184	23-1	10	normal	indoors	90	{"Dream Catcher Blueprint","Green Leaf Necklace Blueprint","Lorelei Watch Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/df/CHAPTER23_Normal_Main_Stage01.png
194	24-3	10	normal	outdoors	91	{"Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Shanhaijing)","Damaged Antikythera Mechanism","Repaired Roman Dodecahedron"}	https://static.miraheze.org/bluearchivewiki/9/97/CHAPTER24_Normal_Main_Stage03.png
205	25-3	10	normal	urban	91	{"Aqua Sandals Blueprint","Sailor Hat Blueprint","Anchor Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/41/CHAPTER25_Normal_Main_Stage03.png
36	5-4	10	normal	outdoors	35	{"Leather Wristwatch Blueprint","Leather Wristwatch Blueprint","Heat Pack Blueprint","Snowflake Pendant Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/79/CHAPTER05_Normal_Main_Stage04.png
46	6-1H	20	hard	outdoors	38	{"Suzumi's Eleph","Normal Tactical Training Blu-ray (Millennium)","Normal Tactical Training Blu-ray (Hyakkiyako)","Beginner Tactical Training Blu-ray (Millennium)","Beginner Tactical Training Blu-ray (Hyakkiyako)","Rohonc Codex Page","Voynich Manuscript Page","Mystery Stone Piece"}	https://static.miraheze.org/bluearchivewiki/c/cc/CHAPTER06_Hard_Main_Stage01.png
57	7-2H	20	hard	indoors	46	{"Serika's Eleph","Peroro Oven Mitts Blueprint","Peroro Oven Mitts Blueprint","Wavecat Wristwatch Blueprint","Wavecat Wristwatch Blueprint","Angry Adelie Button Blueprint","Angry Adelie Button Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/b6/CHAPTER07_Hard_Main_Stage02.png
67	9-1	10	normal	urban	51	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Shanhaijing)","Normal Tactical Training Blu-ray (Trinity)","Normal Tactical Training Blu-ray (Shanhaijing)","Broken Nebra Sky Disk","Broken Nimrud Lens"}	https://static.miraheze.org/bluearchivewiki/9/95/CHAPTER09_Normal_Main_Stage01.png
76	10-2	10	normal	urban	56	{"Leather Gloves Blueprint","Navy School Bag Blueprint","Ribbon Beret Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/bb/CHAPTER10_Normal_Main_Stage02.png
89	11-4	10	normal	urban	61	{"Antique Pocket Watch Blueprint","Cross Blueprint","Cross Choker Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f7/CHAPTER11_Normal_Main_Stage04.png
99	12-2H	20	hard	indoors	66	{"Yuuka's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Shanhaijing)","Aether Piece","Broken Crystal Haniwa","Broken Atlantis Medal"}	https://static.miraheze.org/bluearchivewiki/b/b1/CHAPTER12_Hard_Main_Stage02.png
109	13-2H	20	hard	urban	71	{"Mutsuki's Eleph","Tactical Gloves Blueprint","Tactical Boots Blueprint","Kazeyama Patch Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a9/CHAPTER13_Hard_Main_Stage02.png
119	15-4	10	normal	urban	75	{"Advanced Tactical Training Blu-ray (Abydos)","Advanced Tactical Training Blu-ray (Gehenna)","Repaired Totem Pole"}	https://static.miraheze.org/bluearchivewiki/d/d4/CHAPTER15_Normal_Main_Stage04.png
130	16-4	10	normal	outdoors	79	{"Bat Hairpin Blueprint","Heeled Pumps Blueprint","Devil Wing Tote Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/38/CHAPTER16_Normal_Main_Stage04.png
140	17-2H	20	hard	indoors	86	{"Chise's Eleph","Bat Hairpin Blueprint","Cursed Doll Blueprint","Punk Choker Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/b0/CHAPTER17_Hard_Main_Stage02.png
151	19-1	10	normal	outdoors	84	{"Bucket Hat Blueprint","Arm Cover Blueprint","Casual Sneakers Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/ae/CHAPTER19_Normal_Main_Stage01.png
160	20-4	10	normal	indoors	87	{"Street Fashion Wristwatch Blueprint","Pocket Deodorant Blueprint","Street Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a9/CHAPTER20_Normal_Main_Stage04.png
171	21-1H	20	hard	urban	91	{"Yoshimi's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Damaged Nebra Sky Disk","Damaged Nimrud Lens","Depleted Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/d/d1/CHAPTER21_Hard_Main_Stage01.png
180	22-1H	20	hard	outdoors	92	{"Shimiko's Eleph","Leaf-feathered Fedora Blueprint","Pearl Yarn Gloves Blueprint","Leaf Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/86/CHAPTER22_Hard_Main_Stage01.png
190	23-5	10	normal	indoors	92	{"Green Leaf Necklace Blueprint","Leaf Hairpin Blueprint","Butterfly Shoulder Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/21/CHAPTER23_Normal_Main_Stage05.png
200	24-3H	20	hard	outdoors	94	{"Hina's Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Damaged Antikythera Mechanism","Damaged Disco Colgante","Repaired Roman Dodecahedron"}	https://static.miraheze.org/bluearchivewiki/a/a2/CHAPTER24_Hard_Main_Stage03.png
37	5-3	10	normal	outdoors	34	{"Heat Pack Blueprint","Heat Pack Blueprint","Leather Wristwatch Blueprint","Scrunchie Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/2a/CHAPTER05_Normal_Main_Stage03.png
47	6-5	10	normal	outdoors	43	{"Normal Tactical Training Blu-ray (Hyakkiyako)","Normal Tactical Training Blu-ray (Abydos)","Beginner Tactical Training Blu-ray (Hyakkiyako)","Beginner Tactical Training Blu-ray (Abydos)","Mystery Stone Piece"}	https://static.miraheze.org/bluearchivewiki/e/e4/CHAPTER06_Normal_Main_Stage05.png
56	7-5	10	normal	indoors	47	{"Angry Adelie Button Blueprint","Peroro Backpack Blueprint","Big Brother Fedora Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/da/CHAPTER07_Normal_Main_Stage05.png
66	8-3H	20	hard	indoors	53	{"Haruna's Eleph","Momo Hairpin Blueprint","Momo Hairpin Blueprint","Pinky-Paca Slippers Blueprint","Pinky-Paca Slippers Blueprint","Nikolai Locket Blueprint","Nikolai Locket Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/51/CHAPTER08_Hard_Main_Stage03.png
77	10-1	10	normal	urban	55	{"Ribbon Beret Blueprint","Leather Gloves Blueprint","Antique Enamel Loafers Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a2/CHAPTER10_Normal_Main_Stage01.png
88	11-3	10	normal	urban	60	{"Cross Blueprint","Antique Pocket Watch Blueprint","Winged Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/b/bb/CHAPTER11_Normal_Main_Stage03.png
98	12-3H	20	hard	indoors	70	{"Haruna's Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Abydos)","Broken Antikythera Mechanism","Broken Disco Colgante"}	https://static.miraheze.org/bluearchivewiki/2/2c/CHAPTER12_Hard_Main_Stage03.png
108	14-1	10	normal	indoors	70	{"Camo Daruma Blueprint","Dog Tag Blueprint","Dustproof Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/17/CHAPTER14_Normal_Main_Stage01.png
118	15-1	10	normal	urban	72	{"Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Red Winter)","Damaged Nebra Sky Disk","Damaged Nimrud Lens"}	https://static.miraheze.org/bluearchivewiki/5/56/CHAPTER15_Normal_Main_Stage01.png
131	16-2	10	normal	outdoors	78	{"Lace Gloves Blueprint","Coco Devil Silver Badge Blueprint","Frilly Mini Hat Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/38/CHAPTER16_Normal_Main_Stage02.png
141	18-1	10	normal	urban	82	{"Advanced Tactical Training Blu-ray (Red Winter)","Advanced Tactical Training Blu-ray (Trinity)","Annotated Rohonc Codex","Annotated Voynich Manuscript"}	https://static.miraheze.org/bluearchivewiki/4/4a/CHAPTER18_Normal_Main_Stage01.png
150	18-A	10	\N	urban	87	{"Advanced Tactical Training Blu-ray (Millennium)","Advance Tactical Training Blu-ray (Arius)","Damaged Atlantis Medal"}	\N
161	20-2	10	normal	indoors	86	{"Calligraphy Hairpin Blueprint","Street Fashion Wristwatch Blueprint","Pocket Deodorant Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/ff/CHAPTER20_Normal_Main_Stage02.png
170	21-4	10	normal	urban	89	{"Advanced Tactical Training Blu-ray (Abydos)","Advance Tactical Training Blu-ray (Arius)","Repaired Totem Pole"}	https://static.miraheze.org/bluearchivewiki/6/6c/CHAPTER21_Normal_Main_Stage04.png
181	22-5	10	normal	outdoors	92	{"Lorelei Badge Blueprint","Pearl Yarn Gloves Blueprint","Leaf-feathered Fedora Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/17/CHAPTER22_Normal_Main_Stage05.png
191	23-3H	20	hard	indoors	94	{"Arisu's Eleph","Butterfly Shoulder Bag Blueprint","Green Leaf Necklace Blueprint","Lorelei Watch Blueprint"}	https://static.miraheze.org/bluearchivewiki/9/9c/CHAPTER23_Hard_Main_Stage03.png
201	25-4	10	normal	urban	91	{"Anchor Hairpin Blueprint","Harpyia Flexible Badge Blueprint","Sling Dry Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a9/CHAPTER25_Normal_Main_Stage04.png
38	5-1H	20	hard	outdoors	32	{"Akari's Eleph","Insulated Messenger Bag Blueprint","Insulated Messenger Bag Blueprint","Insulated Messenger Bag Blueprint","Knitted Wool Hat Blueprint","Knitted Wool Hat Blueprint","Heat Pack Blueprint","Heat Pack Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/1e/CHAPTER05_Hard_Main_Stage01.png
49	6-2H	20	hard	outdoors	42	{"Pina's Eleph","Normal Tactical Training Blu-ray (Gehenna)","Normal Tactical Training Blu-ray (Shanhaijing)","Beginner Tactical Training Blu-ray (Gehenna)","Beginner Tactical Training Blu-ray (Shanhaijing)","Aether Dust","Crystal Haniwa Fragment","Atlantis Medal Piece"}	https://static.miraheze.org/bluearchivewiki/3/36/CHAPTER06_Hard_Main_Stage02.png
59	8-1	10	normal	indoors	47	{"Momo Hairpin Blueprint","Angry Adelie Button Blueprint","Wavecat Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/3d/CHAPTER08_Normal_Main_Stage01.png
69	9-3	10	normal	urban	53	{"Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Gehenna)","Normal Tactical Training Blu-ray (Millennium)","Normal Tactical Training Blu-ray (Gehenna)","Wolfsegg Iron"}	https://static.miraheze.org/bluearchivewiki/1/18/CHAPTER09_Normal_Main_Stage03.png
79	10-4	10	normal	urban	58	{"Navy School Bag Blueprint","Antique Enamel Loafers Blueprint","Winged Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/d2/CHAPTER10_Normal_Main_Stage04.png
87	11-1H	20	hard	urban	58	{"Akari's Eleph","Navy School Bag Blueprint","Navy School Bag Blueprint","Ribbon Beret Blueprint","Cross Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/7a/CHAPTER11_Hard_Main_Stage01.png
97	12-4	10	normal	indoors	64	{"Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Abydos)","Broken Disco Colgante"}	https://static.miraheze.org/bluearchivewiki/4/4c/CHAPTER12_Normal_Main_Stage04.png
107	13-3H	20	hard	urban	75	{"Izumi's Eleph","Tactical Boots Blueprint","Bulletproof Helmet Blueprint","Tactical Satchel Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f4/CHAPTER13_Hard_Main_Stage03.png
117	15-2	10	normal	urban	73	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Valkyrie)","Damaged Phaistos Disc","Mandrake Juice"}	https://static.miraheze.org/bluearchivewiki/6/6e/CHAPTER15_Normal_Main_Stage02.png
127	16-3	10	normal	outdoors	79	{"Heeled Pumps Blueprint","Frilly Mini Hat Blueprint","Bat Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/7f/CHAPTER16_Normal_Main_Stage03.png
137	17-4	10	normal	indoors	81	{"Gothic Wristwatch Blueprint","Cursed Doll Blueprint","Coco Devil Silver Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/7c/CHAPTER17_Normal_Main_Stage04.png
147	18-1H	20	hard	urban	87	{"Shimiko's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Shanhaijing)","Annotated Rohonc Codex","Annotated Voynich Manuscript","Repaired Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/0/06/CHAPTER18_Hard_Main_Stage01.png
157	19-2H	20	hard	outdoors	90	{"Airi's Eleph","Arm Cover Blueprint","Casual Sneakers Blueprint","Street Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/da/CHAPTER19_Hard_Main_Stage02.png
167	20-2H	20	hard	indoors	91	{"Hare's Eleph","Calligraphy Hairpin Blueprint","Pocket Deodorant Blueprint","Chain Necklace Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/a3/CHAPTER20_Hard_Main_Stage02.png
177	21-A	10	\N	urban	93	{"Advanced Tactical Training Blu-ray (Gehenna)","Advance Tactical Training Blu-ray (Arius)","Repaired Okiku Doll"}	\N
187	23-2	10	normal	indoors	90	{"Leaf Hairpin Blueprint","Lorelei Watch Blueprint","Dream Catcher Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/81/CHAPTER23_Normal_Main_Stage02.png
197	24-1H	20	hard	outdoors	92	{"Serina's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advance Tactical Training Blu-ray (Arius)","Annotated Rohonc Codex","Annotated Voynich Manuscript","Repaired Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/4/44/CHAPTER24_Hard_Main_Stage01.png
207	25-3H	20	hard	urban	94	{"Saya's (Casual) Eleph","Aqua Sandals Blueprint","Sailor Hat Blueprint","Sling Dry Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/f/f4/CHAPTER25_Hard_Main_Stage03.png
39	5-5	10	normal	outdoors	36	{"Snowflake Pendant Blueprint","Snowflake Pendant Blueprint","Manaslu Felt Badge Blueprint","Heat Pack Blueprint"}	https://static.miraheze.org/bluearchivewiki/9/9a/CHAPTER05_Normal_Main_Stage05.png
48	6-A	10	\N	outdoors	46	{"Normal Tactical Training Blu-ray (Valkyrie)","Normal Tactical Training Blu-ray (Arius)","Beginner Tactical Training Blu-ray (Valkyrie)","Beginner Tactical Training Blu-ray (Arius)","Atlantis Medal Piece"}	\N
58	7-3H	20	hard	indoors	49	{"Hoshino's Eleph","Pinky-Paca Slippers Blueprint","Pinky-Paca Slippers Blueprint","Nikolai Locket Blueprint","Nikolai Locket Blueprint","Momo Hairpin Blueprint","Momo Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/03/CHAPTER07_Hard_Main_Stage03.png
68	9-2	10	normal	urban	52	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Trinity)","Normal Tactical Training Blu-ray (Gehenna)","Normal Tactical Training Blu-ray (Trinity)","Broken Phaistos Disc","Mandrake Sprout"}	https://static.miraheze.org/bluearchivewiki/9/96/CHAPTER09_Normal_Main_Stage02.png
78	10-3	10	normal	urban	57	{"Antique Enamel Loafers Blueprint","Ribbon Beret Blueprint","Leather Gloves Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/ab/CHAPTER10_Normal_Main_Stage03.png
86	11-5	10	normal	urban	62	{"Cross Choker Blueprint","Veronica Embroidered Badge Blueprint","Cross Blueprint"}	https://static.miraheze.org/bluearchivewiki/a/ab/CHAPTER11_Normal_Main_Stage05.png
96	12-1H	20	hard	indoors	61	{"Kotori's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Hyakkiyako)","Damaged Rohonc Codex","Damaged Voynich Manuscript","Broken Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/1/1e/CHAPTER12_Hard_Main_Stage01.png
106	13-5	10	normal	urban	70	{"Kazeyama Patch Blueprint","Tactical Gloves Blueprint","Bulletproof Helmet Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/85/CHAPTER13_Normal_Main_Stage05.png
116	14-3H	20	hard	indoors	78	{"Iori's Eleph","Tactical Satchel Blueprint","Dog Tag Blueprint","Dustproof Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/84/CHAPTER14_Hard_Main_Stage03.png
126	15-A	10	\N	urban	75	{"Advanced Tactical Training Blu-ray (Trinity)","Advance Tactical Training Blu-ray (Arius)","Repaired Okiku Doll"}	\N
136	17-3	10	normal	indoors	81	{"Devil Wing Tote Bag Blueprint","Punk Choker Blueprint","Gothic Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/3/32/CHAPTER17_Normal_Main_Stage03.png
146	18-4	10	normal	urban	83	{"Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Abydos)","Damaged Disco Colgante"}	https://static.miraheze.org/bluearchivewiki/0/02/CHAPTER18_Normal_Main_Stage04.png
156	19-1H	20	hard	outdoors	89	{"Juri's Eleph","Bucket Hat Blueprint","Arm Cover Blueprint","Calligraphy Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/5/58/CHAPTER19_Hard_Main_Stage01.png
166	20-3H	20	hard	indoors	92	{"Iori's Eleph","Street Bag Blueprint","Chain Necklace Blueprint","Street Fashion Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/8d/CHAPTER20_Hard_Main_Stage03.png
176	22-1	10	normal	outdoors	90	{"Leaf-feathered Fedora Blueprint","Pearl Yarn Gloves Blueprint","Waterproof Hiking Boots Blueprint"}	https://static.miraheze.org/bluearchivewiki/d/dd/CHAPTER22_Normal_Main_Stage01.png
186	23-2H	20	hard	indoors	93	{"Tsubaki's Eleph","Leaf Hairpin Blueprint","Dream Catcher Blueprint","Green Leaf Necklace Blueprint"}	https://static.miraheze.org/bluearchivewiki/6/6b/CHAPTER23_Hard_Main_Stage02.png
196	24-5	10	normal	outdoors	92	{"Advanced Tactical Training Blu-ray (Millennium)","Advance Tactical Training Blu-ray (Arius)","Repaired Mystery Stone"}	https://static.miraheze.org/bluearchivewiki/6/6b/CHAPTER24_Normal_Main_Stage05.png
206	25-1H	20	hard	urban	92	{"Haruka's Eleph","Sailor Hat Blueprint","Sailing Gloves Blueprint","Anchor Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/1/1d/CHAPTER25_Hard_Main_Stage01.png
40	5-2H	20	hard	outdoors	36	{"Junko's Eleph","Manaslu Felt Badge Blueprint","Manaslu Felt Badge Blueprint","Manaslu Felt Badge Blueprint","Knitted Mittens Blueprint","Knitted Mittens Blueprint","Leather Wristwatch Blueprint","Leather Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/c2/CHAPTER05_Hard_Main_Stage02.png
50	6-3H	20	hard	outdoors	45	{"Junko's Eleph","Normal Tactical Training Blu-ray (Trinity)","Normal Tactical Training Blu-ray (Abydos)","Beginner Tactical Training Blu-ray (Trinity)","Beginner Tactical Training Blu-ray (Abydos)","Antikythera Mechanism Piece","Disco Colgante Piece"}	https://static.miraheze.org/bluearchivewiki/5/5f/CHAPTER06_Hard_Main_Stage03.png
60	8-2	10	normal	indoors	48	{"Momo Hairpin Blueprint","Wavecat Wristwatch Blueprint","Nikolai Locket Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/c3/CHAPTER08_Normal_Main_Stage02.png
71	9-4	10	normal	urban	54	{"Advanced Tactical Training Blu-ray (Abydos)","Advanced Tactical Training Blu-ray (Millennium)","Normal Tactical Training Blu-ray (Abydos)","Normal Tactical Training Blu-ray (Millennium)","Broken Totem Pole"}	https://static.miraheze.org/bluearchivewiki/7/7e/CHAPTER09_Normal_Main_Stage04.png
81	10-5	10	normal	urban	59	{"Veronica Embroidered Badge Blueprint","Navy School Bag Blueprint","Ribbon Beret Blueprint"}	https://static.miraheze.org/bluearchivewiki/9/9f/CHAPTER10_Normal_Main_Stage05.png
91	11-3H	20	hard	urban	63	{"Hoshino's Eleph","Winged Hairpin Blueprint","Winged Hairpin Blueprint","Antique Enamel Loafers Blueprint","Cross Choker Blueprint"}	https://static.miraheze.org/bluearchivewiki/c/c3/CHAPTER11_Hard_Main_Stage03.png
101	13-1	10	normal	urban	65	{"Bulletproof Helmet Blueprint","Tactical Gloves Blueprint","Tactical Boots Blueprint"}	https://static.miraheze.org/bluearchivewiki/4/43/CHAPTER13_Normal_Main_Stage01.png
111	14-2	10	normal	indoors	71	{"Multi-Purpose Hairpin Blueprint","Dustproof Wristwatch Blueprint","Camo Daruma Blueprint"}	https://static.miraheze.org/bluearchivewiki/8/85/CHAPTER14_Normal_Main_Stage02.png
121	15-1H	20	hard	urban	77	{"Haruka's Eleph","Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Shanhaijing)","Damaged Nebra Sky Disk","Damaged Nimrud Lens","Depleted Ancient Battery"}	https://static.miraheze.org/bluearchivewiki/a/a5/CHAPTER15_Hard_Main_Stage01.png
129	16-1H	20	hard	outdoors	83	{"Asuna's Eleph","Frilly Mini Hat Blueprint","Lace Gloves Blueprint","Bat Hairpin Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/7e/CHAPTER16_Hard_Main_Stage01.png
139	17-1H	20	hard	indoors	85	{"Yoshimi's Eleph","Coco Devil Silver Badge Blueprint","Gothic Wristwatch Blueprint","Cursed Doll Blueprint"}	https://static.miraheze.org/bluearchivewiki/2/2a/CHAPTER17_Hard_Main_Stage01.png
149	18-3H	20	hard	urban	89	{"Aru's Eleph","Advanced Tactical Training Blu-ray (Trinity)","Advanced Tactical Training Blu-ray (Abydos)","Damaged Antikythera Mechanism","Damaged Disco Colgante"}	https://static.miraheze.org/bluearchivewiki/a/a6/CHAPTER18_Hard_Main_Stage03.png
158	20-1	10	normal	indoors	86	{"Pocket Deodorant Blueprint","Chain Necklace Blueprint","Street Fashion Wristwatch Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/0f/CHAPTER20_Normal_Main_Stage01.png
169	21-3	10	normal	urban	89	{"Advanced Tactical Training Blu-ray (Millennium)","Advanced Tactical Training Blu-ray (Shanhaijing)","Low-Purity Wolfsegg Steel"}	https://static.miraheze.org/bluearchivewiki/0/0d/CHAPTER21_Normal_Main_Stage03.png
179	22-4	10	normal	outdoors	91	{"Leaf Hairpin Blueprint","Waterproof Hiking Boots Blueprint","Butterfly Shoulder Bag Blueprint"}	https://static.miraheze.org/bluearchivewiki/0/08/CHAPTER22_Normal_Main_Stage04.png
189	23-4	10	normal	indoors	91	{"Lorelei Watch Blueprint","Dream Catcher Blueprint","Lorelei Badge Blueprint"}	https://static.miraheze.org/bluearchivewiki/7/73/CHAPTER23_Normal_Main_Stage04.png
199	24-2H	20	hard	outdoors	93	{"Mari's Eleph","Advanced Tactical Training Blu-ray (Gehenna)","Advanced Tactical Training Blu-ray (Red Winter)","Aether Shard","Repaired Crystal Haniwa","Damaged Atlantis Medal"}	https://static.miraheze.org/bluearchivewiki/8/8f/CHAPTER24_Hard_Main_Stage02.png
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: arona
--

COPY public.skills (id, student_id, kind, name, description, cost) FROM stdin;
1	airi	ex	It's a waste but... umph!	Deal **265~464%** damage to all enemies in a circular area, decrease their movement speed by **22.8%** and reduce attack speed by **20~26.2%** for **0~20 seconds**.	5
2	airi	basic	You might feel a little brain freeze...	Every **25 seconds**, decrease one enemy's attack speed by **18.4~35.1%**. (Duration: **30 seconds**)	\N
3	airi	enhanced	The power of pudding	Increase Attack by **14~26.6%**.	\N
4	airi	sub	Airi's encouragement	Increase Attack Speed of all allies by **9.1~17.3%**.	\N
5	akane	ex	Elegant Removal	Deal **547~876%** damage to one enemy and lower their defense by **29~37.7%** for **30 seconds**.	2
6	akane	basic	High-Quality Penetration	Every **40 seconds**, deal **396~753%** damage to one enemy.	\N
7	akane	enhanced	Swift Advance	Increase movement speed by **14~26.6%**.	\N
8	akane	sub	Precise Suppression	When attacking, there is a **10%** chance to reduce enemy evasion by **6.7~12.7%** for **30 seconds**. (Cooldown: **5 seconds**)	\N
9	akane_bunny_girl	ex	Careful Preparation	Place a landmine that automatically explodes when enemy is within range, dealing **351~667%** damage. (Landmine disappears after **90 seconds**)	3
10	akane_bunny_girl	basic	Graceful Cleanup	Every **30 seconds**, deal **216~411%** damage to enemies within a circular area.	\N
11	akane_bunny_girl	enhanced	To the Point	Increase Attack by **14~26.6%**.	\N
12	akane_bunny_girl	sub	Prompt Assistance	Increase Attack of Mystic type allies by **12.7~24.2%**.	\N
13	akari	ex	One large serving of grenades!	Deal **392~744%** Attack damage to enemies in circular area.	4
14	akari	basic	One spicy second serving!	Normal attacks have **10%** chance to increase Attack by **38.7~73.6%** for **20 seconds**. (Cooldown: **15 seconds**)	\N
15	akari	enhanced	Thanks for the food!	Increase HP by **14~26.6%**.	\N
16	akari	sub	I can still eat more and more!	Normal attacks have **10%** chance to increase Attack by **34.4~65.5%** for **26 seconds**. (Cooldown: **18 seconds**)	\N
17	akari_new_year	ex	I'm borrowing it for a bit!	Akari enters the battlefield ridind School Lunch Promotion Vehicle. School Lunch Promotion Vehicle additionally inherits **27.6~52.5%** of of Akari's HP. (Duration: **30 seconds**)(School Lunch Promotion Vehicle does not attack enemies)(Only one tactical support vehicle can be fielded at any given time)	5
18	akari_new_year	basic	A special grenade, from the bottom of my heart!	Akari, when riding the School Lunch Promotion Vehicle, activates "A special grenade, from the bottom of my heart!" skill every **13 seconds**, dealing **409~553%** damage to enemies within a circular area.	\N
19	akari_new_year	enhanced	Is that how you feel today?	When School Lunch Promotion Vehicle is present, increase the Attack Speed of other allies (except Akari herself) remaining within the circular area around the vehicle by **28.9~39%**, and add **23.3~31.5%** Mystic Efficiency.	\N
20	akari_new_year	basic	How about this?	Every **40 seconds**, increase Defense of allies within a circular area centered on the ally with the lowest HP by **12.8~24.4%** for **30 seconds**. (Effect applies only while within range)	\N
21	akari_new_year	enhanced	Lets' eat!	Increase HP by **14~26.6%**.	\N
22	akari_new_year	sub	Want seconds?	Increase Mystic Efficiency of all allies by **15.9~30.2%**.	\N
23	ako	ex	Reconnaissance report	Increase the Critical Rate of one ally by **27.2~39.5%**, and additionally increase Critical Damage by **50.5~73.3%**. (Duration: **16 seconds**)	3
24	ako	basic	Supply plan B	Every **45 seconds**, heal one ally for **129~245%** of Healing.	\N
25	ako	enhanced	Providing support	Increase Healing by **14~26.6%**.	\N
26	ako	sub	Leave the support to me	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
27	ako_dress	ex	Perfect agent	For allies within a circular range, increase Critical Rate by **11.3~19.8%** and Critical Damage **32.8~57.5%** for **30 seconds**.Additionally, add 1 "Perfect bodyguard" to each ally (up to a maximum of **15**).	5
28	ako_dress	basic	Don't miss the target!	Every **35 seconds**, decrease the Defense of one enemy by **18.5~24%** for **22 seconds**.Deal damage depending on the number of "Perfect bodyguards" owned:3 or less: Deal **496~942%** damage4 to 7: Deal **531~1010%** damage8 to 11: Deal **584~1111%** damage12 or more: Deal **638~1212%** damage	\N
29	ako_dress	enhanced	Agent confidence	Increase HP by **14~26.6%**.	\N
30	ako_dress	sub	Operation results	Increase Attack by **3~5.7%** for each "Perfect bodyguard".	\N
31	arisu	ex	I'm breaking the world's rules!	Deal **311~591%** damage to enemies in a straight line. Increase damage by **1.5** or **2** times based on energy charge level. Reset energy charge level after shooting.	6
32	arisu	basic	The Light!	Every **25 seconds**, increase Critical Rate by **17~32.3%**. (Cooldown: **20 seconds**)Increase energy charge level by 1. (Max 2 charges)	\N
33	arisu	enhanced	This is enhancement magic!	Increase Attack by **14~26.6%**.	\N
34	arisu	sub	Awaken, Super Nova!	Increase Critical Rate by **12.1~22.9%** when using EX skill. (Cooldown: **20 seconds**)Increase effect by **1.5** or **2** based on energy charge level.	\N
35	arisu_maid	ex	Arisu, clean up!	Deal **594~1128%** damage to one enemy.	4
36	arisu_maid	basic	Meticulous care	Every **15** normal attacks, add **21.8~38.1%** to Mystic damage bonus against the enemies weak to it, and increase Attack by **18.3~32%** for **30~40 seconds**.	\N
37	arisu_maid	enhanced	It's a job bonus!	Increase Critical Damage by **14~26.6%**.	\N
38	arisu_maid	sub	Job Trait: Maid Hero!	Normal attacks now hit 1 enemy and deal **15.8~30.1%** additional damage.	\N
39	aru	ex	Hard boiled shot	Deal **274~521%** damage to one enemy. Deal an additional **292~554%** damage to enemies in circular area around the targeted enemy.	4
40	aru	basic	Noir shoot	Every **25 seconds**, deal **152~290%** damage to one enemy. **50%** chance to deal an additional **251~476%** damage to enemies in a circular area around the targeted enemy.	\N
41	aru	enhanced	President's Dignity	Increase Critical Damage by **14~26.6%**.	\N
42	aru	sub	Outlaw Style	Increase Critical Rate of EX skill by **20.1~38.3%**.	\N
43	aru_dress	ex	Fascinating proposal	Increase Critical Damage by **47.7~83.4%** of one other ally for **30 seconds**.	3
44	aru_dress	basic	Meaningful transaction	Every **50 seconds**, heal one other ally with the lowest HP for **79.8~151%** of Healing.	\N
45	aru_dress	enhanced	Dress up	Increase Attack by **14~26.6%**.	\N
46	aru_dress	sub	Favorable trade	Normal attacks have a 30% chance to reduce Critical Resistance of the target by **8~15.3%** for **13 seconds**. (Cooldown: **5** seconds)	\N
47	aru_new_year	ex	Hard boiled Hanetsuki shot	Restore **0.5~0.7** Skill Cost for each "Bad deed" that Aru currently holds, and reset the number of "Bad deeds" to zero.Deal **179~340%** damage against one enemy. For surrounding enemies that have not been hit,  deal a further **179~340%** damage (up to 11 times).	6
55	asuna_bunny_girl	ex	Hey, hey, look at this!	Decrease Defense of all enemies in a circular area by **18.9~24.6%** for **40 seconds**, then deal **274~438%** damage to them.	5
63	ayane	ex	Care Package	Heal all allies within a circular area for **118~224%** of Ayane's Healing.	4
88	cherino_hot_spring	sub	This is the authority of the moustache!	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
96	chinatsu	sub	Strengthened defensive support	Increase Defense of all allies by **9.1~17.3%**.	\N
104	chise	sub	This will hurt a little~	Normal attacks have **10%** chance to deal **53.7~102%** Attack of continuous burn damage for **20 seconds**. (Cooldown: **5 seconds**)	\N
112	eimi	sub	Tenacious force of will	When HP is under **50%** increase CC Resistance by **20.1~38.3%**.	\N
120	fubuki	sub	I think I'll take you up on that	When any ally uses an EX skill, increases Fubuki's Attack by **17.6~33.5%** for **10 seconds**.	\N
128	fuuka_new_year	sub	Lunch Club delivery	Increase Attack of all allies by **9.1~17.3%**.	\N
136	hanae_christmas	sub	I'm rooting for you!	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
144	hanako_swimsuit	sub	We're all pumped up ♡	Charge the water gauge by **40%** when any other ally uses an EX skill.For every 100% charge, increase Attack by **20.1~38.3%** for **20 seconds**.(The water gauge can hold up to 2 full charges)	\N
152	hare_camping	sub	The best part of camping	When attacking an enemy while holding Freshly Roasted Sweet Potatoes, deal **51.6~98%** of Attack as additional damage.After that, reduce owned Freshly Roasted Sweet Potatoes count by 1.	\N
160	haruka_new_year	sub	With all my heart	Increase Cost Recovery of allies by **10.6~20.2%**.	\N
48	aru_new_year	basic	Noir Hanetsuki shot	Every **30 seconds**, deal **169~321%** damage to enemies in a circular area.	\N
56	asuna_bunny_girl	basic	Let's have some fun!	Every **35 seconds**, increase Attack by **18.4~29.5%** for **23 seconds**.	\N
64	ayane	basic	Learning Support	Every **30 seconds**, increase the critical hit resistance of all allies in a circular area by **15.5~29.4%**.	\N
72	azusa	ex	Bring Death	Deal **1065~2023%** damage to a single enemy.	5
80	cherino	ex	Elite Guard, gather!	Deal **515~605%** damage to all enemies in a circular area.	7~5
49	aru_new_year	enhanced	Gorgeous President's Elegance	Increase HP by **14~26.6%**.	\N
57	asuna_bunny_girl	enhanced	Let's have even more fun!	Increase HP by **14~26.6%**.	\N
65	ayane	enhanced	Passion for Learning	Increase Healing by **14~26.6%**.	\N
73	azusa	basic	Arrow of Annihilation	Every **30 seconds**, deal **292~468%** damage to a single enemy, and reduce their Defense by **18.9~24.6%**. (Duration: **20 seconds**)	\N
81	cherino	basic	Regulate the enemy!	Every **40 seconds**, apply a Focused Fire status to the enemy with the highest Attack, and lower their Critical Damage Resistance by **18.7~35.6%**. (Duration: **15 seconds**)	\N
89	chihiro	ex	Override	Deal **257~412%** damage to one enemy. If the enemy's defense type is Heavy armor, Stun them for **5.7~7.5 seconds**.	3
97	chinatsu_hot_spring	ex	Combat Type-A Energizer	Increase the Attack Speed for one other ally by **31.5~60%** for **30 seconds**.	2
105	chise_swimsuit	ex	Summer beach, fe~ver~	Fire grenades sequentially at up to 3 enemies, dealing **232~372%** damage in circular area around targets and applying Stun for **2.1~2.7 seconds**.If the target is already affected by a CC state, deal **465~744%** damage and Stun them for **4.1~5.3 seconds** instead.	6
113	eimi_swimsuit	ex	Reliable support	Move 6 allies within a circular area to the specified location, grant them a shield of **104~197%** Healing and increase Attack by **0~12.6%** for **30 seconds**.	4
121	fuuka	ex	Lunch Time!	Fuuka moves allies (max 4) in circular area to a specified position and recovers their HP by **109~207%** of her Healing.	5
129	hanae	ex	It's treatment time～!	Continuously recover one ally HP by **54.1~102%** of Healing. (Duration: **20 seconds**)	4
137	hanako	ex	Let's begin the forbidden games	Apply continuous healing equivalent to **26.9~51.1%** of Hanako's Healing to allies in a certain area. (Duration: **8 seconds**)	5
145	hare	ex	Deploy EMP Drone	Deal **271~435%** damage to enemies in a circular area and Stun them for **2.7~3.5 seconds**.	4
153	haruka	ex	Erratic Shooting	Deal **821~1560%** damage to enemies in a fan-shaped area.	4
161	haruna	ex	Piercing Elegance	Attack a selected enemy with **506~887%** of Haruna's Attack, bullet will penetrate target and damage subsequent targets at sequential **10%** damage reduction per target. (Damage reduction caps at a low of **30%**)	4~3
50	aru_new_year	sub	Perfect President's Style	For every 6 enemies defeated by allies, Aru obtains one "Bad deed". Can hold up to **3~6** "Bad deeds", Defense is decreased by **26.8~5.3%** for every "Bad deed" currently held.	\N
58	asuna_bunny_girl	sub	That's a bonus!	When EX skill is activated increase Attack Speed by **20.1~38.3%** for **30 seconds**.	\N
66	ayane	sub	Increasing Morale	Increase HP of all allies by **9.1~17.3%**.	\N
74	azusa	enhanced	Rigorous training	Increase Critical Rate by **14~26.6%**.	\N
82	cherino	enhanced	This is the power of the moustache!	Increase Attack by **14~26.6%**.	\N
90	chihiro	basic	Into the backdoor	Every **30 seconds**, decrease Attack of one enemy with the highest Attack by **30 seconds** for **16.9~32.2%**.	\N
98	chinatsu_hot_spring	basic	Enhanced combat support	Every **25 seconds**, increase the Attack Speed of one other ally by **18.4~35%** for **20 seconds**.	\N
106	chise_swimsuit	basic	Beach ball, shoo~t	Every **50 seconds**, deal **282~451%** damage to one enemy and Stun them for **2.4~3.1 seconds**.	\N
114	eimi_swimsuit	basic	Eimi's confidence	Every **45 seconds**, increase Attack Speed of 4 allies by **11~21%** for **25 seconds**.	\N
122	fuuka	basic	Kindness of School Lunch Club	Every **20 seconds**, Fuuka increases Defense of an ally with the highest HP by **18.1~34.4%**. (Duration: **16 seconds**)	\N
130	hanae	basic	You mustn't collapse!	Every **25 seconds**, increase Defense of an ally with the lowest HP by **17.7~33.7%**. (Duration: **20 seconds**)	\N
138	hanako	basic	Beco~me tougher♪	Every **20 seconds**, increase Defense of an ally with the lowest HP by **24.2~46%**. (Duration: **13 seconds**)	\N
146	hare	basic	Subversion: Plan A	Every **30 seconds**, decrease one enemy's recovery rate by **26.7~50.7%**. (Duration: **15 seconds**)	\N
154	haruka	basic	Trigger Over	Every **20 seconds**, Haruka's Defense is increased by **18.9~36%**. (Duration: **20 seconds**)	\N
162	haruna	basic	Exploding Exotic	Every **30 seconds**, attack one enemy with **200~380%** of Haruna's Attack.	\N
51	asuna	ex	Here I go!	After activating the skill increase Evasion by **43.4%** and Attack Speed by **30.2~57.3%** for **30 seconds**.	2
59	atsuko	ex	This is also my power...?	Recover HP of all allies in a circular area around Atsuko by **28.4~53.9%** of Healing every **5 seconds**. (Duration: **30 seconds**)	4
67	ayane_swimsuit	ex	Nimbostratus, attacking!	Ayane enters the battlefield aboard the Nimbostratus.Nimbostratus additionally inherits **12.5~47.5%** of Ayane's Attack and **12.5~32.6%** of Critical Rate. (Duration:**30 seconds**)(Only one tactical support vehicle can be fielded at any given time)	4
92	chihiro	sub	Deploying firewall	Increase CC Strength of all allies by **9.1~17.3%**.	\N
100	chinatsu_hot_spring	sub	Cautious first-aid officer	When using EX skill, generate a shield around self with HP equal to **108~205%** of Healing for **30 seconds**.	\N
108	chise_swimsuit	sub	Brrr~ Getting chilly?	When using EX skill, additionally deal **30~57%** continuous chill damage for **20 seconds**.	\N
116	eimi_swimsuit	sub	Slippery	Increase Attack Speed of all allies by **9.1~17.3%**.	\N
124	fuuka	sub	Pride of School Lunch Club	Increase Critical Rate Resistance of all allies by **9.1~17.3%**.	\N
132	hanae	sub	Do your very best, everyone～!	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
140	hanako	sub	It's not embarrassing if we're together!	Increase Healing of all allies by **9.1~17.3%**.	\N
148	hare	sub	Operate Interception System	Increase Evasion of all allies by **9.1~17.3%**.	\N
156	haruka	sub	Uwaaaaah!?	When Haruka takes damage, **5%** chance of increasing defense by **18.1~34.4%** for **15 seconds**. (Cooldown: **10 seconds**)	\N
164	haruna	sub	The Serenity of the Gourmet	When not moving, increase Attack by **10~19.1%**.	\N
52	asuna	basic	I'm gonna fire!	Every **20 seconds**, deal **219~416%** damage to one enemy.	\N
60	atsuko	basic	Hiding	Every **30 seconds**, deploy a smoke screen that increases Evasion of allies within range by **20.5~39.1%**. (Duration: **20 seconds**)	\N
68	ayane_swimsuit	basic	Rainstorm Missile	Every **12 seconds**, the Nimbostratus will activate its "Rainstorm Missile" skill, dealing **297~401%** damage to one enemy. (This attack ignores **68~84%** of the enemy Defense)	\N
76	azusa_swimsuit	ex	Biting Water	Deal **651~847%** damage to a single enemy and apply **406~650%** continuous chill damage over **20 seconds**.	5
84	cherino_hot_spring	ex	Purge-kun No. 1, attack!	Cherino enters the battlefield riding Purge-kun No. 1.Purge-kun No. 1 additionally inherits **9~17.1%** of Cherino's Attack. (Duration: **50 seconds**)(Only one tactical support vehicle can be fielded at any given time)	6
53	asuna	enhanced	Does that hurt?	Increase Critical Damage by **14~26.6%**.	\N
61	atsuko	enhanced	As instructed	Increase Evasion by **14~26.6%**.	\N
69	ayane_swimsuit	basic	Support from the sky	Every **30 seconds**, deal **148~215%** damage to one enemy. (This attack ignores **60~84%** of the enemy Defense)	\N
77	azusa_swimsuit	basic	Anger Beach	Every **35 seconds**, increase Crit Damage by **21~40%**. (Duration: **30 seconds**)	\N
85	cherino_hot_spring	basic	Purge them all!	Every 3 normal attacks, Purge-kun No. 1 will activate its "Purge them all!" skill and deal **184~216%** damage to the targeted enemy, plus **276~324%** damage to the targeted enemy and in conical area behind them.	\N
93	chinatsu	ex	Combat casualty aid	Heal 1 ally for **195~342%** of Chinatsu's Healing, remove **0~1** debuff from the target.	4
101	chise	ex	This may hurt~	Deal continuous damage in a circular area equivalent to **56~106%** of Chise's Attack. (Duration: **10 seconds**)	4
109	eimi	ex	Unflinching will	Regenerate HP equal to **8.6~16.4%** Healing + **3.4%** lost HP. (Duration: **20 seconds**)	4
117	fubuki	ex	First of all, rest well	Increase Attack by **36.5~69.4%** for **46 seconds**.	4
125	fuuka_new_year	ex	Lunch Club osechi	Reduce EX skill cost for one other ally by up to **50%** (reduction active until EX is activated **1** time). The discount is rounded down to the nearest whole number.Increase Critical Damage by **18.3~32.1%** for **35 seconds**.	3~2
133	hanae_christmas	ex	It's gifts time～	Grant 1 "Holy Night Blessing" to allies within a circular area ("Holy Night Blessing" stacks up to 15 times) and continuously recover their HP by **7~13.4%** of Healing for **60 seconds**.Healing effect is increased by **0.3~0.7%** for each active "Holy Night Blessing".	5
141	hanako_swimsuit	ex	I'm going to douse you ♡	Deal **337~642%** damage to enemies within a fan-shaped area.If the water gauge is 1 or more, EX skill card remains in hand. Subtract 1 water gauge charge.	2
149	hare_camping	ex	Campfire cooking	Increase Attack of one other ally by **42.3~80.4%** for **26 seconds**.Additionally, give self 5 Freshly Roasted Sweet Potatoes. (Stacks up to a maximum of 15)	2
157	haruka_new_year	ex	Who gave permission……?	Lower Critical Resistance and Critical Damage Resistance of one enemy by **21.8~41.5%** for **50 seconds**. Deal **182~345%** damage to them.	4
165	haruna_new_year	ex	Gourmet's Wrath	Target up to 5 enemies, dealing **106~202%** damage to each in turn, additinally deal **52~98.7%** damage within a circular area around each hit.	5
54	asuna	sub	We're gonna speed things up, okay?	When EX skill is activated increase Attack Speed by **20.1~38.3%** for **30 seconds**.	\N
62	atsuko	sub	I'm used to pain	Increase Evasion by **24.2~45.9%** when HP is below **30%**.	\N
70	ayane_swimsuit	enhanced	Automatic targeting	Increase Critical Rate by **14~26.6%**.	\N
78	azusa_swimsuit	enhanced	Freezing Temperature	Increase Attack by **14~26.6%**.	\N
86	cherino_hot_spring	basic	Sights set, purge!	Every **15 seconds**, deal **136~259%** damage to enemies within a circular area.	\N
94	chinatsu	basic	Reshaping the battle	Every **40 seconds**, increase Evasion of 1 ally with the lowest current HP by **50.9~67%**. (Duration **30 seconds**)	\N
102	chise	basic	I'm going to shoot~	Every **25 seconds**, deal damage equal to **219~416%** of Chise's Attack to enemies in a circular area.	\N
110	eimi	basic	A furious fixated attack	Every **15 seconds**, deal **297~564%** damage to enemies within a fan shaped area.	\N
118	fubuki	basic	One last bite!	Whenever ammo count reaches 3 or less, deal **225~361%** damage to one enemy and Stun them for **1.9~2.5 seconds**.Reduce Ammo count by **3**.	\N
126	fuuka_new_year	basic	Tasting time!	Every **60 seconds**, grant a shield to an ally with the lowest HP (shield HP is **119~227%** of Fuuka's Healing). (Duration: **20 seconds**)	\N
134	hanae_christmas	basic	Cheer up!	Every **35 seconds**, increase the Recovery Rate of an ally with the lowest HP by **22.7~43.2%** for **15 seconds**.	\N
142	hanako_swimsuit	basic	Take good care of it ♡	Every **30 seconds**, deal **118~225%** damage to enemies within a circular area.Additionally, decrease their Defense by **10.9~20.7%** for **20 seconds**.	\N
150	hare_camping	basic	Spreading warmth	Every **50 seconds**, increase Attack of allies within a circular area by **14.5~24.3%** for **30 seconds**.	\N
158	haruka_new_year	basic	Proper greeting	Every **30 seconds**, lower the Critical Damage Resistance of one enemy by **16.2~30.8%** for **20 seconds**.	\N
71	ayane_swimsuit	sub	Understanding the battlefield	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
79	azusa_swimsuit	sub	Saltwater in the Wound	When attacking, there is a **30%** chance to reduce target's Defense by **8~15.3%** for **13 seconds**. (Cooldown: **5 seconds**)	\N
87	cherino_hot_spring	enhanced	Feel the wrath of the moustache!	Increase Attack by **14~26.6%**.	\N
95	chinatsu	enhanced	Strengthened medical support	Increase Healing by **14~26.6%**.	\N
103	chise	enhanced	Alright, let's do our best~	Increase Attack by **14~26.6%**.	\N
111	eimi	enhanced	Specialist's rest	Increase healing received by **14~26.6%**.	\N
119	fubuki	enhanced	Traffic control	Increase CC Strength by **14~26.6%**.	\N
127	fuuka_new_year	enhanced	The best bite	Increase Healing by **14~26.6%**.	\N
135	hanae_christmas	enhanced	Blessed relief	Increase Healing by **14~26.6%**.	\N
143	hanako_swimsuit	enhanced	True feelings hidden in midsummer	Increase Attack by **11.2~16.2%** and Critical Damage by **11.2~16.2%**.	\N
151	hare_camping	enhanced	Detox effect	Increase Attack by **14~26.6%**.	\N
159	haruka_new_year	enhanced	Unforgivable, unforgivable	Increase Attack by **14~26.6%**.	\N
75	azusa	sub	Aim for the weak point	When attacking weakened enemies, deal **46.6~88.5%** of Attack as additional damage.	\N
83	cherino	sub	Kneel before the moustache!	Increase cost recovery by **269~511**. If other Red Winter students are in the same team, increase the effect by **77~146** per student. (Cherino not included, up to a maximum of 3)	\N
91	chihiro	enhanced	Exploit	Increase Critical Damage by **14~26.6%**.	\N
99	chinatsu_hot_spring	enhanced	Brief moment of rest	Increase HP by **14~26.6%**.	\N
107	chise_swimsuit	enhanced	Stroll, ready	Increase Attack by **14~26.6%**.	\N
115	eimi_swimsuit	enhanced	Like fish in water	Increase Healing by **14~26.6%**.	\N
123	fuuka	enhanced	Let's gather fresh ingredients	Increase Healing by **14~26.6%**.	\N
131	hanae	enhanced	Ability improvement	Increase Healing by **14~26.6%**.	\N
139	hanako	enhanced	I'm feeling pumped up!	Increase Hanako's Healing by **14~26.6%**.	\N
147	hare	enhanced	Armament Strengthening: Plan B	Increase Critical Rate by **14~26.6%**.	\N
155	haruka	enhanced	I-I'll do my best!	Increase HP by **14~26.6%**.	\N
163	haruna	enhanced	The Dignity of the Gourmet	Increase HP by **14~26.6%**.	\N
166	haruna_new_year	basic	Gourmet's Belief	Every **40 seconds**, increase Attack by **15.9~30.3%** for **30 seconds**.	\N
167	haruna_new_year	enhanced	New Year's Viando	Increase Attack by **14~26.6%**.	\N
168	haruna_new_year	sub	Farewell Dessert	When attacking, there is a **20%** chance to reduce enemy Defense by **7.8~14.8%** for **17 seconds**. (Cooldown: **5 seconds**)	\N
169	haruna_track	ex	Gourmet endorsement	Move up to 4 allies within circular area to the specified position and heal them for **63~119%** of Healing.	3
170	haruna_track	basic	Gourmet approach	Every **40 seconds**, deal **161~306%** damage to 6 enemies.Decrease their Defense by **5.8~11%** for **20 seconds**.	\N
171	haruna_track	enhanced	Healing sweets	Increase Healing by **14~26.6%**.	\N
172	haruna_track	sub	Sports banquet	Increase Attack of all allies by **9.1~17.3%**.	\N
173	hasumi	ex	Armour-piercing ammo	Deal **574~1091%** damage to one enemy.	5
174	hasumi	basic	A composed mind	After defeating an enemy immediately reload and increase Critical Damage by **30~57%** for **13 seconds**.	\N
175	hasumi	enhanced	Target in sights	Increase Critical Damage by **14~26.6%**.	\N
176	hasumi	sub	Searching for target	After reloading increase Critical Rate by **50~95%** for one attack.	\N
177	hasumi_track	ex	Iron Will Piercing Bullet	Deal **452~859%** damage to one enemy.Additionally consume up to 2 Cost, increasing damage dealt by 30% for every extra Cost paid.(Cost reduction effects will only affect the base skill cost)	3
178	hasumi_track	basic	Sports shooting	Every **25 seconds**, deal **247~470%** damage to one enemy.	\N
179	hasumi_track	enhanced	Preparing to participate	Increase Critical Damage by **14~26.6%**.	\N
180	hasumi_track	sub	Excitement of the competition	When attacking large enemies, deal **21.8~41.5%** of Attack as additional damage.	\N
181	hatsune_miku	ex	Putting my heart into it at every moment!	Heal allies within a circular area for **111~144%** of Miku's Healing.	5
182	hatsune_miku	enhanced	Putting my heart into it at every moment!	While allies remain near Miku dancing on the field, increase their Attack by **21.2~34%**. (Duration: **26 seconds**)	\N
183	hatsune_miku	basic	The Passion of Hatsune Miku	Every **30 seconds**, increase Critical Rate of allies within a circular area by **19.8~37.7%**. (Duration: **20 seconds**)	\N
184	hatsune_miku	enhanced	The Cheering of Hatsune Miku	Increase Healing by **14~26.6%**.	\N
185	hatsune_miku	sub	The Blessing of Hatsune Miku	Increase all allies' incoming healing by **9.1~17.3%**.	\N
186	hibiki	ex	There's a high probability this will hurt	Deal **311~591%** damage to enemies in 5 circular areas.	4
187	hibiki	basic	Plenty of firepower	Every **20 seconds**, deal **144~275%** damage to enemies in circular area centered on the enemy with the lowest HP.	\N
188	hibiki	enhanced	Might be dangerous	Increase Critical Damage by **14~26.6%**.	\N
189	hibiki	sub	Hope that helps	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
190	hibiki_cheer_squad	ex	It might be a little hot	Deal **107~140%** damage to enemies within a circular area.Inflict continuous Burn damage of **29.9~47.9%** for **120 seconds**.	7
191	hibiki_cheer_squad	basic	If this voice reaches you	Every **40 seconds**, increase the Attack of an ally with the highest Attack and self by **15.5~22.5%** for **30 seconds**.	\N
192	hibiki_cheer_squad	enhanced	Just enough passion	Increase Attack by **17.9~34%**, decrease Critical Damage by **11.2%**.	\N
193	hibiki_cheer_squad	sub	It's a little embarrassing...	When attacking an enemy, deal **3.4~6.4%** as additional damage.The farther the enemy is, the more damage is done, and the closer the enemy, the weaker the damage.(Maximum multiplier of x2, minimum of x0.5)	\N
194	hifumi	ex	Help me, Peroro-sama!	Summon a Peroro Doll, dealing **202~386%** damage to enemies in a circular area and taunting them. The Peroro Doll additionally inherits **160%** of Hifumi's Max HP.	5
195	hifumi	enhanced	Help me, Peroro-sama!	When the Peroro Doll appears, it Taunts enemies within a circular area around itself for **3.4~3.9 seconds**.	\N
196	hifumi	basic	Peroro-sama's Support	Every **35 seconds**, deal **212%** damage to one enemy and reduce their accuracy by **16.8~32%** for **30 seconds**.	\N
197	hifumi	enhanced	Collector's Spirit	Increase HP by **14~26.6%**.	\N
198	hifumi	sub	Nimble Collector	When using EX skill, increase skill cost recovery speed by **980~1861**. (Duration: **5 seconds**)	\N
199	hifumi_swimsuit	ex	Crusader-chan, please!	Hifumi enters the battlefield riding Crusader-chan.Crusader-chan additionally inherits **19.4~36.8%** of Hifumi's Attack. (Duration: **50 seconds**)(Only one tactical support vehicle can be fielded at any given time)	1
200	hifumi_swimsuit	basic	2-Pounder High-Explosive Loaded!	Every **20 seconds**, Crusader-chan will activate its "2-Pounder High-Explosive Loaded!" skill and deal **266~359%** damage to enemies in a circilar area.	\N
201	hifumi_swimsuit	basic	Peroro-sama's Attack	Every **25 seconds**, deal **159~302%** damage to enemies in an area.	\N
202	hifumi_swimsuit	enhanced	Collector's Fighting Spirit	Increase Attack by **14~26.6%**.	\N
203	hifumi_swimsuit	sub	Angry Adelie's Blessing	Increase Attack Speed of all allies by **9.1~17.3%**.	\N
204	himari	ex	Let me show you what I can do	Increase Attack of one ally by **55.2~105%** for **13 seconds**.	3
206	himari	enhanced	Delicate clifftop flower	Increase Attack by **14~26.6%**.	\N
205	himari	basic	You might be a little surprised	Every **30 seconds**, deal **185~241%** damage to one enemy.Decrease their Evasion by **16.9~27.1%** for **23 seconds**.	\N
213	hina_dress	ex	First note of the melody	Deal **324~618%** damage to enemies in a straight line.Each time projectile penetrates an enemy, damage is reduced by **45%** (minimum **10%** damage).This attack is not affected by Stability and always does maximum damage.Maintain Concentrated Fire stance for **10 seconds** and prepare the next shot.	0
222	hina_swimsuit	sub	Use of Force	When EX skill is activated, increase Attack by **8.7~16.5%**. Stacks up to a maximum of **5** times.	\N
230	hinata_swimsuit	sub	Caring hands	Increase Attack of all allies by **9.1~17.3%**.	\N
238	hoshino	sub	Supression Veteran	When EX skill is in use, activate a shield that has **108~205%** Healing power in health.	\N
246	ibuki	enhanced	Well-behaved girl	Increase HP by **14~26.6%**.	\N
254	iori	enhanced	Hitting the mark in one shot	Increase Accuracy by **14~26.6%**.	\N
262	iroha	basic	It's annoying...	Every **40 seconds**, fire shells at up to 4 enemies. Deal **43.8~83.3%** damage within the circular area around targeted enemy.	\N
270	izumi_swimsuit	basic	Sweet and sour and delicious!	Every **35 seconds**, increase Attack by **20.2~38.4%** for **30 seconds**.	\N
278	izuna_swimsuit	basic	Izuna-Style Ninjutsu! Bubble Technique!	Every **6** normal attacks, deal **418~669%** damage to one enemy. Reduce their Critical Damage Resistance by **29.9~38.9%** for **20 seconds**.	\N
207	himari	sub	The true worth of a super genius delicate sickly beautiful girl	Increase Cost Recovery of allies by **10.6~20.2%**.	\N
215	hina_dress	ex	Closing note of the melody	Deal **680.4~1288%** damage to enemies in a straight line.Each time projectile penetrates an enemy, damage is reduced by **45%** (minimum **10%** damage).This attack is not affected by Stability and always does maximum damage.After shooting, exit Concentrated Fire stance.	0
223	hinata	ex	Last resort	Deal **250~476%** damage to enemies within 5 circular areas.	6
231	hiyori	ex	I-i'll support you now!	Fires a bullet that flies in a straight line and deals **207~331%** damage to the first enemy it hits.If there are two or fewer Arius Squad students in the same team, reduce Defense of the hit enemy by **23.2~30.1%**; if there are three or more, reduce their Defence by **39.7~51.6%** instead. (Duration: **30 seconds**)	3
239	hoshino_swimsuit	ex	Aquatic support	Increase the Attack of all allies around Hoshino by **26.5~38.5%**, and add **68.3~99%** to the Explosion damage bonus against the enemies weak to it. (Duration: **50 seconds**)	6~5
264	iroha	sub	Please stay strong	Increase Attack of all allies by **9.1~17.3%**.	\N
272	izumi_swimsuit	sub	Ice-cold, but delicious~	Attacks have a **10%** chance to stun for **1.23~2.34 seconds**. (Cooldown: **20 seconds**)	\N
280	izuna_swimsuit	sub	Izuna-Style Ninjutsu・Summer Version Secret Technique!	Every **25** critical hits, increases Attack Speed by **16.2~30.9%** for **23 seconds**.	\N
208	hina	ex	Ending scene: Ishbóshet	Deal **636~1208%** damage to enemies in fan-shaped area.	7
217	hina_dress	enhanced	Passionate performance	Increase Attack by **11.2~16.2%**, increase Critical Rate by **11.2~16.2%**.	\N
225	hinata	enhanced	Unexpected development	Increase Critical Damage by **14~26.6%**.	\N
233	hiyori	enhanced	I read it in a magazine	Increase Critical Damage by **14~26.6%**.	\N
241	hoshino_swimsuit	enhanced	Heat wave endurance	Increase Defense by **11.2~16.2%** and Attack by **11.2~16.2%**.	\N
249	ichika	basic	Justice Actualization Committee contact network	Every **30 seconds**, add **32.9~63.1%** to Sonic Efficiency for **20~25 seconds**.	\N
257	iori_swimsuit	basic	Swift and Skilful Resolution	Every **25 seconds**, deal **186~297%** damage to a single enemy. Additionally, inflict **51~66.3%** continuous chill damage. (Duration: **20 seconds**)	\N
265	izumi	ex	Cheese Chocolate Burger!	Recover HP equal to **145~254%** of Healing; increase Attack Speed by **0~38.4%** for **0~21 seconds**.	3
273	izuna	ex	This is The Izuna-Style Ninjutsu!	Jump to the selected location, and increase Attack Speed by **27.4~52.1%** for **30 seconds**.	3
281	junko	ex	Hunger's Frustration	Junko sacrifices **25.7%** of current HP and deals **746~1417%** damage to enemies in a straight line.	5
209	hina	basic	Reload and Destroy	When out of bullets, Hina immediately reloads and increases Attack by **21~39.9%**. (Duration: **16 seconds**)	\N
218	hina_dress	sub	Sincerity	While in a Concentrated Fire stance, increase Explosive Efficiency by **36.29~63.51%** and gain immunity to Taunt status.	\N
226	hinata	sub	I'll do the heavy lifting!	When attacking medium-sized enemies, deal **21.8~41.5%** of Attack as additional damage.	\N
234	hiyori	sub	Power of the appendix	Increase Attack of all allies by **9.1~17.3%**.	\N
242	hoshino_swimsuit	sub	Fun at the beach	While EX skill is active, increase Cost Recovery by **360~684**.	\N
250	ichika	enhanced	Sharp instincts	Increase Accuracy by **14~26.6%**.	\N
258	iori_swimsuit	enhanced	Precise Shot	Increase Attack by **14~26.6%**.	\N
266	izumi	basic	Reeeady, Bang!	Normal attacks have a **20%** chance to deal **275~523%** Attack damage to one enemy. (Cooldown: **10 seconds**)	\N
274	izuna	basic	Secret technique! Explosive Shuriken!	Every **6** normal attacks, deal **444~845%** damage to enemies in circular area.	\N
282	junko	basic	Don't talk to me when I'm hungry!	Junko gains Immortal status for **12.8~24.3 seconds** when her HP is under **20%**. (Can only be used **1** per battle)	\N
210	hina	enhanced	Cool-headed Disciplinary committee	Increase Attack Speed by **14~26.6%**.	\N
251	ichika	sub	Everybody has bad days	When attacking enemies that are not in cover, deal **2.3~4.4%** as additional damage.	\N
259	iori_swimsuit	sub	Specialist's Might	When attacking, there is a **25%** chance to inflict continuous chill damage equivalent to **34.1~64.8%** of Attack for **20 seconds**. (Cooldown: **10 seconds**)	\N
267	izumi	enhanced	What should I eat next?	Increase healing received by **14~26.6%**.	\N
275	izuna	enhanced	Izuna-Style, Surprise Attack Jutsu	Increase Critical Damage by **14~26.6%**.	\N
283	junko	enhanced	Merit of being a petite	Increase Evasion by **14~26.6%**.	\N
211	hina	sub	From beginning to end	When Hina attacks enemies that aren't taking cover, deal bonus damage of **2.7~5.2%** Attack.	\N
219	hina_swimsuit	ex	Distant seas: Ishbóshet	Deal **232~441%** damage to up to 5 enemies in fan-shaped area.	3
227	hinata_swimsuit	ex	Fun waterplay	Deal **479~911%** damage to enemies within a circular range around self. (this attack ignores **40~80%** of enemy Defense)	6
235	hoshino	ex	Tactical Suppression	Deal **435~697%** of Hoshino's Attack as damage to enemies within a conical area and stun them for **0~1.4 seconds**.	4
243	ibuki	ex	Ibuki's drawing time!	Increase Attack of all other allies within a circular area by **26.4~50.2%** for **35 seconds**.	3
268	izumi	sub	Tastiness really is the most important thing	While attacking, deal additional damage of **0.4~0.7%** to **2.2~4.1%** Attack, proportional to current HP.	\N
276	izuna	sub	Izuna-Ryuu, Funki no Jutsu	On EX skill use, increase Attack by **20.1~38.3%** for **30 seconds**.	\N
284	junko	sub	Gourmet on an empty stomach	When attacking, Junko deals **0.9~1.7%**〜**4.9~9.4%** of her Attack as additional damage in proportion to lost HP.	\N
212	hina_dress	ex	Opening scene: Ishbóshet	Switch to Concentrated Fire stance for **10 seconds**.While in Concentrated Fire stance, character can not perform normal attacks or move.(CC application cancels the effect)	6
221	hina_swimsuit	enhanced	Merciless Disciplinary Committee	Increase Critical Rate by **14~26.6%**.	\N
229	hinata_swimsuit	enhanced	Expeditionary passion	Increase Attack by **14~26.6%**.	\N
237	hoshino	enhanced	Countermeasures Council President	Increase Defense by **14~26.6%**.	\N
245	ibuki	basic	Bad kids get punished!	Every **30 seconds**, deal **204~388%** damage to one enemy.Additionally, decrease their Attack by **18.6~24.1%** for **20 seconds**.	\N
253	iori	basic	Wanted List	Every **25 seconds**, deal damage equal to **229~436%** of Attack power against one enemy.	\N
261	iroha	basic	Main gun aim, fire	Every **15 seconds**, Toramaru activates its "Main gun aim, fire" skill, dealing **279~377%** damage to one enemy. Upon hit, shell fragments and deals the same damage to 2 nearby enemies, then deals the same damage to further 2 nearby enemies.	\N
269	izumi_swimsuit	ex	Filled with coconut juice!	Throw coconut at an enemy, dealing **332~532%** damage. If there are other enemies around the target that have not been hit, the coconut will bounce in their direction and deal damage again (the amount of damage from the second time onwards is reduced by 10%) Deals up to 5 hits. Stun enemies hit for **2.4~3.1 seconds**.	4
277	izuna_swimsuit	ex	Izuna-Style Ninjutsu・Summer Version!	Deal **423~804%** damage to one enemy.  Apply Focused Fire status to the enemy for **30 seconds**.	2
214	hina_dress	ex	Second note of the melody	Deal **324~618%** damage to enemies in a straight line.Each time projectile penetrates an enemy, damage is reduced by **45%** (minimum **10%** damage).This attack is not affected by Stability and always does maximum damage.Maintain Concentrated Fire stance for **10 seconds** and prepare the next shot.	0
247	ibuki	sub	Pandemonium mascot	When using EX skill, heal self for **90~171%** of Healing.	\N
255	iori	sub	Bravery of the Disciplinary Committee	When Iori is not taking cover, attacks deal **22.6~43.1%** of Attack as additional damage.	\N
263	iroha	enhanced	There's no choice	Increase Attack by **14~26.6%**.	\N
271	izumi_swimsuit	enhanced	Now, eat up and do your best~!	Increase Attack Speed by **14~26.6%**.	\N
279	izuna_swimsuit	enhanced	Master! It's summer!	Increase Attack Speed by **14~26.6%**.	\N
216	hina_dress	basic	Thorough preparation	At the beginning of combat, increase Explosive Efficiency by **34.17~64.91%** and Accuracy by **238~451**.(Can only be used **1** time per battle)	\N
224	hinata	basic	Let's talk first...!	Every **20 seconds**, deal **223~425%** damage to one enemy with the highest HP.	\N
232	hiyori	basic	O-oh, this will hurt!	Every **40 seconds**, deal **255~409%** damage to one enemy and reduce their defense by **7.7~10%** for **30 seconds**.	\N
240	hoshino_swimsuit	basic	Aquatic assault	Every **40 seconds**, deal **283~454%** damage to one enemy. Additionally, heal herself by **75~97.6%** of Healing.	\N
248	ichika	ex	Excuse me for a moment	Deal **726~1380%** damage to enemies within a cone-shaped area.	6
256	iori_swimsuit	ex	Storm and Stress	Deal **463~880%** damage to enemies in a circular area.	4
220	hina_swimsuit	basic	Slow and Knock out	Every **20 seconds**, deal **141~226%** damage to a single enemy and stun them for **1.6~2 seconds**.	\N
228	hinata_swimsuit	basic	Refreshing dip	Every **40 seconds**, throw a water balloon to deal **86.3~164%** damage to 1 enemy. If there are enemies around the target that have not yet been attacked, the water balloon will bounce in that direction and deal the same damage (up to 6 times).(This attack ignores **50~80%** of the enemy Defense)	\N
236	hoshino	basic	Emergency Field Aid	When HP falls to **30%**, continuously regenerate **100~191%** of Healing power for **20 seconds**. (Can only be used **1** per battle)	\N
244	ibuki	ex	Patrol with Iroha-senpai!	When onboard Toramaru with Iroha, deal **246~302%** damage to enemies within a circular area.	5
252	iori	ex	Total Arrest	Fires 3 shots at an enemy. Each shot has **350~666%** Attack power and deals damage in a conical shape behind the enemy.	3
260	iroha	ex	Let's go, Toramaru	Iroha enters the battlefield riding Toramaru.Toramaru additionally inherits **11.2~38.5%** of Iroha's Attack. (Duration: **55 seconds**)(Only one tactical support vehicle can be fielded at any given time)	8~6
285	junko_new_year	ex	Food grudge	Deal **344~653%** damage to enemies within a circular area.	2
286	junko_new_year	basic	I wanted to eat that...	Every **21** normal attacks, deal **400~760%** damage to one enemy.	\N
287	junko_new_year	enhanced	Let's get this over with!	Increase Attack Speed by **14~26.6%**.	\N
288	junko_new_year	sub	This was my only dress!	When EX or Normal skill are activated, increase Critical Rate by **10.4~19.9%** for **20 seconds**.	\N
289	juri	ex	Juri's Cooking Time!	Reposition 4 enemies within a circular area, inflict a poisoning effect for **58.9~112%** of Juri's Attack. (Duration: **20 seconds**)	3
290	juri	basic	The Finest Cooking	Every **20 seconds**, decrease the Attack Speed of 1 enemy with the highest attack by **18.1~34.4%**. (Duration: **16 seconds**)	\N
291	juri	enhanced	Plenty of Motivation!	Increase Attack by **14~26.6%**.	\N
292	juri	sub	Bon Appétit!	Increase HP of all allies by **9.1~17.3%**.	\N
293	kaede	ex	Flare gun, fire!!	Grant a shield of **144~275%** Healing to the allies within a circular range. (Duration: **16 seconds**)	4
294	kaede	basic	Beetle shield!	Every **40 seconds**, increase Defense of one ally with the highest Defense by **15.8~30%** for **33 seconds**.	\N
295	kaede	enhanced	Healing wave!	Increase Healing by **14~26.6%**.	\N
296	kaede	sub	Keep doing your best!	Increase HP of all allies by **9.1~17.3%**.	\N
297	kaho	ex	Being a fan	Deal **745~1415%** damage to one enemy.	5
298	kaho	basic	Clear mind	Every **50 seconds**, apply "Serenity" status and increase Attack by **27.4~39.7%** for **25~40 seconds**.	\N
299	kaho	enhanced	Passionate dedication	Increase Critical Damage by **14~26.6%**.	\N
300	kaho	sub	Tranquil composure	When "Serenity" status is active, deal **5.5~10.4%** of Attack as additional damage.	\N
301	kanna	ex	Chief of Public Security	Deal **52.9~84.7%** damage to one enemy.After that, **30~50%** of the damage done by the allies to that enemy is added up for **15 seconds**, and the resulting damage is done again as Penetration type.(This damage can not be critical, maximum amount of damage that can be accumulated is **2070~2691%** of Kanna's Attack)	3
302	kanna	basic	Intense interrogation	Every **30 seconds**, deal **197~375%** damage to one enemy.Reduce their Defense by **7.6~14.4%** for **20 seconds**.	\N
303	kanna	enhanced	Mad Dog obsession	Increase Attack by **14~26.6%**.	\N
304	kanna	sub	PSB special ammunition	Increase Attack of Penetration type allies by **12.7~24.2%**.	\N
305	karin	ex	Eliminating Target	Deal **687~1099%** Attack damage to one enemy. If enemy is colossal-sized, deal an additional **481~625%** damage.	4
306	karin	basic	Initiate Fire Support	Every **40 seconds**, deal **223~424%** Attack damage to one enemy, with a **50%** chance to stun. (Duration: **3.1 seconds**)	\N
307	karin	enhanced	Weapon Upgrade, Complete	Increase Attack by **14~26.6%**.	\N
308	karin	sub	Initiating Support Actions	Increase Attack of all allies by **9.1~17.3%**.	\N
309	karin_bunny_girl	ex	Promptly and precisely	Deal **325~521%** damage to enemies in a conical area, ignoring **32~48%** of their defense.	7
310	karin_bunny_girl	basic	Wide-area firing, commence	Every **25 seconds**, deal **111~192%** damage to enemies in a circular area, ignoring **20~32%** of their defense.	\N
311	karin_bunny_girl	enhanced	Firepower upgrade, complete	Increase Attack by **14~26.6%**.	\N
312	karin_bunny_girl	sub	Carefully and correctly	Upon activating EX skill, increase Critical Rate by **12.9~24.5%**. (Duration: **40 seconds**)	\N
313	kasumi	ex	Giant Heel Crush	For enemies within a circular area, decrease Defense by **17.6~33.5%** for **25 seconds**.Deal **227.6~432.5%** damage to them.	4
314	kasumi	basic	That's an important message	Every **35 seconds**, deal **227~432%** damage to enemies within a circular area.	\N
315	kasumi	enhanced	Madman's strategy	Increase Critical Rate by **14~26.6%**.	\N
316	kasumi	sub	Did the drill stop?	Every **3** EX skill uses, deal **633~1204%** additional damage.	\N
317	kayoko	ex	Panic Bringer	Deal **349~558%** damage and inflict Fear for **3.9~5.1 seconds** to enemies in a circular area.	6
318	kayoko	basic	Panic Shot	Every **20 seconds**, deal **132~252%** damage to 1 enemy. **30%** chance to inflict Fear for **3.6 seconds**.	\N
319	kayoko	enhanced	Scary face	Increase CC Strength by **14~26.6%**.	\N
320	kayoko	sub	It can't be helped	When attacking a CC'd enemy, deal **74.8~142%** of Attack as extra damage.	\N
321	kayoko_dress	ex	Shadow Shot	Deal **762~1219%** damage to one enemy (this attack ignores **48~64%** of enemy Defense).If Infiltration mode is active, this attack is a guaranteed critical hit. Afterwards, exit Infiltration mode.	5
322	kayoko_dress	basic	Back in the groove	Every **25 seconds**, increase Critical Damage by **13.5~25.8%** for **16 seconds**.	\N
323	kayoko_dress	enhanced	Assassins' eyes	Increase Critical Damage by **14~26.6%**.	\N
324	kayoko_dress	sub	Infiltration tactics	At the start of battle, activate Infiltration mode, this mode ends whenever Kayoko is attacked.After Infiltration mode ends, if Kayoko is not attacked for 10 seconds, enter Infiltration mode again.When in Infiltration mode, increase own Critical Damage by **33.6~63.8%**.	\N
325	kayoko_new_year	ex	New Year's Omamori	For one other ally, add **48.8~92.8%** to the Mystic damage bonus against the enemies weak to it. (Duration: **40 seconds**)Grant them Omamori status.	2
326	kayoko_new_year	basic	Cat's protection	Every **40 seconds**, increase Critical Rate of one other ally by **20.8~39.5%** for **25 seconds**.	\N
334	kikyou	basic	If you know the enemy and know yourself, you need not fear the result of a hundred battles	Every **35 seconds**, add Sonic Efficiency to other allies within a circular area. (Duration: **25 seconds**)Effect depends on the number of allies affected:1 person: **14.6~27.8%**2 people: **18~34.2%**3 or more: **21.4~40.7%**.	\N
342	koharu	basic	I-I'll heal you!	For allies that are at less than **50%**, heal for **80.8~153%** of Healing. (Cooldown: **20 seconds**)	\N
350	kokona	basic	I'm looking forward to next time!	When allies deal **100** critical hits, heal one other ally with the lowest HP for **56.6~107%** Healing.Receive 1 Hanamaru Stamp.	\N
358	kotama_camping	basic	Resonance effect	Every **45 seconds**, increase Attack of one other ally and self by **5.9~11.3%** for **35 seconds**.	\N
366	kotori_cheer_squad	basic	Ah, that's right!	Every **5** EX skill uses, increase Critical Rate of surrounding allies (except self) by **11.4~21.8%** for **30 seconds**.	\N
374	maki	basic	Take this, paintball!	Every **25 seconds**, reduce 1 enemy's Defense by **18.3~34.8%** and mark them for **15 seconds**.	\N
382	mari	basic	Purifying baptism	Every **25 seconds**, deal **191~364%** damage to enemies within a circular area.	\N
390	marina	basic	Not a step back!	When HP is **20%** or less, gain Immortal status for **12~22.8 seconds**. (Can only be used **1** per battle)	\N
398	mashiro_swimsuit	basic	Cooperation of justice	Every **30 seconds**, increase Critical Damage of an ally with the highest Attack by **18.9~36%**. (Duration: **20**)	\N
327	kayoko_new_year	enhanced	Escalating misunderstandings	Increase Attack by **14~26.6%**.	\N
335	kikyou	enhanced	Qualifications of a strategist	Increase Attack by **14~26.6%**.	\N
343	koharu	enhanced	I'm giving it my all!	Increase Attack by **14~26.6%**.	\N
351	kokona	enhanced	Instructor's responsibilities	Increase Healing by **14~26.6%**.	\N
359	kotama_camping	enhanced	Noise amplification	Increase Attack by **14~26.6%**.	\N
367	kotori_cheer_squad	enhanced	Please ask me anything!	Increase Attack by **14~26.6%**.	\N
375	maki	enhanced	Artistic Performance	Increase Attack Speed by **14~26.6%**.	\N
383	mari	enhanced	Resolute mind	Increase Critical Rate by **14~26.6%**.	\N
391	marina	enhanced	No retreat!	Increase Evasion by **14~26.6%**.	\N
399	mashiro_swimsuit	enhanced	Gaze of justice	Increase Attack by **14~26.6%**.	\N
328	kayoko_new_year	sub	Omamori bond	When allies deal **200** critical hits, increase Attack by **13.1~24.9%**.For allies with an Omamori, add **22~41.8%** to the Mystic damage bonus against the enemies weak to it. (Duration: **50 seconds**)Afterwards, clear all Omamori from allies.	\N
336	kikyou	sub	Fūrinkazan strategy	Every **30 seconds**, increase Attack by **17.2~32.8%** for **20 seconds**.Grant 1 Fūrinkazan (stacks up to a maximum of 3).When using an EX skill with 3 Fūrinkazan present, all Fūrinkazan will be consumed and the EX skill cost of all other allies will be reduced by **1**. (Reduction active until EX is activated **1** times)	\N
344	koharu	sub	Because I'm elite!	Every **30 seconds**, increase Healing by **21.5~41%**. (Duration: **20 seconds**)	\N
352	kokona	sub	Plum Blossom Garden teaching method	When **5** Hanamaru Stamps are acquired, the EX skill cost of all allies other than Kokona herself is reduced by **1**. (Reduction active until EX is activated **1**)Remove all Hanamaru Stamps.Heal self for **57~108%** of Healing power.	\N
360	kotama_camping	sub	Radio interference	When attacking an enemy, deal **24.1~45.8%** of Attack as additional damage.	\N
368	kotori_cheer_squad	sub	Glad to be of service!	Every time Normal skill buff is applied to an ally, increase own Attack by **6.6~12.6%** for **30 seconds**. (stacks up to **5**)	\N
376	maki	sub	The Hardships of Art	Marked enemies receive additional damage equal to **14.9~28.3%** of Maki's Attack.	\N
384	mari	sub	Compassionate heart	Increase HP of all allies by **9.1~17.3%**.	\N
392	marina	sub	Iron discipline	While EX skill is active, increase the Evasion by **20.1~38.3%**.	\N
400	mashiro_swimsuit	sub	Blessing of justice	Increase Accuracy of all allies by **9.1~17.3%**.	\N
329	kazusa	ex	Sweet・fire	Reload instantly after skill activation.Deal **933~1773%** damage to 1 enemy.	4
337	kirino	ex	We're done talking!	Deal **337~540%** damage to enemies within a circular area. Creates smoke screen for **20 seconds** that reduces Accuracy of enemies within it by **26.1~30%**.	3
345	koharu_swimsuit	ex	It's not like that!	Deal **439~834%** damage to enemies within a circular area.	3
353	kotama	ex	Begin surveillance	Increase the Attack of all allies in a circular area by **24.9~47.4%**. (Duration: **30 seconds**)	3
361	kotori	ex	Black box	Move 4 allies to the specified location and grant them shields of **175~334%** Healing power for **13 seconds**.	4
369	koyuki	ex	Tricky variables	Throw a random bomb, dealing damage to enemies within a circular area.Bullet: Deal **233~444%** damageElectric Field: Deal **221~421%** damageExplosion: Deal **209~398%** damage	4
377	makoto	ex	M-mistake!	Deal damage to enemies depending on the number of them within the circular area:4 or less: Deal **155~296%** damage5 to 9: Deal **311~592%** damage10 or more: Deal **519~987%** damage	6
385	mari_track	ex	Please have some water	Recover HP by **167~318%** of Healing to all allies within range (except Mari herself).	3
393	mashiro	ex	Shot of Justice	Deal **415~664%** damage to one enemy, **50~75%** chance of additional **623~716%** damage.	3
330	kazusa	basic	Force of habit	Every **30 seconds**, Increase Attack by **23~43.8%** for **25 seconds**.	\N
338	kirino	basic	Suppression!	Every **20 seconds**, deal **199~289%** damage to the furthest targetable enemy, and reduce their Accuracy by **19.4~28.1%** for **13 seconds**.	\N
346	koharu_swimsuit	basic	Don't stare!	Every **30 seconds**, increases Critical Rate by **20.8~39.6%** for **25 seconds**.	\N
354	kotama	basic	Scanning for vulnerabilities	Every **30 seconds**, target 1 enemy for **237~450%** of Attack. Reduce enemy's Attack stat by **18.9%**. (Duration: **20 seconds**)	\N
362	kotori	basic	Sorry!	Every **35 seconds**, deal **269~511%** damage to enemies within a fan shaped area.	\N
370	koyuki	basic	Did you think it was just you!?	Every **30 seconds**, deal **202~385%** damage to one enemy. If there are enemies nearby, deal the same damage to 2 nearby enemies.Reload immediately after skill activation.	\N
378	makoto	basic	Listen!	Every **55 seconds**, decrease the Defense of enemies within a circular area by **8.3~15.8%** for **35 seconds**.	\N
386	mari_track	basic	Sister's support	Every **45 seconds**, recover HP of one other ally with the highest Defense and self by **82.8~132%** of Healing. Increase Defense by **18.5~24.1%** for **40 seconds**.	\N
394	mashiro	basic	Justice's Decision	Every **20 seconds**, target a circular area with **150~286%** Attack.	\N
331	kazusa	enhanced	Sugar・high	Increase Attack by **14~26.6%**.	\N
339	kirino	enhanced	Taking immediate action!	Increase HP by **14~26.6%**.	\N
347	koharu_swimsuit	enhanced	Elites' duty	Increase Critical Rate by **14~26.6%**.	\N
355	kotama	enhanced	Intensive analysis	Increase Accuracy by **14~26.6%**.	\N
363	kotori	enhanced	Getting the point	Increase Critical Damage by **14~26.6%**.	\N
371	koyuki	enhanced	Do you believe in miracles?	Increase Attack by **14~26.6%**.	\N
379	makoto	enhanced	Great Chairman of Pandemonium Society	Increase Attack by **14~26.6%**.	\N
387	mari_track	enhanced	Here to help	Increase Healing by **14~26.6%**.	\N
395	mashiro	enhanced	Sprit of Justice	Increase Critical Rate by **14~26.6%**.	\N
332	kazusa	sub	Nibble	When reloading, decrease Attack Speed by **16.3%**, but increase Attack by **26.1~49.6%** for **15 seconds**.Stacks up to a maximum of **2** times.	\N
340	kirino	sub	No time to rest!	Normal attacks have a **30%** chance to decrease enemy Recovery Rate by **22.7~43.2%** for **13 seconds**. (Cooldown: **5 seconds**)	\N
348	koharu_swimsuit	sub	Nothing naughty! Death penalty!	When attacking medium-sized enemies, deal **10.4~19.8%** of Attack as additional damage.	\N
356	kotama	sub	Spread spectrum	Increase Attack of all allies by **9.1~17.3%**.	\N
364	kotori	sub	Understood!	After defeating an enemy, increase Critical Damage by **20.1~38.3%** for **30 seconds**.	\N
372	koyuki	sub	Chaos theory	When EX skill is activated, increase Attack depending on the type of bomb used. (Duration: **40 seconds**)Bullet: Increase Attack by **15.3~29.1%**Electric Field:Increase Attack by **14.5~27.5%**Explosion: Increase Attack by **13.7~26%**	\N
380	makoto	sub	Invincible! The true leader of Gehenna!	Increase Penetration Efficiency of all aliies by **15.9~30.2%**.	\N
388	mari_track	sub	Devoted encouragement	When using EX or Normal skill, if target's HP is below 30%, additionally recover their HP by **90~171%** of Healing.	\N
396	mashiro	sub	Justice Solidarity	Increase Accuracy of all allies by **9.1~17.3%**.	\N
333	kikyou	ex	Divinely calculated move	Reduce Defense of enemies within a cross-shaped area by **17.6~28.1%** for **30 seconds**.Deal **252~480%** damage to them.	5
341	koharu	ex	Holy Hand Grenade	Heal allies in an area for **101~192%** of Healing. For enemies, deal **227~431%** damage.	3
349	kokona	ex	Very well done!	Heal one other ally for **152~290%** of Healing. Heal self for **101%** of Healing.Receive 1 Hanamaru Stamp.	2
357	kotama_camping	ex	Bear bell toss	Deal **477~906%** damage to one enemy and inflict Confusion for **7.2~11.5 seconds**.	6
365	kotori_cheer_squad	ex	The origin of the gun salute is...	Deal **205~390%** damage to enemies within a conical area..	3
373	maki	ex	To make a more vivid world!	Target 1 enemy with **676~1081%** Attack, and increase Attack by **41.9~54.5%** for **30 seconds**.	5
381	mari	ex	Holy blessing	Grant a shield of **172~328%** Healing to an ally for **20 seconds**, and cleanse **1** debuff from them.	2
389	marina	ex	Revolutionary charge!	Deal **335~636%** damage to enemies within an arch-shaped area. Reduce their Recovery Rate by **23.9~45.5%** for **30 seconds**.	3
397	mashiro_swimsuit	ex	Baptism of justice	Decrease Evasion of a single enemy by **30.1~39.1%** for **30 seconds**. Then, deal **640~1025%** damage to that enemy.	4
401	megu	ex	I like it hot~!	Deal **354~619%** damage enemies within a conical area.Increase Attack by **16.7~19.2%** and ignore normal attack delay for **30 seconds**.	5
402	megu	basic	I'll warm it up for you!	Every **40 seconds**, inflict **17.9~34.1%** continuous damage to enemies within a circular area. (Duration: **10 seconds**)	\N
403	megu	enhanced	Give way!	Increase Defense by **11.2~16.2%** and Attack by **11.2~16.2%**.	\N
404	megu	sub	Ah, so refreshing!	Every **50** attacks, recover HP by **30~57%** of Healing.	\N
405	meru	ex	Great idea	Deal **91.1~173%** damage to one enemy, and inflict **173~329%** of continuous Burn damage for **30 seconds**.Apply the Weak Point Exposed debuff on target for **30 seconds**.When attacked, an enemy with this debuff takes additional damage equal to **1.3~2.5%** of Meru's Attack.(This damage can not be critical, effect ends after **480 hits**)	5
406	meru	basic	Shipping has no limits	Every **50 seconds**, deal **71.4~135.6%** damage to one enemy.Inflict **47.9~91.1%** of additional Burn damage for **30 seconds**.	\N
407	meru	enhanced	Input	Increase Attack by **14~26.6%**.	\N
408	meru	sub	Setting breakdown!	Every **3** Normal attacks, fire enhanced bullets, dealing **139~264%** damage.	\N
409	michiru	ex	Michiru-style technique!!	Launch a firework that flies in a straight line and deals **501~803%** damage to the first enemy hit. Additionally, inflict **149~194%** continuous burn damage for **20 seconds**.	5
410	michiru	basic	Behold, hell's ninja sword!	Every **30 seconds**, increases Attack by **21.4~40.6%** for **20 seconds**.	\N
411	michiru	enhanced	Look, look, my own ninjutsu!	Increase Critical Damage by **14~26.6%**.	\N
412	michiru	sub	Secret Michiru-style ninjutsu!	Increase Critical Damage by **8.4~15.9%**. For each **1** student of the Ninjutsu Research Department within the same team, the  Critical Damage is increased by an additional **8.4~15.9%**. (Michiru not included, up to a maximum of 3)	\N
413	midori	ex	Drawing Art	Target up to 5 enemies, dealing damage equal to **119~191%** Attack per shot. If Momoi is in the same team, apply poison damage equal to **39.8~51.8%**. (Duration: **20 seconds**)	3
414	midori	basic	Brushup Sense	Every **25 seconds**, heal 1 ally with the lowest HP for **77.5~147%** of Midori's Healing.	\N
415	midori	enhanced	Artist Inspiration	Increase Critical Rate by **14~26.6%**.	\N
416	midori	sub	Developer Synergy: Momoi	Increase Attack Speed by **15.1~28.7%**. If Momoi is in the same team, increase by **18.1~34.4%** instead.	\N
417	mika	ex	Kyrie Eleison	Deal **810~1540%** damage to a single enemy.Damage is multiplied by x**1~2** depending on the target's current HP.The higher the target enemy's HP, the greater the damage.	6
418	mika	basic	Call of the Stars	Every **5** normal attacks, deal **89.4~169%** damage to one enemy.Every 3 Normal Skill activations, a meteorite falls, dealing **178~339%** additional damage.	\N
419	mika	enhanced	Gloria Patri	Increase Attack by **14~26.6%**.	\N
420	mika	sub	Benedictio	All attacks are guaranteed to be critical hits.Increase damage dealt by **12.7~24.2%** and reduce damage taken by **6.4~12.2%**.	\N
421	mimori	ex	It's a beatiful day to watch cherry blossoms	Move up to 5 allies within circular area to a specified position and increase their Attack Speed by **14.7~28%** for **40 seconds**.	3
422	mimori	basic	I've packed lunch	Every **45 seconds**, continuously regenerate HP of an ally with the lowest HP (except Mimori herself) at a rate of **22.8~43.4%** Healing for **20 seconds**.	\N
423	mimori	enhanced	There's plenty more	Increase Defense by **14~26.6%**.	\N
424	mimori	sub	Would you like to taste it?	Every **35 seconds**, increase Defense of allies within the circular area by **14.2~27.1%** for **23 seconds**.	\N
425	mimori_swimsuit	ex	It's summer!	Deploy a cover, and increase the Attack Speed of allies within a circular area around it by **16.6~31.6%** for **20 seconds**.The cover inherits **49.5~94.1%** of Mimori's HP.	3
426	mimori_swimsuit	basic	Do you want some?	Every **50 seconds**, grant a shield to an ally with the lowest HP (shield HP is **105~201%** of Mimori's Healing). (Duration: **35 seconds**)	\N
427	mimori_swimsuit	enhanced	I brought plenty	Increase HP by **14~26.6%**.	\N
428	mimori_swimsuit	sub	Don't worry. I'm by your side.	Increase Attack Speed of all allies by **9.1~17.3%**.	\N
429	mina	ex	Clash of Giants	Deal **312~593%** damage to one enemy.Decrease their Attack, Evasion, and Accuracy by **15.9~30.2%** for **50 seconds**.	3
430	mina	basic	Unstoppable Force	Every **8** normal attacks, reload instantly and deal **222~423%** damage to one enemy.Deal additional damage depending on the number of debuffs of the target:3 debuffs: **445~846%** damage4 debuffs: **668~1269%** damage5 or more debuffs: **891~1693%** damage.	\N
431	mina	enhanced	Relentless	Increase Evasion by **14~26.6%**	\N
432	mina	sub	Riding the Tiger	When using EX skill, increase Attack, Evasion, and Accuracy by **18.8~35.8%** for **20 seconds**.	\N
433	mine	ex	Pride and Faith	Jump to the specified location, dealing **103~196%** damage to enemies within a circular area, reduce their Evasion and Defense by **6.8~13%** for **40 seconds**.If the enemy is medium-sized, Evasion and Defense reductions are increased by a factor of **2.5**.	4
435	mine	enhanced	Will of the Knights	Increase HP by **14~26.6%**.	\N
439	minori	enhanced	Hand in hand	Increase Accuracy by **14~26.6%**.	\N
434	mine	basic	Severe Sentence	Whenever "Ready for Rescue" status ends, deal **475~902%** Defense damage to enemies within a circular area, and reduce their Evasion and Defense by **8~15.2%** for **30 seconds**.	\N
442	misaka_mikoto	basic	It's going to tingle!	Every **50 seconds**, deal **120~228%** damage to enemies within a circular area.Apply **113~157%** continuous electric shock damage for **20~40 seconds**.	\N
450	miyako	basic	Claymore	Every **40 seconds**, 5 fragments are scattered from a small claymore, each dealing **84~160%** damage.	\N
458	miyu	basic	Attack from an unexpected angle	Every **5** Normal attacks, deal **148~283%** damage to one enemy.	\N
466	moe	basic	Barrage	Every **40 seconds**, deal **100~160%** damage to 5 enemies. Inflict Stun status for **1.2~1.6 seconds**.	\N
474	momoi	basic	Strict Deadlines	Every **30 seconds**, increase Accuracy by **22.3~42.3%**. (Duration: **20 seconds**)	\N
482	mutsuki_new_year	basic	Little devil chorus	Every **50 seconds**, deal **217~315%** damage to enemies in a straight line. If Mutsuki currently holds 6 "Little devils", deal an additional **117~169%** damage.	\N
490	natsu	basic	Eat this and cheer up	Every **30 seconds**, increase Attack of an ally by **8.5~16.1%** for **20 seconds**. If there are other allies that do not have this buff (excluding self), apply it to them as well.	\N
498	neru_bunny_girl	basic	I said this ain't a show!	Every **30 seconds**, increase Evasion by **22.1~41.9%**. (Duration: **23 seconds**)	\N
506	nodoka	basic	Stubborn sightlines	Every **25 seconds**, deal **221~421%** damage to 1 enemy, decrease their Evasion by **17.7~33.7%**. (Duration: **20 seconds**)	\N
436	mine	sub	Indomitable Courage	When using EX skill, apply "Ready for Rescue" status, granting continuous HP recovery of **64.8~123%** Healing for **10 seconds**.If "Ready for Rescue" is already active, instead increase Critical Resistance by **19.3~36.7%** for **20 seconds**.	\N
444	misaka_mikoto	sub	Don't make me repeat myself	When Normal skill is activated, increase Attack by **10~21.4%** for **20~40 seconds**.	\N
452	miyako	sub	Operation reinforcements	When using EX skill, reduce incoming damage by **19~36.1%** for **16 seconds**.	\N
460	miyu	sub	Special sniper rounds	After reloading increase Critical Damage by **18.9~36%** for **13 seconds**.	\N
468	moe	sub	Operation support	Increase Attack of all allies by **9.1~17.3%**.	\N
476	momoi	sub	Developer Synergy: Midori	Increase Attack by **15.1~28.7%**. If Midori is in the same team, increase by **18.1~34.4%** instead.	\N
484	mutsuki_new_year	sub	Little devil's cute plot	Each time Mutsuki's EX Skill hits 3 enemies, she gains one "Little devil" for **56 seconds**. Can hold up to **6** "Little devils", Critical Damage is increased by **2.1~4.1%** for every "Little devil" that Mutsuki holds.	\N
492	natsu	sub	A mouthful of happiness	When activating EX skill, increase Recovery Rate by **7.2~13.8%**. Stacks up to a maximum of **3** times.	\N
500	neru_bunny_girl	sub	You like it even more painful?	When attacking medium-sized enemies, deal **3.2~6.2%** of Attack as additional damage.	\N
437	minori	ex	Raise up!	Deal **462~878%** damage enemies within a circular area.Additionally consume up to 3 Cost, increasing damage by 35% per 1 Cost.(Cost reduction effects will only affect the base skill cost)	4
445	misaki	ex	Empty world	Deal **7.5~14.3%** damage to enemies within 7 circular areas each **4 seconds**. (Duration: **48 seconds**)(If this skill is used again while its previous effect is still active, previous effect disappears)	5
453	miyako_swimsuit	ex	Flying drone operational	Decrease Critical Damage Resistance of 1 enemy by **10.7~20.3%** for **50 seconds**.Deal **256~487%** damage to them.	2
461	miyu_swimsuit	ex	Seagull attack	Deal **388~737%** guaranteed critical damage to enemies within a straight line.	5
469	momiji	ex	Be quiet in the library	Deal **187~356%** damage to enemies within a circular area.	4
477	mutsuki	ex	Scorching Serenade	Deal damage equal to **409~778%** of Attack to enemies in 3 circular areas.	4
485	nagisa	ex	Time On Target	Deal **482~772%** damage to enemies within a circular area.If the enemy has Light armor, decrease their Defense by **30.9~40.2%** before attacking, for **15 seconds**.	3
493	neru	ex	Huh? Do you have a fucking death wish?	Attack 1 enemy with **476~762%** Attack power. When enraged, damage is multiplied **1.5~1.7**x.	2
501	noa	ex	Because speed is the key to records	Apply Focused Fire to one target enemy for **40 seconds**.Decrease their Defense by **21.3~40.5%** for **40 seconds**.	3
438	minori	basic	United will	Every **25 seconds**, deal **77.8~147%** damage to enemies within a circular area.	\N
446	misaki	basic	I can't wait to get this over with	Every **50 seconds**, increase Attack by **19.5~37.1%** for **40 seconds**.	\N
454	miyako_swimsuit	basic	Lightweight equipment	Every **30 seconds**, increase Evasion by **18.4~35%** for **25 seconds**.	\N
462	miyu_swimsuit	basic	Stealth strike	Every **70 seconds**, deal **369~702%** damage to enemies within a cone-shaped area.	\N
470	momiji	basic	Power of Knowledge	Every **30 seconds**, increase Attack by **11.8~22.5%** for **20 seconds**.	\N
478	mutsuki	basic	Exploding Aria	Every **20 seconds**, place 3 landmines that deal **334~635%** damage. (Landmines disappear after **15 seconds**)	\N
486	nagisa	basic	Afternoon Tea	Every **50 seconds**, heal one ally with the lowest HP for **147~279%** of Healing.If the target is a student of Trinity, heal for **207~393%** of Healing instead.	\N
494	neru	basic	Huh? Stop bullshitting!	Every **30 seconds**, apply Enraged status to self. Increase Evasion by **17.8~33.9%**. (Duration: **20 seconds**)	\N
502	noa	basic	There are openings everywhere!	Every **30 seconds**, deal **399~758%** damage to one enemy.	\N
440	minori	sub	Fruits of labor	For all allies, increase Explosive damage bonus against the enemies weak to it by **15.9~30.2%**.	\N
448	misaki	sub	Equivalent exchange	When attacking a weakened enemy, deal **1.1~2.1%/4.1%/6.2%/8.3%/10.3%** of Attack as additional damage, stacks up to 5 times depending on the number of weakening effects.	\N
456	miyako_swimsuit	sub	Tactical maneuver	After **50** evasions, increase Cost Recovery by **332~630** for **10 seconds**.	\N
464	miyu_swimsuit	sub	Observation status report	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
472	momiji	sub	Beginning of the Journey	At the beginning of combat, increase Attack by **9.4~17.8%**Normal attack damage radius is increased by x**0~1.5**.	\N
480	mutsuki	sub	Let's go have fun?	Normal attacks have a **25%** chance of increasing accuracy by **30.2~57.4%** for **30 seconds**. (Cooldown: **25 seconds**)	\N
488	nagisa	sub	Noblesse oblige	Increase Critical Damage of Explosive damage type allies by **12.7~24.2%**.	\N
496	neru	sub	Fury	When enraged, increase Attack by **16.8~31.9%**. (**30 seconds** duration)	\N
504	noa	sub	Secretary's commitment	When using Normal skill, increase debuff duration by **16.9~32.1%** for **13 seconds**.	\N
441	misaka_mikoto	ex	Tokiwadai Railgun	Deal **544~1034%** damage to enemies in a straight line.	3
449	miyako	ex	Self-propelled flash drone	Deal **340~545%** damage to an enemy and Stun them for **4.2~5.5 seconds**.	3
457	miyu	ex	Observation of a timid person	Apply the Weak Point Exposed debuff to one enemy for **10 seconds**. When attacked, an enemy with this debuff takes additional damage equal to **15.8~30%** of Miyu's Attack.(This damage can not be critical, effect ends after **120 hits**)	3
465	moe	ex	Iron Rain	Deal **306~489%** damage to enemies in a straight line.Apply **50.9~66.2%** of continuous burn damage for **20 seconds**.	4
473	momoi	ex	The anguish of creation	Attack all enemies in a conical area with damage equal to **338~541%** Attack. If Midori is in the same team, inflict burn damage equal to **72~93.6%** Attack. (Duration: **20 seconds**)	3
481	mutsuki_new_year	ex	Symphony of New Year	Deal **159~302%** damage to enemies in an arch-shaped area.	2
489	natsu	ex	It's the best thing to do in times like these	Recover HP by **178~338%** of Healing and clear **1** debuff.	3
497	neru_bunny_girl	ex	You there, don't move!	Move to chosen location, deploy a shield with HP equal to **276~401%** of Healing for **20 seconds**, and deal **366~531%** damage to enemies in a circular area. Taunt enemies in a circular area for **0~3 seconds**.	4
505	nodoka	ex	Observatory Support	Increase Accuracy of all allies in a circular area by **25.2~47.9%**. (Duration: **30 seconds**)	3
443	misaka_mikoto	enhanced	Electromaster	Increase Accuracy by **14~26.6%**.Ignore Shokuhou Misaki's Confusion effect.	\N
451	miyako	enhanced	Special bulletproof plate	Increase HP by **14~26.6%**.	\N
459	miyu	enhanced	Take a deep breath	Increase Critical Damage by **14~26.6%**.	\N
467	moe	enhanced	Pleasure of ruination	Increase Attack by **14~26.6%**.	\N
475	momoi	enhanced	Creative Sense	Increase Critical Rate by **14~26.6%**.	\N
483	mutsuki_new_year	enhanced	More fun ways to play!	Increase Attack by **14~26.6%**.	\N
491	natsu	enhanced	When you're hungry...!	Increase HP by **14~26.6%**.	\N
499	neru_bunny_girl	enhanced	Bitter	Increase Critical Damage by **14~26.6%**.	\N
507	nodoka	enhanced	Aesthetics-based Observation	Increase Accuracy by **14~26.6%**.	\N
447	misaki	enhanced	Pointless technology	Increase Attack by **14~26.6%**.	\N
455	miyako_swimsuit	enhanced	Steady training	Increase HP by **14~26.6%**.	\N
463	miyu_swimsuit	enhanced	Underwater composite ammo	Increase Attack by **14~26.6%**.	\N
471	momiji	enhanced	Collector's ardour	Increase Attack by **14~26.6%**.	\N
479	mutsuki	enhanced	Let's play!	Increase Attack by **14~26.6%**.	\N
487	nagisa	enhanced	Pride of Tea Party	Increase Attack by **14~26.6%**.	\N
495	neru	enhanced	Call sign 00	Increase Critical Damage by **14~26.6%**.	\N
503	noa	enhanced	Secretary's leeway	Increase HP by **14~26.6%**.	\N
508	nodoka	sub	The Bond of the Special Class	Increase Accuracy of all allies by **9.1~17.3%**.	\N
509	nodoka_hot_spring	ex	No. 227 Hot Spring Resort, Open for Business!	Nodoka (Hot Spring) enters the battlefield to distribute snacks to allies. (Duration: **32 seconds**)	4
510	nodoka_hot_spring	basic	I brought snacks!	Every **3 seconds**, a random snack is thrown to one ally with the lowest HP within the circular area around Nodoka (Hot Spring), recovering their HP.Hot Spring Manju: **20.3~38.6%** of HealingCorn Stick: **24.8~47.1%** of HealingMilk: **29.3~55.7%** of Healing	\N
511	nodoka_hot_spring	basic	Hostess' Hospitality	Every **25 seconds**, increase incoming healing of the ally with the lowest HP by **16.6~31.6%** for 20 seconds.	\N
512	nodoka_hot_spring	enhanced	Spring Water Cure	Increase Healing by **14~26.6%**.	\N
513	nodoka_hot_spring	sub	Hot Springs Warmth	Increase Attack of all allies by **9.1~17.3%**.	\N
514	nonomi	ex	It's punishment time~♣	Attack all enemies within a conical area for **432~821%** of Nonomi's Attack.	5
515	nonomi	basic	Ta-da☆	Every **30 seconds**, increase Nonomi's Attack by **21.8~41.4%**. (Duration: **20 seconds**)	\N
516	nonomi	enhanced	That's not okay!	Increase Critical Damage by **14~26.6%**.	\N
517	nonomi	sub	I'll clean up spick-and-span~♧	When attacking large enemies, deal **6.7~12.8%** of Nonomi's Attack stat as additional damage.	\N
518	nonomi_swimsuit	ex	Stay cool ♧	Deal **695~1113%** damage to one enemy.Ignore delay between normal attacks **2~4** times until **100** bullets is consumed.Reload immediately after skill activation.	6
519	nonomi_swimsuit	basic	Have fun with everyone!	Every **40 seconds**, increases the Attack Speed of allies within a circular area by **11.4~21.6%** for **30 seconds**.	\N
520	nonomi_swimsuit	enhanced	I can't wait ♧	Increase Attack Speed by **14~26.6%**.	\N
521	nonomi_swimsuit	sub	It's cold~!	When EX skill is active, normal attacks deal additional damage of **10.9~20.9%** Attack.	\N
522	pina	ex	Rapid-Fire Mode!	Reloads and increases attack power by **29.1~46.6%** for **30 seconds** while ignoring attack delay **3~5** times.	4
523	pina	basic	Ignite once more!	When HP drops to **20%**, heal self for **355~674%** of Healing power **1** per battle.	\N
524	pina	enhanced	Sharp Intuition	Increase Critical Rate by **14~26.6%**.	\N
525	pina	sub	Firing Preparations, OK!	Increase Attack Speed by **20.1~38.3%** when standing still for **10 seconds**.	\N
526	reisa	ex	Come challenge me!	Deal **372~707%** damage to enemies within a conical areaCleanse **1** debuff from self.	3
527	reisa	basic	Victory pose!	Every **50 seconds**, continuously regenerate HP at a rate of **22.7~43.1%** Healing for **30 seconds**.	\N
528	reisa	enhanced	All day long!	Increase Attack by **11.2~16.2%**, increase HP by **11.2~16.2%**.	\N
529	reisa	sub	The presense of Uzawa Reisa	When using EX skill, decrease target Defense by **6~11.4%** for **25 seconds**.Taunt them for **1 second**.	\N
530	renge	ex	Hyakkaryouran shooting technique	Inflict **14.5~27.6%** continuous Burn damage to enemies within a fan-shaped area. (Duration: **20 seconds**)Deal **263.5~501.5%** damage to them.	3
531	renge	basic	Burning passion	Every **30 seconds**, obtain Passion status, increasing Attack by **19.8~37.6%** for **22 seconds**.	\N
532	renge	enhanced	Hyakkaryouran oni instructor	Increase Attack by **14~26.6%**.	\N
533	renge	sub	Cutthroat captain's duty	When attacking in Passion state, deal **4.5~8.6%** of Attack as additional damage.	\N
534	rumi	ex	Best in the world!	Toss fried rice to one other ally, healing them, and if there is an ally near the target that has not yet been healed, fried rice bounces in that direction and heals them as well (up to 4 times).1st and 4th target: heals **117~223%** of Healing, cleanses **0~1** debuff2nd and 3rd targets: heals **82.2~156%** of Healing	4
535	rumi	basic	No complaints allowed!	Every **30 seconds**, deals **226~430%** damage to enemies within a fan-shaped area.	\N
536	rumi	enhanced	Chairman's pride	Increase normal attack Firing Range by **100** and Healing by **11.2~21.2%**.	\N
537	rumi	sub	Memorable taste	For allies healed by EX skill, additionally continuously heal by **1.7~3.3%** of Healing for **60 seconds**.	\N
538	saki	ex	Support fire, commence!	Deal **416~666%** damage to enemies in a circular area and Stun them for **3.9~5.1 seconds**.	4
539	saki	basic	Suppressive fire	Every **35 seconds**, deal **185~343%** damage to one enemy. Apply continuous Burn damage, dealing **53.4~56%** damage every 4 seconds for **20 seconds**.	\N
540	saki	enhanced	All set	Increase Attack by **14~26.6%**.	\N
541	saki	sub	Point man leading the way	Increase Attack of all allies by **9.1~17.3%**.	\N
542	saki_swimsuit	ex	Signal flare away!	Deal **290~552%** damage to a single enemy.Decrease their Defense, Attack, and Critical Resistance by **10.9~20.8%** for **50 seconds**.	4
543	saki_swimsuit	basic	Covering fire	Every **15** normal attacks, deal **195~371%** damage to enemies within a conical area.Deal **97.7~185%** of Attack as additional damage against medium-sized enemies.	\N
544	saki_swimsuit	enhanced	Meticulous maintenance	Increase Accuracy by **14~26.6%**.	\N
545	saki_swimsuit	sub	Brothers-in-arms	Increase Attack of self and Special students by **16.1~30.6%**.	\N
546	sakurako	ex	Baptismal seal	Deal **390~625%** damage to one enemy and apply Focused Fire for **30 seconds**.Normal attacks deal **9.4~17.9%** as additional damage for **30 seconds**.	4
547	sakurako	basic	Sister's garment	Every **40 seconds**, increase Attack Speed by **12.3~23.4%** for **30 seconds**.	\N
548	sakurako	enhanced	One who judges the guilty	Increase Attack Speed by **14~26.6%**.	\N
549	sakurako	sub	May the light be with you	Deal **4.8~9.1%** as additional damage against the enemies with Special armor.	\N
550	saori	ex	...and all is vanity!	Deal **671~1275%** guaranteed critical hit to one enemy.	4
551	saori	basic	Leading the target	Every **25 seconds**, Increase Critical Damage by **19.1~24.8%** for **16 seconds**.Deal **208~334%** guaranteed critical damage hit to one enemy.	\N
559	saya	basic	Exciting Experiment!	Every **20 seconds**, decrease 1 enemy's Critical Rate by **12.1%**. (Duration: **20 seconds**)Apply continuous poison damage for **36.5~69.3%** of Saya's Attack. (Duration: **20 seconds**)	\N
567	sena	enhanced	On-site support	While Emergency Vehicle No. 11 is deployed, increase Attack for all other allies (excluding Sena herself) remaining within the circular area around Emergency Vehicle No. 11 by **17~22.1%**.	\N
552	saori	enhanced	Results of training	Increase Critical Damage by **14~26.6%**.	\N
560	saya	enhanced	I really am great!	Increase Attack by **14~26.6%**.	\N
568	sena	enhanced	On-site support	While Emergency Vehicle No. 11 is deployed, heal all other allies (excluding Sena herself) within the circular area around Emergency Vehicle No. 11 for **18.7~19.7%** of Healing every **10 seconds**.	\N
576	serika_new_year	ex	You're interrupting my work!	Deal **247~395%** damage enemies in an arch-shaped area.Reduce their Critical Damage by **21.3~27.7%** for **30 seconds**.	3
584	serina_christmas	ex	The sound of blessings	Increase Critical Damage **27.2~43.5%** for **50 seconds** and grant 1 "Holy Night Blessing" to other allies within a circular area around Serina. ("Holy Night Blessing" stacks up to 15 times)Each "Holy Night Blessing" adds **2.3~3.7%** Penetration damage bonus against the enemies weak to it. (Duration: **50 seconds**)	4
592	shigure_hot_spring	ex	Shigure Special Fruit Milk	Recover HP by **21.3~40.4%** of Healing for all allies within a circular area every **4 seconds** for **30 seconds**.	6~5
600	shiroko	ex	Summon Drone: Fire Support	Deal **400~760%** of Shiroko's Attack as damage to one enemy.	2
608	shiroko_swimsuit	ex	Big catch	Decrease Defense of one enemy by **18~34.2%** for **30 seconds**Deal **588~1117%** damage to them.	3
616	shizuko_swimsuit	ex	Business trip, Momoyo summer stall!	Move 4 allies in a circular area to the specified location and apply a shield equal to **76.8~145%** of Healing power for **30 seconds**.	3
553	saori	sub	Leader's responsibility	Increase Attack by **19.3~36.7%/55%/73.4%** respectively when there are 2/3/4 or more students from Arius Squad in the same unit, including self.(additionally includes all versions of Azusa)	\N
561	saya	sub	Believe only in me!	Increase Critical Rate of all allies by **9.1~17.3%**.	\N
569	sena	basic	Stimulant injection	Every **40 seconds**, increase Attack of one ally with the highest Attack by **16.8~31.9%** for **30 seconds**.	\N
577	serika_new_year	basic	As a shrine maiden, I'll pray for you!	Every **40 seconds**, increase Attack of allies within a circular area by **8.6~16.4%**. (Duration: **30 seconds**)	\N
585	serina_christmas	basic	Gift set C	Every **21** normal attacks, throw random gifts to other allies within a circular area. (Duration: **30 seconds**)Green box: Increase Critical Damage by **11~21%**Red box: Increase Critical Damage by **12.6~24%**Stuffed bear: Increase Critical Damage by **14.2~27%**	\N
593	shigure_hot_spring	basic	How about a bite?	Every **50 seconds**, heal 4 allies with the lowest HP by **67.6~128%** of Healing.	\N
601	shiroko	basic	Grenade Toss	Every **25 seconds**, deal **193~368%** damage to enemies within a circular area.	\N
609	shiroko_swimsuit	basic	"Right here"	At the beginning of combat, increase the Critical Rate of all other allies by **11.5~21.9%** for **60 seconds**, and reduce EX skill cost by **1**.(Reduction active until EX is activated **1** time)	\N
617	shizuko_swimsuit	basic	Are you hot?	Every **45 seconds**, increase the Critical Damage of one ally with the highest Critical Damage by **20.8~39.5%**. (Duration: **36 seconds**)	\N
554	saten_ruiko	ex	Full swing	Deal **446~847%** damage to enemies in a circular area.	4~3
562	saya_casual	ex	It's a gift from me!	Create a horizontal area, enemies within area are dealt **40~75.9%** continuous damage. (Duration: **20 seconds**)	5
571	sena	sub	As soon as possible	Increase Attack of all allies by **9.1~17.3%**.	\N
579	serika_new_year	sub	Shrine maiden's tenacity	Increase Critical Damage Resistance of all allies by **9.1~17.3%**.	\N
587	serina_christmas	sub	Divine protection	When reloading, increase Evasion by **18.1~34.4%** for **15 seconds**.	\N
595	shigure_hot_spring	sub	Tangy flavor	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
603	shiroko	sub	High-speed Rapid Fire	Normal attacks have a **20%** chance to increase Attack Speed by **30.2~57.4%** for **30 seconds**. (Cooldown: **25 seconds**)	\N
611	shiroko_swimsuit	sub	Toned body	Increase Cost Recovery of all allies by **10.6~20.2%**.	\N
555	saten_ruiko	basic	Secret mackerel curry	Every **45 seconds**, increase Attack of one ally by **10.9~20.6%** for **20 seconds**.Every time Ruiko uses a Normal skill, the number of targets increases by 1 (up to a maximum of 3).	\N
563	saya_casual	basic	Research never ends!	Every **30 seconds**, deal **205~389%** damage to all enemies within a circular area.	\N
556	saten_ruiko	enhanced	Going all out!	Increase Attack by **14~26.6%**.	\N
564	saya_casual	enhanced	Elixir of concentration	Increase Critical Damage by **14~26.6%**.	\N
572	serika	ex	You're such a bother!	Reload and increase Attack by **35.6~67.7%** for **30 seconds**.	2
580	serina	ex	Intensive care set A	Moves the closest ally to the first aid box and recovers their HP by **120~228%**.	2
588	shigure	ex	Shigure Special Bottle Grenade	Deal **425~681%** damage to enemies within a straight line.Inflict **64~83.1%** continuous Burn damage for **20 seconds**.	5
596	shimiko	ex	Shield Of Knowledge	Deploy a cover, and increases any allies's Defense in circular area by **16.3~26.2%**. (Duration: **30 seconds**)Cover additionally inherits **0~38%** of Shimiko's HP.	3
604	shiroko_cycling	ex	Ride & Grenade	Deal **431~690%** damage to enemies in a circular area and reduce their Attack by **38.4~50%** for **10 seconds**.	4
612	shizuko	ex	Momoyo Hall Take-out!	Deploy a piece of cover at designated location. Allies within radius of location receive **16.3~21.3%** increased accuracy for **30 seconds**. Cover's durability is a set amount plus **29.2~46.8%** of Shizuko's HP.	3
557	saten_ruiko	sub	Me too!	Increase Attack of all allies  by **9.1~17.3%**.	\N
565	saya_casual	sub	It's not a suspicious drug!	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
573	serika	basic	Precision Shooting	Every **25 seconds**, deal **223~425%** damage to one enemy.	\N
581	serina	basic	Emergency care set B	Every **35 seconds**, heals one ally by **94~178%**.	\N
589	shigure	basic	How about a drink?	Every **60 seconds**, increase Attack of one other ally with  the highest Attack by **26.4~50.2%**, but decrease the Accuracy by **27.5%**. (Duration: **30 seconds**)	\N
597	shimiko	basic	Chicken soup for the Soul	Every **35 seconds**, grant a shield to an ally with the lowest HP (shield HP is **119~226%** of Shimiko's Healing). (Duration: **16 seconds**)	\N
605	shiroko_cycling	basic	One-point breakthrough	Every **40 seconds**, deal **194~369%** damage to enemies in a straight line.	\N
613	shizuko	basic	Don't interfere with Business!	Every **25 seconds**, deal **184~341%** damage to one enemy and lower their Attack by **17.4~18.3%** for **21 seconds**.	\N
558	saya	ex	This is my masterpiece!	Apply continuous damage in an area for **126~239%** of Saya's Attack. (Duration: **8 seconds**)	6
566	sena	ex	Emergency dispatch	Sena enters the battlefield riding Emergency Vehicle No. 11.Emergency Vehicle No. 11 additionally inherits **16.2~25.9%** of Sena's Healing. (Duration: **50 seconds**)(Only one tactical support vehicle can be fielded at any given time)	5~4
570	sena	enhanced	Emergency support	Increase Healing by **14~26.6%**.	\N
575	serika	sub	Wrath of the Countermeasure Committe	Increase Attack Speed by **20.1~38.3%** for **30 seconds** after activating her EX skill.	\N
578	serika_new_year	enhanced	Shrine maiden's determination	Increase Attack by **14~26.6%**.	\N
583	serina	sub	Angel's smile	Increase CC Resistance of all allies by **9.1~17.3%**.	\N
586	serina_christmas	enhanced	Guardian angel's will	Increase HP by **14~26.6%**.	\N
591	shigure	sub	Wild guess	Normal attack damage radius is increased by x**1.5~2**, but attacks deal **61.6~83.8%** damage.	\N
594	shigure_hot_spring	enhanced	Warm four-and-a-half tatami room	Increase Healing by **14~26.6%**.	\N
599	shimiko	sub	Let's open a Book Club!	Increase Defense of all allies by **9.1~17.3%**.	\N
602	shiroko	enhanced	Pinpoint	Increase Critical Rate by **14~26.6%**.	\N
607	shiroko_cycling	sub	Sharp Eyes	When attacking weakened enemies, deal **3.8~7.3%** of Attack as additional damage.	\N
610	shiroko_swimsuit	enhanced	Slightly buoyant	Increase Attack by **14~26.6%**.	\N
615	shizuko	sub	Nyan Nyan!	Increase Critical Rate of all allies by **9.1~17.3%**.	\N
618	shizuko_swimsuit	enhanced	Sales are on the rise!	Increase Healing by **14~26.6%**.	\N
574	serika	enhanced	Part-time Job Spirit	Increase Attack by **14~26.6%**.	\N
582	serina	enhanced	Angel in white	Increase Healing by **14~26.6%**.	\N
590	shigure	enhanced	Sweet fermentation	Increase Critical Rate by **14~26.6%**.	\N
598	shimiko	enhanced	Let's accumulate more knowledge!	Increase Healing by **14~26.6%**.	\N
606	shiroko_cycling	enhanced	Rapid Fire	Increase Attack Speed by **14~26.6%**.	\N
614	shizuko	enhanced	Te, Tehepero?	Increase Accuracy by **14~26.6%**.	\N
619	shizuko_swimsuit	sub	Good luck! Nyan Nyan!	Increase Attack of all allies by **9.1~17.3%**.	\N
620	shokuhou_misaki	ex	Mental Out	Deal **772~1468%** damage to the target and two closest enemies within a circular area.Confuse them for **5~7 seconds**.	5
621	shokuhou_misaki	basic	Would you help me out a little?	Every **30 seconds**, deal **318~604%** damage to enemies within a circular area.	\N
622	shokuhou_misaki	enhanced	Queen of Tokiwadai	Increase CC Strength by **14~26.6%**.	\N
623	shokuhou_misaki	sub	I'm the smartest here	Every time Shokuhou Misaki's EX skill applies Confusion to an enemy, increase Defense and Evasion by **19.3~36.7%** for **20 seconds**.	\N
624	shun	ex	Where are the troublesome children?	Increase normal attack damage to **153%**, firing range by **24.4%**, Critical Rate by **26.3~50%**, but decrease Attack Speed by **18.8%**. (Duration: **30 seconds**)	3
625	shun	basic	Everyone, pay attention!	Acquire **2~3.8** Skill Cost at the beginning of combat. (Can only be used **1** per battle)	\N
626	shun	enhanced	An instructor's dignity	Increase Attack by **14~26.6%**.	\N
627	shun	sub	Meihua Yuan's Teachings	When attacking medium-sized enemies, deal **50.7~96.4%** of Attack as additional damage.	\N
628	shun_small	ex	That's not how it's supposed to work, okay?	Deal **593~803%** damage to a single target. (Ignores **28~44%** of target's Defense)	5
629	shun_small	basic	That's dangerous!	Every **25 seconds**, deal **167~317%** damage to one enemy.	\N
630	shun_small	enhanced	Enthusiastic	Increase Attack Speed by **14~26.6%**.	\N
631	shun_small	sub	Unbalanced	When using EX skill, decrease Attack by **21.7%** for **20 seconds**. Afterwards, increase Attack by **34.6~65.7%** for **20 seconds**.	\N
632	sumire	ex	Spurt Forward!	Attack all enemies in a conical area for **742~1410%** of Sumire's Attack.	3
633	sumire	basic	Warming Up	Every **40 seconds**, increase Attack by **25.2~47.9%**. (Duration: **20 seconds**)	\N
634	sumire	enhanced	Pinpoint Attack	Increase HP by **14~26.6%**.	\N
635	sumire	sub	Tension Up	When not under the effect of Crowd Control, increase Defense by **13.4~25.5%**.	\N
636	suzumi	ex	Order-made Flashbang	Attack all enemies within a circular area for **389~518%** Attack, inflict Stun status for **0~4.1 seconds**.	4
637	suzumi	basic	Hidden Strength of the Vigilante Corps	Every **25 seconds**, attack 1 enemy for **233~443%** Attack.	\N
638	suzumi	enhanced	Emergency Evasion	Increase Evasion by **14~26.6%**.	\N
639	suzumi	sub	Vigilante Corps Fierce Assault	Increase damage by **27.5~52.3%** of Attack on enemies under CC effects.	\N
640	toki	ex	System: Abi-Eshuh	Switch to Abi-Eshuh mode; increase Attack by **26.1~41.8%**, Accuracy by **13.9~18.1%**, and Evasion by **12.2%**.(Exit the mode after using EX skill **3** times)	2
641	toki	ex	System: Abi-Eshuh	After mode change, 1st and 2nd attack deal **87.5~167%** damage to enemies within a straight line, the final attack deals **607~1153%** damage to the targeted enemy, and **121~230%** to other enemies within a straight line.All three attacks ignore **40~60%** of enemy Defense.	5
642	toki	basic	Tactical judgment	Every **35 seconds**, deal **486~778%** damage to a single enemy.	\N
643	toki	basic	Tactical judgment	In Abi-Eshuh mode, every **35 seconds** deal **486~778%** damage to a single enemy, this attack ignores **30~60%** of enemy Defense.	\N
644	toki	enhanced	Call sign zero four	Increase Attack by **14~26.6%**.	\N
645	toki	sub	An eye for an eye	While in Abi-Eshuh mode, when using EX skill, deal additional damage depending on the number of usesFirst EX skill: **17.6~25.6%** damageSecond EX skill: **35.2~51.1%** damageThird EX skill: **52.9~76.7%** damage.This attack ignores **30~60%** of enemy Defense.	\N
646	toki_bunny_girl	ex	Special Weapon: Arm Gear	Deal **550~1045%** damage to one enemy.	2
647	toki_bunny_girl	basic	Agents' Secret Tools	Every **40 seconds**, deal **311~591%** damage to 1 enemy. Reduce their Critical Damage Resistance by **19.9~25.9%** for **30 seconds**.	\N
648	toki_bunny_girl	enhanced	Expertise	Increase Attack by **14~26.6%**.	\N
649	toki_bunny_girl	sub	Arms Handling	When EX skill is activated, add **18.6~35.4%** to Explosive damage bonus against the enemies weak to it. (Duration: **20 seconds**)	\N
650	tomoe	ex	Everyone, please listen to me!	Increase Critical Rate by **13.9~20.1%**, Critical Damage by **13.9~20.1%**, and the Movement Speed by **30.8%** for all allies around Tomoe; reduce their normal attack range by **38.5%**. (Duration: **30 seconds**)	3
651	tomoe	basic	Clever agitation	Every **30 seconds**, deal **235~447%** damage to one enemy.	\N
652	tomoe	enhanced	Practiced speech	Increase Attack by **14~26.6%**.	\N
653	tomoe	sub	Irrefutable claims	When attacking shielded enemies, deal **57.1~108%** of Attack as additional damage.	\N
654	tsubaki	ex	Combat shield, engaged	Increase Defense by **28.1~44.9%** for **30 seconds** and taunt enemies in a circular area for **4.7~6.2 seconds**.	4
655	tsubaki	basic	If you get tired, you should sleep	When HP drops to **30%**, heal self for **349~663%** of Healing power **1** a battle.	\N
656	tsubaki	enhanced	Grit	Increase Defense by **14~26.6%**.	\N
657	tsubaki	sub	Dexterous reload	While reloading reduce damage taken by **24~45.6%**.	\N
658	tsukuyo	ex	Tsukuyo-style technique...!	Each time character is attacked, recover **7~11.2%** of Healing.(Duration: **30 seconds**, applies up to a maximum of **100** times)Reduce Tsukuyo's own Attack by **28.8~20.2%** for **30 seconds**.	3
659	tsukuyo	basic	I practiced a lot, so...!	Every **7** normal attacks, deal **418~659%** damage to one enemy.If the enemy is medium-sized, additionally reduce their Defense by **38.9~51.6%** for **20 seconds**.	\N
660	tsukuyo	enhanced	Naturally gifted	Increase HP by **14~26.6%**.	\N
661	tsukuyo	sub	I can' t go down, yet...!	Recover **97.5~185%** of Healing when affected by a CC state.	\N
662	tsurugi	ex	Strange and mysterious	Reload immediately after activating the skill. Normal attack becomes a fan-shaped area attack that deals **138%** damage; increase Attack power by **25.8~45.2%**. (Effective until Tsurugi reloads **1~2**)	3
663	tsurugi	basic	Passion	When defeating an enemy, recover **116~221%** of Healing power. (Cooldown: **10 seconds**)	\N
671	ui	basic	Knowledge to be passed on	Every **40 seconds**, increase Critical Rate of allies within a circular area by **13.6~25.9%** for **33 seconds**.	\N
679	utaha	basic	Rai-chan MK-II, Active	Every **30 seconds**, summon a turret. The turret inherits **38.2~72.6%** of Utaha's Attack. (Duration: **20 seconds**)	\N
687	wakamo	ex	Crimson Flower Divination	Deal **203~325%** damage to one enemy. After that, the damage done by the allies to that enemy is added up for **10 seconds**, and the resulting damage is done again as Mystic type.(This damage can not be critical, maximum amount of damage that can be accumulated is **1017~1322%** of Wakamo's Attack)	4
695	yoshimi	ex	W-Who's panicking!?	Attack all enemies within a circular area for **220~353%** of Attack, inflict Stun status for **2.2~2.9 seconds**.	4
703	yuuka	ex	Q.E.D	Generates a shield around Yuuka with HP equal to **190~248%** of her Healing. (Duration: **15~25 seconds**)	3
711	yuzu	ex	Game Start!	Deal **312~594%** damage to enemies within a circular area centered on the specified opponent.	4
664	tsurugi	enhanced	Agility	Increase movement speed by **14~26.6%**.	\N
672	ui	enhanced	Expert knowledge	Increase Critical Rate by **14~26.6%**.	\N
680	utaha	enhanced	Technological Revolution	Increase Attack by **14~26.6%**.	\N
688	wakamo	basic	Cherry Blossom Storm	Every **25 seconds**, deal **194~369%** damage to one enemy.	\N
696	yoshimi	basic	Do you want to get hurt?!	Every **25 seconds**, attack all enemies within a circular area for **191~364%** of Attack.	\N
704	yuuka	basic	I.F.F	Every **15 seconds**, deal **301~573%** damage to one enemy.	\N
712	yuzu	basic	Continuous combo!	Every **25 seconds**, deal **140~266%** damage to enemies a circular area centered on the highest attack power opponent.	\N
665	tsurugi	sub	Uncontrollable power	**30~57%** chance to add **1** ammo when defeating an enemy.	\N
673	ui	sub	Jittery	When using the EX skill, increase Attack Speed by **24.2~45.9%** for **20 seconds**.	\N
681	utaha	sub	Meister's Oath	Increase HP of all allies by **9.1~17.3%**.	\N
689	wakamo	enhanced	Destructive urges in full bloom	Increase Attack by **14~26.6%**.	\N
697	yoshimi	enhanced	D-Don't make fun of me!	Increase Critical Rate by **14~26.6%**.	\N
705	yuuka	enhanced	Derivation of Optimal solution	Increase Defense by **14~26.6%**.	\N
713	yuzu	enhanced	Debugging...	Increase Critical Damage by **14~26.6%**.	\N
666	tsurugi_swimsuit	ex	Unstoppable torrent	Normal attack deals additional **67~167%** damage. (Duration: **20~30 seconds**)	3
674	ui_swimsuit	ex	Private cafe	Move 4 other allies within a circular area to Ui's position, then add **36.9~70.1%** to their Penetration Efficiency for **45 seconds**.	4
682	utaha_cheer_squad	ex	Rai-chan MK-III, enhance	Enhances the turret for **90 seconds**. While the turret is in Enhanced state, normal attacks will deal **115~146%** damage. Changes Normal skill activation conditions.	5
667	tsurugi_swimsuit	basic	A burning blow	Every **35 seconds**, deal **190~362%** damage to one enemy.	\N
675	ui_swimsuit	basic	Definitive clue	When **3** Clues are obtained, add **15.2~28.9%** Penetration Efficiency to all Striker allies for **30 seconds**.Consume **3** Clues.	\N
683	utaha_cheer_squad	basic	Passion Cannon	Every **30 seconds**, deal **166~315%** damage to one enemy.	\N
691	wakamo_swimsuit	ex	Jade Flower Divination	Deal **565~1074%** damage to one enemy.Each intermediate attack Stuns target for **0.8~1.1 seconds**, the last attack Stuns target for **3.2~4.1 seconds**.	5
699	yukari	ex	Boldness of youth	Deal **159~302%** damage to enemies within a circular area.Consume as many owned Prayers as possible in groups of 10, for each 10 Prayers consumed deal **117~223%** guaranteed critical damage.	7
707	yuuka_track	ex	R.S.G!	Move to the designated position and apply a shield of **168~320%** Healing to self for **25 seconds**.Set a rally flag for 3 other allies within range. When an ally reaches the flag, apply a shield of **168~320%** Healing to them for **25 seconds**.	3
715	yuzu_maid	ex	Starting infiltration!	Deal **682~1296%** damage to enemies within a circular area, then deal the same damage in surrounding circular areasIf the same enemy is attacked multiple times, followup attack will only deal **136~259%** damage.	5
668	tsurugi_swimsuit	enhanced	Light feelings	Increase Attack Speed by **14~26.6%**.	\N
676	ui_swimsuit	enhanced	Seeker's will	Increase Attack by **14~26.6%**.	\N
684	utaha_cheer_squad	basic	Passion Cannon	While Rai-chan is Enhanced, every **6** attacks deal **284~539%** damage to one enemy.	\N
692	wakamo_swimsuit	basic	Just for you	Every **60 seconds**, increase Attack power while also increasing damage taken. Triggers up to 3 times.Attack increase is **21.7~31.5%/61.8%/99%**.Damage taken increase is **9.6%/19.2%/28.9%**.	\N
700	yukari	basic	Long-awaited reunion	Every **40 seconds**, obtain **10~20** Prayer effects (Prayers can stack up to a maximum of 50).Increase Attack by **5.4~19.7%** for **30 seconds**.	\N
708	yuuka_track	basic	Hydration	Every **30 seconds**, if Yuuka doesn't have a shield, apply a shield of **115~220%** Healing for **23 seconds**.If Yuuka has a shield, increase Healing by **12.3~23.4%** for **90 seconds**. (Stacks up to a maximum of **3** times)	\N
716	yuzu_maid	basic	High Score Attack	Every **30 seconds**, deal **117~223%** damage to enemies within a circular area.	\N
669	tsurugi_swimsuit	sub	Burning body	When Normal skill is activated, increase Attack Speed by **16.8~31.9%** for **30 seconds**.	\N
677	ui_swimsuit	sub	Identifying clues	When other allies use **2** EX skills, increase Attack by **22.6~43.1%** for **30 seconds**. Acquire **1** Clue.	\N
685	utaha_cheer_squad	enhanced	Cheerleader's Passion	Increase Attack by **14~26.6%**.	\N
693	wakamo_swimsuit	enhanced	Overflowing love	Increase Attack by **14~26.6%**.	\N
701	yukari	enhanced	Hyakkaryouran elite	Increase Critical Damage by **14~26.6%**.	\N
709	yuuka_track	enhanced	Mathematical competition strategy	Increase Attack Speed by **14~26.6%**.	\N
717	yuzu_maid	enhanced	Clean Code	Increase Critical Damage by **14~26.6%**.	\N
670	ui	ex	Old book expert	Reduce EX skill cost for one other ally by **50%** (reduction active until EX is activated **2**). The discount is rounded down to the nearest whole number.Increase Attack by **10~16.1%** for **46 seconds**.	5~3
678	utaha	ex	Rai-chan, Summon	Summon a turret. The turret inherits **81.4~154%** of Utaha's Attack. (Duration: **30 seconds**)	4
686	utaha_cheer_squad	sub	Cheerleader's Fighting Spirit	When attacking weakened enemies, deal **5.1~9.7%** of Attack as additional damage.	\N
694	wakamo_swimsuit	sub	Midsummer passion	When attacking enemies with less than **30%** HP, deal additional damage of **51.6~98.1%** Attack to them.	\N
702	yukari	sub	Rise up to the challenge	Obtain a Prayer for each Cost consumed by other allies (Prayers can stack up to a maximum of 50).For every 10 Prayers accumulated, increase Critical Damage by **8.1~15.5%** for **15 seconds**.	\N
710	yuuka_track	sub	Optimal pathing calculation	When Yuuka stops moving, she gains **31.1~59.1%** Mystic damage bonus against the enemies weak to it for **20 seconds**.	\N
718	yuzu_maid	sub	Bonds of the Game Development Club	Increase Attack of all allies by **9.1~17.3%**.	\N
690	wakamo	sub	Fighting instincts in full bloom	When attacking a BOSS, deal **15.6~29.7%** of Attack as additional damage.	\N
698	yoshimi	sub	Listen to what I have to say!	Increase CC Strength of all allies by **9.1~17.3%**.	\N
706	yuuka	sub	High speed Mental arithmetic	When Yuuka takes cover, she recovers her HP by **75~142%** of her Healing power. (Cooldown: **10 seconds**)	\N
714	yuzu	sub	Pluck up the courage	When EX or Normal skill are activated, increase Critical Damage by **22.3~42.4%** for **6 seconds**.	\N
719	tsubaki_guide	ex	Inner discipline president's guidance	Increase Attack of all allies within a circular area by **37.2~70.7%** for **45 seconds**.(Effect applies only while within range)	6
720	tsubaki_guide	basic	Power nap instructions	Every **45 seconds**, heal an ally with the lowest HP for **54.9~104%** of Healing.Additionally, increase Critical Resistance by **29.5~56.1%** for **30 seconds**.	\N
721	tsubaki_guide	enhanced	Guide's pride	Increase Healing by **14~26.6%**.	\N
722	tsubaki_guide	sub	Customer service	Increase Attack of all allies by **9.1~17.3%**.	\N
723	umika	ex	The festival has begun!	Summon a fireworks launcher for **50 seconds**. (up to **5** can be deployed at the same time)The fireworks launcher additionally inherits **22.3~42.5%** of Umika's HP.	3
724	umika	basic	Launch... fireworks!	When Umika orders the fireworks launcher to fire, it activates the "Launch... fireworks!" ability and deals **2138~2887%** damage to one enemy.Afterwards, clear firing order.(Damage is calculated based on the fireworks launcher stats)	\N
725	umika	basic	Ta~ ma~ ya~!	Every **10** Normal attacks, increase Attack by **11.9~22.6%** for **30 seconds**.Additionally, increase Attack of all allied fireworks launchers by **10** for **11.9~22.6%**. Order a launch.	\N
726	umika	enhanced	Exciting show	Increase HP by **14~26.6%**.	\N
727	umika	sub	Thrill of the festival	Every **55** Normal attacks, increase Attack by **32.2~61.3%** for **40 seconds**.Additionally, decrease own EX skill cost by **3**. (Reduction active until EX is activated **1** time)	\N
728	airi_band	ex	Happy melody	Increase own Explosive Efficiency by **95.8~182%** and acquire a "Sugar Rush" for **30 seconds**.	2
729	airi_band	basic	Chocomint musical stairs	Every **12** Normal attacks, deal **710~1349%** damage to one enemy.	\N
730	airi_band	enhanced	Bigger and further	Increase Firing Range by **100** and Attack Speed by **11.2~21.2%**.	\N
731	airi_band	sub	Pervasive feelings	When possessing "Sugar Rush", attacks have a 10% chance to reduce Critical Damage Resistance by **12.8~24.4%** for **16 seconds**. (Cooldown: **5** seconds)	\N
732	kazusa_band	ex	Spitting bars	Increase the Attack Speed of allies within a circular area around self by **18.9~35.9%**, and acquire **1~2** "Sugar Rush" for **40 seconds**. (stacks up to a maximum of 2)	3
733	kazusa_band	basic	Bass tuning	Every **35 seconds**, increase Attack by **19.6~37.2%** for **26 seconds**.	\N
734	kazusa_band	enhanced	Familiar stage	Increase Attack Speed by **14~26.6%**.	\N
735	kazusa_band	sub	Sweet vocals	For each "Sugar Rush" owned, when attacking, deal **5.6~10.6%** of Attack as additional damage. (stacks up to a maximum of 2)	\N
736	yoshimi_band	ex	Explosive climax	Increase Attack and Attack Speed by **59.1~112%** for **50 seconds**.Additionally, acquire **5** stacks of "Sugar Rush" (up to a maximum of 5)"Sugar Rush" decreases by **1** every **10 seconds**.	1
737	yoshimi_band	basic	Visual maker	Every **10** Normal attacks, deal **508~966%** damage to one enemy.Damage is increased by **5%** for every **1** "Sugar Rush" active on all allies (stacks up to a maximum of **8**)	\N
738	yoshimi_band	enhanced	Rock'n'roll	Increase Attack by **14~26.6%**.	\N
739	yoshimi_band	sub	Sweet harmonics	Every **3** Normal skill activations, deal **63~119%** additional damage.	\N
740	kirara	ex	Gehenna's celebrity!	Change normal attacks to shots that deal **15.2~28.9%** additional damage, increase Attack by **39.6~51.4%** for **40 seconds**.Reload immediately after skill activation.	4
741	kirara	basic	Always sparkling!	Every **30 seconds**, deal **391~744%** damage to one enemy.	\N
742	kirara	enhanced	Sweetness of crepe	Increase Critical Damage by **14~26.6%**.	\N
743	kirara	sub	Feeling☆excited?	If normal attack are in a modified state, increase Accuracy by **16.1~30.6%** and ignore the normal attack delay **2~4** times.	\N
744	midori_maid	ex	Virtual・Maid・Shot!	Deal **914~1738%** damage to one enemy.	5
745	midori_maid	basic	Perfect cleaning	Every **30 seconds**, increase Attack by **24.8~49.3%** for **23 seconds**.	\N
746	midori_maid	enhanced	Guess I'll go green	Increase Attack by **14~26.6%**.	\N
747	midori_maid	sub	Score challenge	When activating EX skill, increase the Critical Rate by **30.2~57.4%** for **10 seconds**.	\N
748	momoi_maid	ex	Virtual・Maid・Weapon!	Reload immediately after skill activation.Change normal attacks to shots that deal **29.5~56%** additional damage, increase Attack Speed by **53.2~85.1%**, normal attacks ignore delay **100** times. (Effective until Momoi reloads **1** time)	4
749	momoi_maid	basic	All's well that ends well!	Every **50 seconds**, deal **414~788%** damage to one enemy.	\N
750	momoi_maid	enhanced	I'll go with red!	Increase Critical Damage by **14~26.6%**.	\N
751	momoi_maid	sub	Beware of misfires!	When using EX skill, no ammo is consumed by normal attacks over **2.5~5.5 seconds**.	\N
752	serika_swimsuit	ex	Wave of anger	Deal **636~1210%** damage to enemies in a circular area.	6
753	serika_swimsuit	basic	Splash, splash!	Every **35 seconds**, deal **101~187%** damage to enemies a circular area.	\N
754	serika_swimsuit	enhanced	Highly motivated	Increase Attack by **14~26.6%**.	\N
755	serika_swimsuit	sub	Ah, it's cold!	Increase Critical Damage of all allies by **9.1~17.3%**.	\N
756	fubuki_swimsuit	ex	Cool your head off	Deal damage to enemies within 3 circular areas:Small circle: Deal **580~1102%** damageMedium circle: Deal **122~231%** damageLarge circle: Deal **99.7~189%** damage(These attacks penetrate enemy shields)	4
757	fubuki_swimsuit	basic	Do I really have to do it~?	Every **45 seconds**, deal **476~906%** damage to one enemy.Deal **48.6~92.4%** damage to enemies within a circular area.	\N
758	fubuki_swimsuit	enhanced	Slacking rules	Increase Attack by **14~26.6%**.	\N
759	fubuki_swimsuit	sub	I have a favor to ask~	Increases Explosive Efficiency of allies by **15.9~30.2%**.	\N
760	kanna_swimsuit	ex	Water safety ensured!	Deal **488~927%** damage to one enemy and lower their Defense by **25.1~47.8%** for **20 seconds**.	2
766	kirino_swimsuit	enhanced	Real-life training	Increase HP by **14~26.6%**.	\N
761	kanna_swimsuit	basic	Warm-up exercise	Every **40 seconds**, reduce damage taken by **10.3~19.6%** for **30 seconds**.	\N
762	kanna_swimsuit	enhanced	Lifeguard training	Increase HP by **14~26.6%**.	\N
763	kanna_swimsuit	sub	Awkward smile	Increase Attack of self and allied Special students by **16.1~30.6%**.	\N
764	kirino_swimsuit	ex	The Director will be watching!	Deploy a cover;Increase the Attack of allies within a circular range by **14~26.7%** for **45 seconds**. (Effect applies only while within range)The cover additionally inherits **29.6~56.4%** Kirino's HP.	5
765	kirino_swimsuit	basic	Emergency!	Every **50 seconds**, increase Attack of 6 allies (excluding Special students) by **6.5~12.3%** for **40 seconds**.	\N
767	kirino_swimsuit	sub	I'm rooting for you!	Increases Attack of allies by **9.1~17.3%**.	\N
768	moe_swimsuit	ex	Ballistic missile attack	Deal **995~1892%** damage to enemies within a circular area, and **199~378%** to other enemies.	6
769	moe_swimsuit	basic	Hydro-strike	Every **35 seconds**, deal **312~593%** damage to one enemy.	\N
770	moe_swimsuit	enhanced	Aesthetics of ruination	Increase Attack by **14~26.6%**.	\N
771	moe_swimsuit	sub	Demolition specialist	When attacking large and extra-large enemies, deal **9.3~17.7%** of Attack as additional damage.	\N
772	hoshino_battle_tank	ex	Hardened defensive posture	Move to the specified location, then raise a shield that acts as a cover, granting the cover state and increasing Attack by 82.5~156% for 40 seconds.\\nThe cover has 39.5~69.1% of Hoshino's HP.\\n(The armor type of the cover is the same as Hoshino (Battle))	4
773	hoshino_battle_tank	basic	Plate swap	Every 40 seconds, equip self with ballistic plate to reduce damage taken by 12.7~24.1%.\\n(Ballistic plate effect will be removed after taking 25 hits)	\N
774	hoshino_battle_tank	enhanced	Close-quarters battle system	Increase Attack by 11.2~16.2% and HP by 11.2~16.2%.	\N
775	hoshino_battle_tank	sub	Meta-tactics	When attacking an enemy, there is a 20% chance of reducing target Defense by 10.1~19.3% for 20 seconds. (Cooldown: 5 seconds)	\N
776	hoshino_battle_dealer	ex	Concentrated breakthrough	Deal 78.5~149% damage to one enemy.\\nDeal 264~503% damage to enemies within a circular area.	\N
777	hoshino_battle_dealer	basic	Rapid-fire pistol	When the remaining fast loading ammo reaches 0, deal 211~400% damage to one enemy.	\N
778	hoshino_battle_dealer	enhanced	Expanded tactical awareness	Increase Firing Range by 300 and Critical Damage by 11.2~21.2%.	\N
779	hoshino_battle_dealer	sub	Suppression attack	All attacks ignore 60~85% of the enemy Defense.\\nIncrease own Attack by 7.4~14%.\\nWhen using an EX skill or Normal skill, reload instantly, the first normal attack deals 79~150% damage to enemies within a cone-shaped area.	\N
780	atsuko_swimsuit	ex	Summer memories	Recover HP of one ally by **153~290%** of Healing.	2
781	atsuko_swimsuit	basic	This flower for you	Every **30 seconds**, increase healing received for the ally with the lowest HP by **18.9~36%** for **20 seconds**.	\N
782	atsuko_swimsuit	enhanced	Fresh sea breeze	Increase Healing by **14~26.6%**.	\N
783	atsuko_swimsuit	sub	Beach Princess	Increase Attack Speed of all allies by **9.1~17.3%**.	\N
784	hiyori_swimsuit	ex	Aiming for first prize!	Fire 5 bullets. The projectiles fly in a straight line, dealing **587~1115%** (total for 5 bullets) damage to the enemies they hit.When all 5 bullets hit the same enemy, deal **176~308%** additional damage.If EX Charge Gauge is 1 or more, immediately draw EX skill card and then subtract 1 EX Charge Gauge.	4
785	hiyori_swimsuit	basic	Special handy fan	Every **12** normal attacks, increase Critical Damage by **29.1~55.3%** for **30 seconds**.	\N
786	hiyori_swimsuit	enhanced	Enjoy the summer!	Increase Critical Damage by **14~26.6%**.	\N
787	hiyori_swimsuit	sub	Vacation planning	Every **4.5 seconds**, charge the EX Charge Gauge by **10%**.Every time the EX Charge Gauge is charged to **100%**, increase Critical Rate by **7.5~14.3%** for **30 seconds**.(The EX Charge Gauge can only hold up 1 full charge)	\N
788	saori_swimsuit	ex	Music, start!	Deal **833~1083%** damage to targeted enemies within a sector-shaped area.Inflict **360~577%** continuous chill damage over **40 seconds**, and deal **123~159%** damage to other enemies.	7
789	saori_swimsuit	basic	A brief respite	Every **30 seconds**, increase Attack by **19.7~37.5%** for **20 seconds**.	\N
790	saori_swimsuit	enhanced	Perfect mission execution	Increase Attack by **14~26.6%**.	\N
791	saori_swimsuit	sub	Honest student part-time job	Normal attacks have a **30%** chance of inflicting **10.08~19.16%** continuous chill damage over **20 seconds**. (Cooldown: **5 seconds**)	\N
792	shiroko_terror	ex	Enhanced firepower	Summon a drone for **40 seconds**. While the drone is active, normal attacks will deal **120%** damage.Increase Critical Rate by **42~67.3%** and Critical Damage by **71~134%** for **40 seconds**.Deal **20%** of max HP damage to self. (This effect can't make Shiroko＊Terror retreat from battle)	3
793	shiroko_terror	basic	Grenade Toss・Revised	Every **40 seconds**, deal **370~704%** damage to one enemy.When EX skill is active, this skill changes to "Summon Drone: Crossfire."	\N
794	shiroko_terror	basic	Summon Drone: Crossfire	When using EX skill, deal **474~902%** damage to one enemy.When the EX skill drone disappears, this skill reverts to "Grenade Toss・Revised"	\N
795	shiroko_terror	enhanced	Precise Aiming	Increase Attack by **14~26.6%**.	\N
796	shiroko_terror	sub	Time to catch your breath	Increase Mystic Efficiency by **25.92~49.25%**.When Shiroko＊Terror's current HP is below **1%**, prevent retreating for **15 seconds**. (Cooldown: **90 seconds**)If HP is not fully recovered during the retreat grace period, immediately retreat afterwards.	\N
797	marina_qipao	ex	W-whaaaaat?!	Deal **318~414%** damage to one enemy and inflict **351~561%** continuous Poison damage over **32 seconds**.	6
798	marina_qipao	basic	Tactical insulation measures!	Every **35 seconds**, deal **238~452%** damage to one enemy.If the targeted enemy is poisoned, increase own Attack Speed by **15.1~28.8%** for **25 seconds**.	\N
799	marina_qipao	enhanced	Till the last breath!	Increase Firing Range by **200** and Attack by **11.2~21.2%**.	\N
800	marina_qipao	sub	Deep operation!	Normal attacks deal **5.3~10.1%** additional damage to targets with Poison effect.	\N
801	tomoe_qipao	ex	Korobushka	Move up to 5 allies and enemies within a circular range to the specified location, then apply an effect depending on the target.Allies: Apply a shield of **87.2~165%** Healing for **25 seconds** and grant 1 Flyer for **35 seconds** (stacks up to a maximum of 1)Enemies: Decrease Defense by **13~24.7%** for **25 seconds**.	3
802	tomoe_qipao	basic	Katyusha	Every **30 seconds**, buff the ally with the highest Attack depending on the number of Flyers held by the entire team (Duration: **20 seconds**)0 Flyers: Increase Attack by **15.1~28.8%**1 Flyer: Increase Attack by **17.4~33.1%**2 Flyers: Increase Attack by **19.7~37.5%**3 Flyers: Increase Attack by **22~41.8%**4 Flyers or more: Increase Attack by **24.3~46.1%**	\N
803	tomoe_qipao	enhanced	Kalinka	Increase Healing by **14~26.6%**.	\N
804	tomoe_qipao	sub	Troika	Increase Attack of Mystic type allies by **12.7~24.2%**.	\N
847	asuna_school_uniform	basic	Say cheese!	Every 40 seconds, Heal all other allies within a circular area for 51.7~98.2% of Healing.	\N
848	asuna_school_uniform	enhanced	Good luck!	Increase Healing by 14~26.6%.	\N
805	reijo	ex	Technique: Grenade kick	Deal 89.8~116% damage to one enemy. Apply a debuff strengthening the effect of existing continuous damage statuses (Chill, Poison) for 15 seconds. When a continuous damage status (Chill, Poison) is applied to ​​an enemy with the debuff, strengthen the effect: Chill: Reduce the delay between chill damage ticks by 19.9~31.8%. Poison: Deal 33.1~53% additional damage every 2 seconds on top of the poisoning effect damage, up to a maximum of 4~6.	3
806	reijo	basic	Stance: Rising dragon form	Every 30 seconds, increase Attack by 23.7~45% for 20 seconds.	\N
807	reijo	enhanced	Qigong: Protein shake	Increase Attack by 14~26.6%.	\N
808	reijo	sub	Mind: Weight training	When using EX skill, increase Cost Recovery by 980~1861 for 5 seconds.	\N
809	kisaki	ex	Imperial Edict: Gather Knowledge	For one ally, increase the EX Skill damage by 42.4~80.7% for 15 seconds.	3
810	kisaki	basic	Imperial Edict: Ethics and Discipline	Every 35 seconds, grant a shield of 69~131% Healing to the ally with the lowest HP for 17 seconds.	\N
811	kisaki	enhanced	Order: Moderation	Increase Healing by 14~26.6%.	\N
812	kisaki	sub	Imperial Proclamation	Increase Cost Recovery of allies by 10.6~20.2%.	\N
813	mari_idol	ex	Overflowing heart	Heal one other ally for 139~265% of Healing, and heal self for 93.3~121%. Convert 100% of excess healing beyond Max HP into additional overheal HP. (The maximum overheal HP is 50% of the target's maximum HP) (Overheal HP is reduced by 5% of the total amount of healing provided, including overheal, every 1 second.) Gain 1 "Fan Service".	2
814	mari_idol	basic	Blow a kiss	Every 30 seconds, heal one other ally with the lowest HP for 72~136% of Healing.	\N
815	mari_idol	enhanced	Tireless effort	Increase Healing by 14~26.6%.	\N
816	mari_idol	sub	Enjoy the moment	Increase HP by 13.4~25.5%. When 3 "Fan Services" are acquired, reduce the EX skill cost of all allies other than Mari by 1, and reset the "Fan Service" count. (Reduction active until EX is activated 1 time)	\N
817	sakurako_idol	ex	Gap Moe	Increase Critical Rate of self and allied Special students by 16.7~24.2%, and increase Critical Damage by 31~45% for 17 seconds.	3
818	sakurako_idol	basic	You are the best	Every 35 seconds, increase Attack by 20.8~30.1% and Attack Speed by 20.8~30.1% for 25 seconds.	\N
819	sakurako_idol	enhanced	I'm always watching over you	Increase Attack by 14~26.6%.	\N
820	sakurako_idol	sub	Cheering everyone	Increase Critical Damage for self and allied Special students by 16.1~30.6%.	\N
821	mine_idol	ex	Super Idol Landing	Move to the specified location, increase Attack Speed by 13~24.7% for 30 seconds. Gain 5 "Penlights" ("Penlights" can be stacked up to a maximum of 30) Summon a stage prop and move three other allies to the prop's location, and increase Attack Speed of targets that arrive at the prop by 13~24.7% for 30 seconds.	3
822	mine_idol	basic	I choose you	Every 30 seconds, consume a multiple of 10 owned "Penlights", dealing damage to one enemy and reducing their Attack for 20 seconds No "Penlights" consumed: Deal 208~333% damage, reduce target Attack by 16.7~21.7% 10 "Penlights" consumed: Deal 327~523% damage, reduce target Attack by 18.3~23.9% 20 "Penlights" consumed: Deal 446~714% damage, reduce target Attack by 20~26% 30 "Penlights" consumed: Deal 565~904% damage, reduce target Attack by 21.7~28.2%	\N
823	mine_idol	enhanced	Long Live	Increase HP by 14~26.6%.	\N
824	mine_idol	sub	Fans cheering	Whenever other allies consume Cost, gain "Penlights" amount equal to the Cost used. ("Penlights" can be stacked up to a maximum of 30.) When 10 "Penlights" are acquired, increase Defense by 12.1~22.9% for 20 seconds. (effect does not stack)	\N
825	satsuki	ex	I feel stronger~	Increase Defense Penetration by 366~696 for 7 seconds. Deal 870~1653% damage to one enemy. Additionally consume up to 3 Cost, increasing damage per cost point by 35%. (The effects of cost increase/decrease skills are applied only to the base skill cost)	3
826	satsuki	basic	Information gathering	Every 35 seconds, reduce one enemy's Critical Damage Resistance by 14.3~27.2% for 25 seconds.	\N
827	satsuki	enhanced	NK Ultra Project	Increase Critical Damage by 14~26.6%.	\N
828	satsuki	sub	Pandemonium allegiance	Increase Attack of all allies by 9.1~17.3%.	\N
829	chiaki	ex	Is that really true?	Deal 1459~2772% damage to one enemy (this attack can not be a critical hit).	6
830	chiaki	basic	Say cheese!	Every 30 seconds, increase Sonic Efficiency by 32.9~63.1% for 20~25 seconds.	\N
831	chiaki	enhanced	Breaking news!	Increase Attack by 14~26.6%.	\N
832	chiaki	sub	Yes! Got it!	When EX skill is activated, increase EX skill damage by 24.7~46.9% for 7 seconds.	\N
833	yuuka_pajama	ex	Peroro-sama in danger!	Deal 467~887% damage to one enemy; Reduce target Defense by 16.1~23.3% for 25 seconds; If the enemy has Light armor, reduce their Defense by 32.2~46.7% for 25 seconds.	2
834	yuuka_pajama	basic	Night Care	Every 30 seconds, heal self for 72~115% of Healing.	\N
835	yuuka_pajama	enhanced	Sweet Dreams	Increase HP by 14~26.6%.	\N
836	yuuka_pajama	sub	Woke up tired	When receiveing healing, increase Defense by 3.6~6.7% for 30 seconds. (stacks up to a maximum of 7 effects)	\N
837	noa_pajama	ex	Please be quiet after lights out	Deal 759~1442% damage to one enemy. Additionally grant Weak Point Exposed status for 20 seconds. When attacked, an enemy with this debuff takes additional damage equal to 17.6~33.4% of Noa's Attack. (This damage can not be critical, effect ends after 240 hits)	5
838	noa_pajama	ex	Shhh, lights out	Deal 886~1683% damage to one enemy. Additionally grant Weak Point Exposed status for 20 seconds. When attacked, an enemy with this debuff takes additional damage equal to 20.5~39% of Noa's Attack. (This damage can not be critical, effect ends after 240 hits)	3
839	noa_pajama	basic	Favorite pillow	After "Please be quiet after lights out" is used 2 times, increase Cost Recovery by 423~803 for 30 seconds. Change "Please be quiet after lights out" to "Shh, lights out" for one use of the EX skill.	\N
840	noa_pajama	enhanced	Cool-headed secretary	Increase Attack by 14~26.6%.	\N
841	noa_pajama	sub	Secretary's intuition	Every 10 normal attacks, increase Penetration Efficiency by 46.8~88.9% for 10 seconds.	\N
846	asuna_school_uniform	ex	Over here, over here!	Increase Attack of self and Special students by 33.4~63.5% for 19 seconds.	3
849	asuna_school_uniform	sub	This way!	Increases Attack of self and Special students by 16.1~30.6%.	\N
850	karin_school_uniform	ex	Crisis response	Deal 521~991% damage to one enemy. (damage is multiplied x1～3 depending on target's current HP; the lower the target's HP, the greater the damage) When using an EX skill, if the target's HP is 20% or less, increase own Critical Damage rate by 21.1~40.2%, increase Attack by 11.1~21.1%, and increase Defense Penetration by 396~751 for 30 seconds.	7
851	karin_school_uniform	basic	Rear support	Every 40 seconds, deal 118~224% damage to one enemy. (damage is multiplied x1～3 depending on target's current HP; the lower the target's HP, the greater the damage)	\N
852	karin_school_uniform	enhanced	Watchful eye	Increase Critical Rate by 14~26.6%.	\N
853	karin_school_uniform	sub	Popular guide	Increase Attack of all allies by 9.1~17.3%.	\N
854	seia	ex	Garden of Slumber	Reduce EX skill cost of one other ally by up to 50% (reduction active until EX is activated 1~2 times) The discount amount is rounded down to the nearest whole number. Increase own Cost Recovery by 378~718 for 15 seconds.	3
855	seia	basic	Wise Advice	Every 35 seconds, increase Piercing Efficiency of self and one other ally by 26.2~49.8% for 25 seconds.	\N
856	seia	enhanced	Peace of mind	Increase Healing by 14~26.6%.	\N
857	seia	sub	Wise Foresight	When EX skill is used 3 times, grant a shield of 102~195% Healing to self and the target of 3rd EX for 25 seconds.	\N
859	rio	ex	Big Sister	Immediately draw an EX skill card, then duplicate an ally's EX skill card (the duplicated card can be used 1 time). Increase the target's Attack by 35.4~51.4% for 20 seconds. (Duplicated card matches the card state of target's EX skill) (Cost of the duplicated card is the base cost of target's EX skill minus 1, minimum 0) 	2
860	rio	basic	The only way	Every 30 seconds, reduce Defense of one enemy by 19.6~25.5% for 19 seconds. Deal 185~297% damage.	\N
861	rio	enhanced	Starchaser	Increase Attack by 14~26.6%.	\N
862	rio	sub	Avant-Guard	Increase Attack of all allies by 9.1~17.3%.	\N
863	neru_school_uniform	ex	Bring it on	Put yourself and one enemy into a Duel state for 70 seconds. When attacking an enemy in a Duel state, increase damage multiplier by 0.2. Immediately draw one EX skill. While in Duel state, EX skill changes to "I don't care if someone gets hurt".	1
864	neru_school_uniform	ex	I don't care if someone gets hurt	Gain 1 "Spirit". (Spirit can be stacked up to a maximum of 5) Deal 773~1469% damage to one enemy. (When the skill reverts to "Bring it on", reset "Spirit" count)	4
865	neru_school_uniform	basic	Let's play a bit	Every 35 seconds, increase Piercing Efficiency by 31~58.8% for 25 seconds.	\N
866	neru_school_uniform	enhanced	Is it over already?	Increase normal attack Firing Range by 100 and Attack by 11.2~21.2%.	\N
867	neru_school_uniform	sub	I won't miss	Increase outgoing damage by 12.7~24.2%. Each time you gain "Spirit", increase damage multiplier of the skill "I don't care if someone gets hurt" by 0.35.	\N
868	maki_camping	ex	Just a little more...!	Deal 864~1642% damage to one enemy. (This attack penetrates enemy shields)	4
869	maki_camping	basic	The glimmer of art	Every 45 seconds, increase Explosive Efficiency by 28~53.2% for 25 seconds.	\N
870	maki_camping	enhanced	Lively holidays	Increase Attack by 14~26.6%.	\N
871	maki_camping	sub	Sunrise glow	Increase Critical Damage of all allies by 9.1~17.3%.	\N
872	juri_part_timer	ex	The final touch!	Deal 370~703% damage to one enemy. Deal 62.2~118% continuous Chill damage for 16 seconds. Inflict Fear for 2~3.1 seconds.	3
873	juri_part_timer	basic	Earnest part-timer	Every 45 seconds, increase Recovery Rate of self and one other ally with the lowest HP by 17.8~33.8% for 32 seconds.	\N
874	juri_part_timer	enhanced	Indomitable spirit	Increase HP by 14~26.6%.	\N
875	juri_part_timer	sub	Juri's tips!	Recover 97.5~185% of Healing as HP when inflicted with Crowd Control.	\N
876	sena_casual	ex	Providing first aid	Continuously heal allies within a circular area for 27.9~53% of Healing over 32 seconds.	5
877	sena_casual	basic	Duty of the Emergency Medicine Department's head	Every 40 seconds, increases Healing by 18.6~35.3% and Attack Speed by 18.6~35.3% for 30 seconds.	\N
878	sena_casual	enhanced	Off-duty assistance	Increase Attack by 14~26.6%.	\N
879	sena_casual	sub	Full of curiosity	Normal attack damage radius is increased by 1.5~2x, but attacks deal 61.6~83.8% damage.	\N
880	izumi_new_year	ex	Takoyaki for everyone!	Heal allies within a circular area for 111~144% of Healing.	5
881	izumi_new_year	enhanced	There's plenty!	Increase Attack of allies within a circular area around Izumi (New Year) by 21.6~34.6% for 30 seconds. (Effect applies only while within range) 	\N
882	izumi_new_year	basic	It's kagami mochi!	Every 30 seconds, throw a Kagami mochi to one ally, and increase their Critical Rate by 19.8~37.7% for 20 seconds. If there is another ally in the vicinity of the target who has not yet received it, the Kagami mochi will bounce in that direction and apply the effect again (up to a maximum of 6 times).	\N
883	izumi_new_year	enhanced	Life is an adventure!	Increase Healing by 14~26.6%.	\N
884	izumi_new_year	sub	Let's go together!	Increase healing received by all allies by 9.1~17.3%.	\N
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: arona
--

COPY public.students (id, name, full_name, school, age, birthday, height, hobbies, wiki_image, attack_type, defense_type, combat_class, combat_role, combat_position, uses_cover, weapon_type, rarity, is_welfare, is_limited, release_date, recorobi_level, base_variant_id) FROM stdin;
chinatsu	Chinatsu	Hinomiya Chinatsu	gehenna	15	August 22	159cm	Reading philosophy books	https://static.miraheze.org/bluearchivewiki/b/b6/Chinatsu.png	piercing	light	special	healer	back	f	HG	1	f	f	2021-02-03	6	\N
atsuko	Atsuko	Hakari Atsuko	arius	15	January 20	158cm	Tending to flowers	https://static.miraheze.org/bluearchivewiki/c/c7/Atsuko.png	explosive	special	striker	tank	front	t	SMG	3	f	f	2022-06-07	5	\N
hanako_swimsuit	Hanako (Swimsuit)	Urawa Hanako	trinity	16	January 3	161cm	Wandering around	https://static.miraheze.org/bluearchivewiki/c/c5/Hanako_%28Swimsuit%29.png	sonic	heavy	striker	attacker	middle	t	AR	3	f	t	2023-08-01	3	hanako
chise_swimsuit	Chise (Swimsuit)	Waraku Chise	hyakkiyako	16	July 13	159cm	Haiku	https://static.miraheze.org/bluearchivewiki/1/1e/Chise_%28Swimsuit%29.png	mystic	light	striker	support	middle	t	GL	3	f	t	2022-07-24	3	chise
eimi	Eimi	Izumimoto Eimi	millennium	15	May 1	167cm	Zoning out, listening to music	https://static.miraheze.org/bluearchivewiki/e/ed/Eimi.png	explosive	light	striker	tank	front	f	SG	3	f	f	2021-02-03	6	\N
hanae_christmas	Hanae (Christmas)	Asagao Hanae	trinity	15	May 12	150cm	Dance, cheerleading	https://static.miraheze.org/bluearchivewiki/1/1a/Hanae_%28Christmas%29.png	mystic	special	special	healer	back	f	AR	3	f	f	2022-12-13	5	hanae
ayane_swimsuit	Ayane (Swimsuit)	Okusora Ayane	abydos	15	November 12	153cm	Keeping the accounts, collecting antiques	https://static.miraheze.org/bluearchivewiki/f/f6/Ayane_%28Swimsuit%29.png	piercing	light	special	t.s.	back	f	HG	1	t	f	2022-06-21	5	ayane
hanako	Hanako	Urawa Hanako	trinity	16	January 3	161cm	Wandering around	https://static.miraheze.org/bluearchivewiki/9/9c/Hanako.png	piercing	special	special	healer	back	f	AR	2	f	f	2021-05-26	2	\N
airi	Airi	Kurimura Airi	trinity	15	January 30	160cm	Looking for tasty sweets, tea parties	https://static.miraheze.org/bluearchivewiki/9/96/Airi.png	explosive	light	special	support	back	f	SMG	2	f	f	2021-02-03	6	\N
chise	Chise	Waraku Chise	hyakkiyako	16	July 13	159cm	Haiku	https://static.miraheze.org/bluearchivewiki/d/d0/Chise.png	mystic	heavy	striker	attacker	middle	t	GL	2	f	f	2021-02-03	5	\N
hare	Hare	Omagari Hare	millennium	16	April 19	153cm	Video games, watching movies	https://static.miraheze.org/bluearchivewiki/4/47/Hare.png	explosive	light	special	support	back	f	AR	2	f	f	2021-02-03	5	\N
mari_idol	Mari (Idol)	Iochi Mari	trinity	15	September 12	151cm	Prayer, thinking	https://static.miraheze.org/bluearchivewiki/f/f6/Mari_%28Idol%29.png	explosive	heavy	striker	healer	middle	t	HG	3	f	t	2024-10-23	5	mari
marina_qipao	Marina (Qipao)	Ikekura Marina	redwinter	16	November 4	166cm	Walks, charges	https://static.miraheze.org/bluearchivewiki/6/6a/Marina_%28Qipao%29.png	piercing	heavy	striker	attacker	front	t	SMG	3	f	f	2024-08-20	3	marina
fuuka	Fuuka	Aikiyo Fuuka	gehenna	16	April 30	159cm	Home cooking, making bento	https://static.miraheze.org/bluearchivewiki/1/1f/Fuuka.png	explosive	heavy	special	healer	back	f	SMG	2	f	f	2021-02-03	6	\N
sakurako_idol	Sakurako (Idol)	Utazumi Sakurako	trinity	17	October 4	160cm	Prayer	https://static.miraheze.org/bluearchivewiki/2/27/Sakurako_%28Idol%29.png	explosive	heavy	striker	support	middle	t	AR	3	f	t	2024-10-23	5	sakurako
umika	Umika	Satohama Umika	hyakkiyako	15	July 1	165cm	Going to festivals, collecting festival-related goods (pamphlets)	https://static.miraheze.org/bluearchivewiki/e/e2/Umika.png	mystic	special	striker	attacker	middle	t	AR	3	f	f	2024-03-26	6	\N
aru_dress	Aru (Dress)	Rikuhachima Aru	gehenna	16	March 12	160cm	Studying management	https://static.miraheze.org/bluearchivewiki/1/1f/Aru_%28Dress%29.png	piercing	heavy	striker	support	back	t	SR	3	f	f	2024-02-20	3	aru
chinatsu_hot_spring	Chinatsu (Hot Spring)	Hinomiya Chinatsu	gehenna	15	August 22	159cm	Reading philosophy books	https://static.miraheze.org/bluearchivewiki/b/b1/Chinatsu_%28Hot_Spring%29.png	mystic	light	striker	support	middle	t	HG	3	f	f	2021-11-29	6	chinatsu
akari	Akari	Wanibuchi Akari	gehenna	17	December 9	167cm	Eating a lot	https://static.miraheze.org/bluearchivewiki/7/7d/Akari.png	explosive	heavy	striker	attacker	middle	t	AR	2	f	f	2021-02-03	5	\N
ayane	Ayane	Okusora Ayane	abydos	15	November 12	153cm	Keeping the accounts, collecting antiques	https://static.miraheze.org/bluearchivewiki/a/a7/Ayane.png	piercing	light	special	healer	back	f	HG	2	f	f	2021-02-03	5	\N
azusa_swimsuit	Azusa (Swimsuit)	Shirasu Azusa	trinity	16	December 26	149cm	None	https://static.miraheze.org/bluearchivewiki/a/a4/Azusa_%28Swimsuit%29.png	mystic	light	striker	attacker	middle	t	AR	3	f	t	2021-06-29	5	azusa
fuuka_new_year	Fuuka (New Year)	Aikiyo Fuuka	gehenna	16	April 30	159cm	Home cooking, making bento	https://static.miraheze.org/bluearchivewiki/1/13/Fuuka_%28New_Year%29.png	piercing	special	special	support	back	f	SMG	3	f	t	2022-12-27	5	fuuka
ako_dress	Ako (Dress)	Amau Ako	gehenna	17	December 22	165cm	President Hina	https://static.miraheze.org/bluearchivewiki/f/fc/Ako_%28Dress%29.png	explosive	special	striker	support	middle	t	HG	3	f	t	2024-01-23	5	ako
chihiro	Chihiro	Kagami Chihiro	millennium	17	April 26	160cm	Shopping for electronics	https://static.miraheze.org/bluearchivewiki/a/a7/Chihiro.png	piercing	heavy	special	attacker	back	f	AR	3	f	f	2022-01-29	5	\N
tsubaki_guide	Tsubaki (Guide)	Kasuga Tsubaki	hyakkiyako	16	February 3	162cm	Afternoon naps	https://static.miraheze.org/bluearchivewiki/e/ef/Tsubaki_%28Guide%29.png	piercing	heavy	special	support	back	f	SMG	3	f	f	2024-03-26	5	tsubaki
eimi_swimsuit	Eimi (Swimsuit)	Izumimoto Eimi	millennium	15	May 1	167cm	Zoning out, listening to music	https://static.miraheze.org/bluearchivewiki/c/ce/Eimi_%28Swimsuit%29.png	mystic	special	special	support	back	f	SG	3	f	f	2023-12-05	6	eimi
fubuki	Fubuki	Nemugaki Fubuki	valkyrie	15	October 21	148cm	Crosswords, radio	https://static.miraheze.org/bluearchivewiki/c/cd/Fubuki.png	piercing	heavy	striker	attacker	back	t	SR	1	t	f	2022-01-25	5	\N
moe_swimsuit	Moe (Swimsuit)	Kazekura Moe	srt	15	September 13	163cm	Fireworks	https://static.miraheze.org/bluearchivewiki/7/77/Moe_%28Swimsuit%29.png	sonic	special	striker	attacker	middle	t	HG	3	f	f	2024-07-09	6	moe
azusa	Azusa	Shirasu Azusa	trinity	16	December 26	149cm	None	https://static.miraheze.org/bluearchivewiki/8/86/Azusa.png	explosive	heavy	striker	attacker	middle	t	AR	3	f	f	2021-05-26	5	\N
asuna_bunny_girl	Asuna (Bunny Girl)	Ichinose Asuna	millennium	17	March 24	167cm	Attacking	https://static.miraheze.org/bluearchivewiki/a/a4/Asuna_%28Bunny_Girl%29.png	mystic	light	striker	support	middle	t	AR	3	f	f	2021-10-11	2	asuna
midori_maid	Midori (Maid)	Saiba Midori	millennium	15	December 8	143cm	Drawing pictures	https://static.miraheze.org/bluearchivewiki/2/29/Midori_%28Maid%29.png	sonic	light	striker	attacker	back	t	SR	3	f	f	2024-05-21	5	midori
serika_swimsuit	Serika (Swimsuit)	Kuromi Serika	abydos	15	June 25	153cm	Saving money, working part-time	https://static.miraheze.org/bluearchivewiki/0/0f/Serika_%28Swimsuit%29.png	mystic	heavy	special	attacker	back	f	AR	3	f	f	2024-06-04	3	serika
akane_bunny_girl	Akane (Bunny Girl)	Murokasa Akane	millennium	16	April 1	164cm	Cleaning	https://static.miraheze.org/bluearchivewiki/9/99/Akane_%28Bunny_Girl%29.png	mystic	heavy	special	attacker	back	f	HG	3	f	f	2022-10-11	6	akane
mine_idol	Mine (Idol)	Aomori Mine	trinity	17	November 23	168cm	Collecting medical supplies	https://static.miraheze.org/bluearchivewiki/2/29/Mine_%28Idol%29.png	explosive	heavy	striker	tank	front	f	SG	1	t	f	2024-10-23	2	mine
momoi_maid	Momoi (Maid)	Saiba Momoi	millennium	15	December 8	143cm	Video games	https://static.miraheze.org/bluearchivewiki/3/31/Momoi_%28Maid%29.png	sonic	light	striker	attacker	middle	t	AR	3	f	f	2024-05-21	2	momoi
pina	Pina	Asahina Pina	hyakkiyako	17	November 3	165cm	Watching yakuza movies	https://static.miraheze.org/bluearchivewiki/9/96/Pina.png	piercing	light	striker	attacker	back	f	MG	1	f	f	2021-02-03	6	\N
mutsuki_new_year	Mutsuki (New Year)	Asagi Mutsuki	gehenna	16	July 29	144cm	Collecting bombs	https://static.miraheze.org/bluearchivewiki/c/c2/Mutsuki_%28New_Year%29.png	mystic	heavy	striker	attacker	back	f	MG	3	f	t	2021-12-28	5	mutsuki
reijo	Reijo	Kayama Reijo	shanhaijing	17	March 3	169cm	Kung fu training, gourmet food	https://static.miraheze.org/bluearchivewiki/4/4d/Reijo.png	mystic	heavy	striker	support	middle	t	AR	3	f	f	2024-09-25	6	\N
cherino	Cherino	Renkawa Cherino	redwinter	??	October 27	128cm	Purges, snowball fights	https://static.miraheze.org/bluearchivewiki/7/7c/Cherino.png	piercing	light	striker	attacker	middle	t	HG	3	f	f	2021-04-28	6	\N
haruka	Haruka	Igusa Haruka	gehenna	15	May 13	157cm	Growing weeds	https://static.miraheze.org/bluearchivewiki/b/b1/Haruka.png	explosive	light	striker	tank	front	f	SG	1	f	f	2021-02-03	8	\N
arisu_maid	Arisu (Maid)	Tendou Arisu	millennium	??	March 25	152cm	Games (Especially RPGs)	https://static.miraheze.org/bluearchivewiki/b/b4/Arisu_%28Maid%29.png	mystic	light	striker	attacker	back	f	RG	3	f	f	2023-04-25	5	arisu
aru_new_year	Aru (New Year)	Rikuhachima Aru	gehenna	16	March 12	160cm	Studying management	https://static.miraheze.org/bluearchivewiki/6/60/Aru_%28New_Year%29.png	piercing	special	striker	attacker	back	t	SR	3	f	t	2021-12-28	5	aru
hibiki_cheer_squad	Hibiki (Cheer Squad)	Nekozuka Hibiki	millennium	15	April 2	154cm	Shopping, cosplay	https://static.miraheze.org/bluearchivewiki/b/bf/Hibiki_%28Cheerleader%29.png	explosive	light	striker	attacker	back	f	MT	1	t	f	2022-09-27	3	hibiki
hoshino_swimsuit	Hoshino (Swimsuit)	Takanashi Hoshino	abydos	17	January 2	145cm	Afternoon naps, lazing around	https://static.miraheze.org/bluearchivewiki/c/c2/Hoshino_%28Swimsuit%29.png	explosive	special	striker	support	front	f	SG	3	f	t	2022-07-19	2	hoshino
kayoko_dress	Kayoko (Dress)	Onikata Kayoko	gehenna	18	March 17	157cm	Collecting CDs	https://static.miraheze.org/bluearchivewiki/9/9b/Kayoko_%28Dress%29.png	piercing	light	striker	attacker	middle	t	HG	3	f	f	2024-02-20	2	kayoko
saya_casual	Saya (Casual)	Yakushi Saya	shanhaijing	16	January 3	149cm	Research	https://static.miraheze.org/bluearchivewiki/e/e2/Saya_%28Casual%29.png	piercing	special	special	attacker	back	f	HG	3	f	f	2021-09-08	5	saya
shiroko_cycling	Shiroko (Cycling)	Sunaōkami Shiroko	abydos	16	May 16	156cm	Jogging, strength training, cycling	https://static.miraheze.org/bluearchivewiki/a/a0/Shiroko_%28Riding%29.png	mystic	heavy	striker	attacker	middle	t	AR	3	f	f	2021-08-11	3	shiroko
junko	Junko	Akashi Junko	gehenna	15	December 27	149cm	Gourmet tour	https://static.miraheze.org/bluearchivewiki/3/3c/Junko.png	piercing	light	striker	attacker	middle	t	AR	2	f	f	2021-02-03	8	\N
toki_bunny_girl	Toki (Bunny Girl)	Asuma Toki	millennium	16	August 16	165cm	Presently looking for one	https://static.miraheze.org/bluearchivewiki/8/83/Toki_%28Bunny_Girl%29.png	explosive	light	striker	attacker	middle	t	AR	3	f	f	2023-04-25	5	toki
tomoe_qipao	Tomoe (Qipao)	Sashiro Tomoe	redwinter	17	November 10	165cm	Agitation	https://static.miraheze.org/bluearchivewiki/2/2d/Tomoe_%28Qipao%29.png	mystic	special	special	support	back	f	SR	3	f	f	2024-08-20	3	tomoe
kazusa_band	Kazusa (Band)	Kyoyama Kazusa	trinity	15	August 5	155cm	Eating "regular" sweets	https://static.miraheze.org/bluearchivewiki/3/36/Kazusa_%28Band%29.png	explosive	special	striker	attacker	back	f	MG	3	f	t	2024-04-23	3	kazusa
wakamo_swimsuit	Wakamo (Swimsuit)	Kosaka Wakamo	hyakkiyako	18	April 3	161cm	Destruction, pillaging	https://static.miraheze.org/bluearchivewiki/e/e2/Wakamo_%28Swimsuit%29.png	piercing	heavy	striker	attacker	back	t	SR	3	f	f	2022-06-21	5	wakamo
meru	Meru	Himeki Meru	redwinter	16	December 21	137cm	Drawing manga, shipping	https://static.miraheze.org/bluearchivewiki/4/4f/Meru.png	piercing	light	striker	attacker	middle	t	HG	3	f	f	2023-08-22	6	\N
misaki	Misaki	Imashino Misaki	arius	16	January 13	163cm	Being alone	https://static.miraheze.org/bluearchivewiki/a/ae/Misaki.png	explosive	special	striker	attacker	back	t	RL	3	f	f	2022-05-23	5	\N
kotori_cheer_squad	Kotori (Cheer Squad)	Toyomi Kotori	millennium	15	December 31	151cm	Talking	https://static.miraheze.org/bluearchivewiki/8/89/Kotori_%28Cheerleader%29.png	explosive	special	striker	attacker	back	f	MG	3	f	f	2023-09-05	2	kotori
miyako	Miyako	Tsukiyuki Miyako	srt	15	January 7	156cm	Watching animal-related videos	https://static.miraheze.org/bluearchivewiki/3/3e/Miyako.png	piercing	heavy	striker	tank	front	t	SMG	3	f	f	2022-03-22	6	\N
nagisa	Nagisa	Kirifuji Nagisa	trinity	17	July 4	160cm	Collecting tea leaves, making sweets, tending the garden	https://static.miraheze.org/bluearchivewiki/6/6a/Nagisa.png	explosive	heavy	special	attacker	back	f	HG	3	f	t	2023-02-21	5	\N
renge	Renge	Fuwa Renge	hyakkiyako	16	July 23	157cm	Reading light novels, training	https://static.miraheze.org/bluearchivewiki/e/e4/Renge.png	sonic	heavy	striker	attacker	back	t	SR	3	f	f	2023-11-21	6	\N
serika	Serika	Kuromi Serika	abydos	15	June 25	153cm	Saving money, working part-time	https://static.miraheze.org/bluearchivewiki/c/c8/Serika.png	explosive	light	striker	attacker	middle	t	AR	2	f	f	2021-02-03	9	\N
kisaki	Kisaki	Ryuuge Kisaki	shanhaijing	17	February 19	142cm	Tea ceremony, traveling incognito	https://static.miraheze.org/bluearchivewiki/5/55/Kisaki.png	sonic	elastic	special	support	back	f	SMG	3	f	f	2024-09-25	2	\N
asuna	Asuna	Ichinose Asuna	millennium	17	March 24	167cm	Attacking	https://static.miraheze.org/bluearchivewiki/9/9f/Asuna.png	mystic	light	striker	attacker	middle	t	AR	1	f	f	2021-02-03	6	\N
hanae	Hanae	Asagao Hanae	trinity	15	May 12	150cm	Dance, cheerleading	https://static.miraheze.org/bluearchivewiki/7/72/Hanae.png	explosive	heavy	special	healer	back	f	AR	2	f	f	2021-02-03	6	\N
shizuko	Shizuko	Kawawa Shizuko	hyakkiyako	16	July 7	153cm	Serving customers with charm, attracting people into her shop	https://static.miraheze.org/bluearchivewiki/7/77/Shizuko.png	mystic	special	special	support	back	f	SG	2	f	f	2021-02-24	6	\N
tomoe	Tomoe	Sashiro Tomoe	redwinter	17	November 10	165cm	Agitation	https://static.miraheze.org/bluearchivewiki/0/0a/Tomoe.png	piercing	special	striker	support	back	t	SR	1	t	f	2021-11-29	5	\N
haruna	Haruna	Kurodate Haruna	gehenna	17	March 1	163cm	Looking for delicious things	https://static.miraheze.org/bluearchivewiki/a/a6/Haruna.png	mystic	heavy	striker	attacker	back	t	SR	3	f	f	2021-02-03	6	\N
wakamo	Wakamo	Kosaka Wakamo	hyakkiyako	18	April 3	161cm	Destruction, pillaging	https://static.miraheze.org/bluearchivewiki/a/a7/Wakamo.png	mystic	light	striker	attacker	back	t	SR	3	f	t	2022-01-25	2	\N
airi_band	Airi (Band)	Kurimura Airi	trinity	15	January 30	160cm	Looking for tasty sweets, tea parties	https://static.miraheze.org/bluearchivewiki/c/c5/Airi_%28Band%29.png	explosive	special	striker	attacker	front	t	SMG	1	t	f	2024-04-23	3	airi
hoshino_battle_dealer	Hoshino (Battle) / Dealer	Takanashi Hoshino	abydos	17	January 2	145cm	Afternoon naps, lazing around	https://static.miraheze.org/bluearchivewiki/a/a2/Hoshino_%28Battle%29.png	mystic	heavy	striker	attacker	front	f	SG	3	f	t	2024-07-23	3	hoshino
hoshino_battle_tank	Hoshino (Battle) / Tank	Takanashi Hoshino	abydos	17	January 2	145cm	Afternoon naps, lazing around	https://static.miraheze.org/bluearchivewiki/a/a2/Hoshino_%28Battle%29.png	mystic	heavy	striker	tank	front	f	SG	3	f	t	2024-07-23	3	hoshino
yoshimi_band	Yoshimi (Band)	Ibaragi Yoshimi	trinity	15	August 29	146cm	All kinds of events, touring cafés for limited edition sweets	https://static.miraheze.org/bluearchivewiki/c/ca/Yoshimi_%28Band%29.png	explosive	special	striker	attacker	middle	t	AR	3	f	t	2024-04-23	5	yoshimi
hifumi_swimsuit	Hifumi (Swimsuit)	Ajitani Hifumi	trinity	16	November 27	158cm	Collecting Peroro goods, collecting cute things, shopping, giving advice	https://static.miraheze.org/bluearchivewiki/3/32/Hifumi_%28Swimsuit%29.png	piercing	heavy	special	t.s.	back	t	AR	3	f	f	2021-07-14	5	hifumi
akari_new_year	Akari (New Year)	Wanibuchi Akari	gehenna	17	December 9	167cm	Eating a lot	https://static.miraheze.org/bluearchivewiki/a/ae/Akari_%28New_Year%29.png	mystic	special	special	t.s.	back	f	AR	3	f	f	2024-03-05	3	akari
ibuki	Ibuki	Tanga Ibuki	gehenna	11	April 14	128cm	Homework, collecting stuffed animals	https://static.miraheze.org/bluearchivewiki/7/75/Ibuki.png	mystic	heavy	striker	support	middle	t	AR	1	t	f	2024-01-23	6	\N
juri	Juri	Ushimaki Juri	gehenna	15	October 20	170cm	Self-styled culinary research	https://static.miraheze.org/bluearchivewiki/3/37/Juri.png	explosive	light	special	support	back	f	SG	1	f	f	2021-02-03	6	\N
kazusa	Kazusa	Kyoyama Kazusa	trinity	15	August 5	155cm	Eating "regular" sweets	https://static.miraheze.org/bluearchivewiki/b/b3/Kazusa.png	piercing	heavy	striker	attacker	back	f	MG	3	f	f	2022-08-23	5	\N
koyuki	Koyuki	Kurosaki Koyuki	millennium	15	February 14	149cm	Gambling, escapes	https://static.miraheze.org/bluearchivewiki/a/af/Koyuki.png	mystic	heavy	striker	attacker	back	f	MG	3	f	f	2023-03-07	8	\N
megu	Megu	Shimokura Megu	gehenna	17	April 25	164cm	Demolition	https://static.miraheze.org/bluearchivewiki/d/d4/Megu.png	explosive	special	striker	attacker	front	f	FT	3	f	f	2023-01-30	5	\N
shiroko_terror	Shiroko＊Terror	Sunaōkami Shiroko＊Terror	abydos	17	May 16	165cm	Jogging, strength training, cycling	https://static.miraheze.org/bluearchivewiki/f/f9/Shiroko%EF%BC%8ATerror.png	mystic	special	striker	attacker	middle	f	AR	3	f	t	2024-07-21	3	\N
tsubaki	Tsubaki	Kasuga Tsubaki	hyakkiyako	16	February 3	162cm	Afternoon naps	https://static.miraheze.org/bluearchivewiki/6/6a/Tsubaki.png	piercing	special	striker	tank	front	f	SMG	2	f	f	2021-02-03	6	\N
yoshimi	Yoshimi	Ibaragi Yoshimi	trinity	15	August 29	146cm	All kinds of events, touring cafés for limited edition sweets	https://static.miraheze.org/bluearchivewiki/c/c2/Yoshimi.png	piercing	heavy	special	attacker	back	f	AR	1	f	f	2021-02-03	6	\N
karin_school_uniform	Karin (School Uniform)	Kakudate Karin	millennium	16	February 2	170cm	Cleaning	https://static.wikitide.net/bluearchivewiki/d/d1/Karin_%28School_Uniform%29.png	explosive	heavy	special	attacker	back	f	SR	1	t	f	2025-01-20	0	karin
aru	Aru	Rikuhachima Aru	gehenna	16	March 12	160cm	Studying management	https://static.miraheze.org/bluearchivewiki/d/db/Aru.png	explosive	light	striker	attacker	back	t	SR	3	f	f	2021-02-03	6	\N
asuna_school_uniform	Asuna (School Uniform)	Ichinose Asuna	millennium	17	March 24	167cm	Attacking	https://static.wikitide.net/bluearchivewiki/0/01/Asuna_%28School_Uniform%29.png	explosive	heavy	striker	support	middle	t	AR	3	f	t	2025-01-20	0	asuna
yuuka_pajama	Yuuka (Pajama)	Hayase Yuuka	millennium	16	March 14	156cm	Calculating things	https://static.wikitide.net/bluearchivewiki/a/ad/Yuuka_%28Pajama%29.png	explosive	heavy	striker	tank	front	t	SMG	3	f	f	2024-12-24	0	yuuka
himari	Himari	Akeboshi Himari	millennium	17	December 10	162cm	Fortune-telling, occult in general	https://static.miraheze.org/bluearchivewiki/5/5a/Himari.png	piercing	light	special	support	back	f	HG	3	f	f	2022-11-15	6	\N
satsuki	Satsuki	Kyougoku Satsuki	gehenna	17	April 10	172cm	Mind control research, shopping	https://static.wikitide.net/bluearchivewiki/a/a4/Chiaki.png	explosive	heavy	special	attacker	back	f	HG	3	f	f	2024-11-20	5	\N
rio	Rio	Tsukatsuki Rio	millennium	17	June 6	171cm	Design	https://static.wikitide.net/bluearchivewiki/4/4a/Rio.png	mystic	elastic	special	support	back	f	HG	3	f	t	2025-01-27	0	\N
maki_camping	Maki (Camping)	Konuri Maki	millennium	15	August 1	149cm	Graffiti, video games	https://static.wikitide.net/bluearchivewiki/2/21/Maki_%28Camping%29.png	explosive	heavy	special	attacker	back	f	MG	3	f	f	2025-02-12	0	maki
atsuko_swimsuit	Atsuko (Swimsuit)	Hakari Atsuko	arius	15	January 20	158cm	Tending to flowers	https://static.miraheze.org/bluearchivewiki/1/1b/Atsuko_%28Swimsuit%29.png	sonic	special	special	healer	back	f	SMG	1	t	f	2024-07-21	3	atsuko
hare_camping	Hare (Camping)	Omagari Hare	millennium	16	April 19	153cm	Video games, watching movies	https://static.miraheze.org/bluearchivewiki/a/a2/Hare_%28Camping%29.png	explosive	light	striker	support	middle	t	AR	3	f	f	2023-12-26	5	hare
haruka_new_year	Haruka (New Year)	Igusa Haruka	gehenna	15	May 13	157cm	Growing weeds	https://static.miraheze.org/bluearchivewiki/d/d9/Haruka_%28New_Year%29.png	explosive	light	special	support	back	f	SG	3	f	f	2023-03-21	2	haruka
junko_new_year	Junko (New Year)	Akashi Junko	gehenna	15	December 27	149cm	Gourmet tour	https://static.miraheze.org/bluearchivewiki/d/d0/Junko_%28New_Year%29.png	mystic	heavy	striker	attacker	middle	t	AR	1	t	f	2022-12-27	5	junko
kayoko_new_year	Kayoko (New Year)	Onikata Kayoko	gehenna	18	March 17	157cm	Collecting CDs	https://static.miraheze.org/bluearchivewiki/0/0d/Kayoko_%28New_Year%29.png	mystic	special	striker	support	middle	t	HG	3	f	f	2023-03-21	3	kayoko
noa_pajama	Noa (Pajama)	Ushio Noa	millennium	16	April 13	161cm	Reading, reciting	https://static.wikitide.net/bluearchivewiki/1/14/Noa_%28Pajama%29.png	piercing	heavy	striker	attacker	middle	t	HG	3	f	f	2024-12-24	0	noa
shiroko_swimsuit	Shiroko (Swimsuit)	Sunaōkami Shiroko	abydos	16	May 16	156cm	Jogging, strength training, cycling	https://static.miraheze.org/bluearchivewiki/4/4e/Shiroko_%28Swimsuit%29.png	mystic	light	special	attacker	back	f	AR	3	f	f	2023-07-16	2	shiroko
ichika	Ichika	Nakamasa Ichika	trinity	16	November 11	163cm	Helping people, trying her hand at various jobs	https://static.miraheze.org/bluearchivewiki/b/b3/Ichika.png	sonic	heavy	striker	attacker	middle	t	AR	3	f	f	2023-09-26	6	\N
neru_school_uniform	Neru (School Uniform)	Mikamo Neru	millennium	17	August 17	146cm	Winning	https://static.wikitide.net/bluearchivewiki/1/16/Neru_%28School_Uniform%29.png	piercing	elastic	striker	attacker	front	t	SMG	3	f	t	2025-01-27	0	neru
sena	Sena	Himuro Sena	gehenna	17	April 7	155cm	Standing by, preparing medicine	https://static.miraheze.org/bluearchivewiki/f/f4/Sena.png	mystic	light	special	t.s.	back	f	GL	3	f	f	2022-01-29	6	\N
kirara	Kirara	Yozakura Kirara	gehenna	16	February 24	159cm	Chatting	https://static.miraheze.org/bluearchivewiki/3/3f/Kirara.png	sonic	light	striker	attacker	middle	t	AR	3	f	f	2024-05-07	5	\N
kotori	Kotori	Toyomi Kotori	millennium	15	December 31	151cm	Talking	https://static.miraheze.org/bluearchivewiki/a/ab/Kotori.png	piercing	light	striker	support	back	f	MG	1	f	f	2021-02-03	6	\N
michiru	Michiru	Chidori Michiru	hyakkiyako	17	February 22	153cm	Inventing new ninjutsu and making videos	https://static.miraheze.org/bluearchivewiki/e/e6/Michiru.png	mystic	light	striker	attacker	front	f	SG	1	t	f	2022-04-26	6	\N
misaka_mikoto	Misaka Mikoto	Misaka Mikoto	etc	14	May 2	161cm	Browsing magazines at the convenience store, collecting Gekota goods	https://static.miraheze.org/bluearchivewiki/7/76/Misaka_Mikoto.png	piercing	heavy	striker	attacker	middle	t	AR	3	f	t	2023-10-23	5	\N
natsu	Natsu	Yutori Natsu	trinity	15	December 4	152cm	Romanticizing thoughts, contemplation	https://static.miraheze.org/bluearchivewiki/9/90/Natsu.png	mystic	heavy	striker	tank	front	f	SMG	3	f	f	2021-10-26	5	\N
reisa	Reisa	Uzawa Reisa	trinity	15	May 31	153cm	Duel proposals, self-introductions	https://static.miraheze.org/bluearchivewiki/3/34/Reisa.png	piercing	heavy	striker	tank	front	f	SG	3	f	f	2023-05-09	6	\N
seia	Seia	Yurizono Seia	trinity	17	September 29	149cm	Solving puzzles, reading	https://static.wikitide.net/bluearchivewiki/thumb/4/46/Seia.png/266px-Seia.png	piercing	elastic	striker	support	middle	t	HG	3	f	t	2025-01-20	0	\N
sena_casual	Sena (Casual)	Himuro Sena	gehenna	17	April 7	155cm	Standing by, preparing medicine	https://static.wikitide.net/bluearchivewiki/b/b4/Sena_%28Casual%29.png	sonic	heavy	striker	healer	middle	t	GL	3	f	f	2025-02-25	0	sena
izumi_new_year	Izumi (New Year)	Shishidou Izumi	gehenna	16	May 11	161cm	Making and eating strange foods	https://static.wikitide.net/bluearchivewiki/e/e3/Izumi_%28New_Year%29.png	explosive	light	special	support	back	f	MG	3	f	f	2025-03-19	0	izumi
chiaki	Chiaki	Motomiya Chiaki	gehenna	16	September 22	167cm	Weekly magazine publication, making friends	https://static.wikitide.net/bluearchivewiki/e/e9/Satsuki.png	sonic	special	striker	attacker	middle	t	AR	3	f	f	2024-11-20	6	\N
fubuki_swimsuit	Fubuki (Swimsuit)	Nemugaki Fubuki	valkyrie	15	October 21	148cm	Crosswords, radio	https://static.miraheze.org/bluearchivewiki/3/34/Fubuki_%28Swimsuit%29.png	explosive	heavy	special	attacker	back	f	SR	3	f	f	2024-06-25	3	fubuki
haruna_new_year	Haruna (New Year)	Kurodate Haruna	gehenna	17	March 1	163cm	Looking for delicious things	https://static.miraheze.org/bluearchivewiki/b/b3/Haruna_%28New_Year%29.png	explosive	light	striker	attacker	back	t	SR	3	f	t	2022-12-27	5	haruna
hiyori_swimsuit	Hiyori (Swimsuit)	Tsuchinaga Hiyori	arius	16	January 8	155cm	Collecting magazines	https://static.miraheze.org/bluearchivewiki/5/53/Hiyori_%28Swimsuit%29.png	piercing	heavy	striker	attacker	back	t	SR	3	f	t	2024-07-28	3	hiyori
iori_swimsuit	Iori (Swimsuit)	Shiromi Iori	gehenna	16	November 8	157cm	Patrolling, raising her voice	https://static.miraheze.org/bluearchivewiki/5/53/Iori_%28Swimsuit%29.png	explosive	special	striker	attacker	back	t	SR	3	f	t	2021-07-28	5	iori
serika_new_year	Serika (New Year)	Kuromi Serika	abydos	15	June 25	153cm	Saving money, working part-time	https://static.miraheze.org/bluearchivewiki/6/61/Serika_%28New_Year%29.png	piercing	special	special	support	back	f	AR	3	f	f	2022-01-11	5	serika
shizuko_swimsuit	Shizuko (Swimsuit)	Kawawa Shizuko	hyakkiyako	16	July 7	153cm	Serving customers with charm, attracting people into her shop	https://static.miraheze.org/bluearchivewiki/f/f2/Shizuko_%28Swimsuit%29.png	mystic	heavy	special	support	back	f	SG	1	t	f	2022-07-19	5	shizuko
juri_part_timer	Juri (Part-Timer)	Ushimaki Juri	gehenna	15	October 20	170cm	Self-styled culinary research	https://static.wikitide.net/bluearchivewiki/3/33/Juri_%28Part-Timer%29.png	mystic	light	striker	tank	front	f	SG	3	f	f	2025-02-25	0	juri
hina	Hina	Sorasaki Hina	gehenna	17	February 19	142cm	Sleeping, resting	https://static.miraheze.org/bluearchivewiki/8/83/Hina.png	explosive	heavy	striker	attacker	back	f	MG	3	f	f	2021-02-03	8	\N
kaho	Kaho	Kuwakami Kaho	hyakkiyako	17	October 9	173cm	Promoting Hyakkiyako culture, Collecting Hyakkiyako merchandise	https://static.miraheze.org/bluearchivewiki/6/63/Kaho.png	mystic	heavy	striker	attacker	middle	t	AR	3	f	f	2023-04-11	6	\N
kirino	Kirino	Nakatsukasa Kirino	valkyrie	15	October 22	161cm	Eating on the go	https://static.miraheze.org/bluearchivewiki/8/85/Kirino.png	explosive	special	striker	support	middle	t	HG	2	f	f	2021-08-25	6	\N
makoto	Makoto	Hanuma Makoto	gehenna	18	March 19	169cm	Stratagems, tricks, playing with Ibuki	https://static.miraheze.org/bluearchivewiki/2/20/Makoto.png	piercing	special	special	attacker	back	f	SR	3	f	t	2024-01-23	2	\N
midori	Midori	Saiba Midori	millennium	15	December 8	143cm	Drawing pictures	https://static.miraheze.org/bluearchivewiki/e/ee/Midori.png	piercing	light	striker	attacker	back	t	SR	3	f	f	2021-04-07	6	\N
miyu	Miyu	Kasumizawa Miyu	srt	15	July 12	149cm	Negative thoughts, escapism, pebble hunting	https://static.miraheze.org/bluearchivewiki/a/ac/Miyu.png	piercing	light	striker	support	back	t	SR	3	f	f	2022-04-05	5	\N
neru	Neru	Mikamo Neru	millennium	17	August 17	146cm	Winning	https://static.miraheze.org/bluearchivewiki/2/24/Neru.png	piercing	light	striker	attacker	front	t	SMG	3	f	f	2021-02-03	8	\N
saki	Saki	Sorai Saki	srt	15	April 9	161cm	Firearms maintenance, gathering plants, etc.	https://static.miraheze.org/bluearchivewiki/d/d0/Saki.png	piercing	special	special	attacker	back	f	MG	3	f	f	2022-03-22	5	\N
tsukuyo	Tsukuyo	Ōno Tsukuyo	hyakkiyako	15	April 5	180cm	Body replacement technique, hiding	https://static.miraheze.org/bluearchivewiki/c/ce/Tsukuyo.png	mystic	light	striker	tank	front	t	SMG	3	f	f	2022-05-10	6	\N
yukari	Yukari	Kadenokouji Yukari	hyakkiyako	15	June 16	155cm	Praying, visiting candy stores	https://static.miraheze.org/bluearchivewiki/2/2b/Yukari.png	sonic	heavy	striker	attacker	back	f	SR	3	f	f	2023-11-07	6	\N
haruna_track	Haruna (Track)	Kurodate Haruna	gehenna	17	March 1	163cm	Looking for delicious things	https://static.miraheze.org/bluearchivewiki/a/af/Haruna_%28Sportswear%29.png	sonic	heavy	special	healer	back	f	SR	3	f	f	2023-09-14	5	haruna
hina_dress	Hina (Dress)	Sorasaki Hina	gehenna	17	February 19	142cm	Sleeping, resting	https://static.miraheze.org/bluearchivewiki/2/20/Hina_%28Dress%29.png	explosive	elastic	striker	attacker	back	f	MG	3	f	t	2024-01-30	5	hina
kanna_swimsuit	Kanna (Swimsuit)	Ogata Kanna	valkyrie	17	September 7	166cm	Reading, watching movies (detectives)	https://static.miraheze.org/bluearchivewiki/8/83/Kanna_%28Swimsuit%29.png	explosive	light	striker	support	middle	t	HG	3	f	f	2024-06-25	5	kanna
miyako_swimsuit	Miyako (Swimsuit)	Tsukiyuki Miyako	srt	15	January 7	156cm	Watching animal-related videos	https://static.miraheze.org/bluearchivewiki/9/97/Miyako_%28Swimsuit%29.png	explosive	heavy	striker	tank	front	t	SMG	3	f	f	2023-06-20	6	miyako
neru_bunny_girl	Neru (Bunny Girl)	Mikamo Neru	millennium	17	August 17	146cm	Winning	https://static.miraheze.org/bluearchivewiki/7/78/Neru_%28Bunny_Girl%29.png	explosive	heavy	striker	tank	front	t	SMG	3	f	t	2021-09-28	3	neru
saori_swimsuit	Saori (Swimsuit)	Jomae Saori	arius	17	September 3	167cm	None	https://static.miraheze.org/bluearchivewiki/5/54/Saori_%28Swimsuit%29.png	mystic	heavy	striker	attacker	middle	t	AR	3	f	t	2024-07-28	5	saori
iori	Iori	Shiromi Iori	gehenna	16	November 8	157cm	Patrolling, raising her voice	https://static.miraheze.org/bluearchivewiki/2/26/Iori.png	piercing	heavy	striker	attacker	back	t	SR	3	f	f	2021-02-03	6	\N
kaede	Kaede	Isami Kaede	hyakkiyako	15	July 9	142cm	Mischief (she tries to hold back as much as possible), catching beetles	https://static.miraheze.org/bluearchivewiki/f/f0/Kaede.png	explosive	special	special	support	back	f	HG	3	f	f	2022-04-26	6	\N
kikyou	Kikyou	Kiryuu Kikyou	hyakkiyako	16	August 8	160cm	Cat's cradle, reading military books, sunbathing	https://static.miraheze.org/bluearchivewiki/6/62/Kikyou.png	sonic	heavy	striker	support	back	t	SR	3	f	f	2023-11-21	6	\N
maki	Maki	Konuri Maki	millennium	15	August 1	149cm	Graffiti, video games	https://static.miraheze.org/bluearchivewiki/2/21/Maki.png	piercing	light	striker	attacker	back	f	MG	3	f	f	2021-02-03	8	\N
mika	Mika	Misono Mika	trinity	17	May 8	157cm	Chatting, collecting accessories	https://static.miraheze.org/bluearchivewiki/c/c8/Mika.png	piercing	light	striker	attacker	front	t	SMG	3	f	t	2023-01-23	5	\N
rumi	Rumi	Akeshiro Rumi	shanhaijing	17	March 5	168cm	Cooking, food development	https://static.miraheze.org/bluearchivewiki/7/7d/Rumi.png	explosive	heavy	striker	healer	front	t	SMG	3	f	f	2023-05-23	6	\N
serina	Serina	Sumi Serina	trinity	16	January 6	156cm	Volunteering at hospitals	https://static.miraheze.org/bluearchivewiki/4/41/Serina.png	mystic	light	special	healer	back	f	AR	1	f	f	2021-02-03	6	\N
shokuhou_misaki	Shokuhou Misaki	Shokuhou Misaki	etc	14	-	-	Drinking tea, eating organic food	https://static.miraheze.org/bluearchivewiki/6/66/Shokuhou_Misaki.png	explosive	heavy	striker	support	middle	t	HG	3	f	t	2023-10-23	5	\N
tsurugi	Tsurugi	Kenzaki Tsurugi	trinity	17	June 24	162cm	Watching movies, reading (romance novels)	https://static.miraheze.org/bluearchivewiki/c/c1/Tsurugi.png	piercing	heavy	striker	attacker	front	f	SG	3	f	f	2021-02-03	5	\N
yuuka	Yuuka	Hayase Yuuka	millennium	16	March 14	156cm	Calculating things	https://static.miraheze.org/bluearchivewiki/3/3e/Yuuka.png	explosive	heavy	striker	tank	front	t	SMG	2	f	f	2021-02-03	1	\N
hasumi_track	Hasumi (Track)	Hanekawa Hasumi	trinity	17	December 12	179cm	Reading, watching people	https://static.miraheze.org/bluearchivewiki/8/80/Hasumi_%28Sportswear%29.png	mystic	special	striker	attacker	back	t	SR	1	t	f	2022-10-25	2	hasumi
izumi_swimsuit	Izumi (Swimsuit)	Shishidō Izumi	gehenna	16	May 11	161cm	Making and eating strange foods	https://static.miraheze.org/bluearchivewiki/b/b0/Izumi_%28Swimsuit%29.png	explosive	light	striker	support	back	f	MG	1	t	f	2021-07-28	5	izumi
kirino_swimsuit	Kirino (Swimsuit)	Nakatsukasa Kirino	valkyrie	15	October 22	161cm	Eating on the go	https://static.miraheze.org/bluearchivewiki/c/cc/Kirino_%28Swimsuit%29.png	mystic	heavy	special	support	back	f	HG	1	t	f	2024-06-25	5	kirino
kotama_camping	Kotama (Camping)	Otose Kotama	millennium	17	January 5	158cm	Radio communication, wiretapping	https://static.miraheze.org/bluearchivewiki/1/19/Kotama_%28Camping%29.png	piercing	heavy	striker	support	middle	t	HG	3	f	f	2023-12-26	5	kotama
mashiro_swimsuit	Mashiro (Swimsuit)	Shizuyama Mashiro	trinity	15	June 5	155cm	Climbing to high places, keeping an observation diary	https://static.miraheze.org/bluearchivewiki/2/20/Mashiro_%28Swimsuit%29.png	mystic	light	special	attacker	back	f	SR	3	f	t	2021-06-29	5	mashiro
utaha_cheer_squad	Utaha (Cheer Squad)	Shiraishi Utaha	millennium	17	November 13	162cm	Inventing and repairing in general	https://static.miraheze.org/bluearchivewiki/7/7b/Utaha_%28Cheerleader%29.png	mystic	special	striker	attacker	front	f	SMG	3	f	f	2022-09-27	3	utaha
hinata	Hinata	Wakaba Hinata	trinity	17	May 17	166cm	Prayer, tidying up	https://static.miraheze.org/bluearchivewiki/9/97/Hinata.png	mystic	heavy	striker	attacker	middle	t	HG	3	f	f	2022-02-22	3	\N
kasumi	Kasumi	Kinugawa Kasumi	gehenna	16	May 24	148cm	Blasting, hot spring development	https://static.miraheze.org/bluearchivewiki/6/6b/Kasumi.png	sonic	heavy	striker	attacker	middle	t	HG	3	f	f	2023-09-26	2	\N
minori	Minori	Yasumori Minori	redwinter	17	July 14	158cm	Strikes, demonstrations, construction	https://static.miraheze.org/bluearchivewiki/1/1a/Minori.png	explosive	special	special	attacker	back	f	AR	3	f	f	2023-06-06	5	\N
mutsuki	Mutsuki	Asagi Mutsuki	gehenna	16	July 29	144cm	Collecting bombs	https://static.miraheze.org/bluearchivewiki/0/0b/Mutsuki.png	explosive	light	striker	attacker	back	f	MG	2	f	f	2021-02-03	6	\N
nonomi	Nonomi	Izayoi Nonomi	abydos	16	September 1	160cm	Shopping	https://static.miraheze.org/bluearchivewiki/a/ad/Nonomi.png	piercing	light	striker	attacker	back	f	MG	2	t	f	2021-02-03	5	\N
saya	Saya	Yakushi Saya	shanhaijing	16	January 3	149cm	Research	https://static.miraheze.org/bluearchivewiki/c/ce/Saya.png	explosive	light	special	attacker	back	f	HG	3	f	f	2021-02-03	8	\N
shimiko	Shimiko	Endō Shimiko	trinity	15	November 30	157cm	Reading, making bookmarks	https://static.miraheze.org/bluearchivewiki/f/f4/Shimiko.png	explosive	light	special	support	back	f	AR	1	f	f	2021-02-03	6	\N
suzumi	Suzumi	Morizuki Suzumi	trinity	16	August 31	162cm	Patrolling, strolling	https://static.miraheze.org/bluearchivewiki/0/07/Suzumi.png	explosive	heavy	striker	support	middle	t	AR	1	f	f	2021-02-03	6	\N
hinata_swimsuit	Hinata (Swimsuit)	Wakaba Hinata	trinity	17	May 17	166cm	Prayer, tidying up	https://static.miraheze.org/bluearchivewiki/0/08/Hinata_%28Swimsuit%29.png	explosive	light	special	attacker	back	f	HG	3	f	t	2023-07-23	2	hinata
nodoka_hot_spring	Nodoka (Hot Spring)	Amami Nodoka	redwinter	16	February 20	147cm	Astronomy	https://static.miraheze.org/bluearchivewiki/3/3f/Nodoka_%28Hot_Spring%29.png	explosive	special	special	healer	back	f	SMG	3	f	f	2021-12-14	6	nodoka
hatsune_miku	Hatsune Miku	Hatsune Hatsune Miku	etc	16	August 31	158cm	Singing, dancing	https://static.miraheze.org/bluearchivewiki/9/93/Hatsune_Miku.png	explosive	light	special	support	back	f	GL	3	f	t	2021-11-02	6	\N
izuna	Izuna	Kuda Izuna	hyakkiyako	15	December 16	155cm	Studying ninja arts, escorting her lord	https://static.miraheze.org/bluearchivewiki/5/54/Izuna.png	mystic	light	striker	attacker	front	t	SMG	3	f	f	2021-02-24	6	\N
kayoko	Kayoko	Onikata Kayoko	gehenna	18	March 17	157cm	Collecting CDs	https://static.miraheze.org/bluearchivewiki/a/a5/Kayoko.png	explosive	heavy	striker	support	middle	t	HG	2	f	f	2021-02-03	6	\N
kotama	Kotama	Otose Kotama	millennium	17	January 5	158cm	Radio communication, wiretapping	https://static.miraheze.org/bluearchivewiki/9/94/Kotama.png	explosive	light	special	support	back	f	HG	1	f	f	2021-02-03	6	\N
mashiro	Mashiro	Shizuyama Mashiro	trinity	15	June 5	155cm	Climbing to high places, keeping an observation diary	https://static.miraheze.org/bluearchivewiki/0/06/Mashiro.png	explosive	heavy	special	attacker	back	f	SR	3	f	f	2021-02-10	8	\N
mine	Mine	Aomori Mine	trinity	17	November 23	168cm	Collecting medical supplies	https://static.miraheze.org/bluearchivewiki/a/a0/Mine.png	explosive	light	striker	tank	front	f	SG	3	f	f	2023-01-10	6	\N
momoi	Momoi	Saiba Momoi	millennium	15	December 8	143cm	Video games	https://static.miraheze.org/bluearchivewiki/1/18/Momoi.png	piercing	light	striker	attacker	middle	t	AR	2	f	f	2021-04-07	6	\N
saten_ruiko	Saten Ruiko	Saten Ruiko	etc	12	-	160cm	Online mahjong, trying out sweets	https://static.miraheze.org/bluearchivewiki/b/b0/Saten_Ruiko.png	piercing	special	special	attacker	back	f	SMG	1	t	f	2023-10-23	5	\N
shiroko	Shiroko	Sunaōkami Shiroko	abydos	16	May 16	156cm	Jogging, strength training, cycling	https://static.miraheze.org/bluearchivewiki/6/63/Shiroko.png	explosive	light	striker	attacker	middle	t	AR	3	f	f	2021-02-03	9	\N
toki	Toki	Asuma Toki	millennium	16	August 16	165cm	Presently looking for one	https://static.miraheze.org/bluearchivewiki/e/e4/Toki.png	explosive	elastic	striker	attacker	middle	f	AR	3	f	t	2023-02-21	6	\N
utaha	Utaha	Shiraishi Utaha	millennium	17	November 13	162cm	Inventing and repairing in general	https://static.miraheze.org/bluearchivewiki/3/37/Utaha.png	piercing	heavy	special	attacker	back	f	SMG	2	f	f	2021-02-03	6	\N
hina_swimsuit	Hina (Swimsuit)	Sorasaki Hina	gehenna	17	February 19	142cm	Sleeping, resting	https://static.miraheze.org/bluearchivewiki/4/44/Hina_%28Swimsuit%29.png	explosive	heavy	striker	attacker	back	f	MG	3	f	t	2021-07-28	5	hina
mimori_swimsuit	Mimori (Swimsuit)	Mizuha Mimori	hyakkiyako	16	March 15	156cm	Shojo manga, doing household chores	https://static.miraheze.org/bluearchivewiki/2/22/Mimori_%28Swimsuit%29.png	mystic	special	special	support	back	f	HG	3	f	f	2023-08-15	5	mimori
nonomi_swimsuit	Nonomi (Swimsuit)	Izayoi Nonomi	abydos	16	September 1	160cm	Shopping	https://static.miraheze.org/bluearchivewiki/9/98/Nonomi_%28Swimsuit%29.png	explosive	special	striker	attacker	back	f	MG	3	f	f	2022-06-21	5	nonomi
shigure_hot_spring	Shigure (Hot Spring)	Mayoi Shigure	redwinter	16	January 22	156cm	Making homemade drinks	https://static.miraheze.org/bluearchivewiki/d/da/Shigure_%28Hot_Spring%29.png	piercing	special	special	healer	back	f	GL	3	f	f	2023-10-10	5	shigure
hasumi	Hasumi	Hanekawa Hasumi	trinity	17	December 12	179cm	Reading, watching people	https://static.miraheze.org/bluearchivewiki/8/84/Hasumi.png	piercing	heavy	striker	attacker	back	t	SR	2	f	f	2021-02-03	8	\N
izumi	Izumi	Shishidō Izumi	gehenna	16	May 11	161cm	Making and eating strange foods	https://static.miraheze.org/bluearchivewiki/1/10/Izumi.png	explosive	light	striker	attacker	back	f	MG	3	f	f	2021-02-03	5	\N
karin	Karin	Kakudate Karin	millennium	16	February 2	170cm	Cleaning	https://static.miraheze.org/bluearchivewiki/5/50/Karin.png	piercing	heavy	special	attacker	back	f	SR	3	f	f	2021-02-03	9	\N
kokona	Kokona	Sunohara Kokona	shanhaijing	11	June 1	139cm	Reading picture books	https://static.miraheze.org/bluearchivewiki/8/83/Kokona.png	piercing	special	striker	healer	middle	t	AR	3	f	f	2022-09-20	6	\N
marina	Marina	Ikekura Marina	redwinter	16	November 4	166cm	Walks, charges	https://static.miraheze.org/bluearchivewiki/9/9d/Marina.png	piercing	light	striker	tank	front	t	SMG	3	f	f	2022-03-07	5	\N
moe	Moe	Kazekura Moe	srt	15	September 13	163cm	Fireworks	https://static.miraheze.org/bluearchivewiki/c/cc/Moe.png	piercing	light	special	attacker	back	f	HG	3	f	f	2022-08-23	6	\N
saori	Saori	Jomae Saori	arius	17	September 3	167cm	None	https://static.miraheze.org/bluearchivewiki/4/46/Saori.png	explosive	special	striker	attacker	middle	t	AR	3	f	f	2022-08-08	5	\N
sumire	Sumire	Otohana Sumire	millennium	16	August 20	167cm	Training, gardening	https://static.miraheze.org/bluearchivewiki/d/d6/Sumire.png	piercing	special	striker	attacker	front	f	SG	3	f	f	2021-02-03	5	\N
ui	Ui	Kozeki Ui	trinity	17	April 23	165cm	Reading, book management, old book research	https://static.miraheze.org/bluearchivewiki/1/18/Ui.png	explosive	light	striker	support	back	t	SR	3	f	f	2022-02-22	6	\N
yuzu_maid	Yuzu (Maid)	Hanaoka Yuzu	millennium	16	August 12	150cm	Making games	https://static.miraheze.org/bluearchivewiki/1/17/Yuzu_%28Maid%29.png	explosive	elastic	special	attacker	back	f	GL	1	t	f	2023-04-25	5	\N
koharu_swimsuit	Koharu (Swimsuit)	Shimoe Koharu	trinity	15	April 16	148cm	Daydreaming, delusions, collecting lewd magazines	https://static.miraheze.org/bluearchivewiki/d/df/Koharu_%28Swimsuit%29.png	mystic	heavy	striker	attacker	back	t	SR	1	t	f	2023-07-23	2	koharu
mari_track	Mari (Track)	Iochi Mari	trinity	15	September 12	151cm	Prayer, thinking	https://static.miraheze.org/bluearchivewiki/8/88/Mari_%28Sportswear%29.png	mystic	special	striker	healer	middle	t	HG	3	f	t	2022-10-25	3	mari
saki_swimsuit	Saki (Swimsuit)	Sorai Saki	srt	15	April 9	161cm	Firearms maintenance, gathering plants, etc.	https://static.miraheze.org/bluearchivewiki/1/13/Saki_%28Swimsuit%29.png	explosive	heavy	striker	support	back	f	MG	3	f	f	2023-06-20	6	saki
shun_small	Shun (Small)	Sunohara Shun	shanhaijing	Top secret	February 5	Wasn't measured	Eating sweets	https://static.miraheze.org/bluearchivewiki/5/53/Shun_%28Kid%29.png	explosive	light	striker	attacker	back	t	SR	3	f	f	2021-08-25	6	shun
tsurugi_swimsuit	Tsurugi (Swimsuit)	Kenzaki Tsurugi	trinity	17	June 24	162cm	Watching movies, reading (romance novels)	https://static.miraheze.org/bluearchivewiki/e/e6/Tsurugi_%28Swimsuit%29.png	mystic	special	striker	attacker	front	f	SG	1	t	f	2021-06-29	3	tsurugi
yuuka_track	Yuuka (Track)	Hayase Yuuka	millennium	16	March 14	156cm	Calculating things	https://static.miraheze.org/bluearchivewiki/6/60/Yuuka_%28Sportswear%29.png	mystic	special	striker	tank	front	t	SMG	3	f	t	2022-10-25	2	yuuka
iroha	Iroha	Natsume Iroha	gehenna	16	November 16	151cm	Reading, skipping classes	https://static.miraheze.org/bluearchivewiki/b/bf/Iroha.png	mystic	heavy	special	t.s.	back	f	HG	3	f	f	2022-04-26	6	\N
hibiki	Hibiki	Nekozuka Hibiki	millennium	15	April 2	154cm	Shopping, cosplay	https://static.miraheze.org/bluearchivewiki/b/bc/Hibiki.png	explosive	heavy	special	attacker	back	f	MT	3	f	f	2021-02-03	9	\N
hiyori	Hiyori	Tsuchinaga Hiyori	arius	16	January 8	155cm	Collecting magazines	https://static.miraheze.org/bluearchivewiki/7/76/Hiyori.png	explosive	light	special	support	back	f	SR	3	f	f	2022-05-23	5	\N
kanna	Kanna	Ogata Kanna	valkyrie	17	September 7	166cm	Reading, watching movies (detectives)	https://static.miraheze.org/bluearchivewiki/4/47/Kanna.png	piercing	heavy	special	attacker	back	f	HG	3	f	f	2023-01-30	5	\N
mimori	Mimori	Mizuha Mimori	hyakkiyako	16	March 15	156cm	Shojo manga, doing household chores	https://static.miraheze.org/bluearchivewiki/8/82/Mimori.png	mystic	light	striker	support	middle	t	HG	3	f	f	2022-02-08	6	\N
momiji	Momiji	Akiizumi Momiji	redwinter	15	August 7	135cm	Collecting manga	https://static.miraheze.org/bluearchivewiki/5/53/Momiji.png	sonic	heavy	striker	attacker	back	t	RL	2	f	f	2023-08-22	5	\N
noa	Noa	Ushio Noa	millennium	16	April 13	161cm	Reading, reciting	https://static.miraheze.org/bluearchivewiki/2/23/Noa.png	mystic	special	striker	support	middle	t	HG	3	f	f	2022-09-27	6	\N
shigure	Shigure	Mayoi Shigure	redwinter	16	January 22	156cm	Making homemade drinks	https://static.miraheze.org/bluearchivewiki/d/da/Shigure.png	explosive	heavy	striker	attacker	middle	t	GL	3	f	f	2022-11-29	5	\N
shun	Shun	Sunohara Shun	shanhaijing	Top secret	February 5	174cm	Playing with children	https://static.miraheze.org/bluearchivewiki/1/17/Shun.png	explosive	light	striker	attacker	back	t	SR	3	f	f	2021-02-03	9	\N
yuzu	Yuzu	Hanaoka Yuzu	millennium	16	August 12	150cm	Making games	https://static.miraheze.org/bluearchivewiki/7/71/Yuzu.png	piercing	special	striker	attacker	middle	t	GL	3	f	f	2021-05-12	8	\N
izuna_swimsuit	Izuna (Swimsuit)	Kuda Izuna	hyakkiyako	15	December 16	155cm	Studying ninja arts, escorting her master	https://static.miraheze.org/bluearchivewiki/3/37/Izuna_%28Swimsuit%29.png	mystic	special	striker	attacker	front	t	SMG	3	f	t	2022-07-24	6	izuna
karin_bunny_girl	Karin (Bunny Girl)	Kakudate Karin	millennium	16	February 2	170cm	Cleaning	https://static.miraheze.org/bluearchivewiki/b/bd/Karin_%28Bunny_Girl%29.png	mystic	heavy	striker	attacker	back	t	SR	3	f	t	2021-09-28	2	karin
akane	Akane	Murokasa Akane	millennium	16	April 1	164cm	Cleaning	https://static.miraheze.org/bluearchivewiki/a/aa/Akane.png	piercing	light	striker	support	middle	t	HG	2	f	f	2021-02-03	9	\N
ako	Ako	Amau Ako	gehenna	17	December 22	165cm	President Hina	https://static.miraheze.org/bluearchivewiki/7/72/Ako.png	mystic	heavy	special	support	back	f	HG	3	f	f	2021-11-16	5	\N
miyu_swimsuit	Miyu (Swimsuit)	Kasumizawa Miyu	srt	15	July 12	149cm	Negative thoughts, escapism, pebble hunting	https://static.miraheze.org/bluearchivewiki/d/d1/Miyu_%28Swimsuit%29.png	explosive	light	special	attacker	back	f	SR	1	t	f	2023-06-20	2	miyu
arisu	Arisu	Tendou Arisu	millennium	??	March 25	152cm	Games (Especially RPGs)	https://static.miraheze.org/bluearchivewiki/0/0f/Arisu.png	mystic	special	striker	attacker	back	f	RG	3	f	f	2021-03-24	8	\N
hifumi	Hifumi	Ajitani Hifumi	trinity	16	November 27	158cm	Collecting Peroro goods, collecting cute things, shopping, giving advice	https://static.miraheze.org/bluearchivewiki/3/3b/Hifumi.png	piercing	light	striker	support	middle	t	AR	3	f	f	2021-02-03	8	\N
serina_christmas	Serina (Christmas)	Sumi Serina	trinity	16	January 6	156cm	Volunteering at hospitals	https://static.miraheze.org/bluearchivewiki/1/19/Serina_%28Christmas%29.png	piercing	special	striker	support	middle	t	AR	3	f	f	2022-12-13	2	serina
ui_swimsuit	Ui (Swimsuit)	Kozeki Ui	trinity	17	April 23	165cm	Reading, book management, old book research	https://static.miraheze.org/bluearchivewiki/6/60/Ui_%28Swimsuit%29.png	piercing	elastic	striker	support	back	t	SR	3	f	t	2023-07-23	3	ui
cherino_hot_spring	Cherino (Hot Spring)	Renkawa Cherino	redwinter	??	October 27	128cm	Purges, snowball fights	https://static.miraheze.org/bluearchivewiki/9/95/Cherino_%28Hot_Spring%29.png	explosive	heavy	special	t.s.	back	f	HG	3	f	f	2021-11-29	6	cherino
hoshino	Hoshino	Takanashi Hoshino	abydos	17	January 2	145cm	Afternoon naps, lazing around	https://static.miraheze.org/bluearchivewiki/a/a9/Hoshino.png	piercing	heavy	striker	tank	front	f	SG	3	f	f	2021-02-03	9	\N
koharu	Koharu	Shimoe Koharu	trinity	15	April 16	148cm	Daydreaming, delusions, collecting lewd magazines	https://static.miraheze.org/bluearchivewiki/c/c3/Koharu.png	explosive	heavy	striker	healer	back	t	SR	3	f	f	2021-06-09	6	\N
mari	Mari	Iochi Mari	trinity	15	September 12	151cm	Prayer, thinking	https://static.miraheze.org/bluearchivewiki/4/4f/Mari.png	mystic	special	special	support	back	f	HG	2	f	f	2021-10-26	3	\N
mina	Mina	Konoe Mina	shanhaijing	16	September 9	166cm	Watching movies (mainly hard-boiled action)	https://static.miraheze.org/bluearchivewiki/6/6b/Mina.png	explosive	heavy	striker	support	middle	t	HG	3	f	f	2023-05-23	5	\N
nodoka	Nodoka	Amami Nodoka	redwinter	16	February 20	147cm	Astronomy	https://static.miraheze.org/bluearchivewiki/e/e1/Nodoka.png	explosive	heavy	special	support	back	f	SMG	1	t	f	2021-04-28	6	\N
sakurako	Sakurako	Utazumi Sakurako	trinity	17	October 4	160cm	Prayer	https://static.miraheze.org/bluearchivewiki/f/f0/Sakurako.png	mystic	special	striker	attacker	middle	t	AR	3	f	f	2023-02-09	5	\N
\.


--
-- Name: gifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arona
--

SELECT pg_catalog.setval('public.gifts_id_seq', 52, true);


--
-- Name: missions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arona
--

SELECT pg_catalog.setval('public.missions_id_seq', 207, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arona
--

SELECT pg_catalog.setval('public.skills_id_seq', 884, true);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: gifts gifts_pkey; Type: CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.gifts
    ADD CONSTRAINT gifts_pkey PRIMARY KEY (id);


--
-- Name: missions missions_pkey; Type: CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: skills skills_student_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_student_id_students_id_fk FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: students students_base_variant_id_students_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: arona
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_base_variant_id_students_id_fk FOREIGN KEY (base_variant_id) REFERENCES public.students(id);



--
-- PostgreSQL database dump complete
--
