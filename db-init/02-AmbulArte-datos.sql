-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 07-06-2025 a las 12:31:49
-- Versión del servidor: 8.0.42-0ubuntu0.24.04.1
-- Versión de PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: AmbulArte
--
USE AmbulArte;

--
-- Volcado de datos para la tabla usuarios
--

INSERT INTO usuarios (idUsuario, email, contrasena, tipo, activo, perfilCompletado) VALUES
(1, 'inmaculadabonet@ambularte.com', '$2y$10$8aHaKtBtAA3LRt6PyPC1OOMVYagjIcmbG2dNcVXfFM2cJfW1JtQha', 'artista', 1, 1),
(2, 'agatapinedo@ambularte.com', '$2y$10$XBT.j7k/VM///K7b5MunhuGz0nGhC.geseTghQs.Dw8qRANWAAp/W', 'artista', 1, 1),
(3, 'ruysegarra@ambularte.com', '$2y$10$Z4JZhdugli/aJV2yn8l6meWpDfORGshYvpYjf5.V8v9hZRaPuzY4S', 'artista', 1, 1),
(4, 'wilfredoacero@ambularte.com', '$2y$10$Z9C/gd9QOj0gWWYyMCu8le/uM0HVXfO.yUuB5UjE3HgE4f0mJLmvG', 'artista', 1, 1),
(5, 'patriciaperea@ambularte.com', '$2y$10$oFc3AX4RI8l2biaku4IrAudXWT0H6NHzHxQ9JPK7vNawGJVx1NAqG', 'artista', 1, 1),
(6, 'klauskinski@ambularte.com', '$2y$10$cK/Bg/iTmT0E/ddVA.oEJ.XzCfQdvRdApYCmJuShDTq6VuwArZFEm', 'artista', 1, 1),
(7, 'angelssanz@ambularte.com', '$2y$10$LEzszRBNp8gcleSiJ9y41e3O2/.rV7Iqn70CC.qimX4FY5WOmyeNO', 'artista', 1, 1),
(8, 'aminpriego@ambularte.com', '$2y$10$qURqU.Cs2oI8EF639AiXHOOylbSj6Vs4KmS.KhnJK3gX8Bdrh3wfK', 'artista', 1, 1),
(9, 'joseazcona@ambularte.com', '$2y$10$Ymb.Ec6ITTf.5ysd3/UwHuYgYwOF0Adf2gg1Nx9Nj6TBs6OomK2wi', 'artista', 1, 1),
(10, 'alinfrances@ambularte.com', '$2y$10$m9OFnjvD7cTlbuASu0rL4OJIj3LmPdXHqc.XtatU.l7eBhR.W4Zfq', 'artista', 1, 1),
(11, 'bettmir@ambularte.com', '$2y$10$2hlsLmUES58ydMWzi2mp1.8QwmdSvlX04WUx2vIdRn9P7IlpjfoUC', 'artista', 1, 1),
(12, 'imeldamay@ambularte.com', '$2y$10$bDb6Uy6GAVk7sIiRSsGJkusdddwtrY1bWDkPSCaFvmMrgo/4mUVCC', 'artista', 1, 1),
(13, 'yagocanellas@ambularte.com', '$2y$10$bIdpP4CrUpqspGCMyTFiSOdC7FgDUtSmcpiczQkBsGjOMPvJ5rrZy', 'artista', 1, 1),
(14, 'miguelsanchez@ambularte.com', '$2y$10$pkUktfKKprCLC/4YKY4SRu.RWrweMoYjmcr3BRl8IFOO6WB5/WlL6', 'artista', 1, 1),
(15, 'nicolaspinilla@ambularte.com', '$2y$10$HggrGjTcnT3YzRwG/6JZSeG60kYlRW01NOVEgIw5MJK0lNzO5SHNS', 'artista', 1, 1),
(16, 'josaaller@ambularte.com', '$2y$10$MVczBBGtYN4iJAoadFWRcelwQyalPz6KrtRjQ0eUT0xTV4VD05Uhq', 'artista', 1, 1),
(17, 'annamuller@ambularte.com', '$2y$10$GBh45zyvce9FoUC80427pextLoUff98/qu6OSQD6WdrXsahHgfsvO', 'artista', 1, 1),
(18, 'josegual@ambularte.com', '$2y$10$dy8v8kFBPjgDO0CMAQd05eWWU6jdCqSvjIv93Xq3eT8JRw0GdtRlK', 'artista', 1, 1),
(19, 'magalipacao@ambularte.com', '$2y$10$fL/4zfEZMdfX9jUrvgwTw.aSpNJM6QJUcZv/KxXgwaIQbT3EkRcC2', 'artista', 1, 1),
(20, 'bettiepret@ambularte.com', '$2y$10$g6DLcWHEGAinQiA4WvwJmeRWhwtDR/5kh2gJu7pWpqVVzUqBhr7Fy', 'artista', 1, 1),
(21, 'enarniklen@ambularte.com', '$2y$10$tWJCeiT7olzgY58epyZs2OL6c5h8uyvgY0g0uTHGJo8n9SveJyscK', 'coleccionista', 1, 1),
(22, 'anaballester@ambularte.com', '$2y$10$gOVexWl/VUOb4MWBHxnImuC3wKIZvWeBSmrw.1J4RoRRs4yt2XDqO', 'coleccionista', 1, 1),
(23, 'faustopla@ambularte.com', '$2y$10$8P64KSr50CVe387OFhRmRuuddcW5l8/Uoz8W6JD09sLxhRRIAvDoi', 'coleccionista', 1, 1),
(24, 'edmundovalles@ambularte.com', '$2y$10$tTl6kAqF8fYCeW0obaF1PekfockoR4L4xjQnkGrE2DR9xkGiMmG52', 'coleccionista', 1, 1),
(25, 'shelbyolsen@ambularte.com', '$2y$10$jo24se4/AyXDal3eFCuDXO1xn4U1o5RdAxHqL33ZZI8y7vF8MepVO', 'coleccionista', 1, 1),
(26, 'marujamayo@ambularte.com', '$2y$10$D/1deOGgIwOyeq/G6MvE9ugucyTrc2H9owb605g96gllyzoMXsCPW', 'galeria', 1, 1),
(27, 'fridakhalo@ambularte.com', '$2y$10$unBWxJGiNJdsKqFlxyyFDODwxTEi45byZpU0ftKOkiTfZ4eg29fzm', 'galeria', 1, 1),
(28, 'giorgiaokeeffe@ambularte.com', '$2y$10$fAX7kZvYi6PRk6n8Vg.jtO1SsFmlFLKlAjaZ5uNfnzGs1gqI.1DHC', 'galeria', 1, 1),
(29, 'artemisiagentileschi@ambularte.com', '$2y$10$IE.Dge0MaiG/NvEuZeA9k.t4.cir3Rjwoc9ge0P1eFiuN.x2pR5n2', 'galeria', 1, 1),
(30, 'marycassatt@ambularte.com', '$2y$10$GGoc9pAij6kcbELkRmwhEOUOCs79XLcSydyMf4hjL0uGwZvBl7Jtq', 'galeria', 1, 1),
(31, 'yayoikusama@ambularte.com', '$2y$10$uUwSPfXeTDRifFblQUZuSe92eFpUJYY88wBnTtv7uSzDHOdrCceGG', 'galeria', 1, 1),
(32, 'judithleyster@ambularte.com', '$2y$10$BOXK4AyKinBY39xGZXRXgOCwsWFyi5QZhqVOmQA58pazI0.jshdjS', 'galeria', 1, 1),
(33, 'artista@ambularte.com', '$2y$10$oP6WSobmp4ZVFVsY7P36iObOgrF9dEkOS8r4TCr04Ac358Vf7dGa6', 'artista', 1, 1),
(34, 'coleccionista@ambularte.com', '$2y$10$K/9qfMxKS19DZdyPWGJOVuWq7rgv7LGlr/ulhmSx7nycUqjIJ06ue', 'coleccionista', 1, 0),
(35, 'galeria@ambularte.com', '$2y$10$73imk55kb/.K/L3WxdhaeuQ989GABQcyo6J5f4SzuKQYqzJBv1qSe', 'galeria', 1, 0),
(36, 'admin@ambularte.com', '$2y$10$mfKAIidXEtB3ioGybCuPp.XIm9jwQMkGezW3vo/aBK/AMYWCmhni2', 'admin', 1, 0);

