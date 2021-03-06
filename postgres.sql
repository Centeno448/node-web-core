PGDMP     :                    x            WebCore    12.2    12.2 8    @           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            A           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            B           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            C           1262    16395    WebCore    DATABASE     �   CREATE DATABASE "WebCore" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE "WebCore";
                WebAdminDBA    false            �            1259    16544    AppRole    TABLE     d   CREATE TABLE public."AppRole" (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public."AppRole";
       public         heap    WebAdminDBA    false            D           0    0    TABLE "AppRole"    ACL     N   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."AppRole" TO "WebCoreNode";
          public          WebAdminDBA    false    210            �            1259    16542    AppRole_id_seq    SEQUENCE     �   CREATE SEQUENCE public."AppRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."AppRole_id_seq";
       public          WebAdminDBA    false    210            E           0    0    AppRole_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."AppRole_id_seq" OWNED BY public."AppRole".id;
          public          WebAdminDBA    false    209            F           0    0    SEQUENCE "AppRole_id_seq"    ACL     I   GRANT SELECT,USAGE ON SEQUENCE public."AppRole_id_seq" TO "WebCoreNode";
          public          WebAdminDBA    false    209            �            1259    16404    AppUser    TABLE     �   CREATE TABLE public."AppUser" (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(254) NOT NULL,
    password character(64) NOT NULL,
    role integer NOT NULL
);
    DROP TABLE public."AppUser";
       public         heap    WebAdminDBA    false            G           0    0    TABLE "AppUser"    ACL     N   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."AppUser" TO "WebCoreNode";
          public          WebAdminDBA    false    203            �            1259    16402    AppUser_AppUserId_seq    SEQUENCE     �   CREATE SEQUENCE public."AppUser_AppUserId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."AppUser_AppUserId_seq";
       public          WebAdminDBA    false    203            H           0    0    AppUser_AppUserId_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public."AppUser_AppUserId_seq" OWNED BY public."AppUser".id;
          public          WebAdminDBA    false    202            I           0    0     SEQUENCE "AppUser_AppUserId_seq"    ACL     P   GRANT SELECT,USAGE ON SEQUENCE public."AppUser_AppUserId_seq" TO "WebCoreNode";
          public          WebAdminDBA    false    202            �            1259    16500    Book    TABLE     �   CREATE TABLE public."Book" (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    author character varying(50) NOT NULL,
    "publicationDate" date NOT NULL,
    category integer NOT NULL,
    "user" integer NOT NULL
);
    DROP TABLE public."Book";
       public         heap    postgres    false            J           0    0    TABLE "Book"    ACL     K   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."Book" TO "WebCoreNode";
          public          postgres    false    206            �            1259    16514    BookCategory    TABLE     �   CREATE TABLE public."BookCategory" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(200)
);
 "   DROP TABLE public."BookCategory";
       public         heap    WebAdminDBA    false            K           0    0    TABLE "BookCategory"    ACL     S   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."BookCategory" TO "WebCoreNode";
          public          WebAdminDBA    false    208            �            1259    16512    BookCategory_id_seq    SEQUENCE     �   CREATE SEQUENCE public."BookCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."BookCategory_id_seq";
       public          WebAdminDBA    false    208            L           0    0    BookCategory_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."BookCategory_id_seq" OWNED BY public."BookCategory".id;
          public          WebAdminDBA    false    207            M           0    0    SEQUENCE "BookCategory_id_seq"    ACL     N   GRANT SELECT,USAGE ON SEQUENCE public."BookCategory_id_seq" TO "WebCoreNode";
          public          WebAdminDBA    false    207            �            1259    16558    BookExchange    TABLE        CREATE TABLE public."BookExchange" (
    id integer NOT NULL,
    "fromUser" integer NOT NULL,
    "toUser" integer NOT NULL,
    "fromBook" integer NOT NULL,
    "toBook" integer NOT NULL,
    "exchangeDate" date NOT NULL,
    "exchangeFailed" boolean
);
 "   DROP TABLE public."BookExchange";
       public         heap    WebAdminDBA    false            N           0    0    TABLE "BookExchange"    ACL     S   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."BookExchange" TO "WebCoreNode";
          public          WebAdminDBA    false    212            �            1259    16556    BookExchange_id_seq    SEQUENCE     �   CREATE SEQUENCE public."BookExchange_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."BookExchange_id_seq";
       public          WebAdminDBA    false    212            O           0    0    BookExchange_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."BookExchange_id_seq" OWNED BY public."BookExchange".id;
          public          WebAdminDBA    false    211            P           0    0    SEQUENCE "BookExchange_id_seq"    ACL     N   GRANT SELECT,USAGE ON SEQUENCE public."BookExchange_id_seq" TO "WebCoreNode";
          public          WebAdminDBA    false    211            �            1259    16498    Book_BookId_seq    SEQUENCE     �   CREATE SEQUENCE public."Book_BookId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Book_BookId_seq";
       public          postgres    false    206            Q           0    0    Book_BookId_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Book_BookId_seq" OWNED BY public."Book".id;
          public          postgres    false    205            R           0    0    SEQUENCE "Book_BookId_seq"    ACL     J   GRANT SELECT,USAGE ON SEQUENCE public."Book_BookId_seq" TO "WebCoreNode";
          public          postgres    false    205            �            1259    16586    Rating    TABLE     �   CREATE TABLE public."Rating" (
    id integer NOT NULL,
    score numeric NOT NULL,
    comment character varying(200),
    "toUser" integer NOT NULL,
    "fromUser" integer NOT NULL
);
    DROP TABLE public."Rating";
       public         heap    WebCoreNode    false            �            1259    16584    Rating_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Rating_id_seq";
       public          WebCoreNode    false    214            S           0    0    Rating_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;
          public          WebCoreNode    false    213            �            1259    16414    RefreshToken    TABLE     M   CREATE TABLE public."RefreshToken" (
    token character varying NOT NULL
);
 "   DROP TABLE public."RefreshToken";
       public         heap    WebAdminDBA    false            T           0    0    TABLE "RefreshToken"    ACL     L   GRANT SELECT,INSERT,DELETE ON TABLE public."RefreshToken" TO "WebCoreNode";
          public          WebAdminDBA    false    204            �
           2604    16547 
   AppRole id    DEFAULT     l   ALTER TABLE ONLY public."AppRole" ALTER COLUMN id SET DEFAULT nextval('public."AppRole_id_seq"'::regclass);
 ;   ALTER TABLE public."AppRole" ALTER COLUMN id DROP DEFAULT;
       public          WebAdminDBA    false    210    209    210            �
           2604    16407 
   AppUser id    DEFAULT     s   ALTER TABLE ONLY public."AppUser" ALTER COLUMN id SET DEFAULT nextval('public."AppUser_AppUserId_seq"'::regclass);
 ;   ALTER TABLE public."AppUser" ALTER COLUMN id DROP DEFAULT;
       public          WebAdminDBA    false    202    203    203            �
           2604    16503    Book id    DEFAULT     j   ALTER TABLE ONLY public."Book" ALTER COLUMN id SET DEFAULT nextval('public."Book_BookId_seq"'::regclass);
 8   ALTER TABLE public."Book" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    205    206            �
           2604    16517    BookCategory id    DEFAULT     v   ALTER TABLE ONLY public."BookCategory" ALTER COLUMN id SET DEFAULT nextval('public."BookCategory_id_seq"'::regclass);
 @   ALTER TABLE public."BookCategory" ALTER COLUMN id DROP DEFAULT;
       public          WebAdminDBA    false    207    208    208            �
           2604    16561    BookExchange id    DEFAULT     v   ALTER TABLE ONLY public."BookExchange" ALTER COLUMN id SET DEFAULT nextval('public."BookExchange_id_seq"'::regclass);
 @   ALTER TABLE public."BookExchange" ALTER COLUMN id DROP DEFAULT;
       public          WebAdminDBA    false    212    211    212            �
           2604    16589 	   Rating id    DEFAULT     j   ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);
 :   ALTER TABLE public."Rating" ALTER COLUMN id DROP DEFAULT;
       public          WebCoreNode    false    214    213    214            �
           2606    16549    AppRole AppRole_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."AppRole"
    ADD CONSTRAINT "AppRole_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."AppRole" DROP CONSTRAINT "AppRole_pkey";
       public            WebAdminDBA    false    210            �
           2606    16409    AppUser AppUser_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."AppUser"
    ADD CONSTRAINT "AppUser_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."AppUser" DROP CONSTRAINT "AppUser_pkey";
       public            WebAdminDBA    false    203            �
           2606    16519    BookCategory BookCategory_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."BookCategory"
    ADD CONSTRAINT "BookCategory_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."BookCategory" DROP CONSTRAINT "BookCategory_pkey";
       public            WebAdminDBA    false    208            �
           2606    16563    BookExchange BookExchange_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."BookExchange"
    ADD CONSTRAINT "BookExchange_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."BookExchange" DROP CONSTRAINT "BookExchange_pkey";
       public            WebAdminDBA    false    212            �
           2606    16505    Book Book_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Book" DROP CONSTRAINT "Book_pkey";
       public            postgres    false    206            �
           2606    16594    Rating Rating_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "Rating_pkey";
       public            WebCoreNode    false    214            �
           2606    16421    RefreshToken RefreshToken_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (token);
 L   ALTER TABLE ONLY public."RefreshToken" DROP CONSTRAINT "RefreshToken_pkey";
       public            WebAdminDBA    false    204            �
           2606    16551    AppUser FK_AppRole_AppUser    FK CONSTRAINT     �   ALTER TABLE ONLY public."AppUser"
    ADD CONSTRAINT "FK_AppRole_AppUser" FOREIGN KEY (role) REFERENCES public."AppRole"(id) NOT VALID;
 H   ALTER TABLE ONLY public."AppUser" DROP CONSTRAINT "FK_AppRole_AppUser";
       public          WebAdminDBA    false    210    203    2738            �
           2606    16527    Book FK_AppUser_Book    FK CONSTRAINT     �   ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "FK_AppUser_Book" FOREIGN KEY ("user") REFERENCES public."AppUser"(id) NOT VALID;
 B   ALTER TABLE ONLY public."Book" DROP CONSTRAINT "FK_AppUser_Book";
       public          postgres    false    206    2730    203            �
           2606    16522    Book FK_BookCategory_Book    FK CONSTRAINT     �   ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "FK_BookCategory_Book" FOREIGN KEY (category) REFERENCES public."BookCategory"(id) NOT VALID;
 G   ALTER TABLE ONLY public."Book" DROP CONSTRAINT "FK_BookCategory_Book";
       public          postgres    false    206    2736    208            �
           2606    16574 %   BookExchange FK_FromBook_BookExchange    FK CONSTRAINT     �   ALTER TABLE ONLY public."BookExchange"
    ADD CONSTRAINT "FK_FromBook_BookExchange" FOREIGN KEY ("fromBook") REFERENCES public."Book"(id);
 S   ALTER TABLE ONLY public."BookExchange" DROP CONSTRAINT "FK_FromBook_BookExchange";
       public          WebAdminDBA    false    212    206    2734            �
           2606    16564 %   BookExchange FK_FromUser_BookExchange    FK CONSTRAINT     �   ALTER TABLE ONLY public."BookExchange"
    ADD CONSTRAINT "FK_FromUser_BookExchange" FOREIGN KEY ("fromUser") REFERENCES public."AppUser"(id);
 S   ALTER TABLE ONLY public."BookExchange" DROP CONSTRAINT "FK_FromUser_BookExchange";
       public          WebAdminDBA    false    203    212    2730            �
           2606    16600    Rating FK_FromUser_Rating    FK CONSTRAINT     �   ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "FK_FromUser_Rating" FOREIGN KEY ("fromUser") REFERENCES public."AppUser"(id);
 G   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "FK_FromUser_Rating";
       public          WebCoreNode    false    214    2730    203            �
           2606    16579 #   BookExchange FK_ToBook_BookExchange    FK CONSTRAINT     �   ALTER TABLE ONLY public."BookExchange"
    ADD CONSTRAINT "FK_ToBook_BookExchange" FOREIGN KEY ("toBook") REFERENCES public."Book"(id);
 Q   ALTER TABLE ONLY public."BookExchange" DROP CONSTRAINT "FK_ToBook_BookExchange";
       public          WebAdminDBA    false    206    212    2734            �
           2606    16569 #   BookExchange FK_ToUser_BookExchange    FK CONSTRAINT     �   ALTER TABLE ONLY public."BookExchange"
    ADD CONSTRAINT "FK_ToUser_BookExchange" FOREIGN KEY ("toUser") REFERENCES public."AppUser"(id);
 Q   ALTER TABLE ONLY public."BookExchange" DROP CONSTRAINT "FK_ToUser_BookExchange";
       public          WebAdminDBA    false    203    2730    212            �
           2606    16595    Rating FK_ToUser_Rating    FK CONSTRAINT        ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "FK_ToUser_Rating" FOREIGN KEY ("toUser") REFERENCES public."AppUser"(id);
 E   ALTER TABLE ONLY public."Rating" DROP CONSTRAINT "FK_ToUser_Rating";
       public          WebCoreNode    false    203    2730    214           