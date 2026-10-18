# ReversoYa: _«Tu plata de vuelta por ley, sin rogarle al comercio»_

Herramienta LegalTech de acceso a la justicia para **Colombia** que ejecuta la **Reversión de Pago obligatoria ante bancos y pasarelas (PSE, Nequi, Daviplata, tarjetas)**, el **Derecho de Retracto**, la **Garantía Legal en compras online** y la **Compensación por Sobreventa o Cancelación Aérea (RAC 3)**.

🌐 **Aplicación Web (GitHub Pages):** [https://seagomezar.github.io/reversoya/](https://seagomezar.github.io/reversoya/)

---

## 📦 Archivos y Entregables en el Repositorio

| # | Entregable | Archivo en el Repositorio | Enlace Directo |
|---|---|---|---|
| **1** | **Aplicación Web Independiente (Calculadora y Generador de Oficios)** | `index.html` + `app.js` | [Abrir Aplicación](https://seagomezar.github.io/reversoya/index.html) |
| **2** | **Documento Ejecutivo Formal (1 Página A4)** | `ReversoYa_Resumen_Ejecutivo_1Pagina.pdf` / `resumen-ejecutivo-1-pagina.html` | [Descargar PDF](https://seagomezar.github.io/reversoya/ReversoYa_Resumen_Ejecutivo_1Pagina.pdf) |
| **3** | **Presentación de Sustentación (10 Diapositivas)** | `presentacion-10-minutos.html` / `ReversoYa_Presentacion_10Minutos.pptx` / `Presentacion_10_Minutos_Speaker_Notes.md` | [Abrir Diapositivas Web](https://seagomezar.github.io/reversoya/presentacion-10-minutos.html) · [Descargar .PPTX](https://seagomezar.github.io/reversoya/ReversoYa_Presentacion_10Minutos.pptx) |
| **4** | **Animación Continua del Problema Jurídico, Marco Normativo y Solución** | `videos-motion-graphics.html` + capítulos en `videos/*.js` | [Abrir Animación Continua](https://seagomezar.github.io/reversoya/videos-motion-graphics.html) |

### Estructura de la Animación Continua (`videos/`)
Los 5 capítulos de la narrativa jurídica están enlazados en una sola animación continua en `videos-motion-graphics.html`:
- `videos/motion_engine.js`: Motor de narrativa visual que enlaza los 5 capítulos y 23 secuencias en una línea continua.
- `videos/video1_problema_colombia.js`: Capítulo I: El Problema del Consumidor Digital en Colombia (370M de pagos digitales y las 4 excusas ilegales).
- `videos/video2_marco_legal_decreto587.js`: Capítulo II: Fundamento Constitucional (Arts. 78 y 229 C.P.), Ley 1480/2011 y Decreto 587 de 2016.
- `videos/video3_flujo_4_pantallas.js`: Capítulo III: Solución y Flujo Guiado de Reclamación en 4 Pasos.
- `videos/video4_casos_y_vuelos_rac3.js`: Capítulo IV: Casos Reales y Compensación Aérea RAC 3 (100 % reembolso + 30 % compensación).
- `videos/video5_modelo_negocio_impacto.js`: Capítulo V: Diferenciación en Colombia y Sostenibilidad ($0 / $19.900 / B2B SaaS).

---

## ⚖️ Marco Normativo (Colombia)

* **Constitución Política de Colombia:** **Art. 78** (protección constitucional al consumidor) y **Art. 229** (acceso efectivo a la administración de justicia).
* **Estándar Internacional:** **Directrices de las Naciones Unidas para la Protección del Consumidor** (Resolución A/RES/70/186).
* **Estatuto del Consumidor (Ley 1480 de 2011):** **Arts. 7 y 8** (garantía legal), **Art. 43** (ineficacia de pleno derecho de cláusulas abusivas), **Art. 47** (retracto en 5 días hábiles en dinero), **Art. 50 lit. h** (responsabilidad directa de entrega), **Art. 51** (reversión del pago) y **Arts. 58 y 61** (acción jurisdiccional y sanciones hasta por 2.000 SMLMV).
* **Decreto 587 de 2016** (compilado en el **Decreto 1074 de 2015, Arts. 2.2.2.51.1 a 2.2.2.51.13**): Notificación en **5 días hábiles** y reembolso obligatorio por parte del banco o pasarela en máximo **15 días hábiles**.
* **Ley 527 de 1999:** Validez probatoria de los mensajes de datos y soportes con huella digital **SHA-256**.
* **Reglamentos Aeronáuticos de Colombia (RAC 3 de la Aerocivil):** Reembolso del **100 %** del tiquete más compensación mínima del **30 %** del valor del trayecto por sobreventa o cancelación atribuible a la aerolínea.