--
-- Volcado de datos para la tabla artistas
--

INSERT INTO artistas (idArtista, nombre, apellidos, genero, fechaNacimiento, fechaDefuncion, direccion, ciudad, codigoPostal, pais, telefono, email, imagen, activo) VALUES
(1, 'Inma', 'Bonet', 'mujer', '1989-07-25', NULL, 'Rue Amelie 990', 'París', '65423', 'Francia', '+34731161559', 'inmaculadabonet@ambularte.com', 'mujer1.jpg', 1),
(2, 'Ágata', 'Pinedo', 'mujer', '1954-09-29', NULL, 'Strand Strasse 41 Apt. 64 Santa Cruz de Tenerife, 25534', 'Berlín', '92832', 'Alemania', '+34736 483 503', 'agatapinedo@ambularte.com', 'mujer2.jpg', 1),
(3, 'Ruy', 'Segarra', 'hombre', '1959-02-08', NULL, 'Rue Bárbara Jódar 769', 'Marsella', '26916', 'Francia', '+34997 848 018', 'ruysegarra@ambularte.com', 'hombre1.jpg', 1),
(4, 'Will', 'Acero', 'hombre', '1998-07-09', NULL, 'Strasse Prost, 632', 'Viena', '43039', 'Austria', '+34 731 718 227', 'wilfredoacero@ambularte.com', 'hombre2.jpg', 1),
(5, 'Patricia', 'Perea', 'mujer', '1979-03-13', NULL, 'Urbanización Bernardo Neira, 9', 'Madrid', '51834', 'España', '+34707 38 29 97', 'patriciaperea@ambularte.com', 'mujer8.jpg', 1),
(6, 'Klaus', 'Kinski', 'hombre', '1977-05-11', NULL, 'Oelkes Alle, 4', 'Hamburgo', '17810', 'Alemania', '+34880 13 26 77', 'klauskinski@ambularte.com', 'hombre3.jpg', 1),
(7, 'Angels', 'Sanz', 'prefiero no decirlo', '1968-10-16', NULL, 'Rue Manu Gelabert, 9 Apt. 50', 'Bruselas', '21913', 'Bélgica', '+34 936 629 946', 'angelssanz@ambularte.com', 'mujer10.jpg', 1),
(8, 'Amin', 'Priego', 'no binario', '1958-04-15', NULL, 'Strasse Luigi Sedano, 291 Puerta 3', 'Múnich', '84980', 'Alemania', '+34708 41 24 11', 'aminpriego@ambularte.com', 'hombre8.jpg', 1),
(9, 'José', 'Azcona', 'prefiero no decirlo', '2000-08-31', NULL, 'Plaza Nazario Castrillo', 'Madrid', '62045', 'España', '+34 705 331 586', 'joseazcona@ambularte.com', 'hombre11.jpg', 1),
(10, 'Alin', 'Françes', 'mujer', '1977-05-26', NULL, 'Vie Robert Beacoup, 43 Piso 5', 'Rotterdam', '14586', 'Países Bajos', '+34718 50 14 29', 'alinfrances@ambularte.com', 'mujer7.jpg', 1),
(11, 'Bett', 'Mir', 'hombre', '2001-01-29', NULL, 'Strasse Levis 9 Puerta 3, 59514', 'Múnich', '65648', 'Alemania', '+34 936629946', 'bettmir@ambularte.com', 'hombre6.jpg', 1),
(12, 'Imelda', 'May', 'mujer', '1984-03-02', NULL, 'Vie Aránzazu, 4', 'Lyon', '76936', 'Francia', '+34663 201 632', 'imeldamay@ambularte.com', 'mujer6.jpg', 1),
(13, 'Yago', 'Cañellas', 'no binario', '2002-12-31', NULL, 'Paseo de Victor Manuel Cuenca 57 Apt. 48', 'Rotterdam', '55812', 'Países Bajos', '+34 836231665', 'yagocanellas@ambularte.com', 'hombre7.jpg', 1),
(14, 'Miguel', 'Sánchez', 'prefiero no decirlo', '1988-07-22', NULL, 'Calle Betis 98 Puerta 3', 'Sevilla', '27298', 'España', '+34 669 901 627', 'miguelsanchez@ambularte.com', 'hombre9.jpg', 1),
(15, 'Nicolás', 'Pinilla', 'prefiero no decirlo', '1999-04-26', NULL, 'Rue Marc Porta, 23 Puerta 0', 'Bruselas', '19374', 'Bélgica', '+34 629 91 24 19', 'nicolaspinilla@ambularte.com', 'hombre10.jpg', 1),
(16, 'Josa', 'Aller', 'mujer', '1995-12-12', NULL, 'Rue Beatrix, 7', 'Marsella', '62849', 'Francia', '+34707769453', 'josaaller@ambularte.com', 'mujer5.jpg', 1),
(17, 'Anna', 'Müller', 'mujer', '1961-10-03', NULL, 'Strasse Mark Losa, 148', 'Viena', '70143', 'Austria', '+34834 957 885', 'annamuller@ambularte.com', 'mujer4.jpg', 1),
(18, 'José', 'Gual', 'hombre', '1957-08-04', NULL, 'Rue Angels Varda, 83 Piso 9, 43524', 'París', '82400', 'Francia', '+34714271094', 'josegual@ambularte.com', 'hombre5.jpg', 1),
(19, 'Magali', 'Paçao', 'mujer', '1998-11-22', NULL, 'Rue de Candelario, 52', 'Lisboa', '86774', 'Portugal', '+34736499091', 'magalipacao@ambularte.com', 'mujer3.jpg', 1),
(20, 'Bettie', 'Pret', 'mujer', '2005-03-07', NULL, 'Rue Chaplin, 27 Puerta 3', 'Lyon', '21024', 'Francia', '+34749471746', 'bettiepret@ambularte.com', 'mujer9.jpg', 0);

