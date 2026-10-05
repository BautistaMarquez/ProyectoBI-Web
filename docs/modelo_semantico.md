# MODELO SEMÁNTICO - GESTIÓN DE OBRAS Y EXPEDIENTES

## TABLAS Y COLUMNAS

### Tabla: TablaObras
- Columna: Source.Name (String)
- Columna: OBRA O PROCESO (String)
- Columna: TIPO (String)
- Columna: Dirección Responsable (String)
- Columna: Firma de Contrato (DateTime)
- Columna: Inicio (DateTime)
- Columna: ESTADO (String)
- Columna: Contratista (String)
- Columna: Nombre Completo de la Obra (String)
- Columna: % DE AL (Int64)
- Columna: SUBESTADO (String)
- Columna Calculada: PrestamoYObra (String) -> DAX: TablaObras[Source.Name] & "_" & TablaObras[OBRA o PROCESO]
- Columna Calculada: NombreID (String) [PK] -> DAX: CONCATENATE(TablaObras[Source.Name], TablaObras[OBRA O PROCESO])

### Tabla: TablaDatos (Hechos / Facturaciones y Pagos)
- Columna: Source.Name (String)
- Columna: OBRA o PROCESO (String)
- Columna: TIPO DE CERTIFICADO PAGO (Int64)
- Columna: Cert o Aj. o informe (String)
- Columna: Mes (DateTime)
- Columna: PAGO Numero Factura (String)
- Columna: CERTIFICADO Monto Certificado (Decimal)
- Columna: CERTIFICADO monto a pagar / facturar (Decimal)
- Columna: Tipo (String)
- Columna: PAGO Expediente de Pago (String)
- Columna: ENTRADA a DAFyMP (DateTime)
- Columna: Fecha Caratulacion ee (DateTime)
- Columna: S.F. NRO de SF (String)
- Columna: S.F. FECHA (DateTime)
- Columna: MONTO FINANCIADO (Decimal)
- Columna: PAGO fecha de pago (DateTime)
- Columna: PAGO Tipo de cambio (Decimal)
- Columna: MONTO PAGADO (USD) (Decimal)
- Columna: MONTO FINANCIADO (USD) (Decimal)
- Columna: NUM OP (String)
- Columna: AÑO OP (String)
- Columna Calculada: NombreID (String) [FK] -> DAX: CONCATENATE(TablaDatos[Source.Name], TablaDatos[OBRA O PROCESO])
- Columna Calculada: PrestamoYObra (String) -> DAX: TablaDatos[Source.Name] & "_" & TablaDatos[OBRA o PROCESO]
- Columna Calculada: Prestamo (String) -> DAX:
  SWITCH(
      'TablaDatos'[Source.Name],
      "2 - TABLERO CAF 10059.xlsx", "CAF 10059",
      "TABLERO 3256.xlsx", "BID 3256",
      "TABLERO BID 4427.xlsx", "BID 4427",
      "TABLERO BID 4435.xlsx", "BID 4435",
      "TABLERO BIRF 8736.xlsx", "BIRF 8736",
      "TABLERO CAF 10061.xlsx", "CAF 10061",
      "TABLERO CAF 10209.xlsx", "CAF 10209",
      "TABLERO CAF 11189.xlsx", "CAF 11189",
      "TABLERO CAF 11342 2.xlsx", "CAF 11342",
      "TABLERO CAF 11346.xlsx", "CAF 11346",
      "DESCONOCIDO"
  )
- Columna Calculada: Dias de proceso (Int64) -> DAX:
  IF(('TablaDatos'[PAGO fecha de pago] && 'TablaDatos'[ENTRADA a DAFyMP] > DATE(2025, 10, 1)),
      DATEDIFF('TablaDatos'[Fecha Caratulacion ee], ('TablaDatos'[PAGO fecha de pago]), DAY),
      BLANK()
  )
- Columna Calculada: Dias en tramitacion (Int64) -> DAX:
  IF(ISBLANK('TablaDatos'[PAGO fecha de pago]) && 'TablaDatos'[ENTRADA a DAFyMP] > DATE(2025, 10, 1),
      DATEDIFF('TablaDatos'[ENTRADA a DAFyMP], TODAY(), DAY),
      BLANK()
  )
- Columna Calculada: Dias de tramitacion (Int64) -> DAX:
  IF(('TablaDatos'[PAGO fecha de pago] && 'TablaDatos'[ENTRADA a DAFyMP] > DATE(2025, 10, 1)),
      DATEDIFF('TablaDatos'[ENTRADA a DAFyMP], ('TablaDatos'[PAGO fecha de pago]), DAY),
      BLANK()
  )
