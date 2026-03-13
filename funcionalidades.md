Módulos dentro de la app(FitFlow)

- Clientes
Los clientes son los usuarios que hay físicamente en el gym. El Administrador puede agregar en este módulo los clientes que va teniendo el gimnasio. En primera plana aparecerán los clientes activos y que están en el sistema. El Administrador puede añadir nuevos clientes, eliminar los existentes o cambiar información de ellos. En el formulario de creación de los clientes se va requerir el nombre del cliente, la edad del cliente, sexo del cliente (hombre o mujer). Si un cliente es eliminado se borran todos sus datos de la base de datos. 
El módulo mostrará una tabla con todos los clientes activos con todos los datos de estos, así como la clase o clases que están apuntados y el estado de activo porque estan activos en el sistema.
Este módulo debe mostrar los clientes que hay activos actualmente en el sistema y porcentaje por género y edad en una gráfica.

- Clases
Las clases son las que podemos denominar como zumba, sala de fitness, etc. El Administrador puede añadir clases, eliminar las que existen, cambiar alguna información sobre ellas. Este módulo debe mostrar las clases que hay en el sistema y que el Administrador a ido agregando, etc. Se deberá ver el nombre de la clase, los horarios que hay de esa clase en concreto, una descripción, el precio de la clase concreta, el número de clientes que hay por cada clase. Un cliente puede estar apuntado al menos a una clase o a varias sin restricción.
El formulario de creación de estas clases debe permitir al administrador introducir el nombre de la clase, el precio de la clase, descripción, horarios y poder agregar de una lista de clientes existen dentro del sistema a los que formen parte de esa clase. La descripción y el horario de una clase son datos opcionales, el administrador los agrega si quiere.
El precio se puede poner de varias maneras, por mes, por clase, por medio mes o por día.
En este módulo también habrá unas gráficas estadísticas sobre que clases son las más concurridas con porcentajes y totales, que porcentaje de clientes hombre o mujer hay en cada clase apuntados, porcentaje por edades de las clases. 

- Máquinas
Este módulo lleva las máquinas generalizadas que contiene el gym como por ejemplo hack, prensa, poleas, etc. El Administrador puede agregar, editar o eliminar maquinas. Para el formulario de creación se necesita el nombre de la máquina, descripción de la máquina, foto de la máquina. La descripción de la máquina y la foto son datos opciones que el administrador puede administrar o no.
El módulo debe mostrar todas las máquinas que hay agregadas en el sistema.

- Pagos de los clientes
Este módulo se refiere a los pagos de los clientes por la clase o clases que están apuntados en el sistema. El sistema pone la lista de los clientes filtrada por clases con el estado de que ha pagado o no pagado ese cliente. Los precios de las clases vienen fijados del módulo anterior de clases. Habrá un check en esa lista al lado del nombre del cliente. Si se marca este  check es que esta pagado, si no se marca es que no esta pagado. El check que se marcara como pagado tomara la fecha actual del sistema y tambien mostrara la fecha de cuando fue pagado. Tambien aparecera el importe que el cliente ha pagado. Este modulo tambien debe mostrar un total de todos los importes pagados de todas las clases asi como un importe total desglosado por clases, tambien con una grafica de porcentajes.
El pago de los clientes contara como un Ingreso, por tanto es una cifra positiva +.
- Productos
Este módulo se refiere a los productos que vende el gym, como por ejemplo proteina, creatina, bebida energetica, agua, etc. El Administrador puede agregar, eliminar o cambiar información de ese producto. El formulario debe llevar el nombre del producto, el precio de venta del producto, el stock, una descripcion y una foto. La descripcion y la foto son datos que pueden ser opcionales. Este modulo debe mostrar el precio total por producto (precio producto x stock) asi como el precio total de la suma total de todos los productos. 
El agregar o eliminar un producto se hara mediante estas 2 funcionalidades. Compra para Agregar y Venta para Eliminar un producto. Si quisieramos hacer un Update solo seria de la descripcion del producto, foto y precio.
La funcion Compra agrega un nuevo producto (formulario antes descrito) y cuenta como un gasto para el sistema. Cuenta como gasto porque es proveer de ese producto y aumenta el stock. La compra se realiza a un precio de compra indicado antes. La funcion Venta elimina un producto que exista, no entero sino parte de su stock o entero si se vende todo el stock que hay por supuesto, como una venta normal hasta quedar a 0. La venta cuenta como un ingreso para el sistema. El modulo debe llevar inventario correctamente
El modulo debe tener una seccion de Ingresos por venta y Gastos por compra. 
La seccion de Ingresos por Ventas debe conllevar todas las ventas realizadas de los productos, con el total ingreso por venta, fecha de la venta. La fecha de la venta se tomara como la actual del sistema. Se puede filtrar por fecha o por producto. Como es ingreso es una cifra positiva con +.
La seccion de Gastos por Compras debe conllevar todas las compras de los productos, es decir aumento de stock, con el total gastado por compra, fecha de la compra que sera la actual del sistema. Se puede filtrar por fecha  o producto. Como es un gasto es con cifra negativa con -.
Tabla con Beneficios tomando en cuenta Ingresos – Gastos. Pueden ser beneficios positivos o negativos dependiendo de esa operación.
Tambien debe haber una grafica donde se muestre estadistica de Gasto/Ingreso por producto y porcentajes.

