# ReversoYa: _«Tu plata de vuelta por ley, sin rogarle al comercio»_

Herramienta LegalTech de acceso a la justicia para **Colombia** que ejecuta la **Reversión de Pago obligatoria ante bancos y pasarelas (PSE, Nequi, Daviplata, tarjetas)**, el **Derecho de Retracto**, la **Garantía Legal en compras online** y la **Compensación por Sobreventa o Cancelación Aérea (RAC 3)**.

🌐 **Aplicación Web (GitHub Pages):** [https://seagomezar.github.io/reversoya/](https://seagomezar.github.io/reversoya/)

---

## 📦 Archivos y Entregables en el Repositorio

| # | Entregable | Archivo en el Repositorio | Enlace Directo |
|---|---|---|---|
| **1** | **Aplicación Web Independiente (Calculadora y Generador de Oficios)** | `index.html` + `app.js` | [Abrir Aplicación](https://seagomezar.github.io/reversoya/index.html) |
| **2** | **Documento Ejecutivo Formal (1 Página A4)** | `ReversoYa_Resumen_Ejecutivo_1Pagina.pdf` / `resumen-ejecutivo-1-pagina.html` | [Descargar PDF](https://seagomezar.github.io/reversoya/ReversoYa_Resumen_Ejecutivo_1Pagina.pdf) |
| **3** | **Presentación de 10 Minutos Estilizada con Artefactos Motion Design** | `presentacion-10-minutos.html` / `ReversoYa_Presentacion_10Minutos.pptx` / `Presentacion_10_Minutos_Speaker_Notes.md` | [Abrir Diapositivas Web](https://seagomezar.github.io/reversoya/presentacion-10-minutos.html) · [Descargar .PPTX](https://seagomezar.github.io/reversoya/ReversoYa_Presentacion_10Minutos.pptx) |
| **4** | **5 Videos de Motion Design (45 s c/u, Código Fuente + Reproductor HTML)** | `videos-motion-graphics.html` + código fuente en `videos/*.js` | [Abrir Reproductor Motion Design](https://seagomezar.github.io/reversoya/videos-motion-graphics.html) |

### Código Fuente de los 5 Videos de Motion Design (`videos/`)
Los 5 videos de 45 segundos están implementados en módulos de código fuente dentro de `videos/` e importados desde `videos-motion-graphics.html` y `presentacion-10-minutos.html`:
- `videos/motion_engine.js`: Motor compartido de renderizado Canvas 2D a 60 FPS y artefactos visuales para diapositivas.
- `videos/video1_problema_colombia.js`: Video 1 (45 s): El Problema en Colombia (370M de pagos digitales y las 4 excusas improcedentes).
- `videos/video2_marco_legal_decreto587.js`: Video 2 (45 s): Marco Constitucional (Arts. 78 y 229 C.P.), Ley 1480/2011 y Decreto 587 de 2016.
- `videos/video3_flujo_4_pantallas.js`: Video 3 (45 s): Solución y Flujo Guiado en 4 Pantallas.
- `videos/video4_casos_y_vuelos_rac3.js`: Video 4 (45 s): Casos Reales y Compensación Aérea RAC 3 (100 % reembolso + 30 % compensación).
- `videos/video5_modelo_negocio_impacto.js`: Video 5 (45 s): Propuesta de Valor, Benchmark en Colombia y Modelo de Negocio ($0 / $19.900 / B2B SaaS).

---

## ⚖️ Marco Normativo (Colombia)

* **Constitución Política de Colombia:** **Art. 78** (protección constitucional al consumidor) y **Art. 229** (acceso efectivo a la administración de justicia).
* **Estándar Internacional:** **Directrices de las Naciones Unidas para la Protección del Consumidor** (Resolución A/RES/70/186).
* **Estatuto del Consumidor (Ley 1480 de 2011):** **Arts. 7 y 8** (garantía legal), **Art. 43** (ineficacia de pleno derecho de cláusulas abusivas), **Art. 47** (retracto en 5 días hábiles en dinero), **Art. 50 lit. h** (responsabilidad directa de entrega), **Art. 51** (reversión del pago) y **Arts. 58 y 61** (acción jurisdiccional y sanciones hasta por 2.000 SMLMV).
* **Decreto 587 de 2016** (compilado en el **Decreto 1074 de 2015, Arts. 2.2.2.51.1 a 2.2.2.51.13**): Notificación en **5 días hábiles** y reembolso obligatorio por parte del banco o pasarela en máximo **15 días hábiles**.
* **Ley 527 de 1999:** Validez probatoria de los mensajes de datos y soportes con huella digital **SHA-256**.
* **Reglamentos Aeronáuticos de Colombia (RAC 3 de la Aerocivil):** Reembolso del **100 %** del tiquete más compensación mínima del **30 %** del valor del trayecto por sobreventa o cancelación atribuible a la aerolínea.
