CREATE DATABASE FitFlow;
USE FitFlow;

-- ============================
-- TABLA ADMINISTRADORES
-- ============================

CREATE TABLE administradores (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rol ENUM('dueno','empleado') NOT NULL,
    password VARCHAR(255) NOT NULL,
    edad INT,
    sexo ENUM('hombre','mujer'),
    direccion VARCHAR(255),
    foto VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLA CLIENTES
-- ============================

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    sexo ENUM('hombre','mujer') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    creado_por INT,
    FOREIGN KEY (creado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- TABLA CLASES
-- ============================

CREATE TABLE clases (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    tipo_pago ENUM('mes','medio_mes','clase','dia') NOT NULL,
    creado_por INT,
    FOREIGN KEY (creado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- HORARIOS DE CLASES
-- ============================

CREATE TABLE horarios_clase (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_clase INT NOT NULL,
    horario VARCHAR(100),
    FOREIGN KEY (id_clase) REFERENCES clases(id_clase) ON DELETE CASCADE
);

-- ============================
-- RELACION CLIENTES - CLASES
-- ============================

CREATE TABLE clientes_clases (
    id_cliente INT,
    id_clase INT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_cliente,id_clase),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_clase) REFERENCES clases(id_clase) ON DELETE CASCADE
);

-- ============================
-- PAGOS DE CLIENTES
-- ============================

CREATE TABLE pagos_clientes (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_clase INT NOT NULL,
    pagado BOOLEAN DEFAULT FALSE,
    fecha_pago DATE,
    importe DECIMAL(10,2),
    registrado_por INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_clase) REFERENCES clases(id_clase) ON DELETE CASCADE,
    FOREIGN KEY (registrado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- MAQUINAS
-- ============================

CREATE TABLE maquinas (
    id_maquina INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    foto VARCHAR(255),
    creado_por INT,
    FOREIGN KEY (creado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- PRODUCTOS
-- ============================

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    descripcion TEXT,
    foto VARCHAR(255)
);

-- ============================
-- COMPRAS (GASTOS)
-- ============================

CREATE TABLE compras_productos (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (registrado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- VENTAS (INGRESOS)
-- ============================

CREATE TABLE ventas_productos (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (registrado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- INGRESOS EXTRA
-- ============================

CREATE TABLE ingresos_extra (
    id_ingreso INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(255),
    cantidad DECIMAL(10,2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT,
    FOREIGN KEY (registrado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- GASTOS EXTRA
-- ============================

CREATE TABLE gastos_extra (
    id_gasto INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(255),
    cantidad DECIMAL(10,2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT,
    FOREIGN KEY (registrado_por) REFERENCES administradores(id_admin)
);

-- ============================
-- AUDITORIA DE OPERACIONES
-- ============================

CREATE TABLE auditoria (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_admin INT,
    modulo VARCHAR(100),
    accion VARCHAR(255),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_admin) REFERENCES administradores(id_admin)
);