--
-- Volcado de datos para la tabla categorias
--

INSERT INTO categorias (idCategoria, nombre, descripcion, imagen) VALUES
(1, 'Abstracto', 'Ideas, emociones y formas libres', 'abstracto.jpg'),
(2, 'Urbano', 'Vida de la ciudad: la calle y la cultura popular', 'urbano.jpg'),
(3, 'Realismo', 'Atención al detalle y fidelidad visual', 'realismo.jpg'),
(4, 'Minimalismo', 'Belleza en la simplicidad, arte con pocos elementos', 'minimalismo.jpg'),
(5, 'Dadaísmo', 'Azar, desafío de la lógica y la razón, ruptura de toda regla', 'dadaismo.jpg'),
(6, 'Conceptual', 'El enfoque está en la idea detrás de la obra, más que en su aspecto visual', 'conceptual.jpg');

--
-- Volcado de datos para la tabla coleccionistas
--

INSERT INTO coleccionistas (idColeccionista, nombre, apellidos, genero, direccion, ciudad, codigoPostal, pais, telefono, email, imagen, activo) VALUES
(21, 'Enar', 'Niklen', 'hombre', 'Strss Ivar Galder 19 Apt. 78', 'Oslo', '65512', 'Noruega', '+34 736 74 68 07', 'enarniklen@ambularte.com', 'hombre3.jpg', 1),
(22, 'Ana', 'Ballester', 'mujer', 'Pasage du Martirio, 94 Apt. 47', 'Rotterdam', '86131', 'Países Bajos', '+34731 274 846', 'anaballester@ambularte.com', 'mujer11.jpg', 1),
(23, 'Fausto', 'Pla', 'hombre', 'Rue Setúbal', 'Lisboa', '55886', 'Portugal', '+34735 339 636', 'faustopla@ambularte.com', 'hombre6.jpg', 1),
(24, 'Edmundo', 'Vallés', 'hombre', 'Vie Carlos Saura, 3', 'Bruselas', '15865', 'Bélgica', '+34978 09 13 43', 'edmundovalles@ambularte.com', 'hombre10.jpg', 1),
(25, 'Shelby', 'Olsen', 'no binario', 'Strass Gyda, 42 Puerta 6', 'Oslo', '92374', 'Noruega', '+34734 074 821', 'shelbyolsen@ambularte.com', 'mujer6.jpg', 1);


