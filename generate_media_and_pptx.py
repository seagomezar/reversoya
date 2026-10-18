import os
import io
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image as RLImage, Table, TableStyle
from reportlab.lib import colors


def load_font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


FONT_H1 = load_font(30, bold=True)
FONT_H2 = load_font(21, bold=True)
FONT_H3 = load_font(17, bold=True)
FONT_BODY = load_font(15, bold=False)
FONT_SMALL = load_font(13, bold=True)


def render_pdf_logo_png_bytes():
    """Renders high-resolution 4x supersampled ReversoYa logo PNG for embedding in the PDF."""
    w, h = 760, 180
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Shield base
    shield_pts = [(90, 14), (24, 38), (24, 92), (44, 136), (90, 166), (136, 136), (156, 92), (156, 38)]
    draw.polygon(shield_pts, fill=(11, 19, 43, 255), outline=(0, 196, 140, 255), width=7)

    # Circular return arrow inside shield
    draw.arc([54, 54, 126, 126], start=35, end=315, fill=(0, 196, 140, 255), width=9)
    draw.polygon([(94, 40), (86, 58), (108, 62)], fill=(0, 196, 140, 255))
    draw.ellipse([80, 80, 100, 100], fill=(255, 255, 255, 255))

    # Wordmark ReversoYa
    font_logo = load_font(82, bold=True)
    draw.text((182, 42), "Reverso", font=font_logo, fill=(11, 19, 43, 255))
    rev_bbox = draw.textbbox((182, 42), "Reverso", font=font_logo)
    draw.text((rev_bbox[2] + 2, 42), "Ya", font=font_logo, fill=(0, 168, 120, 255))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