- Columna Calculada: Nombre_ee (String) -> DAX:
  VAR ExpedienteActual = 'TablaDatos'[PAGO Expediente de Pago]
  RETURN
  CALCULATE(
      CONCATENATEX(VALUES('TablaDatos'[Cert o Aj. o informe]), 'TablaDatos'[Cert o Aj. o informe], ", "),
      ALL('TablaDatos'),
      'TablaDatos'[PAGO Expediente de Pago] = ExpedienteActual
  )
- Columna Calculada: Nombre_ee_principal (String) -> DAX:
  VAR ExpedienteActual = 'TablaDatos'[PAGO Expediente de Pago]
  RETURN
  CALCULATE(
      CONCATENATEX(VALUES('TablaDatos'[Cert o Aj. o informe]), 'TablaDatos'[Cert o Aj. o informe], ", "),
      ALL('TablaDatos'),
      'TablaDatos'[PAGO Expediente de Pago] = ExpedienteActual,
      'TablaDatos'[TIPO DE CERTIFICADO PAGO] IN {0, 1, 4, 5, 7, 8, 10}
  )
- Columna Calculada: Fecha_ee (String) -> DAX:
  FORMAT(
      CALCULATE(MAX('TablaDatos'[Mes]), FILTER('TablaDatos', 'TablaDatos'[PAGO Expediente de Pago] = EARLIER('TablaDatos'[PAGO Expediente de Pago]))),
      "MM/yyyy"
  )
- Columna Calculada: Monto Local USD (Decimal) -> DAX: TablaDatos[MONTO PAGADO (USD)] - TablaDatos[MONTO FINANCIADO (USD)]
- Columna Calculada: Suma por Expediente (Decimal) -> DAX:
  CALCULATE(SUM('TablaDatos'[CERTIFICADO monto a pagar / facturar]), ALLEXCEPT('TablaDatos', 'TablaDatos'[PAGO Expediente de Pago]))
- Columna Calculada: Suma por Expediente USD (Decimal) -> DAX:
  CALCULATE(SUM('TablaDatos'[MONTO PAGADO (USD)]), ALLEXCEPT('TablaDatos', 'TablaDatos'[PAGO Expediente de Pago]))
- Columna Calculada: Certificado por Expediente (Decimal) -> DAX:
  CALCULATE(SUM('TablaDatos'[CERTIFICADO Monto Certificado]), ALLEXCEPT('TablaDatos', 'TablaDatos'[PAGO Expediente de Pago]))
- Columna Calculada: Ranking Expediente (Int64) -> DAX:
  VAR vExpediente = 'TablaDatos'[PAGO Expediente de Pago]
  RETURN
  RANKX(FILTER(ALL('TablaDatos'), 'TablaDatos'[PAGO Expediente de Pago] = vExpediente), 'TablaDatos'[ENTRADA a DAFyMP], , ASC, DENSE)
- Columna Calculada: Plazo en dias (Int64) -> DAX:
  VAR vFechaInicio = TablaDatos[Fecha Caratulacion ee]
  VAR vFechaFinReal = TablaDatos[PAGO fecha de pago]
  VAR vFechaFinEfectiva = COALESCE(vFechaFinReal, TODAY())
  RETURN
  IF(ISBLANK(vFechaInicio), BLANK(), INT(vFechaFinEfectiva - vFechaInicio))
- Columna Calculada: Orden_FechaPago (DateTime) -> DAX:
  IF(ISBLANK('TablaDatos'[PAGO fecha de pago]), DATE(9999, 12, 31), 'TablaDatos'[PAGO fecha de pago])

### Tabla: TablaPlazos
- Columna: Source.Name (String)
- Columna: OBRA O PROCESO (String)
- Columna: TIPO (String)
- Columna: NEUTRALIZADO DESDE (DateTime)
- Columna: NEUTRALIZADO HASTA (DateTime)
- Columna: PLAZO EN DIAS (Int64)
- Columna: FECHA (DateTime)
- Columna Calculada: NombreID (String) [FK] -> DAX: CONCATENATE(TablaPlazos[Source.Name], TablaPlazos[OBRA O PROCESO])
- Columna Calculada: Total Días Plazo (Int64) -> DAX:
  VAR ObraActual = 'TablaPlazos'[NombreID]
  RETURN
  CALCULATE(SUM('TablaPlazos'[PLAZO EN DIAS]), ALL('TablaPlazos'), 'TablaPlazos'[NombreID] = ObraActual)
