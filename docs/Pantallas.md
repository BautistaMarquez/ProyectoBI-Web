**### Pantalla \[1]: \[Inicio]**

\- \*\*Objetivo de negocio:\*\* \[Pantalla de inicio de la web esta debe ser la presentacion por lo cual debe ser estetica y debe poseer los links al resto de pantallas]

\- \*\*Tarjetas superiores:\*\*

&#x20; - Se podrian definir los links en un estilo de tarjetas con el nombre de cada pantalla y que al clikear rediriga a la pantalla selecionada. (Todas las pantallas deben tener un boton para volver a esta pantalla)



**### Pantalla \[2]: \[Total certifcados devengados (pagados + pendientes)]**

\- \*\*Objetivo de negocio:\*\* \[Esta pantalla demuestra una comparativa del monto certificado base (TIPO DE CERTIFICADO DE PAGO = 0 o 1) VS Monto Certificado Redeterminado (TIPO DE CERTIFICADO BASE != 0 o 1) de los certificados (lineas de la tablaDatos) con fecha de pago y sin fecha de pago]

\- \*\*KPIs / Tarjetas superiores:\*\*

&#x20; - \[Ej: Monto Certificado Base, Monto Certificado Redeterminado, Total Monto Certificado, Plazo en dias en promedio (Dias de tramitacion)]

\- \*\*Gráficos visuales:\*\*

&#x20; - \[Ej: Gráfico de columnas apilabas con base y redeterminado divididas por prestamo]

\- \*\*Grilla / Tabla de detalle:\*\*

&#x20; - \[Columnas que deben mostrarse en la tabla inferior: Prestamo, Obra, Mes, Expediente de pago, Monto Certificado, Fecha de pago, Nombre\_ee\_principal, contratista]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Direccion Responsable, Año OP, Mes de pago]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]





**### Pantalla \[3]: \[Certificados pagados $]**

\- \*\*Objetivo de negocio:\*\* \[Muestra el monto de los certificados pagados, haciendo comparativa entre el monto base y el monto redeterminado]

\- \*\*KPIs / Tarjetas superiores:\*\*

&#x20; - \[Ej: Monto Certificado Base, Monto Certificado Redeterminado, Total Monto Certificado, Plazo en dias en promedio (Dias de tramitacion)]

\- \*\*Gráficos visuales:\*\*

&#x20; - \[Ej: Gráfico de columnas apilabas con base y redeterminado por direccion responsable (area)]

\- \*\*Grilla / Tabla de detalle:\*\*

&#x20; - \[Columnas que deben mostrarse en la tabla inferior, ej: Prestamo, Obra, Mes, Expediente de pago, Monto Certificado, Fecha de pago, Nombre\_ee\_principal, Contratista]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Prestamo, Año OP, Mes de pago]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]



**### Pantalla \[4]: \[Certificados pagados USD]**

\- \*\*Objetivo de negocio:\*\* \[Muestra el monto de los certificados pagados, haciendo comparativa entre el monto base y el monto redeterminado en USD]

\- \*\*KPIs / Tarjetas superiores:\*\*

&#x20; - \[Ej: Monto Local USD, Monto Financiado (USD), Monto pagado (USD)]

\- \*\*Gráficos visuales:\*\*

&#x20; - \[Ej: Grafico de barras apiladas base y redeterminado por prestamos]

\- \*\*Grilla / Tabla de detalle:\*\*

&#x20; - \[Columnas que deben mostrarse en la tabla inferior, ej: Prestamo, Obra, Mes, Expediente de pago, Monto Facturado, Monto Financiado USD, Monto pagado USD, fecha de pago, Nombre\_ee\_principal, Contratista]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Prestamo, Año OP, Mes de pago]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]



**### Pantalla \[5]: \[EE pendientes de pago FC]**

\- \*\*Objetivo de negocio:\*\* \[Muestra el monto de los certificados sin fecha de pago con Entrada a DAFYMP mayor a Julio de 2025 (de esta forma no tomando expedientes antiguos)]

\- \*\*KPIs / Tarjetas superiores:\*\*

&#x20; - \[Ej: Monto restante de pago (monto a pagar/facturar)]

\- \*\*Gráficos visuales:\*\*

