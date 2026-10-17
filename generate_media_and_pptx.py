import os
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

os.makedirs("videos", exist_ok=True)

def load_font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

FONT_H1 = load_font(38, bold=True)
FONT_H2 = load_font(26, bold=True)
FONT_STAT = load_font(28, bold=True)
FONT_BODY = load_font(18, bold=False)
FONT_SMALL = load_font(14, bold=True)
FONT_SUB = load_font(15, bold=False)

VIDEOS_DATA = [
    {
        "filename": "videos/video1_problema_colombia_45s.mp4",
        "title": "Video 1: El Problema en Colombia (45s)",
        "scenes": [
            ("ESCENA 1/5 • LA CIFRA OCULTA", "COMERCIO DIGITAL EN COLOMBIA (CCCE)", "370.000.000+ pagos digitales al año", "$62 Billones COP", "Pagamos por PSE, Nequi, Daviplata y tarjetas. Pero ante un incumplimiento, el comprador queda solo.", "En Colombia realizamos más de 370 millones de pagos digitales al año, pero reclamar cuesta demasiado.", [
                ("Pagos digitales anuales (CCCE)", "370M+ transacciones"),
                ("Canales principales", "PSE, Nequi, Daviplata, Tarjetas"),
                ("Quejas y demandas ante la SIC", "28.000+ procesos / año")
            ]),
            ("ESCENA 2/5 • LAS 4 EXCUSAS EN WHATSAPP", "PRÁCTICAS ABUSIVAS COTIDIANAS", "“No devolvemos plata, solo damos bono”", "4 Excusas Ilegales", "1) Bono forzado • 2) 'Culpa de transportadora' • 3) 'Sin garantía en promo' • 4) 'Espere 60 días'", "Las tiendas repiten cuatro excusas ilegales: bono obligatorio, culpa a la transportadora o negar garantías en promoción.", [
                ("“Solo damos bono de cambio”", "ILEGAL • Viola Art. 47 Ley 1480"),
                ("“Reclámele a Servientrega”", "ILEGAL • Viola Art. 50 lit. h"),
                ("“En promoción no hay garantía”", "NULO • Viola Arts. 7 y 43")
            ]),
            ("ESCENA 3/5 • LA BARRERA ECONÓMICA", "ASIMETRÍA DE ACCESO A LA JUSTICIA", "Un abogado cuesta más que tu compra", "$500.000 vs $280.000", "Contratar un abogado particular cuesta entre $400.000 y $800.000 COP. El 84% abandona el reclamo.", "Ningún ciudadano paga quinientos mil pesos a un abogado para recuperar una compra de trescientos mil.", [
                ("Honorarios abogado tradicional", "$400.000 a $800.000 COP"),
                ("Compra promedio afectada", "$150.000 a $900.000 COP"),
                ("Diagnóstico ReversoYa", "$0 COP Gratis / $19.900 Triple Envío")
            ]),
            ("ESCENA 4/5 • EL RELOJ DE 5 DÍAS HÁBILES", "DECRETO 587 DE 2016 • ART. 2.2.2.51.4", "Tienes 5 días hábiles para activar a tu banco", "5 Días Hábiles", "La ley obliga a tu banco o PSE a devolverte la plata si notificas en los primeros 5 días hábiles.", "La ley ya obliga a tu banco a devolverte el dinero, pero exige notificar formalmente en cinco días hábiles.", [
                ("Plazo para notificar al banco/PSE", "5 días hábiles desde el hecho"),
                ("Plazo del banco para abonar", "Máximo 15 días hábiles"),
                ("Si pasaron más de 5 días", "Ruta Jurisdiccional SIC Art. 58")
            ]),
            ("ESCENA 5/5 • NACE REVERSOYA", "PROTOTIPO LEGALTECH COLOMBIA", "ReversoYa: Tu plata de vuelta por ley", "Sin rogarle al comercio", "Activamos la orden vinculante ante tu banco, el comercio y la SIC en 3 minutos.", "Por eso creamos ReversoYa: tu plata de vuelta por ley, sin rogarle al comercio.", [
                ("Paso 1 y 2", "Escáner de plazo + Detector WhatsApp"),
                ("Paso 3", "3 Oficios vinculantes (Art. 2.2.2.51.3)"),
                ("Paso 4", "Radicación Triple + Reloj de 15 días")
            ])
        ]
    },
    {
        "filename": "videos/video2_marco_legal_decreto587_45s.mp4",
        "title": "Video 2: Marco Constitucional y Decreto 587 (45s)",
        "scenes": [
            ("ESCENA 1/5 • CONSTITUCIÓN Y DD. HH.", "FUNDAMENTO CONSTITUCIONAL COLOMBIANO", "Artículos 78 y 229 de la Constitución", "Art. 78 + Art. 229 C.P.", "Protección constitucional al consumidor, acceso a la justicia y Directrices de la ONU (Res. A/RES/70/186).", "ReversoYa materializa los artículos 78 y 229 de la Constitución Política y las Directrices de la ONU.", [
                ("Art. 78 Constitución Política", "Derechos colectivos del consumidor"),
                ("Art. 229 Constitución Política", "Acceso efectivo a la justicia"),
                ("ONU Res. A/RES/70/186", "Comercio electrónico equitativo")
            ]),
            ("ESCENA 2/5 • ESTATUTO DEL CONSUMIDOR", "LEY 1480 DE 2011 • ARTS. 43, 47 Y 50", "Retracto en Dinero y Cláusulas Nulas", "Art. 47 y Art. 43", "Art. 47: 5 días de retracto en efectivo (prohibido imponer bonos). Art. 43: Nula cualquier exclusión en promoción.", "El artículo 47 prohíbe obligarte a recibir bonos, y el artículo 43 anula negar garantías en promociones.", [
                ("Art. 47 Ley 1480 de 2011", "Retracto en dinero, prohibidos los bonos"),
                ("Arts. 7, 8 y 43 Ley 1480", "Garantía obligatoria incluso en descuento"),
                ("Art. 50 lit. h Ley 1480", "Responsabilidad directa de entrega")
            ]),
            ("ESCENA 3/5 • REVERSIÓN DEL PAGO", "ARTÍCULO 51 LEY 1480 + DECRETO 587/2016", "Las 5 Causales que Obligan a tu Banco", "100% Reembolsable", "1) Fraude • 2) Débito no solicitado • 3) Cobro de más • 4) Producto no entregado • 5) Producto defectuoso.", "El artículo 51 de la Ley 1480 y el Decreto 587 ordenan al banco emisor reversar pagos electrónicos fallidos.", [
                ("Causales 1, 2 y 3", "Fraude, cobro no autorizado o cobro doble"),
                ("Causal 4 (Art. 51)", "Producto no recibido en el plazo pactado"),
                ("Causal 5 (Art. 51)", "Producto defectuoso o sin correspondencia")
            ]),
            ("ESCENA 4/5 • TÉRMINO PERENTORIO", "ART. 2.2.2.51.5 DECRETO 1074 DE 2015", "15 Días Hábiles para Abonar en tu Cuenta", "Máx. 15 Días Hábiles", "Notificado el emisor (PSE, Nequi o Tarjeta), la red de pagos tiene 15 días hábiles para devolver el dinero.", "Radicada la orden, tu banco o pasarela tiene máximo quince días hábiles para depositar el dinero en tu cuenta.", [
                ("Día 1 hábil", "Notificación al comercio y orden al banco"),
                ("Día 5 hábil", "Cierre de término de oposición del comercio"),
                ("Día 15 hábil", "Desembolso obligatorio en cuenta bancaria")
            ]),
            ("ESCENA 5/5 • SANCIONES Y AEROCIVIL", "ART. 61 LEY 1480 Y RAC 3 AEROCIVIL", "Multas de 2.000 SMLMV + 30% en Vuelos", "2.000 SMLMV", "La SIC sanciona hasta con 2.000 SMLMV, y el RAC 3 exige 30% de compensación adicional en vuelos.", "Quien obstruya la reversión enfrenta multas de hasta dos mil salarios mínimos y 30% extra en vuelos RAC 3.", [
                ("Art. 61 Ley 1480 de 2011", "Multas SIC de hasta 2.000 SMLMV"),
                ("RAC 3 Aeronáutica Civil", "100% reembolso + 30% compensación"),
                ("Ley 527 de 1999", "Validez probatoria de mensajes de datos")
            ])
        ]
    },
    {
        "filename": "videos/video3_flujo_4_pantallas_45s.mp4",
        "title": "Video 3: Flujo de 4 Pantallas en Stitch (45s)",
        "scenes": [
            ("ESCENA 1/5 • DISEÑO EN STITCH MCP", "INSPIRACIÓN SYMPLIFICA + CLARITY", "Cero jerga jurídica: 4 pantallas guiadas", "3 Minutos", "Convertimos un trámite técnico en una calculadora intuitiva accesible desde cualquier celular o computador.", "Inspirados en Symplifica y diseñados en Stitch, creamos cuatro pantallas claras que se completan en tres minutos.", [
                ("Paleta de Confianza", "Deep Trust Navy #0B132B + Emerald #00C48C"),
                ("Tipografía Legible", "Plus Jakarta Sans + Inter Tabular"),
                ("Redacción Clarity", "Mecanismos verificables sin jerga opaca")
            ]),
            ("ESCENA 2/5 • PANTALLA 1", "ESCÁNER DE COMPRA, VUELO Y PLAZO", "Selecciona causal, monto, PSE/Nequi y fecha", "Pantalla 1 de 4", "Calcula al instante si estás en los 5 días hábiles bancarios o si activa la ruta jurisdiccional SIC.", "En la Pantalla 1 seleccionas qué pasó con tu compra o vuelo y validas tu ventana de cinco días hábiles.", [
                ("Selector de 4 Causales", "No entrega, Defecto, Cobro doble, Vuelo"),
                ("Medios de Pago", "PSE, Nequi, Daviplata, Tarjetas"),
                ("Cálculo de Plazo", "Verifica los 5 días hábiles al instante")
            ]),
            ("ESCENA 3/5 • PANTALLA 2", "DETECTOR DE EXCUSAS Y BÓVEDA SHA-256", "Escanea el chat y sella pruebas con SHA-256", "Pantalla 2 de 4", "Detecta frases ilegales del vendedor y genera estampa criptográfica SHA-256 (Ley 527 de 1999).", "En la Pantalla 2 pegas el chat de WhatsApp; el sistema señala las excusas nulas y sella tus capturas con SHA-256.", [
                ("Escáner de WhatsApp", "Detecta 'solo damos bono' en tiempo real"),
                ("Contraargumento Legal", "Cita Art. 43, 47 y 50 Ley 1480"),
                ("Sello Criptográfico", "Hash SHA-256 bajo Ley 527 de 1999")
            ]),
            ("ESCENA 4/5 • PANTALLA 3", "SEMÁFORO Y 3 OFICIOS VINCULANTES", "Orden al Banco + Aviso al Comercio + SIC", "Pantalla 3 de 4", "Cumple los requisitos taxativos del Art. 2.2.2.51.3 Decreto 1074/2015 para evitar rechazos de forma.", "En la Pantalla 3 se generan los tres oficios blindados para tu banco, el comercio y la Superintendencia.", [
                ("Oficio 1: Banco / PSE", "Orden bajo juramento Decreto 587"),
                ("Oficio 2: Comercio", "Notificación y requisito Art. 58 Ley 1480"),
                ("Oficio 3: SIC / Aerocivil", "Demanda jurisdiccional o reclamo RAC 3")
            ]),
            ("ESCENA 5/5 • PANTALLA 4", "RADICACIÓN TRIPLE Y RELOJ DE 15 DÍAS", "Cronómetro Bancario y Alerta Superfinanciera", "Pantalla 4 de 4", "Monitorea los 15 días hábiles bancarios y escala al Defensor Financiero si el banco incumple.", "En la Pantalla 4 activas la radicación triple y el reloj de quince días hábiles hasta recibir tu dinero.", [
                ("Envío Simultáneo", "Comercio + Banco Emisor + Expediente SIC"),
                ("Cronómetro 15 Días", "Seguimiento del Art. 2.2.2.51.5"),
                ("Escalado Automático", "Queja ante Superfinanciera al Día 16")
            ])
        ]
    },
    {
        "filename": "videos/video4_casos_y_vuelos_rac3_45s.mp4",
        "title": "Video 4: Casos Reales y Vuelos RAC 3 (45s)",
        "scenes": [
            ("ESCENA 1/5 • CASO 1: INSTAGRAM + PSE", "CAUSAL 4 • PRODUCTO NO RECIBIDO", "Camila recupera $680.000 COP vía PSE", "$680.000 COP", "Pagó por PSE a una tienda en Instagram que nunca envió el paquete. Orden directa a Bancolombia.", "Caso uno: Camila pagó seiscientos ochenta mil pesos por PSE en Instagram y recuperó todo a través de su banco.", [
                ("Medio utilizado", "PSE Débito Bancario — Bancolombia"),
                ("Excusa de la tienda", "“Solo damos bono o reclámele a transportadora”"),
                ("Resultado ReversoYa", "100% reversado a su cuenta en 11 días hábiles")
            ]),
            ("ESCENA 2/5 • CASO 2: GARANTÍA EN PROMO", "CAUSAL 5 + ART. 43 LEY 1480", "Andrés anula la excusa de 'Black Friday'", "$1.450.000 COP", "Compró audífonos en descuento que llegaron dañados. El Art. 43 anula negar garantía en promoción.", "Caso dos: Andrés compró un equipo en promoción que llegó roto; ReversoYa anuló la cláusula abusiva.", [
                ("Medio utilizado", "Tarjeta de Crédito — Banco Davivienda"),
                ("Excusa de la tienda", "“Productos en descuento no tienen garantía”"),
                ("Resultado ReversoYa", "Cláusula ineficaz de pleno derecho (Art. 43)")
            ]),
            ("ESCENA 3/5 • CASO 3: COBRO DOBLE NEQUI", "CAUSALES 1 Y 2 • ART. 51 LEY 1480", "Débito duplicado en pasarela digital", "$320.000 COP", "La pasarela debitó dos veces en Nequi y pedía esperar 60 días. ReversoYa exigió el plazo legal de 15 días.", "Caso tres: ante un cobro doble en Nequi donde pedían esperar sesenta días, ReversoYa impuso el límite de quince días.", [
                ("Medio utilizado", "Nequi / Pasarela Electrónica"),
                ("Excusa del comercio", "“Contabilidad tarda 45 a 60 días hábiles”"),
                ("Resultado ReversoYa", "Abono obligatorio bajo Decreto 587/2016")
            ]),
            ("ESCENA 4/5 • CASO 4: VUELOS RAC 3", "REGLAMENTOS AERONÁUTICOS DE COLOMBIA", "Valentina exige 100% Tiquete + 30% RAC 3", "$540k + $162k = $702k", "Sobreventa en vuelo Bogotá–Cartagena: $540.000 de reembolso + $162.000 de compensación RAC 3.", "Caso cuatro: en sobreventa de un vuelo de quinientos cuarenta mil pesos, ReversoYa suma el 30% del RAC 3.", [
                ("100% Reembolso Tiquete", "$540.000 COP vía reversión bancaria"),
                ("+30% Compensación RAC 3", "+$162.000 COP exigibles a la aerolínea"),
                ("Total en Dinero", "$702.000 COP (sin aceptar bonos de millas)")
            ]),
            ("ESCENA 5/5 • RUTA JURISDICCIONAL SIC", "ARTÍCULO 58 LEY 1480 Y ART. 24 CGP", "¿Pasaron más de 5 días? Ruta SIC Activa", "Cobertura Total", "Si venció el plazo bancario de 5 días, ReversoYa genera la Demanda Verbal Sumaria ante la SIC sin abogado.", "Si ya pasaron los cinco días bancarios, el sistema transforma tu caso en demanda ante la SIC sin requerir abogado.", [
                ("Menos de 5 días hábiles", "Orden directa al banco emisor (Dec. 587)"),
                ("Más de 5 días hábiles", "Demanda jurisdiccional SIC (Art. 58)"),
                ("Mínima cuantía", "No requiere tarjeta profesional de abogado")
            ])
        ]
    },
    {
        "filename": "videos/video5_modelo_negocio_impacto_45s.mp4",
        "title": "Video 5: Propuesta de Valor y Modelo de Negocio (45s)",
        "scenes": [
            ("ESCENA 1/5 • BENCHMARK EN COLOMBIA", "DIFERENCIACIÓN FRENTE A ALTERNATIVAS", "Por qué SIC Facilita y los chatbots no bastan", "Innovación Real", "SIC Facilita solo incluye comercios voluntarios; las apps de peticiones solo escriben al vendedor.", "En Colombia, SIC Facilita solo cubre comercios voluntarios y los chatbots no vinculan a tu banco. ReversoYa sí.", [
                ("SIC Facilita", "No cubre tiendas de Instagram ni ordena al banco"),
                ("Formularios bancarios", "Ocultan PSE y rechazan por 'disputa comercial'"),
                ("ReversoYa", "Activa el débito forzoso del Decreto 587/2016")
            ]),
            ("ESCENA 2/5 • NIVEL 1: FREEMIUM ($0)", "ACCESO UNIVERSAL A LA JUSTICIA", "Diagnóstico, Escáner y Oficios por $0 COP", "$0 COP Gratis", "Cualquier colombiano diagnostica su caso, audita excusas y descarga los 3 oficios sin costo.", "Nuestro primer nivel es cien por ciento gratuito: diagnóstico, detector de excusas y descarga de los tres oficios.", [
                ("Escáner de Plazos", "100% gratuito e ilimitado"),
                ("Detector de WhatsApp", "Identifica cláusulas abusivas sin costo"),
                ("Descarga de 3 Oficios", "Listos para radicar manualmente por $0")
            ]),
            ("ESCENA 3/5 • NIVEL 2: MICRO-PAGO B2C", "0% DE COMISIÓN SOBRE LO RECUPERADO", "Radicación Triple Certificada: $19.900 COP", "$19.900 COP", "Pago único por caso (95% menor que un abogado). Envío simultáneo a Comercio + Banco + SIC.", "Por diecinueve mil novecientos pesos automatizamos el envío triple certificado con sello SHA-256 y reloj de 15 días.", [
                ("Tarifa Plana Ética", "$19.900 COP por caso (0% de comisión)"),
                ("Triple Envío Certificado", "Comercio + Banco/PSE + Expediente SIC"),
                ("Ahorro Ciudadano", "95% más económico que un abogado tradicional")
            ]),
            ("ESCENA 4/5 • NIVEL 3: SAAS B2B", "API PARA PASARELAS Y COMERCIOS", "Prevención de Multas SIC de 2.000 SMLMV", "$290k – $1.2M / mes", "Comercios y pasarelas integran nuestro widget de retracto para conciliar en 1 clic y evitar sanciones.", "Nuestro tercer motor es un SaaS B2B para comercios y pasarelas que previene multas de hasta dos mil salarios mínimos.", [
                ("Aliados B2B", "Pasarelas (Wompi, Bold) y tiendas e-commerce"),
                ("Beneficio Legal", "Evita demandas Art. 58 y multas de 2.000 SMLMV"),
                ("Sostenibilidad", "Ingresos recurrentes que subsidian el nivel gratuito")
            ]),
            ("ESCENA 5/5 • IMPACTO EN COLOMBIA", "DERECHOS HUMANOS Y JUSTICIA DIGITAL", "Cuando la ley es fácil, el abuso desaparece", "ReversoYa Colombia", "Justicia financiera y protección al consumidor al alcance de cualquier ciudadano en 3 minutos.", "Con ReversoYa demostramos que cuando la ley se vuelve ejecutable en tres clics, el abuso deja de ser rentable.", [
                ("Nombre", "ReversoYa"),
                ("Eslogan", "“Tu plata de vuelta por ley, sin rogarle al comercio”"),
                ("Diseño & Prosa", "Stitch Design System + Clarity Standard")
            ])
        ]
    }
]

