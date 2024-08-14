create database san_agustin;
use san_agustin;

/*==============================================================*/
/* Table: ACCIONESMEJORA                                        */
/*==============================================================*/
create table ACCIONESMEJORA
(
   ID_ACC               int not null,
   ID                   int,
   DESCRIPCION          varchar(250) not null,
   TIEMPO_PLAZO         date not null,
   primary key (ID_ACC)
);

/*==============================================================*/
/* Table: ALCANCES                                              */
/*==============================================================*/
create table ALCANCES
(
   ID_ALCANCE           int not null,
   ID                   int,
   META                 varchar(250) not null,
   primary key (ID_ALCANCE)
);

/*==============================================================*/
/* Table: FORMULARIOBASE                                        */
/*==============================================================*/
create table FORMULARIOBASE
(
   ID_FORM              int not null,
   TIPO_FORMULARIO      varchar(250) not null,
   primary key (ID_FORM)
);

/*==============================================================*/
/* Table: INDICADORES                                           */
/*==============================================================*/
create table INDICADORES
(
   ID                   int not null auto_increment,
   ID_OBJACADEMICO      int,
   ID_OSGC              int,
   ID_LINEABASE         int,
   ID_FORM              int,
   NOMBRE_IDEA          varchar(250) not null,
   primary key (ID)
);

/*==============================================================*/
/* Table: LINEABASE                                             */
/*==============================================================*/
create table LINEABASE
(
   ID_LINEABASE         int not null,
   TIPODELINEABASE      varchar(250) not null,
   primary key (ID_LINEABASE)
);

/*==============================================================*/
/* Table: OBJACADEMICO                                          */
/*==============================================================*/
create table OBJACADEMICO
(
   ID_OBJACADEMICO      int not null,
   NOMBRE_OBJACADEMICO  varchar(250) not null,
   DESCRIPCION_OBJETIVO varchar(250),
   primary key (ID_OBJACADEMICO)
);

/*==============================================================*/
/* Table: OBJSIGECALIDAD                                        */
/*==============================================================*/
create table OBJSIGECALIDAD
(
   ID_OSGC              int not null,
   NOMBRE_OSGC          varchar(250) not null,
   DESCRIPCION_OSGC     varchar(250) not null,
   primary key (ID_OSGC)
);

/*==============================================================*/
/* Table: PLAZOTIEMPO                                           */
/*==============================================================*/
create table PLAZOTIEMPO
(
   ID_PLAZO             int not null,
   ID                   int,
   FECHA_PLAZO          date not null,
   ANO                  date not null,
   primary key (ID_PLAZO)
);

alter table ACCIONESMEJORA add constraint FK_TIENE foreign key (ID)
      references INDICADORES (ID) on delete restrict on update restrict;

alter table ALCANCES add constraint FK_VA foreign key (ID)
      references INDICADORES (ID) on delete restrict on update restrict;

alter table INDICADORES add constraint FK_CUENTA foreign key (ID_OSGC)
      references OBJSIGECALIDAD (ID_OSGC) on delete restrict on update restrict;

alter table INDICADORES add constraint FK_ESTARA foreign key (ID_LINEABASE)
      references LINEABASE (ID_LINEABASE) on delete restrict on update restrict;

alter table INDICADORES add constraint FK_ESTA_EN foreign key (ID_OBJACADEMICO)
      references OBJACADEMICO (ID_OBJACADEMICO) on delete restrict on update restrict;

alter table INDICADORES add constraint FK_TENDRA foreign key (ID_FORM)
      references FORMULARIOBASE (ID_FORM) on delete restrict on update restrict;

alter table PLAZOTIEMPO add constraint FK_ESTABLEZIDO foreign key (ID)
      references INDICADORES (ID) on delete restrict on update restrict;


-- Existing tables...

/*==============================================================*/
/* Table: USUARIOS                                              */
/*==============================================================*/
create table USUARIOS
(
   ID_USUARIO           int not null auto_increment,
   NOMBRE_USUARIO       varchar(250) not null,
   EMAIL                varchar(250) not null unique,
   PASSWORD             varchar(250) not null,
   primary key (ID_USUARIO)
);

/*==============================================================*/
/* Table: ROLES                                                 */
/*==============================================================*/
create table ROLES
(
   ID_ROL               int not null auto_increment,
   NOMBRE_ROL           varchar(250) not null,
   primary key (ID_ROL)
);

/*==============================================================*/
/* Table: PERMISOS                                              */
/*==============================================================*/
create table PERMISOS
(
   ID_PERMISO           int not null auto_increment,
   NOMBRE_PERMISO       varchar(250) not null,
   primary key (ID_PERMISO)
);

/*==============================================================*/
/* Table: USUARIOS_ROLES                                        */
/*==============================================================*/
create table USUARIOS_ROLES
(
   ID_USUARIO           int not null,
   ID_ROL               int not null,
   primary key (ID_USUARIO, ID_ROL),
   foreign key (ID_USUARIO) references USUARIOS(ID_USUARIO) on delete restrict on update restrict,
   foreign key (ID_ROL) references ROLES(ID_ROL) on delete restrict on update restrict
);

/*==============================================================*/
/* Table: ROLES_PERMISOS                                        */
/*==============================================================*/
create table ROLES_PERMISOS
(
   ID_ROL               int not null,
   ID_PERMISO           int not null,
   primary key (ID_ROL, ID_PERMISO),
   foreign key (ID_ROL) references ROLES(ID_ROL) on delete restrict on update restrict,
   foreign key (ID_PERMISO) references PERMISOS(ID_PERMISO) on delete restrict on update restrict
);