--
-- Volcado de datos para la tabla galerias
--

INSERT INTO galerias (idGaleria, nombre, direccion, ciudad, codigoPostal, pais, telefono, email, metrosCuadrados, imagen, activo) VALUES
(26, 'Maruja Mayo', 'Vie Jordi Pizarro, 559 Puerta 4', 'Bruselas', '43953', 'Bélgica', '+34939 42 10 47', 'marujamayo@ambularte.com', 133, 'galeria1.jpg', 1),
(27, 'Frida Khalo', 'Callejón Xiomara Tirado, 25 Piso 1', 'Madrid', '48175', 'España', '+34714 96 51 37', 'fridakhalo@ambularte.com', 58, 'galeria2.jpg', 1),
(28, 'Giorgia OKeeffe', 'Via de Cleto Guitart 826 Piso', 'Rotterdam', '05377', 'Países Bajos', '+34 651585064', 'giorgiaokeeffe@ambularte.com', 118, 'galeria3.jpg', 1),
(29, 'Artemisia Gentileschi', 'Rue Inocencio Guijarro, 25', 'París', '05395', 'Francia', '+34 824 026 811', 'agentileschi@ambularte.com', 195, 'galeria4.jpg', 1),
(30, 'Mary Cassatt', 'Pasage Fernanda Anguita, 8', 'Ámsterdam', '12499', 'Países Bajos', '+34715698478', 'marycassatt@ambularte.com', 177, 'galeria5.jpg', 1),
(31, 'Yayoi Kusama', 'Pasaje de Sabas Ricart 6 Piso 5', 'Estocolmo', '15280', 'Suecia', '+34738851656', 'yayoikusama@ambularte.com', 86, 'galeria6.jpg', 1);