# ==============================================================================
# 1. GENERATE FORMAL 1-PAGE PDF DOCUMENT
# ==============================================================================
def build_formal_pdf(filename="ReversoYa_Resumen_Ejecutivo_1Pagina.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=12 * mm,
        bottomMargin=10 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "FormalTitle",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=11.5,
        leading=13.5,
        textColor=colors.black,
        alignment=TA_LEFT,
        spaceAfter=6,
    )

    heading_style = ParagraphStyle(
        "FormalHeading",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=9.4,
        leading=11.2,
        textColor=colors.black,
        spaceBefore=4.5,
        spaceAfter=1.5,
    )

    body_style = ParagraphStyle(
        "FormalBody",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=8.65,
        leading=11.0,
        textColor=colors.black,
        alignment=TA_JUSTIFY,
        spaceAfter=2.5,
    )

    story = []

    story.append(
        Paragraph(
            "REVERSOYA: PLATAFORMA DE REVERSIÓN DE PAGO, RETRACTO Y RECLAMACIÓN DE CONSUMO",
            title_style,
        )
    )

    # 1. NOMBRE - LOGO - ESLOGAN (with embedded logo image)
    story.append(Paragraph("1. NOMBRE, LOGO Y ESLOGAN", heading_style))
    logo_img = RLImage(render_pdf_logo_png_bytes(), width=34 * mm, height=8.05 * mm)
    sec1_table = Table(
        [
            [
                Paragraph("<b>Nombre:</b> ReversoYa.", body_style),
                Paragraph("<b>Logo:</b>", body_style),
                logo_img,
                Paragraph(
                    "<b>Eslogan:</b> <i>«Tu plata de vuelta por ley, sin rogarle al comercio»</i>.",
                    body_style,
                ),
            ]
        ],
        colWidths=[32 * mm, 11 * mm, 38 * mm, 97 * mm],
    )
    sec1_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    story.append(sec1_table)

    # 2. PROBLEMA JURÍDICO - DERECHOS - LEGISLACIÓN
    story.append(
        Paragraph(
            "2. PROBLEMA JURÍDICO, DERECHOS Y LEGISLACIÓN APLICABLE",
            heading_style,
        )
    )
    story.append(
        Paragraph(
            "En Colombia se procesan más de 370 millones de transacciones digitales al año (Cámara Colombiana de Comercio Electrónico). Cuando un comercio electrónico o tienda en redes sociales no entrega el pedido en el plazo pactado, envía un producto defectuoso, realiza un cobro duplicado o cuando una aerolínea sobrevende un vuelo, el consumidor suele enfrentarse a cuatro respuestas improcedentes: la imposición de bonos de cambio en lugar de dinero efectivo, el traslado de la responsabilidad a la empresa transportadora, la exclusión de garantía por tratarse de bienes en descuento y la exigencia de plazos de espera de 45 a 60 días hábiles. Dado que los honorarios de un abogado particular ($400.000 a $800.000 COP) superan el valor promedio de estas compras ($80.000 a $900.000 COP), la mayoría de los ciudadanos desiste de reclamar.",
            body_style,
        )
    )
    story.append(
        Paragraph(
            "Esta situación vulnera de forma directa el marco constitucional y legal colombiano: (i) el <b>artículo 78 de la Constitución Política</b> (protección de los consumidores y responsabilidad de productores y comercializadores) y el <b>artículo 229 de la Constitución</b> (acceso efectivo a la administración de justicia), en armonía con las <b>Directrices de las Naciones Unidas para la Protección del Consumidor (Resolución A/RES/70/186)</b>; (ii) el <b>Estatuto del Consumidor (Ley 1480 de 2011)</b> en sus <b>artículos 7 y 8</b> (garantía legal obligatoria), <b>artículo 43</b> (ineficacia de pleno derecho de cláusulas abusivas que limiten la garantía), <b>artículo 47</b> (derecho de retracto en 5 días hábiles con devolución en dinero efectivo), <b>artículo 50 literal h</b> (responsabilidad directa de entrega material), <b>artículo 51</b> (reversión del pago en compras por medios electrónicos) y <b>artículos 58 y 61</b> (acción jurisdiccional de protección al consumidor y multas de la SIC hasta por 2.000 SMLMV); (iii) el <b>Decreto 587 de 2016</b> (compilado en el Capítulo 51 del Decreto 1074 de 2015, artículos 2.2.2.51.1 a 2.2.2.51.13), que obliga al banco emisor o pasarela a reversar el 100% del pago dentro de los <b>15 días hábiles</b> siguientes si el comprador notifica dentro de los primeros <b>5 días hábiles</b>; (iv) la <b>Ley 527 de 1999</b> sobre validez probatoria de mensajes de datos; y (v) los <b>Reglamentos Aeronáuticos de Colombia (RAC 3 de la Aerocivil)</b>, que ordenan el reembolso del 100% del tiquete más una compensación mínima del 30% del valor del trayecto en sobreventa o cancelación atribuible a la aerolínea.",
            body_style,
        )
    )

    # 3. PÚBLICO OBJETIVO
    story.append(Paragraph("3. PÚBLICO OBJETIVO", heading_style))
    story.append(
        Paragraph(
            "En el segmento ciudadano (B2C), la solución está dirigida a personas mayores de edad en Colombia (principalmente entre los 18 y 55 años, estratos 2 al 5) que adquieren bienes, servicios o tiquetes aéreos por internet, Instagram o WhatsApp empleando medios de pago electrónico como PSE, Nequi, Daviplata o tarjetas débito y crédito, con cuantías habituales entre $80.000 y $4.000.000 COP. En el segmento institucional (B2B), se dirige a comercios electrónicos y pasarelas de pago que requieren gestionar retractos, garantías y reversiones de manera oportuna para evitar demandas ante la Superintendencia de Industria y Comercio (SIC) y sanciones administrativas.",
            body_style,
        )
    )

    # 4. SOLUCIÓN Y FLUJO DE PANTALLAS
    story.append(Paragraph("4. SOLUCIÓN Y FLUJO DE PANTALLAS", heading_style))
    story.append(
        Paragraph(
            "ReversoYa articula los derechos del consumidor con el procedimiento administrativo y jurisdiccional mediante una aplicación web guiada en cuatro pasos: <b>Paso 1 (Datos de la compra y cálculo del plazo de 5 días hábiles):</b> el usuario elige la causal (no entrega, producto defectuoso o retracto, cobro doble o sobreventa aérea), registra el valor en pesos colombianos, el medio de pago y la entidad financiera; el sistema verifica si está dentro de los 5 días hábiles del artículo 2.2.2.51.4 del Decreto 1074 de 2015 para ordenar la reversión bancaria o si procede la vía jurisdiccional ante la SIC (artículo 58 de la Ley 1480). <b>Paso 2 (Auditoría de respuestas del comercio y soportes probatorios):</b> el usuario selecciona o transcribe la respuesta recibida del proveedor; la herramienta identifica las normas vulneradas y calcula la huella digital SHA-256 de los comprobantes conforme a la Ley 527 de 1999. <b>Paso 3 (Generación de los tres documentos formales):</b> el sistema redacta automáticamente (1) la Solicitud Formal de Reversión de Pago dirigida al banco o billetera emisora con los requisitos taxativos del artículo 2.2.2.51.3 del Decreto 1074 de 2015, (2) la Reclamación Directa al proveedor (requisito de procedibilidad del artículo 58 numeral 5 de la Ley 1480) y (3) el formato de Demanda de Protección al Consumidor ante la SIC o reclamo aeronáutico RAC 3. <b>Paso 4 (Guía de radicación y control de los 15 días hábiles):</b> presenta el instructivo de radicación y el cronograma que controla el término legal de 15 días hábiles para el desembolso bancario (artículo 2.2.2.51.5).",
            body_style,
        )
    )

    # 5. PROPUESTA DE VALOR
    story.append(
        Paragraph(
            "5. PROPUESTA DE VALOR Y DIFERENCIACIÓN EN COLOMBIA",
            heading_style,
        )
    )
    story.append(
        Paragraph(
            "Frente a las alternativas existentes en el país, ReversoYa se diferencia por activar directamente la obligación legal de reembolso a cargo de la entidad financiera emisora: (i) a diferencia de <i>SIC Facilita</i>, que solo opera con comercios registrados voluntariamente y no cubre tiendas informales en redes sociales ni vincula al banco del comprador, ReversoYa dirige la orden al emisor del instrumento de pago (PSE, Nequi o tarjeta); (ii) frente a los formularios bancarios ordinarios, que suelen tramitar los reclamos únicamente como fraude de tarjeta y rechazar controversias por falta de entrega o pagos vía PSE, ReversoYa invoca expresamente el artículo 2.2.2.51.3 del Decreto 1074 de 2015 que impide dicho rechazo; y (iii) frente a las páginas que solo redactan derechos de petición dirigidos al vendedor incumplido, ReversoYa integra simultáneamente la notificación al comercio, la orden vinculante al banco y el expediente para la SIC.",
            body_style,
        )
    )

    # 6. MODELO DE NEGOCIO
    story.append(Paragraph("6. MODELO DE NEGOCIO", heading_style))
    story.append(
        Paragraph(
            "El modelo de ingresos opera en tres niveles sin descontar comisiones sobre el dinero recuperado por el consumidor: (1) <b>Nivel gratuito de autogestión ($0 COP):</b> cualquier ciudadano puede utilizar el verificador de plazos, analizar las respuestas del comercio y descargar manualmente los tres oficios formales sin costo; (2) <b>Tarifa plana por radicación asistida ($19.900 COP por caso):</b> pago único que cubre la remisión electrónica certificada simultánea al comercio, a la entidad financiera y a la SIC junto con el seguimiento de los 15 días hábiles (un costo 95% menor al de un abogado particular); y (3) <b>Suscripción mensual B2B SaaS ($290.000 a $1.200.000 COP/mes):</b> licencia para comercios electrónicos y pasarelas de pago que integran la gestión temprana de retractos y garantías para evitar litigios y multas administrativas.",
            body_style,
        )
    )

    doc.build(story)
    print(f"Built formal 1-page PDF: {filename}")