- Columna Calculada: Fecha Fin (DateTime) -> DAX: RELATED(TablaObras[Inicio]) + TablaPlazos[Total Días Plazo]
- Columna Calculada: Estado de Obra (String) -> DAX:
  VAR ObraActual = 'TablaPlazos'[OBRA O PROCESO]
  VAR FechaHoy = TODAY()
  VAR EstaNeutralizada =
      CALCULATE(
          COUNTROWS('TablaPlazos'),
          ALL('TablaPlazos'),
          'TablaPlazos'[OBRA O PROCESO] = ObraActual,
          'TablaPlazos'[NEUTRALIZADO DESDE] <= FechaHoy,
          'TablaPlazos'[NEUTRALIZADO HASTA] >= FechaHoy
      ) > 0
  VAR UltimaFechaFin =
      CALCULATE(MAX('TablaPlazos'[Fecha Fin]), ALL('TablaPlazos'), 'TablaPlazos'[OBRA O PROCESO] = ObraActual)
  RETURN
  IF(EstaNeutralizada, "Neutralizada", IF(FechaHoy <= UltimaFechaFin, "En ejecución", "Sin Plazo"))

### Tabla: TablaContratos
- Columna: Source.Name (String)
- Columna: OBRA O PROCESO (String)
- Columna: FECHA (DateTime)
- Columna: TIPO (String)
- Columna: MONTO (Decimal)
- Columna: CONTRATO DOLARIZADO (Decimal)
- Columna Calculada: NombreID (String) [FK] -> DAX: CONCATENATE(TablaContratos[Source.Name], TablaContratos[OBRA O PROCESO])

### Tabla: Filtro
- Columna: Filtro (Int64)

---

## RELACIONES (MODELO EN ESTRELLA / RELACIONAL)

- TablaContratos[NombreID] (Many) ---> (One) TablaObras[NombreID] [Activa: True]
- TablaPlazos[NombreID]    (Many) ---> (One) TablaObras[NombreID] [Activa: True]
- TablaDatos[NombreID]     (Many) ---> (One) TablaObras[NombreID] [Activa: True]

> **Nota de Arquitectura:** `TablaObras` opera como la dimensión central/maestra mediante la clave `NombreID` (`Source.Name` + `OBRA O PROCESO`), relacionando a `TablaDatos`, `TablaPlazos` y `TablaContratos`.

---

## MEDIDAS DAX ANALÍTICAS

- **[Total de Filas]** ('TablaDatos') =
  COUNTROWS('TablaDatos')

- **[Expedientes Tramitados]** ('TablaDatos') =
  DISTINCTCOUNT('TablaDatos'[PAGO Expediente de Pago])

- **[Monto Total Base]** ('TablaDatos') =
  CALCULATE(
      SUM('TablaDatos'[CERTIFICADO Monto Certificado]),
      'TablaDatos'[TIPO DE CERTIFICADO PAGO] = 0 || 'TablaDatos'[TIPO DE CERTIFICADO PAGO] = 1
  )

- **[Monto Total Rdt]** ('TablaDatos') =
  CALCULATE(
      SUM('TablaDatos'[CERTIFICADO Monto Certificado]),
      'TablaDatos'[TIPO DE CERTIFICADO PAGO] IN {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}
  )

- **[Promedio Plazos]** ('TablaDatos') =
  CALCULATE(
      AVERAGE('TablaDatos'[Dias de tramitacion]),
      'TablaDatos'[Dias de tramitacion] > 0
  )

- **[Ranking_Dinámico]** ('TablaDatos') =
  RANKX(
      ALLSELECTED('TablaDatos'),
      CALCULATE(MAX('TablaDatos'[Dias en tramitacion])),
      ,
      DESC,
      Dense
  )

- **[Filtro_TablaExpedientes]** ('TablaDatos') =
  VAR LimiteSeleccionado = [Valor de Filtro]
  VAR PosicionActual = [Ranking_Dinámico]
  RETURN
  IF(PosicionActual <= LimiteSeleccionado, 1, 0)

- **[Valor de Filtro]** ('Filtro') =
  SELECTEDVALUE('Filtro'[Filtro])

- **[Medida % Avance]** ('TablaContratos') =
  VAR CertificadosValidos =
      CALCULATE(
          SUM(TablaDatos[CERTIFICADO Monto Certificado]),
          TablaDatos[TIPO DE CERTIFICADO PAGO] = 1
      )
  VAR TotalContratoBase =
      CALCULATE(
          SUM('TablaContratos'[MONTO]),
          'TablaContratos'[TIPO] = "ORIGINAL"
      )
  RETURN
  DIVIDE(CertificadosValidos, TotalContratoBase, 0)