--
-- Volcado de datos para la tabla obras
--

INSERT INTO obras (idObra, nombre, anio, tipo, tecnica, dimensiones, precioVenta, vendida, imagen, idCategoria, idArtista) VALUES
(1, 'Tótem de Cedro', 1985, 'escultura', 'madera tallada', '41x126 cm', 947.61, 0, 'escultura15.jpg', 4, 1),
(2, 'Sombras del Tiempo', 2004, 'fotografía', 'análoga', '81x76 cm', 2583.55, 0, 'fotografia1.jpg', 5, 1),
(3, 'Luz entre Pigmentos', 1999, 'pintura', 'óleo sobre lienzo', '50x131 cm', 6964.57, 0, 'oleo7.jpg', 6, 1),
(4, 'Caleidoscopio Urbano', 2010, 'pintura', 'acrílico', '106x89 cm', 5526.59, 1, 'acrilico1.jpg', 4, 1),
(5, 'Paisaje de Primavera', 2024, 'pintura', 'acuarela', '44x117 cm', 8905.49, 0, 'acuarela2.jpg', 6, 2),
(6, 'Retrato Analógico', 2000, 'fotografía', 'análoga', '67x85 cm', 2002.50, 0, 'fotografia2.jpg', 1, 2),
(7, 'Ríos del Recuerdo', 2002, 'pintura', 'acuarela', '63x94 cm', 7738.64, 0, 'acuarela5.jpg', 6, 2),
(8, 'Cascada Cromática', 2005, 'pintura', 'acuarela', '137x111 cm', 5322.80, 0, 'acuarela6.jpg', 3, 2),
(9, 'Escultura del Silencio', 2006, 'escultura', 'mármol', '127x50 cm', 5624.10, 0, 'escultura2.jpg', 3, 3),
(10, 'Ecos del Mar', 2007, 'pintura', 'acuarela', '92x32 cm', 1562.74, 0, 'acuarela8.jpg', 3, 3),
(11, 'Retrato Borroso', 2008, 'fotografía', 'análoga', '37x60 cm', 8841.09, 1, 'fotografia3.jpg', 2, 3),
(12, 'Colores de la Memoria', 2009, 'pintura', 'óleo sobre lienzo', '92x134 cm', 1157.52, 0, 'oleo2.webp', 6, 3),
(13, 'Forma y Piedra', 2010, 'escultura', 'mármol', '90x100 cm', 2068.71, 0, 'escultura3.jpg', 6, 4),
(14, 'Líneas del Tiempo', 2000, 'dibujo', 'carboncillo', '126x123 cm', 7053.74, 0, 'dibujo1.jpg', 5, 4),
(15, 'Recuerdo Fugaz', 2001, 'fotografía', 'análoga', '113x77 cm', 4661.95, 0, 'fotografia4.jpg', 6, 4),
(16, 'Trama Interior', 2011, 'dibujo', 'acuarela', '58x38 cm', 3711.81, 0, 'dibujo2.jpg', 2, 4),
(17, 'Raíces Talladas', 2012, 'escultura', 'hierro', '30x39 cm', 7224.49, 1, 'escultura4.jpg', 2, 5),
(18, 'Ventanas al Alma', 2013, 'pintura', 'óleo sobre lienzo', '145x34 cm', 8666.54, 0, 'oleo1.jpeg', 1, 5),
(19, 'Acuarela Nocturna', 2014, 'pintura', 'acuarela', '65x115 cm', 5111.44, 0, 'acuarela7.jpg', 2, 5),
(20, 'Silencio 2019', 2020, 'escultura', 'yeso', '103x90 cm', 2808.47, 0, 'escultura5.jpg', 5, 5),
(21, 'Boceto de Sombras', 2016, 'dibujo', 'carboncillo', '42x42 cm', 6760.34, 0, 'dibujo3.jpg', 2, 6),
(22, 'Instante Fugaz', 2017, 'fotografía', 'análoga', '89x140 cm', 7426.22, 0, 'fotografia5.jpg', 4, 6),
(23, 'Vibraciones del Color', 2018, 'pintura', 'óleo sobre lienzo', '123x73 cm', 8105.63, 0, 'oleo5.jpg', 4, 6),
(24, 'Horizonte de Color', 2019, 'pintura', 'óleo sobre lienzo', '54x98 cm', 4761.83, 0, 'oleo4.jpg', 2, 6),
(25, 'Dibujo de Infancia', 2020, 'dibujo', 'acuarela', '89x61 cm', 8807.62, 0, 'dibujo4.jpg', 3, 7),
(26, 'Color Abstracto', 2021, 'pintura', 'acrílico', '140x139 cm', 5728.09, 0, 'acrilico2.jpg', 1, 7),
(27, 'Reflejos en Acuarela', 2022, 'pintura', 'acuarela', '137x31 cm', 9705.46, 0, 'acuarela1.jpg', 5, 7),
(28, 'Mármol Vivo', 2023, 'escultura', 'mármol', '92x91 cm', 2530.60, 0, 'escultura18.jpg', 4, 7),
(29, 'Estudio de Miradas', 2023, 'dibujo', 'acuarela', '78x30 cm', 9860.43, 1, 'dibujo5.jpg', 2, 8),
(30, 'Captura Analógica', 2022, 'fotografía', 'análoga', '84x119 cm', 9594.52, 1, 'fotografia6.jpg', 3, 8),
(31, 'Boceto Clásico', 2021, 'dibujo', 'tinta', '67x57 cm', 9702.74, 0, 'dibujo6.jpg', 2, 8),
(32, 'Paisaje Silente', 2013, 'pintura', 'acuarela', '37x36 cm', 6049.69, 0, 'acuarela3.jpg', 3, 8),
(33, 'Rostro en Piedra', 2018, 'escultura', 'mármol', '40x138 cm', 2265.34, 1, 'escultura7.jpg', 5, 9),
(34, 'Amanecer en Acuarela', 2024, 'pintura', 'acuarela', '60x81 cm', 1638.92, 0, 'acuarela4.jpeg', 1, 9),
(35, 'Naturaleza en Cedro', 2025, 'escultura', 'madera tallada', '35x109 cm', 1278.84, 0, 'escultura8.jpg', 5, 9),
(36, 'Retrato Desenfocado', 2020, 'fotografía', 'análoga', '115x121 cm', 3484.75, 0, 'fotografia7.jpg', 2, 9),
(37, 'Ecos de la Ciudad', 2021, 'fotografía', 'análoga', '115x112 cm', 3349.97, 0, 'fotografia21.jpg', 2, 10),
(38, 'Texturas Modernas', 2022, 'fotografía', 'digital', '88x109 cm', 9985.32, 0, 'fotografia9.jpg', 1, 10),
(39, 'Cuerpos de Óleo', 2023, 'pintura', 'óleo sobre lienzo', '57x94 cm', 3019.40, 0, 'oleo6.jpg', 5, 10),
(40, 'Códigos Pixelados', 2024, 'fotografía', 'digital', '77x66 cm', 1998.59, 1, 'fotografia10.jpg', 2, 10),
(41, 'Arquitectura Digital', 2025, 'fotografía', 'digital', '134x100 cm', 3344.10, 0, 'fotografia11.jpg', 6, 11),
(42, 'Reflejos Análogos', 2022, 'fotografía', 'análoga', '38x128 cm', 8471.99, 0, 'fotografia12.jpg', 2, 15),
(43, 'Composición Desenfocada', 2023, 'fotografía', 'digital', '90x130 cm', 5347.11, 0, 'fotografia26.jpg', 2, 15),
(44, 'Esencia del tiempo', 2024, 'escultura', 'yeso', '50x90 cm', 6784.33, 0, 'escultura9.jpg', 1, 15),
(45, 'Sueño de Tinta', 2020, 'dibujo', 'acuarela', '60x95 cm', 3450.78, 0, 'dibujo7.jpg', 2, 11),
(46, 'Frontera Abstracta', 2021, 'pintura', 'acrílico', '115x134 cm', 7560.44, 0, 'acrilico3.jpg', 4, 11),
(47, 'Amanecer sobre Mármol', 2022, 'escultura', 'mármol', '99x87 cm', 6782.26, 0, 'escultura17.jpg', 5, 15),
(48, 'Perspectiva Incógnita', 2023, 'fotografía', 'digital', '110x93 cm', 4983.11, 0, 'fotografia14.jpg', 2, 15),
(49, 'Impresiones Analógicas', 2024, 'fotografía', 'análoga', '95x85 cm', 6239.57, 0, 'fotografia15.jpg', 6, 15),
(50, 'Paisaje de Lienzo', 2025, 'pintura', 'óleo sobre lienzo', '130x97 cm', 7345.00, 0, 'oleo3.jpg', 1, 15),
(51, 'Formas Forjadas', 2023, 'escultura', 'hierro', '75x80 cm', 5673.44, 0, 'escultura11.jpg', 2, 15);


