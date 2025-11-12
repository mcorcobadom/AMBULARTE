-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 07-06-2025 a las 12:29:55
-- Versión del servidor: 8.0.42-0ubuntu0.24.04.1
-- Versión de PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `AmbulArte`
--
CREATE DATABASE IF NOT EXISTS `AmbulArte` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `AmbulArte`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `artistas`
--

DROP TABLE IF EXISTS `artistas`;
CREATE TABLE IF NOT EXISTS `artistas` (
  `idArtista` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `genero` varchar(20) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `fechaDefuncion` date DEFAULT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `codigoPostal` varchar(20) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idArtista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
CREATE TABLE IF NOT EXISTS `auditoria` (
  `idAuditoria` int NOT NULL AUTO_INCREMENT,
  `nombreTabla` varchar(100) NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE','ERROR') NOT NULL,
  `idRegistro` int DEFAULT NULL,
  `datosAnteriores` text,
  `datosNuevos` text,
  `usuario` varchar(100) DEFAULT NULL,
  `fechaHora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idAuditoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `idCategoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coleccionistas`
--

DROP TABLE IF EXISTS `coleccionistas`;
CREATE TABLE IF NOT EXISTS `coleccionistas` (
  `idColeccionista` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `genero` varchar(20) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `codigoPostal` varchar(20) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idColeccionista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallesPedidos`
--

DROP TABLE IF EXISTS `detallesPedidos`;
CREATE TABLE IF NOT EXISTS `detallesPedidos` (
  `idPedido` int NOT NULL,
  `idObra` int NOT NULL,
  `precioObra` decimal(10,2) NOT NULL,
  `observaciones` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idPedido`,`idObra`),
  KEY `idObra` (`idObra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exposiciones`
--

DROP TABLE IF EXISTS `exposiciones`;
CREATE TABLE IF NOT EXISTS `exposiciones` (
  `idExposicion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `idGaleria` int NOT NULL,
  PRIMARY KEY (`idExposicion`),
  KEY `idGaleria` (`idGaleria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galerias`
--

DROP TABLE IF EXISTS `galerias`;
CREATE TABLE IF NOT EXISTS `galerias` (
  `idGaleria` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `codigoPostal` varchar(20) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `metrosCuadrados` int NOT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idGaleria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
CREATE TABLE IF NOT EXISTS `newsletter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fecha_suscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras`
--

DROP TABLE IF EXISTS `obras`;
CREATE TABLE IF NOT EXISTS `obras` (
  `idObra` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `anio` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `tecnica` varchar(50) NOT NULL,
  `dimensiones` varchar(50) NOT NULL,
  `precioVenta` decimal(10,2) NOT NULL,
  `vendida` tinyint(1) NOT NULL DEFAULT '0',
  `imagen` varchar(100) NOT NULL,
  `idCategoria` int NOT NULL,
  `idArtista` int NOT NULL,
  PRIMARY KEY (`idObra`),
  KEY `idArtista` (`idArtista`),
  KEY `idCategoria` (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_exposicion`
--

DROP TABLE IF EXISTS `obras_exposicion`;
CREATE TABLE IF NOT EXISTS `obras_exposicion` (
  `idObra` int NOT NULL,
  `idExposicion` int NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  PRIMARY KEY (`idObra`,`idExposicion`),
  KEY `idExposicion` (`idExposicion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `fechaPedido` date NOT NULL,
  `fechaEntrega` date DEFAULT NULL,
  `total` varchar(20) NOT NULL,
  `metodoPago` enum('tarjeta','transferencia','bizum') NOT NULL,
  `pagado` tinyint(1) NOT NULL DEFAULT '0',
  `idColeccionista` int NOT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `idColeccionista` (`idColeccionista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `tipo` enum('artista','coleccionista','galeria','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `perfilCompletado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `artistas`
--
ALTER TABLE `artistas`
  ADD CONSTRAINT `artistas_ibfk_1` FOREIGN KEY (`idArtista`) REFERENCES `usuarios` (`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `coleccionistas`
--
ALTER TABLE `coleccionistas`
  ADD CONSTRAINT `coleccionistas_ibfk_1` FOREIGN KEY (`idColeccionista`) REFERENCES `usuarios` (`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `detallesPedidos`
--
ALTER TABLE `detallesPedidos`
  ADD CONSTRAINT `detallesPedidos_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detallesPedidos_ibfk_2` FOREIGN KEY (`idObra`) REFERENCES `obras` (`idObra`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `exposiciones`
--
ALTER TABLE `exposiciones`
  ADD CONSTRAINT `exposiciones_ibfk_1` FOREIGN KEY (`idGaleria`) REFERENCES `galerias` (`idGaleria`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `galerias`
--
ALTER TABLE `galerias`
  ADD CONSTRAINT `galerias_ibfk_1` FOREIGN KEY (`idGaleria`) REFERENCES `usuarios` (`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `obras`
--
ALTER TABLE `obras`
  ADD CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`idArtista`) REFERENCES `artistas` (`idArtista`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`idCategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `obras_exposicion`
--
ALTER TABLE `obras_exposicion`
  ADD CONSTRAINT `obras_exposicion_ibfk_1` FOREIGN KEY (`idObra`) REFERENCES `obras` (`idObra`) ON DELETE CASCADE,
  ADD CONSTRAINT `obras_exposicion_ibfk_2` FOREIGN KEY (`idExposicion`) REFERENCES `exposiciones` (`idExposicion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`idColeccionista`) REFERENCES `coleccionistas` (`idColeccionista`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