&#x20; - \[Ej: Gráfico de barras con el monto por Direccion responsable]

\- \*\*Grilla / Tabla de detalle:\*\*

&#x20; - \[Columnas que deben mostrarse en la tabla inferior, ej: Entrada a DAFyMP, NroSF, Prestamo, Direccion Responsable, OBRA, Monto pendiente de pago (monto a pagar / facturar), Mes certificado (mes), Expediente de pago, Nombre\_ee\_principal, Contratista]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Prestamo]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]



**### Pantalla \[6]: \[Reporte EE pendientes de pago FC]**

\- \*\*Objetivo de negocio:\*\* \[Esta pantalla muestra en un tabla todos los expedientes pendientes de pago por linea y la idea de esta pantalla es generar un reporte en excel con la tabla que se muestra que contenga toda la informacion de la tabla]

\- \*\*Tabla:\*\*

&#x20; - \[Columnas que deben mostrarse en la tabla inferior, ej: Prestamo, Direccion Responsable (Area), Nombre\_ee\_principal, Nro SF, Mes, Monto pendiente de pago (monto a facturar/pagar), Dias en tramitacion, Contratista]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Direccion Responsable (Area), Prestamo]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]



**### Pantalla \[7]: \[Reporte 2025]**

\- \*\*Objetivo de negocio:\*\* \[Muesrta de forma amplia los montos de 2025]

\- \*\*KPIs / Tarjetas superiores:\*\*

&#x20; - \[Ej: Monto Certificado redeterminado, Monto Certificado Base, Monto certificado total]

\- \*\*Gráficos visuales:\*\*

&#x20; - \[Ej: Gráfico de barras apiladas por monto base y redeterminado por prestamo]

\- \*\*Filtros / Slicers requeridos:\*\*

&#x20; - \[Ej: Mes de pago, Direccion responsable (area)]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]



**### Pantalla \[8]: \[Estado de obra, bienes y servicios]**

\- \*\*Objetivo de negocio:\*\* \[Pantalla que sirve para ver en detalle la informacion de las obras, este posee un selector donde se puede seleccionar una obra y al seleccionar muestra en una tarjeta, OBRA, Subestado, Contratista, Direccion responsable, Avance de obra, Monto del contrato, Monto ejecutado, Fecha de Inicio, Plazo Total, Fecha de fin y ademas muestra una tabla con todos los certificados tramitados en esa obra, la tabla posee: Certificado(Cert o Aj. o informe) , Mes, Plazo en dias (Dias en tramitacion), fecha de pago (pagado o en tramite) y Monto facturado (Suma por expediente)]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras, TablaPlazos o TablaContratos]





**### Pantalla \[9]: \[Comparativa Certificado y pagado]**

\- \*\*Objetivo de negocio:\*\* \[Muestra una comparativa entre lo certificado y lo pagado utilizando un grafico de lineas que muestra la evolucion mes a mes, esta tiene cards que muestran el valor Total certificado y el Total pagado y otro con los expedientres pagados y posee filtros por Prestamo, Año OP, Mes de pago y Direccion responsable (Area)]

\- \*\*Tablas del modelo involucradas:\*\*

&#x20; - \[TablaDatos, TablaObras]





**### "Pantalla" \[10]: \[Detalle EE (**- \*\*Grilla / Tabla de detalle:\*\*)**] => Multiples pantallas (cada una correspondiente a su antecesor)**: La grilla / Tabla de detalle deberia estar debajo en todas las pantallas donde se muestren los expedientes tramitados (la cantidad de expedientes) en vez de ser una pantalla este detalle estaría debajo del grafico con las cards y filtros de cada pantalla la tabla debe contener el total de los montos de las columnas que posean montos, también hay que tener en cuenta que los filtros que afectan a la pagina también afecten a esta tabla, ya que debe mostrar "el detalle" de la información que vemos en el grafico, el detalle seria la información por linea de los expedientes.


Idea de Funcionalidad para definir en el front end, en vez de definir una pantalla para mostrar los montos pagados en USD, podríamos definir un estilo switch que modifique la información que se esta mostrando con los montos en pesos, mostrando la información en USD, modificando grafico, cards y la tabla del detalle con alguna animación para que se vea el "cambio de paradigma".