# ==============================================================================
# 2. RENDER LEGAL SCHEMATIC IMAGES FOR STYLED POWERPOINT SLIDES
# ==============================================================================
DIAGRAM_HEADERS = {
    "brand_shield": "ESQUEMA JURÍDICO · RESTITUCIÓN BANCARIA (DECRETO 587)",
    "counter": "PANORAMA NACIONAL · PAGOS DIGITALES Y BARRERAS (CCCE)",
    "chat_excuses": "AUDITORÍA LEGAL · EXCUSAS INEFICACES Y LEY 527 DE 1999",
    "bars": "ACCESO A LA JUSTICIA · COSTO DE RECLAMACIÓN EN COLOMBIA",
    "pillars": "JERARQUÍA NORMATIVA · C.P., LEY 1480 Y DECRETO 587",
    "timeline15": "PROCEDIMIENTO · 3 OFICIOS Y TÉRMINO DE 15 DÍAS HÁBILES",
    "flight_rac3": "SECTOR AÉREO · LIQUIDACIÓN RAC 3 AEROCIVIL (100% + 30%)",
    "benchmark_matrix": "COMPARATIVA EN COLOMBIA · VINCULACIÓN BANCARIA DIRECTA",
    "pricing_tiers": "SOSTENIBILIDAD · TRES NIVELES CON 0% DE COMISIÓN",
    "impact_summary": "IMPACTO EN COLOMBIA · EFICACIA JURÍDICA Y ESCALA NACIONAL",
}