- Economía general
Este módulo depende de otros anteriores mas agregando nuevas funcionalidades/opciones. Tendra en cuenta todas las operaciones realizadas en pagos de clientes y en productos para mantener un balance de situación con ingresos, gastos y beneficios.
Se tomaran en cuenta los ingresos por pagos de los clientes, los ingresos y gastos de los productos y nuevos ingresos y gastos que se pueden agregar aquí.
En ingresos el administrador puede agregar nuevos ingresos mediante un formulario que llevara un concepto y la cifra del ingreso que siempre sera positiva, asi como la fecha actual del sistema. Se pueden filtrar ingresos por fecha.
En gastos el administrador puede agregar nuevos gastos mediante un formulario que llevara concepto y la cifra del gasto que siempre sera negativa, asi como la fecha actual del sistema. Se pueden filtrar gastos por fecha.
Los beneficios seran Ingresos – Gastos, que pueden ser positivos o negativos.
Existira una grafica para mostrar los ingresos/gastos/beneficios por dia, mes y año, en cifras totales y en porcentajes.
Habra una funcionalidad para exportar este analisis de ingresos/gastos/beneficios en formato PDF.

- Administradores
Los administradores serán los encargados de manejar toda esta estructura antes comentada. Existirán dos tipos de administradores, el dueño que sera un superadministrador y los empleados que seran administradores. La diferencia es que el dueño puede borrar a los empleados del sistema pero los empleados no pueden borrar al dueño del sistema ni a otros empleados.
El dueño solo puede ser uno, los empleados 0 o varios. En este modulo deberan aparecer tanto el dueño como los empleados con su nombre y su rol. 
Ademas habra otra funcionalidad. Todas las operaciones auditadas de modulos anteriores llevaran el nombre y apellido del administrador que estaba conectado al sistema en ese momento de realizar la operación. 
Ademas existira una perfil del administrador. Este perfil puede contener una foto del administrador concreto si lo desea, informacion sobre este administrador (edad, sexo, direccion, etc) si lo desea y las operaciones realizadas que esten auditadas en nombre de ese administrador. Puede filtrar estas operaciones por fecha si desea. Este perfil es comun para dueño y empleados con la unica diferencia de que el dueño puede filtrar todas las operaciones auditadas de todos los empleados por nombre de estos empleados y fecha, ademas de las suyas propias.

- Login y Registro
El Registro es simple. Se debera ingresar el nombre del dueño/empleados con apellidos y el rol que lleva acabo, dueño o empleado. Si ya existe un dueño en el registro esta opcion desaparece y solo queda la de empleado. El registro tambien requiere de una contraseña. El login requiere del nombre con los apellidos y la contraseña. La contraseña tendra validaciones(1 mayuscula, 1 numero y 1 simbolo al menos ademas de longitud minima de 8 caracteres). Si fuera el caso de olvido de contraseña habria un Recuperar Contraseña donde se debe introducir el nombre y apellido con una contraseña nueva con repeticion.

- Dashboard
El dashboard simplemente es la pantalla principal donde se muestra un resumen con datos de los demas modulos. Habra una sidebar de navegacion a los diferentes modulos, una navbar donde aparecera el nombre del admininistrador conectado en ese momento con un icono del perfil del admininistrador que puede acceder. Tambien debe aparecer el nombre de la aplicación FitFlow.