--
-- Volcado de datos para la tabla exposiciones
--

INSERT INTO exposiciones (idExposicion, nombre, zona, idGaleria) VALUES
(1, 'El Grito de lo Interior', 'Sala Este', 26),
(2, 'Colores de la Memoria', 'Galería Norte', 26),
(3, 'Abstracción y Silencio', 'Planta Alta', 31),
(4, 'Geometrías del Viento', 'Espacio Abstracto', 31),
(5, 'Ideas en el Límite', 'Nivel Subterráneo', 29),
(6, 'La Forma del Pensamiento', 'Planta Baja', 29);

--
-- Volcado de datos para la tabla obras_exposicion
--

INSERT INTO obras_exposicion (idObra, idExposicion, fechaInicio, fechaFin) VALUES
(1, 1, '2025-06-01', '2025-06-30'),
(1, 5, '2025-10-10', '2025-11-01'),
(2, 1, '2025-06-01', '2025-06-30'),
(2, 5, '2025-10-10', '2025-11-01'),
(3, 1, '2025-06-01', '2025-06-30'),
(3, 5, '2025-10-10', '2025-11-01'),
(4, 1, '2025-06-01', '2025-06-30'),
(4, 5, '2025-10-10', '2025-11-01'),
(5, 1, '2025-06-01', '2025-06-30'),
(5, 5, '2025-10-10', '2025-11-01'),
(6, 1, '2025-06-01', '2025-06-30'),
(6, 5, '2025-10-10', '2025-11-01'),
(7, 1, '2025-06-01', '2025-06-30'),
(7, 5, '2025-10-10', '2025-11-01'),
(8, 1, '2025-06-01', '2025-06-30'),
(8, 5, '2025-10-10', '2025-11-01'),
(9, 1, '2025-06-01', '2025-06-30'),
(9, 5, '2025-10-10', '2025-11-01'),
(10, 1, '2025-06-01', '2025-06-30'),
(10, 5, '2025-10-10', '2025-11-01'),
(11, 2, '2025-07-05', '2025-08-01'),
(11, 6, '2025-11-10', '2025-12-01'),
(12, 2, '2025-07-05', '2025-08-01'),
(12, 6, '2025-11-10', '2025-12-01'),
(13, 2, '2025-07-05', '2025-08-01'),
(13, 6, '2025-11-10', '2025-12-01'),
(14, 2, '2025-07-05', '2025-08-01'),
(14, 6, '2025-11-10', '2025-12-01'),
(15, 2, '2025-07-05', '2025-08-01'),
(15, 6, '2025-11-10', '2025-12-01'),
(16, 2, '2025-07-05', '2025-08-01'),
(16, 6, '2025-11-10', '2025-12-01'),
(17, 2, '2025-07-05', '2025-08-01'),
(17, 6, '2025-11-10', '2025-12-01'),
(18, 2, '2025-07-05', '2025-08-01'),
(18, 6, '2025-11-10', '2025-12-01'),
(19, 2, '2025-07-05', '2025-08-01'),
(19, 6, '2025-11-10', '2025-12-01'),
(20, 2, '2025-07-05', '2025-08-01'),
(20, 6, '2025-11-10', '2025-12-01'),
(21, 3, '2025-08-10', '2025-09-05'),
(22, 3, '2025-08-10', '2025-09-05'),
(23, 3, '2025-08-10', '2025-09-05'),
(24, 3, '2025-08-10', '2025-09-05'),
(25, 3, '2025-08-10', '2025-09-05'),
(26, 3, '2025-08-10', '2025-09-05'),
(27, 3, '2025-08-10', '2025-09-05'),
(28, 3, '2025-08-10', '2025-09-05'),
(29, 3, '2025-08-10', '2025-09-05'),
(30, 3, '2025-08-10', '2025-09-05'),
(31, 4, '2025-09-10', '2025-10-01'),
(32, 4, '2025-09-10', '2025-10-01'),
(33, 4, '2025-09-10', '2025-10-01'),
(34, 4, '2025-09-10', '2025-10-01'),
(35, 4, '2025-09-10', '2025-10-01'),
(36, 4, '2025-09-10', '2025-10-01'),
(37, 4, '2025-09-10', '2025-10-01'),
(38, 4, '2025-09-10', '2025-10-01'),
(39, 4, '2025-09-10', '2025-10-01'),
(40, 4, '2025-09-10', '2025-10-01');

--
-- Volcado de datos para la tabla pedidos
--

INSERT INTO pedidos (idPedido, fechaPedido, fechaEntrega, total, metodoPago, pagado, idColeccionista) VALUES
(1, '2025-01-27', '2025-02-01', '1500.00', 'tarjeta', 1, 24),
(2, '2025-02-24', '2025-03-01', '2300.00', 'transferencia', 0, 24),
(3, '2024-08-04', '2024-08-10', '3100.00', 'bizum', 1, 25),
(4, '2024-12-03', '2024-12-10', '1250.00', 'tarjeta', 0, 23),
(5, '2024-12-28', '2025-01-05', '1800.00', 'transferencia', 1, 23),
(6, '2025-06-06', NULL, '11593.11', 'transferencia', 1, 24);

--
-- Volcado de datos para la tabla detallesPedidos
--

INSERT INTO detallesPedidos (idPedido, idObra, precioObra, observaciones) VALUES
(2, 17, 7224.49, NULL),
(3, 4, 5526.59, NULL),
(3, 11, 8841.09, 'Cliente habitual'),
(5, 29, 8841.09, NULL),
(5, 33, 2265.34, 'Solicita factura'),
(6, 30, 9594.52, ''),
(6, 40, 1998.59, '');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