def ease_out_cubic(x):
    x = max(0.0, min(1.0, x))
    return 1.0 - pow(1.0 - x, 3)

def render_video(video_info):
    width, height = 1280, 720
    fps = 15
    duration_sec = 45
    total_frames = fps * duration_sec  # 675 frames = 45.0 seconds
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(video_info["filename"], fourcc, fps, (width, height))

    scenes = video_info["scenes"]
    num_scenes = len(scenes)
    frames_per_scene = total_frames // num_scenes

    # Pre-cache static background grid template
    bg_base = Image.new("RGB", (width, height), (11, 19, 43))
    bg_draw = ImageDraw.Draw(bg_base)
    for x in range(0, width, 40):
        bg_draw.line([(x, 0), (x, height)], fill=(20, 30, 58), width=1)
    for y in range(0, height, 40):
        bg_draw.line([(0, y), (width, y)], fill=(20, 30, 58), width=1)

    # Top Header Bar on base
    bg_draw.rounded_rectangle([48, 32, 1232, 98], radius=14, fill=(19, 26, 51), outline=(45, 58, 92), width=1)
    bg_draw.rounded_rectangle([68, 45, 108, 85], radius=9, fill=(0, 196, 140))
    bg_draw.text((80, 50), "R", font=FONT_H2, fill=(11, 19, 43))
    bg_draw.text((122, 49), "ReversoYa", font=FONT_H2, fill=(255, 255, 255))
    bg_draw.text((275, 55), "•  “Tu plata de vuelta por ley, sin rogarle al comercio”", font=FONT_SMALL, fill=(0, 196, 140))

    for f in range(total_frames):
        t = f / fps
        s_idx = min(num_scenes - 1, f // frames_per_scene)
        local_f = f - s_idx * frames_per_scene
        scene_p = local_f / float(frames_per_scene)
        enter = ease_out_cubic(min(1.0, scene_p * 3.2))

        tag, kicker, headline, stat, sub, voiceover, cards = scenes[s_idx]

        img = bg_base.copy()
        draw = ImageDraw.Draw(img)

        # Scene pill top right
        draw.rounded_rectangle([880, 46, 1212, 84], radius=18, fill=(14, 48, 52), outline=(0, 196, 140), width=1)
        draw.text((900, 56), tag, font=FONT_SMALL, fill=(99, 252, 192))

        # Left column kinetic animation
        y_off = int((1.0 - enter) * 28)
        draw.rounded_rectangle([64, 150 + y_off, 540, 184 + y_off], radius=8, fill=(25, 36, 68))
        draw.text((78, 158 + y_off), kicker, font=FONT_SMALL, fill=(99, 252, 192))

        # Headline wrap (2 lines max)
        words = headline.split(" ")
        line1, line2 = "", ""
        for w in words:
            if len(line1 + " " + w) <= 28:
                line1 = (line1 + " " + w).strip()
            else:
                line2 = (line2 + " " + w).strip()
        draw.text((64, 205 + y_off), line1, font=FONT_H1, fill=(255, 255, 255))
        if line2:
            draw.text((64, 252 + y_off), line2, font=FONT_H1, fill=(255, 255, 255))
            stat_y = 315 + y_off
        else:
            stat_y = 270 + y_off

        # Stat pill
        draw.rounded_rectangle([64, stat_y, 470, stat_y + 62], radius=14, fill=(0, 196, 140))
        draw.text((84, stat_y + 13), stat, font=FONT_STAT, fill=(11, 19, 43))

        # Subtext wrap
        sub_words = sub.split(" ")
        s_lines = []
        cur = ""
        for w in sub_words:
            if len(cur + " " + w) <= 52:
                cur = (cur + " " + w).strip()
            else:
                s_lines.append(cur)
                cur = w
        if cur:
            s_lines.append(cur)
        for idx_l, sl in enumerate(s_lines[:3]):
            draw.text((64, stat_y + 84 + idx_l * 26), sl, font=FONT_BODY, fill=(203, 213, 225))

        # Right Column Animated Motion Cards
        rx, ry, rw, rh = 700, 145, 532, 410
        draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=18, fill=(19, 26, 51), outline=(48, 64, 102), width=2)

        for c_i, (c_title, c_desc) in enumerate(cards):
            c_enter = ease_out_cubic(max(0.0, min(1.0, (scene_p - c_i * 0.12) * 2.8)))
            cy = ry + 26 + c_i * 120 + int((1.0 - c_enter) * 18)
            border_col = (255, 90, 95) if "ILEGAL" in c_desc or "NULO" in c_desc else (0, 196, 140)
            draw.rounded_rectangle([rx + 24, cy, rx + rw - 24, cy + 98], radius=12, fill=(11, 19, 43), outline=border_col, width=2)
            draw.text((rx + 42, cy + 18), c_title, font=FONT_H2, fill=(255, 255, 255))
            draw.text((rx + 42, cy + 56), c_desc, font=FONT_SUB, fill=(99, 252, 192) if border_col == (0, 196, 140) else (255, 180, 176))

        # Bottom Voiceover Banner
        draw.rounded_rectangle([48, 582, 1232, 650], radius=12, fill=(15, 23, 48), outline=(0, 196, 140), width=1)
        draw.text((68, 594), f"LOCUCIÓN CLARITY ({t:04.1f}s / 45.0s):", font=FONT_SMALL, fill=(0, 196, 140))
        draw.text((68, 618), f"“{voiceover[:115]}”", font=FONT_SUB, fill=(248, 250, 252))

        # 45-second progress bar
        draw.rounded_rectangle([48, 668, 1232, 680], radius=6, fill=(30, 41, 72))
        prog_w = int(1184 * (f / float(total_frames - 1)))
        if prog_w > 6:
            draw.rounded_rectangle([48, 668, 48 + prog_w, 680], radius=6, fill=(0, 196, 140))

        frame_bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        out.write(frame_bgr)

    out.release()
    print(f"Rendered {video_info['filename']} ({total_frames} frames, 45.0s)")