def render_legal_diagram_png(artifact_type):
    w, h = 680, 500
    img = Image.new("RGB", (w, h), (11, 19, 43))
    draw = ImageDraw.Draw(img)

    for x in range(0, w, 34):
        draw.line([(x, 0), (x, h)], fill=(20, 31, 62), width=1)
    for y in range(0, h, 34):
        draw.line([(0, y), (w, y)], fill=(20, 31, 62), width=1)

    draw.rounded_rectangle([8, 8, w - 8, h - 8], radius=22, fill=(19, 26, 51), outline=(0, 196, 140), width=3)

    draw.rounded_rectangle([28, 24, w - 28, 66], radius=10, fill=(11, 19, 43), outline=(45, 65, 110), width=1)
    header_label = DIAGRAM_HEADERS.get(artifact_type, "ESQUEMA NORMATIVO COLOMBIANO")
    draw.text((44, 35), header_label, font=FONT_SMALL, fill=(99, 252, 192))

    if artifact_type == "brand_shield":
        cx, cy = w // 2, 195
        for r in [52, 84, 114]:
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 140, 100), width=2)
        draw.rounded_rectangle([cx - 64, cy - 64, cx + 64, cy + 64], radius=24, fill=(11, 19, 43), outline=(0, 196, 140), width=4)
        draw.text((cx - 38, cy - 18), "100%", font=FONT_H1, fill=(255, 255, 255))

        cards = [
            ("PASO A · VENTANA DE 5 DÍAS HÁBILES", "Notificación formal al Banco / PSE (Art. 2.2.2.51.4)"),
            ("PASO B · PLAZO MÁXIMO DE 15 DÍAS HÁBILES", "Abono obligatorio en cuenta bancaria (Art. 2.2.2.51.5)"),
        ]
        for i, (k, v) in enumerate(cards):
            by = 325 + i * 74
            draw.rounded_rectangle([32, by, w - 32, by + 64], radius=12, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
            draw.text((48, by + 10), k, font=FONT_SMALL, fill=(99, 252, 192))
            draw.text((48, by + 32), v, font=FONT_BODY, fill=(255, 255, 255))

    elif artifact_type == "counter":
        draw.rounded_rectangle([32, 86, w - 32, 246], radius=16, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
        draw.text((54, 104), "TRANSACCIONES DIGITALES ANUALES EN COLOMBIA", font=FONT_SMALL, fill=(99, 252, 192))
        draw.text((54, 136), "370.000.000+ pagos / año", font=FONT_H1, fill=(255, 255, 255))
        draw.text((54, 192), "PSE · Nequi · Daviplata · Tarjetas Débito y Crédito", font=FONT_BODY, fill=(180, 198, 224))

        stats = [
            ("$62 Billones COP", "Volumen anual e-commerce (CCCE)"),
            ("84% Abandono", "Desisten por costo de abogado ($500k)"),
            ("5 Días Hábiles", "Ventana para obligar al banco emisor"),
        ]
        for i, (st, desc) in enumerate(stats):
            by = 266 + i * 68
            draw.rounded_rectangle([32, by, w - 32, by + 58], radius=10, fill=(11, 19, 43), outline=(56, 189, 248), width=2)
            draw.text((48, by + 10), st, font=FONT_H3, fill=(99, 252, 192))
            draw.text((255, by + 16), desc, font=FONT_BODY, fill=(240, 245, 255))

    elif artifact_type == "chat_excuses":
        items = [
            ("“Solo damos bono de cambio en tienda”", "PROHIBIDO · Art. 47 Ley 1480", (255, 90, 95)),
            ("“Reclámele a Servientrega, ya salió”", "IMPROCEDENTE · Art. 50 lit. h", (255, 90, 95)),
            ("“En promoción o descuento no hay garantía”", "INEFICAZ · Arts. 7 y 43 Ley 1480", (255, 90, 95)),
            ("Sello Criptográfico SHA-256 Verificado ✓", "VÁLIDO · Ley 527 de 1999", (0, 196, 140)),
        ]
        for i, (msg, law, col) in enumerate(items):
            by = 86 + i * 96
            draw.rounded_rectangle([32, by, w - 32, by + 84], radius=12, fill=(11, 19, 43), outline=col, width=2)
            draw.text((48, by + 16), msg, font=FONT_H3, fill=(255, 255, 255))
            draw.text((48, by + 48), law, font=FONT_SMALL, fill=col)

    elif artifact_type == "bars":
        bars = [
            ("Honorarios abogado particular", "$500.000 COP", 0.92, (255, 90, 95)),
            ("Compra digital promedio afectada", "$280.000 COP", 0.58, (56, 189, 248)),
            ("ReversoYa Diagnóstico + 3 Oficios", "$0 COP (Gratis)", 0.28, (0, 196, 140)),
            ("ReversoYa Radicación Asistida", "$19.900 COP", 0.34, (99, 252, 192)),
        ]
        for i, (label, val, ratio, col) in enumerate(bars):
            by = 88 + i * 96
            draw.text((36, by), label, font=FONT_H3, fill=(240, 245, 255))
            bar_w = int((w - 72) * ratio)
            draw.rounded_rectangle([36, by + 30, w - 36, by + 72], radius=8, fill=(11, 19, 43), outline=(45, 65, 110), width=1)
            draw.rounded_rectangle([36, by + 30, 36 + bar_w, by + 72], radius=8, fill=col)
            draw.text((50, by + 40), val, font=FONT_SMALL, fill=(11, 19, 43))

    elif artifact_type == "pillars":
        pillars = [
            ("1. CONSTITUCIÓN Y DD. HH.", "Arts. 78 y 229 C.P. + Directrices ONU A/RES/70/186", (56, 189, 248)),
            ("2. LEY 1480 DE 2011", "Arts. 7, 43, 47, 50, 51, 58 y 61 (Estatuto Consumidor)", (0, 196, 140)),
            ("3. DECRETO 587 DE 2016", "5 días para notificar → 15 días hábiles para abonar", (99, 252, 192)),
            ("4. RAC 3 AEROCIVIL + LEY 527", "100% + 30% en vuelos y pruebas SHA-256", (245, 158, 11)),
        ]
        for i, (k, t, col) in enumerate(pillars):
            by = 86 + i * 96
            draw.rounded_rectangle([32, by, w - 32, by + 84], radius=12, fill=(11, 19, 43), outline=col, width=2)
            draw.text((48, by + 16), k, font=FONT_SMALL, fill=col)
            draw.text((48, by + 44), t, font=FONT_H3, fill=(255, 255, 255))

    elif artifact_type == "timeline15":
        draw.rounded_rectangle([32, 86, w - 32, 206], radius=14, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
        draw.text((50, 104), "TÉRMINO PERENTORIO DE REEMBOLSO BANCARIO (ART. 2.2.2.51.5)", font=FONT_SMALL, fill=(99, 252, 192))
        draw.text((50, 136), "Máximo 15 Días Hábiles", font=FONT_H1, fill=(255, 255, 255))
        draw.rounded_rectangle([50, 182, w - 50, 196], radius=7, fill=(0, 196, 140))

        steps = [
            ("OFICIO 1 · BANCO / PSE", "Orden bajo juramento (Art. 2.2.2.51.3 Dec. 1074/2015)"),
            ("OFICIO 2 · COMERCIO", "Notificación y procedibilidad (Art. 58 num. 5 Ley 1480)"),
            ("OFICIO 3 · SIC / RAC 3", "Demanda jurisdiccional o queja ante Superfinanciera"),
        ]
        for i, (k, v) in enumerate(steps):
            by = 224 + i * 82
            draw.rounded_rectangle([32, by, w - 32, by + 70], radius=10, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
            draw.text((48, by + 12), k, font=FONT_SMALL, fill=(99, 252, 192))
            draw.text((48, by + 36), v, font=FONT_BODY, fill=(255, 255, 255))

    elif artifact_type == "flight_rac3":
        boxes = [
            ("100% REEMBOLSO DEL TIQUETE (VÍA BANCO / PSE)", "$540.000 COP", (56, 189, 248)),
            ("+ 30% COMPENSACIÓN MÍNIMA OBLIGATORIA RAC 3", "+ $162.000 COP", (0, 196, 140)),
            ("TOTAL LÍQUIDO EXIGIBLE EN DINERO EFECTIVO", "= $702.000 COP", (99, 252, 192)),
        ]
        for i, (title, val, col) in enumerate(boxes):
            by = 90 + i * 124
            draw.rounded_rectangle([32, by, w - 32, by + 108], radius=14, fill=(11, 19, 43), outline=col, width=3)
            draw.text((52, by + 18), title, font=FONT_SMALL, fill=(180, 198, 224))
            draw.text((52, by + 48), val, font=FONT_H1, fill=col)

    elif artifact_type == "benchmark_matrix":
        rows = [
            ("SIC Facilita", "Solo comercios voluntarios", "ReversoYa: Vincula al banco emisor"),
            ("Formulario Banco", "Rechaza PSE y no entrega", "ReversoYa: Invoca Art. 2.2.2.51.3"),
            ("Apps Peticiones", "Solo escriben al vendedor", "ReversoYa: Contracargo en 15 días"),
            ("Abogado Particular", "Cuesta $400k – $800k COP", "ReversoYa: $0 Gratis / $19.900 COP"),
        ]
        for i, (name, lim, adv) in enumerate(rows):
            by = 86 + i * 96
            draw.rounded_rectangle([32, by, w - 32, by + 84], radius=12, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
            draw.text((48, by + 14), f"{name}: {lim}", font=FONT_BODY, fill=(252, 165, 165))
            draw.text((48, by + 44), f"✓ {adv}", font=FONT_H3, fill=(99, 252, 192))

    elif artifact_type in ("pricing_tiers", "impact_summary"):
        tiers = (
            [
                ("NIVEL 1 · ACCESO UNIVERSAL B2C", "$0 COP (Gratis)", "Diagnóstico de plazos y descarga de los 3 oficios."),
                ("NIVEL 2 · RADICACIÓN ASISTIDA B2C", "$19.900 COP / caso", "0% comisión sobre reembolso · Envío triple y plazo 15d."),
                ("NIVEL 3 · SUSCRIPCIÓN B2B SAAS", "$290k – $1.2M / mes", "API de retracto y garantía para comercios y pasarelas."),
            ]
            if artifact_type == "pricing_tiers"
            else [
                ("EXPEDIENTE FORMAL COMPLETO", "3 Oficios Legales", "Cumplimiento estricto de los requisitos del Decreto 587."),
                ("PLAZO PERENTORIO BANCARIO", "Máx. 15 Días Hábiles", "Abono del 100% directo a la cuenta del consumidor."),
                ("MODELO ÉTICO Y SOSTENIBLE", "0% Comisión Abusiva", "Gratis ($0) + Radicación ($19.900) + SaaS B2B."),
            ]
        )
        for i, (tag, price, desc) in enumerate(tiers):
            by = 88 + i * 126
            draw.rounded_rectangle([32, by, w - 32, by + 112], radius=14, fill=(11, 19, 43), outline=(0, 196, 140), width=2)
            draw.text((48, by + 14), tag, font=FONT_SMALL, fill=(99, 252, 192))
            draw.text((48, by + 38), price, font=FONT_H2, fill=(255, 255, 255))
            draw.text((48, by + 76), desc, font=FONT_BODY, fill=(203, 213, 225))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


# ==============================================================================
# 3. BUILD STYLED 16:9 POWERPOINT PRESENTATION
# ==============================================================================
def build_styled_pptx(filename="ReversoYa_Presentacion_10Minutos.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    SLIDES_SPEC = [
        {
            "badge": "DIAPOSITIVA 1 DE 10",
            "rubric": "1. NOMBRE · LOGO · ESLOGAN",
            "title": "ReversoYa: “Tu plata de vuelta por ley, sin rogarle al comercio”",
            "subtitle": "Plataforma LegalTech colombiana para reversión de pago, retracto, garantías y compensación aérea RAC 3.",
            "cards": [
                ("NOMBRE Y MARCA", "ReversoYa: Acción directa sobre el dinero retenido en compras digitales."),
                ("SÍMBOLO (LOGO)", "Escudo institucional azul naval con flecha circular de restitución en verde esmeralda."),
                ("REGLA OPERATIVA", "Notificación formal en 5 días hábiles → Reembolso bancario en máximo 15 días hábiles."),
            ],
            "artifact": "brand_shield",
            "norm_summary": "Art. 51 Ley 1480 de 2011 · Decreto 587 de 2016",
            "notes": "Buenas tardes. ¿A cuántos de ustedes les ha pasado que compran algo por internet o redes sociales, pagan por PSE o Nequi, el producto nunca llega o llega roto, y la tienda responde: ‘no devolvemos plata, solo damos un bono’? Para resolver ese problema cotidiano en Colombia creamos ReversoYa. Nuestro símbolo une un escudo azul naval de certeza jurídica con una flecha circular verde esmeralda que representa el retorno íntegro del dinero a la cuenta del ciudadano. Nuestro eslogan resume nuestra tesis: ‘Tu plata de vuelta por ley, sin rogarle al comercio’.",
        },
        {
            "badge": "DIAPOSITIVA 2 DE 10",
            "rubric": "2. IDENTIFICACIÓN DEL PROBLEMA EN COLOMBIA",
            "title": "370 millones de pagos digitales y reclamos que se abandonan",
            "subtitle": "El comercio digital en Colombia supera los $62 billones COP anuales (CCCE), pero el ciudadano choca con dos barreras:",
            "cards": [
                ("BARRERA 1: LAS 4 EXCUSAS DEL COMERCIO", "1) 'Solo damos bono', 2) 'Reclámele a la transportadora', 3) 'En promoción no hay garantía', 4) 'Espere 60 días'."),
                ("BARRERA 2: ASIMETRÍA ECONÓMICA", "Pagar un abogado cuesta entre $400.000 y $800.000 COP, superando el valor de las compras cotidianas ($80k a $900k COP)."),
                ("BARRERA 3: EL PLAZO OCULTO DE 5 DÍAS", "La ley obliga al banco a devolver el dinero, pero exige radicar una solicitud formal dentro de los primeros 5 días hábiles."),
            ],
            "artifact": "counter",
            "norm_summary": "Cámara Colombiana de Comercio Electrónico (CCCE) · Informes SIC",
            "notes": "Veamos la dimensión del problema en el país. Según la Cámara Colombiana de Comercio Electrónico, en Colombia se realizan más de 370 millones de transacciones digitales al año. Sin embargo, cuando una compra falla, el consumidor choca contra cuatro excusas improcedentes del comercio y el alto costo de contratar un abogado particular.",
        },
        {
            "badge": "DIAPOSITIVA 3 DE 10",
            "rubric": "2. PROBLEMA JURÍDICO · DERECHOS · LEGISLACIÓN",
            "title": "Arquitectura Normativa: El derecho ya existe en Colombia",
            "subtitle": "Articulación entre Constitución Política, Derechos Humanos, Estatuto del Consumidor y Decreto 587 de 2016:",
            "cards": [
                ("CONSTITUCIÓN Y DD. HH.", "Art. 78 C.P. (protección al consumidor), Art. 229 C.P. (acceso a la justicia) y Directrices ONU (Res. A/RES/70/186)."),
                ("LEY 1480 DE 2011", "Art. 51 (Reversión de pago), Art. 47 (Retracto en 5 días en dinero, sin bonos) y Arts. 7, 8 y 43 (Garantía en promociones)."),
                ("DECRETO 587 DE 2016 Y RAC 3", "Art. 2.2.2.51.4 (5 días para avisar) → Art. 2.2.2.51.5 (15 días para que el banco abone el 100%) + RAC 3 Aerocivil (30% extra)."),
            ],
            "artifact": "pillars",
            "norm_summary": "Arts. 78 y 229 C.P. · Ley 1480/2011 · Decreto 587/2016 · RAC 3",
            "notes": "Colombia cuenta con una legislación robusta anclada en los artículos 78 y 229 de la Constitución, la Ley 1480 de 2011 y el Decreto 587 de 2016: si notificas dentro de los 5 días hábiles siguientes al incumplimiento, tu propio banco está obligado a reversar el 100% del dinero en máximo 15 días hábiles.",
        },
        {
            "badge": "DIAPOSITIVA 4 DE 10",
            "rubric": "3. PÚBLICO OBJETIVO",
            "title": "Público Objetivo: Compradores digitales y ecosistema B2B",
            "subtitle": "Diseñado para ciudadanos sin conocimientos jurídicos y para el ecosistema de pagos electrónicos:",
            "cards": [
                ("SEGMENTO B2C (CIUDADANOS)", "Colombianos de 18 a 55 años (estratos 2 al 5) que compran online, en Instagram/WhatsApp o aerolíneas."),
                ("MEDIOS Y CUANTÍAS", "Usuarios de PSE, Nequi, Daviplata y tarjetas con reclamos entre $80.000 y $4.000.000 COP."),
                ("SEGMENTO B2B (COMERCIOS Y PASARELAS)", "Pasarelas (Wompi, Bold, Mercado Pago) y comercios que previenen demandas SIC y multas de hasta 2.000 SMLMV."),
            ],
            "artifact": "bars",
            "norm_summary": "Acceso Material a la Justicia (Art. 229 C.P. y Art. 61 Ley 1480)",
            "notes": "En el segmento B2C nos dirigimos a compradores digitales y viajeros en Colombia entre los 18 y 55 años que usan PSE, Nequi, Daviplata o tarjetas; y en el segmento B2B, a pasarelas y comercios formales.",
        },
        {
            "badge": "DIAPOSITIVA 5 DE 10",
            "rubric": "4. SOLUCIÓN Y FLUJO DE PANTALLAS (PARTE 1)",
            "title": "Flujo Guiado: Pantallas 1 y 2 (Plazo y Auditoría de Excusas)",
            "subtitle": "Inspirado en las calculadoras laborales paso a paso, elimina la complejidad técnica en 4 pasos:",
            "cards": [
                ("PANTALLA 1: DATOS Y PLAZO DE 5 DÍAS", "Selecciona causal, monto, medio de pago (PSE/Nequi/Tarjeta) y verifica si aplica reversión bancaria o ruta SIC."),
                ("PANTALLA 2: DETECTOR DE EXCUSAS", "Analiza la respuesta de WhatsApp o correo e identifica las cláusulas nulas de pleno derecho (Arts. 43, 47 y 50 Ley 1480)."),
                ("VALIDEZ PROBATORIA (LEY 527 DE 1999)", "Calcula la huella criptográfica SHA-256 de los comprobantes y capturas de pantalla para el anexo probatorio."),
            ],
            "artifact": "chat_excuses",
            "norm_summary": "Arts. 43, 47 y 50 Ley 1480 de 2011 · Ley 527 de 1999",
            "notes": "En la Pantalla 1 el usuario valida cuántos de los 5 días hábiles le quedan, y en la Pantalla 2 analiza la respuesta del vendedor en WhatsApp y certifica los soportes con huella SHA-256 conforme a la Ley 527 de 1999.",
        },
        {
            "badge": "DIAPOSITIVA 6 DE 10",
            "rubric": "4. SOLUCIÓN Y FLUJO DE PANTALLAS (PARTE 2)",
            "title": "Flujo Guiado: Pantallas 3 y 4 (3 Oficios y Plazo de 15 Días)",
            "subtitle": "Estructura los requisitos taxativos del Art. 2.2.2.51.3 del Decreto 1074 de 2015 para impedir rechazos de forma:",
            "cards": [
                ("OFICIO 1: ORDEN VINCULANTE AL BANCO", "Solicitud formal bajo juramento exigiendo la reversión del 100% al instrumento de pago electrónico."),
                ("OFICIOS 2 Y 3: COMERCIO Y SIC", "Reclamación directa al proveedor (requisito Art. 58 num. 5) y formato de Demanda de Protección al Consumidor."),
                ("PANTALLA 4: PLAZO DE 15 DÍAS HÁBILES", "Controla el término perentorio del banco (Art. 2.2.2.51.5) y habilita queja ante Superfinanciera si hay mora al día 16."),
            ],
            "artifact": "timeline15",
            "norm_summary": "Arts. 2.2.2.51.3 y 2.2.2.51.5 Decreto 1074 de 2015",
            "notes": "En la Pantalla 3 ReversoYa genera los 3 documentos formales con todos los requisitos del Decreto 587 para que el banco no pueda rechazarlos, y en la Pantalla 4 controla los 15 días hábiles hasta el abono efectivo.",
        },
        {
            "badge": "DIAPOSITIVA 7 DE 10",
            "rubric": "4. ALCANCE SECTORIAL · TRANSPORTE AÉREO RAC 3",
            "title": "Módulo Aeronáutico: 100% Tiquete + 30% Compensación RAC 3",
            "subtitle": "Aplicación en sobreventa (overbooking) o cancelación atribuible a la aerolínea en Colombia:",
            "cards": [
                ("100% REEMBOLSO DEL TIQUETE", "En un tiquete de $540.000 COP, ordena la reversión íntegra de $540.000 COP a través del banco emisor."),
                ("+30% COMPENSACIÓN MÍNIMA RAC 3", "Liquida automáticamente +$162.000 COP adicionales exigibles a la aerolínea según los Reglamentos Aeronáuticos."),
                ("RESTITUCIÓN EN DINERO EFECTIVO", "Total exigible: $702.000 COP en dinero efectivo, sin obligar al pasajero a recibir bonos o millas."),
            ],
            "artifact": "flight_rac3",
            "norm_summary": "Reglamentos Aeronáuticos de Colombia (RAC 3 Aerocivil)",
            "notes": "En el módulo aeronáutico bajo el RAC 3 de la Aerocivil, si sobrevenden un tiquete de $540.000 pesos, ReversoYa calcula automáticamente $702.000 pesos exigibles en efectivo (100% del pasaje más 30% de compensación).",
        },
        {
            "badge": "DIAPOSITIVA 8 DE 10",
            "rubric": "5. PROPUESTA DE VALOR Y BENCHMARK EN COLOMBIA",
            "title": "¿Qué existe hoy en Colombia y por qué ReversoYa es único?",
            "subtitle": "Comparación frente a las herramientas existentes en el mercado colombiano:",
            "cards": [
                ("FRENTE A SIC FACILITA", "SIC Facilita solo opera con comercios inscritos voluntariamente; ReversoYa vincula directamente al banco/PSE."),
                ("FRENTE A FORMULARIOS BANCARIOS", "Los bancos suelen tramitar solo fraude de tarjeta y rechazar PSE; ReversoYa invoca el Art. 2.2.2.51.3 Dec. 1074/2015."),
                ("FRENTE A GENERADORES DE PETICIONES", "Escribir solo al vendedor no recupera el dinero si este no contesta; ReversoYa activa el débito bancario en 15 días."),
            ],
            "artifact": "benchmark_matrix",
            "norm_summary": "Efectividad Vinculante frente al Emisor Financiero",
            "notes": "Al comparar con lo que existe hoy en Colombia vemos nuestra ventaja: ni SIC Facilita ni las apps de peticiones simples accionan la obligación del banco emisor. ReversoYa activa el reembolso bancario forzoso en 15 días hábiles.",
        },
        {
            "badge": "DIAPOSITIVA 9 DE 10",
            "rubric": "6. MODELO DE NEGOCIO",
            "title": "Modelo de Negocio: Sostenible y con 0% de comisión",
            "subtitle": "Estructura de tres niveles que garantiza acceso universal y viabilidad financiera:",
            "cards": [
                ("1. NIVEL FREEMIUM ($0 COP)", "Diagnóstico de plazos, auditoría de excusas y descarga manual de los 3 oficios totalmente gratis."),
                ("2. RADICACIÓN ASISTIDA ($19.900 COP)", "Tarifa plana única por caso (0% comisión sobre el reembolso y 95% más barato que un abogado) con envío simultáneo."),
                ("3. SUSCRIPCIÓN B2B SAAS ($290k – $1.2M/mes)", "API para comercios y pasarelas que resuelven retractos en 1 clic y previenen multas de hasta 2.000 SMLMV."),
            ],
            "artifact": "pricing_tiers",
            "norm_summary": "Sostenibilidad B2C ($0 / $19.900 COP) y Cumplimiento B2B",
            "notes": "Nuestro modelo combina un nivel Freemium gratuito con una tarifa plana de $19.900 pesos por radicación asistida (sin cobrar comisión sobre lo recuperado) y una licencia B2B SaaS mensual para comercios y pasarelas.",
        },
        {
            "badge": "DIAPOSITIVA 10 DE 10",
            "rubric": "CONCLUSIÓN E IMPACTO EN ACCESO A LA JUSTICIA",
            "title": "Cuando la ley es ejecutable para el ciudadano, el abuso desaparece",
            "subtitle": "Síntesis del impacto jurídico, social y tecnológico de ReversoYa en Colombia:",
            "cards": [
                ("EFICACIA MATERIAL (ART. 78 Y 229 C.P.)", "Convierte el Estatuto del Consumidor y el Decreto 587 de 2016 en una defensa ciudadana inmediata."),
                ("RIGOR TÉCNICO Y PROBATORIO", "Cumple estrictamente el Art. 2.2.2.51.3 del Decreto 1074 de 2015 y la Ley 527 de 1999."),
                ("ESCALABILIDAD NACIONAL", "Protege desde compras de $80.000 COP en redes sociales hasta tiquetes aéreos bajo el RAC 3."),
            ],
            "artifact": "impact_summary",
            "norm_summary": "Protección Constitucional del Consumidor en Colombia",
            "notes": "En conclusión: con ReversoYa demostramos que cuando el artículo 78 de la Constitución y la Ley 1480 se traducen en una herramienta clara para el ciudadano, el abuso comercial deja de ser rentable. Muchas gracias.",
        },
    ]

    for idx, sp in enumerate(SLIDES_SPEC, start=1):
        slide = prs.slides.add_slide(blank_layout)

        # 1. Dark Navy Slide Background
        bg = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)
        )
        bg.fill.solid()
        bg.fill.fore_color.rgb = RGBColor(11, 19, 43)
        bg.line.fill.background()

        # 2. Top Header Bar
        top_bar = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.5),
            Inches(0.35),
            Inches(12.333),
            Inches(0.55),
        )
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = RGBColor(19, 26, 51)
        top_bar.line.color.rgb = RGBColor(0, 196, 140)
        top_bar.line.width = Pt(1.2)

        tb_tf = top_bar.text_frame
        tb_tf.word_wrap = True
        p_top = tb_tf.paragraphs[0]
        p_top.text = f"{sp['badge']}   |   {sp['rubric']}"
        p_top.font.size = Pt(11)
        p_top.font.bold = True
        p_top.font.color.rgb = RGBColor(99, 252, 192)
        p_top.font.name = "Segoe UI"

        # 3. Left Column Title & Subtitle
        title_box = slide.shapes.add_textbox(
            Inches(0.5), Inches(1.05), Inches(7.1), Inches(1.45)
        )
        t_tf = title_box.text_frame
        t_tf.word_wrap = True
        p_title = t_tf.paragraphs[0]
        p_title.text = sp["title"]
        p_title.font.size = Pt(23)
        p_title.font.bold = True
        p_title.font.color.rgb = RGBColor(255, 255, 255)
        p_title.font.name = "Segoe UI"

        p_sub = t_tf.add_paragraph()
        p_sub.text = sp["subtitle"]
        p_sub.font.size = Pt(12.5)
        p_sub.font.color.rgb = RGBColor(203, 213, 225)
        p_sub.font.name = "Segoe UI"

        # 4. Left Column 3 Styled Cards
        for c_i, (c_head, c_body) in enumerate(sp["cards"]):
            card_y = 2.62 + c_i * 1.42
            card = slide.shapes.add_shape(
                MSO_SHAPE.ROUNDED_RECTANGLE,
                Inches(0.5),
                Inches(card_y),
                Inches(7.1),
                Inches(1.28),
            )
            card.fill.solid()
            card.fill.fore_color.rgb = RGBColor(19, 26, 51)
            card.line.color.rgb = (
                RGBColor(0, 196, 140) if c_i == 0 else RGBColor(48, 65, 108)
            )
            card.line.width = Pt(1.5)

            c_tf = card.text_frame
            c_tf.word_wrap = True
            p1 = c_tf.paragraphs[0]
            p1.text = c_head
            p1.font.size = Pt(11.5)
            p1.font.bold = True
            p1.font.color.rgb = RGBColor(99, 252, 192)
            p1.font.name = "Segoe UI"

            p2 = c_tf.add_paragraph()
            p2.text = c_body
            p2.font.size = Pt(12.5)
            p2.font.color.rgb = RGBColor(248, 250, 252)
            p2.font.name = "Segoe UI"

        # 5. Right Column: Embedded Legal Diagram PNG + Normative Synthesis Card
        png_stream = render_legal_diagram_png(sp["artifact"])
        slide.shapes.add_picture(
            png_stream, Inches(7.85), Inches(1.08), width=Inches(4.98)
        )

        meta_card = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(7.85),
            Inches(4.90),
            Inches(4.98),
            Inches(1.84),
        )
        meta_card.fill.solid()
        meta_card.fill.fore_color.rgb = RGBColor(19, 26, 51)
        meta_card.line.color.rgb = RGBColor(0, 196, 140)
        meta_card.line.width = Pt(1.5)

        m_tf = meta_card.text_frame
        m_tf.word_wrap = True
        pm1 = m_tf.paragraphs[0]
        pm1.text = "FUNDAMENTO NORMATIVO EN COLOMBIA"
        pm1.font.size = Pt(11)
        pm1.font.bold = True
        pm1.font.color.rgb = RGBColor(99, 252, 192)
        pm1.font.name = "Segoe UI"

        pm2 = m_tf.add_paragraph()
        pm2.text = sp["norm_summary"]
        pm2.font.size = Pt(11.5)
        pm2.font.bold = True
        pm2.font.color.rgb = RGBColor(255, 255, 255)
        pm2.font.name = "Segoe UI"

        pm3 = m_tf.add_paragraph()
        pm3.text = sp["cards"][0][1]
        pm3.font.size = Pt(11)
        pm3.font.color.rgb = RGBColor(203, 213, 225)
        pm3.font.name = "Segoe UI"

        # 6. Bottom Footer Bar
        footer_box = slide.shapes.add_textbox(
            Inches(0.5), Inches(6.95), Inches(12.333), Inches(0.35)
        )
        f_tf = footer_box.text_frame
        p_f = f_tf.paragraphs[0]
        p_f.text = f"ReversoYa Colombia · Ley 1480 de 2011 · Decreto 587 de 2016 · RAC 3 Aerocivil   |   Diapositiva {idx} de 10"
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = RGBColor(148, 163, 184)
        p_f.font.name = "Segoe UI"

        # 7. Speaker Notes
        notes_slide = slide.notes_slide
        notes_slide.notes_text_frame.text = sp["notes"]

    prs.save(filename)
    print(f"Saved styled PowerPoint: {filename}")


if __name__ == "__main__":
    build_formal_pdf()
    build_styled_pptx()