for v in VIDEOS_DATA:
    render_video(v)

# Also create PowerPoint (.pptx) with all 10 Slides and Speaker Notes
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

SLIDES_PPTX = [
    ("Slide 1 (00:00-00:50): Nombre, Logo y Eslogan — ReversoYa",
     [
         "Marca: ReversoYa",
         "Eslogan: “Tu plata de vuelta por ley, sin rogarle al comercio.”",
         "Logo: Escudo naval (#0B132B) con flecha circular de restitución en verde esmeralda (#00C48C) e insignia LEY 1480.",
         "Mecanismo central: Ejecuta la Reversión de Pago obligatoria ante bancos y pasarelas (PSE, Nequi, Tarjetas) en máximo 15 días hábiles."
     ],
     "Buenas tardes. ¿A cuántos de ustedes les ha pasado que compran algo por internet o Instagram, pagan por PSE o Nequi, el producto nunca llega o llega roto, y la tienda les responde: ‘no devolvemos plata, solo damos un bono’? Para resolver ese abuso cotidiano en Colombia creamos ReversoYa. Nuestro símbolo une un escudo azul naval de certeza jurídica con una flecha circular verde esmeralda que representa el retorno del dinero a la cuenta del ciudadano. Y nuestro eslogan resume toda nuestra tesis jurídica: ‘Tu plata de vuelta por ley, sin rogarle al comercio’."),
    ("Slide 2 (00:50-02:00): El Problema en Colombia — ¿A quién afecta?",
     [
         "370+ millones de pagos digitales al año en Colombia por más de $62 billones COP (CCCE).",
         "Muro 1 (Las 4 excusas ilegales): 1) 'Solo damos bono', 2) 'Reclámele a la transportadora', 3) 'En promoción no hay garantía', 4) 'Espere 60 días'.",
         "Muro 2 (Asimetría económica): Un abogado cuesta entre $400.000 y $800.000 COP; nadie contrata un abogado para recuperar una compra de $250.000 COP.",
         "Muro 3 (Ventana oculta): El comprador solo tiene 5 días hábiles para activar formalmente a su banco bajo el Decreto 587 de 2016."
     ],
     "Veamos la dimensión del problema en Colombia. Según la Cámara Colombiana de Comercio Electrónico, en el país se realizan más de 370 millones de transacciones digitales al año. Sin embargo, cuando una compra de $200.000 o $680.000 pesos falla, el consumidor choca contra dos muros: cuatro excusas ilegales del comercio y el alto costo de contratar un abogado particular."),
    ("Slide 3 (02:00-03:15): Problema Jurídico — DD. HH., Constitución y Ley",
     [
         "Constitución Política y DD. HH.: Art. 78 C.P. (protección al consumidor), Art. 229 C.P. (acceso a la justicia) y Directrices ONU (Res. A/RES/70/186).",
         "Ley 1480 de 2011: Art. 51 (Reversión del pago), Art. 47 (Retracto en 5 días hábiles en dinero, prohibidos los bonos), Arts. 7, 8 y 43 (Garantía en promociones).",
         "Decreto 587 de 2016 (Cap. 51 Decreto 1074/2015): 5 días hábiles para notificar (Art. 2.2.2.51.4) -> 15 días hábiles para que el banco devuelva el 100% (Art. 2.2.2.51.5).",
         "RAC 3 Aeronáutica Civil: Reembolso del 100% del tiquete + 30% de compensación mínima obligatoria por sobreventa o cancelación."
     ],
     "Colombia tiene una legislación muy potente anclada en los artículos 78 y 229 de la Constitución, la Ley 1480 de 2011 y el Decreto 587 de 2016: si notificas dentro de los 5 días hábiles siguientes al incumplimiento, tu propio banco está obligado por ley a reversar el 100% del dinero en máximo 15 días hábiles."),
    ("Slide 4 (03:15-04:15): Público Objetivo — ¿A quién está dirigido?",
     [
         "Público B2C (Ciudadanos): Colombianos de 18 a 55 años (estratos 2 al 5) que compran online o en redes con PSE, Nequi, Daviplata o tarjetas ($80.000 a $4.000.000 COP).",
         "Público B2B (Aliados): Pasarelas de pago (Wompi, Bold, Mercado Pago) y comercios formales que buscan conciliar antes de recibir multas SIC de hasta 2.000 SMLMV (Art. 61 Ley 1480)."
     ],
     "Nuestro público principal son los compradores digitales y viajeros en Colombia entre los 18 y 55 años que usan PSE, Nequi, Daviplata o tarjetas, además de pasarelas y comercios en nuestro canal B2B."),
    ("Slide 5 (04:15-05:30): Solución y Flujo — Pantallas 1 y 2 (Diseño Stitch)",
     [
         "Inspiración Symplifica: Convertimos un trámite procesal en una calculadora guiada de 4 pantallas.",
         "Pantalla 1 (Escáner de Compra, Vuelo y Plazo de 5 Días): Calcula el monto exigible y verifica si aplica orden directa al banco (<=5 días) o demanda SIC (>5 días).",
         "Pantalla 2 (Detector de Excusas Ilegales + Bóveda SHA-256): Escanea el chat de WhatsApp, anula excusas ilegales (Art. 43 y 47) y certifica capturas bajo la Ley 527 de 1999."
     ],
     "Inspirados en Symplifica, diseñamos en Stitch un flujo de 4 pantallas sin jerga legal. En la Pantalla 1 el usuario calcula su plazo de 5 días hábiles y en la Pantalla 2 escanea el chat de WhatsApp y sella sus pruebas con SHA-256."),
    ("Slide 6 (05:30-06:45): Solución y Flujo — Pantallas 3 y 4 (Orden al Banco)",
     [
         "Pantalla 3 (Semáforo Legal y 3 Oficios Vinculantes): Genera 1) Orden al Banco/PSE con los requisitos taxativos del Art. 2.2.2.51.3 Dec. 1074/2015, 2) Aviso al Comercio y 3) Demanda SIC.",
         "Pantalla 4 (Radicación Simultánea y Reloj de 15 Días Hábiles): Monitorea el término perentorio del banco y escala a Superfinanciera si no abona al día 15."
     ],
     "En la Pantalla 3 ReversoYa genera los 3 oficios con todos los requisitos formales del Decreto 587 para que el banco no pueda rechazarlos, y en la Pantalla 4 activa el reloj de 15 días hábiles."),
    ("Slide 7 (06:45-07:45): Caso Especial — Vuelos y Compensación 30% (RAC 3)",
     [
         "Ejemplo real: Vuelo Bogotá–Cartagena de $540.000 COP sobrevendido o cancelado por la aerolínea.",
         "Reembolso del tiquete vía banco: $540.000 COP (100%).",
         "Compensación obligatoria RAC 3 (30%): +$162.000 COP.",
         "Total exigible en dinero (no en millas ni vouchers): $702.000 COP."
     ],
     "En el módulo aeronáutico bajo el RAC 3 de la Aerocivil, si sobrevenden un tiquete de $540.000 pesos, ReversoYa calcula automáticamente $702.000 pesos exigibles en efectivo."),
    ("Slide 8 (07:45-08:45): Propuesta de Valor y Benchmark en Colombia",
     [
         "SIC Facilita: Solo aplica a comercios inscritos voluntariamente; no vincula al banco ni cubre tiendas de Instagram.",
         "Formularios bancarios: Tratan todo como fraude de tarjeta y ocultan la reversión de PSE.",
         "Apps de Derechos de Petición: Solo le envían una carta al vendedor incumplido, quien la ignora.",
         "Diferencial ReversoYa: Acciona directamente el débito forzoso ante el banco/pasarela en 15 días hábiles."
     ],
     "Investigamos qué existe en Colombia: ni SIC Facilita ni las apps de peticiones simples accionan la obligación del banco emisor. ReversoYa no le ruega al vendedor: activa la orden bancaria del Decreto 587."),
    ("Slide 9 (08:45-09:30): Modelo de Negocio — Ético y Escalable",
     [
         "1. Nivel Freemium ($0 COP): Diagnóstico, detector de excusas y descarga manual de los 3 oficios gratis.",
         "2. Micro-pago B2C ($19.900 COP por caso, 0% comisión sobre lo recuperado): Radicación triple certificada SHA-256 y reloj de 15 días.",
         "3. SaaS B2B ($290.000 a $1.200.000 COP/mes): API de autogestión de retractos para comercios y pasarelas que evita multas de hasta 2.000 SMLMV."
     ],
     "Nuestro modelo combina un nivel Freemium gratuito con un micro-pago ético de $19.900 pesos por radicación triple certificada y un SaaS B2B mensual para comercios y pasarelas."),
    ("Slide 10 (09:30-10:00): Impacto y Demostración en Vivo",
     [
         "Entregable 1: Aplicación Web Interactiva 100% funcional (4 pantallas + 4 casos reales).",
         "Entregable 2: Resumen Ejecutivo de 1 página exacta en PDF.",
         "Entregable 3: Presentación de 10 minutos con notas de orador Clarity.",
         "Entregable 4: 5 Videos dinámicos de Motion Graphics de 45 segundos cada uno."
     ],
     "En conclusión: con ReversoYa demostramos que cuando el artículo 78 de la Constitución y la Ley 1480 se traducen en cuatro pantallas claras, el abuso comercial deja de ser rentable. Muchas gracias.")
]

for title_text, bullets, notes_text in SLIDES_PPTX:
    slide_layout = prs.slide_layouts[1]
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = title_text
    tf = slide.placeholders[1].text_frame
    tf.clear()
    for i, b in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = b
        p.font.size = Pt(20)
    notes_slide = slide.notes_slide
    notes_slide.notes_text_frame.text = notes_text

prs.save("ReversoYa_Presentacion_10Minutos.pptx")
print("Saved ReversoYa_Presentacion_10Minutos.pptx")
