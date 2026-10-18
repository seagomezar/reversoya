// ReversoYa: Motor de Narrativa Visual y Esquemas Normativos (Canvas 2D)
// Articula los 5 capítulos jurídicos en una sola animación continua

window.ReversoMotionEngine = (function () {
  function easeOutCubic(x) {
    const clamped = Math.max(0, Math.min(1, x));
    return 1 - Math.pow(1 - clamped, 3);
  }

  function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke, strokeW = 1.5) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeW;
      ctx.stroke();
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || '').split(' ');
    let line = '';
    let cy = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, cy);
        line = words[n] + ' ';
        cy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, cy);
    return cy;
  }

  // Builds a single coherent timeline linking all chapters and scenes sequentially
  function buildUnifiedTimeline(videos) {
    const list = Array.isArray(videos) ? videos : [];
    const scenes = [];
    const chapters = [];
    let cursor = 0;

    list.forEach((chapter, cIdx) => {
      const chapterStart = cursor;
      const chapterScenes = chapter.scenes || [];
      chapterScenes.forEach((sc, sIdx) => {
        const dur = Math.max(1, (sc.end || 9) - (sc.start || 0));
        const gStart = cursor;
        const gEnd = cursor + dur;
        scenes.push({
          globalIndex: scenes.length,
          chapterIndex: cIdx,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          chapterSubtitle: chapter.subtitle,
          chapterLegalFocus: chapter.legalFocus || '',
          chapterAccent: chapter.accent || '#00C48C',
          sceneIndexInChapter: sIdx,
          scenesInChapter: chapterScenes.length,
          globalStart: gStart,
          globalEnd: gEnd,
          duration: dur,
          stepTitle: sc.stepTitle || sc.kicker,
          tag: sc.tag,
          kicker: sc.kicker,
          headline: sc.headline,
          stat: sc.stat,
          sub: sc.sub,
          voiceover: sc.voiceover,
          visualType: sc.visualType
        });
        cursor = gEnd;
      });
      chapters.push({
        index: cIdx,
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle,
        legalFocus: chapter.legalFocus || '',
        accent: chapter.accent || '#00C48C',
        globalStart: chapterStart,
        globalEnd: cursor,
        sceneCount: chapterScenes.length
      });
    });

    return {
      totalDuration: Math.max(1, cursor),
      totalScenes: scenes.length,
      chapters,
      scenes
    };
  }

  // Draws the legal schematic inside the bounding box (rx, ry, rw, rh)
  function drawArtifactBox(ctx, type, rx, ry, rw, rh, sceneProgress, t) {
    drawRoundedRect(ctx, rx, ry, rw, rh, 18, '#131A33', 'rgba(255,255,255,0.14)', 1.5);
    const p = easeOutCubic(Math.min(1, sceneProgress * 1.8));
    const cx = rx + rw / 2;

    ctx.save();
    ctx.textAlign = 'left';

    if (type === 'brand_shield') {
      const scy = ry + 130;
      for (let ring = 1; ring <= 3; ring++) {
        const rad = 42 * ring + ((t * 22) % 30);
        ctx.beginPath();
        ctx.arc(cx, scy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 196, 140, ${0.26 - ring * 0.06})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      drawRoundedRect(ctx, cx - 56, scy - 56, 112, 112, 24, '#0B132B', '#00C48C', 3);
      ctx.beginPath();
      ctx.arc(cx, scy, 32, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 1.75 * p);
      ctx.strokeStyle = '#63FCC0';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100%', cx, scy + 8);

      const steps = [
        { k: 'PASO A · 5 DÍAS HÁBILES', v: 'Notificación formal al Banco / PSE', c: '#00C48C' },
        { k: 'PASO B · MÁX. 15 DÍAS HÁBILES', v: 'Abono obligatorio en tu cuenta (Dec. 587)', c: '#63FCC0' }
      ];
      steps.forEach((st, idx) => {
        const by = ry + 225 + idx * 70;
        drawRoundedRect(ctx, rx + 26, by, rw - 52, 58, 12, '#0B132B', st.c, 1.5);
        ctx.textAlign = 'left';
        ctx.fillStyle = st.c;
        ctx.font = '800 11px Inter, sans-serif';
        ctx.fillText(st.k, rx + 42, by + 22);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(st.v, rx + 42, by + 44);
      });
    } else if (type === 'counter') {
      const cy = ry + 130;
      for (let r = 1; r <= 3; r++) {
        const rad = 40 * r + ((t * 25) % 32);
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 196, 140, ${0.26 - r * 0.06})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      drawRoundedRect(ctx, rx + 30, ry + 36, rw - 60, 145, 16, '#0B132B', '#00C48C', 2);
      ctx.fillStyle = '#63FCC0';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRANSACCIONES DIGITALES ANUALES EN COLOMBIA', cx, ry + 70);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
      const val = Math.round(370 * p);
      ctx.fillText(`${val} Millones / año`, cx, ry + 122);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('PSE · Nequi · Daviplata · Tarjetas Débito y Crédito', cx, ry + 156);

      const channels = [
        { l: 'Volumen anual', v: '$62B COP' },
        { l: 'Abandono reclamo', v: '84% casos' },
        { l: 'Plazo bancario', v: '5 días háb.' }
      ];
      const cardW = (rw - 76) / 3;
      channels.forEach((ch, i) => {
        const bx = rx + 26 + i * (cardW + 12);
        drawRoundedRect(ctx, bx, ry + 210, cardW, 130, 12, '#0B132B', 'rgba(0,196,140,0.45)', 1.5);
        ctx.fillStyle = '#63FCC0';
        ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(ch.v, bx + cardW / 2, ry + 268);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText(ch.l, bx + cardW / 2, ry + 298);
      });
    } else if (type === 'chat_excuses') {
      const excuses = [
        { msg: '“Solo damos bono de cambio en la tienda”', law: 'PROHIBIDO · Art. 47 Ley 1480', col: '#FF5A5F' },
        { msg: '“Reclámele a Servientrega, ya salió”', law: 'IMPROCEDENTE · Art. 50 lit. h', col: '#FF5A5F' },
        { msg: '“En promoción o descuento no hay garantía”', law: 'INEFICAZ · Arts. 7 y 43 Ley 1480', col: '#FF5A5F' },
        { msg: 'Sello Probatorio SHA-256 Verificado ✓', law: 'VÁLIDO · Ley 527 de 1999', col: '#00C48C' }
      ];
      excuses.forEach((ex, i) => {
        const appear = easeOutCubic(Math.max(0, Math.min(1, (sceneProgress - i * 0.12) * 2.5)));
        const by = ry + 22 + i * 84 + (1 - appear) * 16;
        ctx.globalAlpha = appear;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 72, 12, '#0B132B', ex.col, 1.8);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 13.5px Inter, sans-serif';
        ctx.fillText(ex.msg, rx + 40, by + 28);
        ctx.fillStyle = ex.col;
        ctx.font = '800 11.5px Inter, sans-serif';
        ctx.fillText(ex.law, rx + 40, by + 52);
      });
      ctx.globalAlpha = 1;
    } else if (type === 'bars') {
      const bars = [
        { label: 'Honorarios abogado particular', val: '$500.000 COP', w: 0.92, col: '#FF5A5F' },
        { label: 'Compra digital promedio afectada', val: '$280.000 COP', w: 0.56, col: '#38BDF8' },
        { label: 'ReversoYa Diagnóstico + 3 Oficios', val: '$0 COP (Gratis)', w: 0.22, col: '#00C48C' },
        { label: 'ReversoYa Radicación Asistida', val: '$19.900 COP', w: 0.28, col: '#63FCC0' }
      ];
      bars.forEach((b, i) => {
        const by = ry + 34 + i * 82;
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(b.label, rx + 28, by);
        drawRoundedRect(ctx, rx + 28, by + 10, rw - 56, 34, 8, '#0B132B', 'rgba(255,255,255,0.12)');
        drawRoundedRect(ctx, rx + 28, by + 10, Math.max(115, (rw - 56) * b.w * p), 34, 8, b.col, null);
        ctx.fillStyle = '#0B132B';
        ctx.font = '800 12.5px Inter, sans-serif';
        ctx.fillText(b.val, rx + 40, by + 32);
      });
    } else if (type === 'clock5' || type === 'timeline15') {
      const is5 = type === 'clock5';
      drawRoundedRect(ctx, rx + 26, ry + 26, rw - 52, 108, 14, '#0B132B', '#00C48C', 2);
      ctx.fillStyle = '#63FCC0';
      ctx.font = '800 11.5px Inter, sans-serif';
      ctx.fillText(
        is5
          ? 'ART. 2.2.2.51.4 DEC. 1074 · PLAZO DEL COMPRADOR'
          : 'ART. 2.2.2.51.5 DEC. 1074 · OBLIGACIÓN DEL BANCO',
        rx + 44,
        ry + 56
      );
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 27px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        is5 ? 'Máximo 5 Días Hábiles' : 'Máximo 15 Días Hábiles',
        rx + 44,
        ry + 100
      );

      drawRoundedRect(ctx, rx + 26, ry + 154, rw - 52, 20, 10, '#0B132B', 'rgba(255,255,255,0.15)');
      drawRoundedRect(ctx, rx + 26, ry + 154, Math.max(36, (rw - 52) * p), 20, 10, '#00C48C', null);

      const milestones = is5
        ? [
            'Hito 1: Incumplimiento de entrega o defecto del bien',
            'Hito 2: Reclamación al comercio y sello SHA-256',
            'Hito 3: Orden de reversión radicada ante el banco/PSE'
          ]
        : [
            'Hito 1: Radicación ante Comercio + Banco + SIC',
            'Hito 2: Cierre del plazo de objeción del comercio (5d)',
            'Hito 3: Abono obligatorio del 100% en tu cuenta (15d)'
          ];
      milestones.forEach((m, i) => {
        const my = ry + 196 + i * 52;
        drawRoundedRect(ctx, rx + 26, my, rw - 52, 40, 10, '#0B132B', 'rgba(0,196,140,0.4)', 1.2);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 12.5px Inter, sans-serif';
        ctx.fillText('✓  ' + m, rx + 42, my + 25);
      });
    } else if (type === 'pillars') {
      const pillars = [
        { k: '1. CONSTITUCIÓN Y DD. HH.', t: 'Arts. 78 y 229 C.P. + ONU A/RES/70/186', c: '#38BDF8' },
        { k: '2. LEY 1480 DE 2011', t: 'Arts. 7, 43, 47, 50, 51 y 58 (Estatuto Consumidor)', c: '#00C48C' },
        { k: '3. DECRETO 587 DE 2016', t: '5 días para notificar → 15 días para abonar', c: '#63FCC0' },
        { k: '4. RAC 3 AEROCIVIL + LEY 527', t: '100% + 30% en vuelos y pruebas SHA-256', c: '#F59E0B' }
      ];
      pillars.forEach((pl, i) => {
        const appear = easeOutCubic(Math.max(0, Math.min(1, (sceneProgress - i * 0.1) * 2.5)));
        const by = ry + 22 + i * 84;
        ctx.globalAlpha = appear;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 72, 12, '#0B132B', pl.c, 1.8);
        ctx.fillStyle = pl.c;
        ctx.font = '800 11px Inter, sans-serif';
        ctx.fillText(pl.k, rx + 40, by + 26);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(pl.t, rx + 40, by + 50);
      });
      ctx.globalAlpha = 1;
    } else if (type === 'law_badges' || type === 'causals_wheel') {
      const items = type === 'law_badges'
        ? [
            { badge: 'ART. 47 LEY 1480', title: 'Retracto en dinero efectivo', desc: 'Prohibido obligar al comprador a recibir bonos o saldos.' },
            { badge: 'ARTS. 7, 8 Y 43', title: 'Garantía obligatoria en promociones', desc: 'Es ineficaz de pleno derecho negar garantía por descuento.' },
            { badge: 'ART. 50 LIT. H', title: 'Responsabilidad directa de entrega', desc: 'El comercio responde hasta la entrega material efectiva.' }
          ]
        : [
            { badge: 'CAUSALES 1, 2 Y 3', title: 'Fraude, cobro no solicitado o cobro doble', desc: 'Cargo electrónico no autorizado o debitado dos veces.' },
            { badge: 'CAUSAL 4 · ART. 51', title: 'Producto no entregado en la fecha pactada', desc: 'Incumplimiento de envío en compras online o redes.' },
            { badge: 'CAUSAL 5 · ART. 51', title: 'Producto defectuoso o distinto a lo anunciado', desc: 'Habilita ordenar al banco la reversión del 100%.' }
          ];
      items.forEach((it, i) => {
        const by = ry + 26 + i * 110;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 96, 12, '#0B132B', '#00C48C', 1.8);
        drawRoundedRect(ctx, rx + 40, by + 14, 164, 22, 6, 'rgba(0,196,140,0.18)', null);
        ctx.fillStyle = '#63FCC0';
        ctx.font = '800 11px Inter, sans-serif';
        ctx.fillText(it.badge, rx + 50, by + 29);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(it.title, rx + 40, by + 56);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '500 12px Inter, sans-serif';
        ctx.fillText(it.desc, rx + 40, by + 78);
      });
    } else if (type === 'ui_step1' || type === 'docs_triple') {
      const cards = type === 'ui_step1'
        ? [
            { step: 'PASO 1', name: 'Datos de la compra y plazo de 5 días', status: 'PSE / Nequi / Tarjeta' },
            { step: 'PASO 2', name: 'Auditoría de excusas y huella SHA-256', status: 'Arts. 43, 47, 50 + Ley 527' },
            { step: 'PASO 3', name: 'Generación de los 3 oficios formales', status: 'Art. 2.2.2.51.3 Dec. 1074' },
            { step: 'PASO 4', name: 'Guía de radicación y plazo de 15 días', status: 'Abono bancario 100%' }
          ]
        : [
            { step: 'OFICIO 1', name: 'Solicitud Formal de Reversión al Banco', status: 'Requisitos Art. 2.2.2.51.3' },
            { step: 'OFICIO 2', name: 'Reclamación Directa al Comercio', status: 'Procedibilidad Art. 58 num. 5' },
            { step: 'OFICIO 3', name: 'Demanda Jurisdiccional SIC / RAC 3', status: 'Mínima cuantía sin abogado' },
            { step: 'ANEXO', name: 'Certificación de Mensajes de Datos', status: 'Huella SHA-256 · Ley 527/1999' }
          ];
      cards.forEach((c, i) => {
        const by = ry + 22 + i * 84;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 72, 12, '#0B132B', '#00C48C', 1.5);
        drawRoundedRect(ctx, rx + 38, by + 16, 78, 40, 8, '#00C48C', null);
        ctx.fillStyle = '#0B132B';
        ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.step, rx + 77, by + 41);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(c.name, rx + 130, by + 33);
        ctx.fillStyle = '#63FCC0';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText(c.status, rx + 130, by + 53);
      });
    } else if (type === 'case1_pse' || type === 'case2_garantia' || type === 'case4_sic') {
      const caseBoxes = type === 'case1_pse'
        ? [
            { badge: 'HECHO · COMPRA ONLINE VÍA PSE', title: '$680.000 COP no entregados en fecha pactada', desc: 'El comercio ofreció solo un bono de cambio en tienda.', col: '#FF5A5F' },
            { badge: 'NORMA · ART. 47 Y ART. 51 NUM. 4', title: 'Prohibido imponer bonos · Procede reversión', desc: 'Notificación formal dentro de los 5 días hábiles.', col: '#38BDF8' },
            { badge: 'RESULTADO · ART. 2.2.2.51.5 DEC. 1074', title: '100% restituido en cuenta ($680.000 COP)', desc: 'Abono directo por el banco emisor en máx. 15 días.', col: '#00C48C' }
          ]
        : type === 'case2_garantia'
        ? [
            { badge: 'HECHO · PRODUCTO EN DESCUENTO', title: '$1.450.000 COP recibido con falla técnica', desc: 'El vendedor negó responder alegando promoción.', col: '#FF5A5F' },
            { badge: 'NORMA · ARTS. 7, 8 Y 43 LEY 1480', title: 'Cláusula que niega garantía es ineficaz', desc: 'La promoción no elimina la garantía legal obligatoria.', col: '#38BDF8' },
            { badge: 'RESULTADO · CAUSAL 5 ART. 51', title: 'Reversión bancaria de $1.450.000 COP', desc: 'Devolución íntegra al instrumento de pago electrónico.', col: '#00C48C' }
          ]
        : [
            { badge: 'SUPUESTO · MÁS DE 5 DÍAS HÁBILES', title: 'Venció la ventana administrativa ante el banco', desc: 'El comprador conserva su acción jurisdiccional.', col: '#F59E0B' },
            { badge: 'NORMA · ART. 58 LEY 1480 Y ART. 24 CGP', title: 'Demanda de protección al consumidor ante la SIC', desc: 'Mínima cuantía sin requerir abogado + huella SHA-256.', col: '#38BDF8' },
            { badge: 'RESULTADO · SENTENCIA Y SANCIÓN SIC', title: 'Orden judicial de devolución + multa 2.000 SMLMV', desc: 'Cobertura jurídica completa en todo el territorio.', col: '#00C48C' }
          ];
      caseBoxes.forEach((cb, i) => {
        const by = ry + 26 + i * 110;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 96, 12, '#0B132B', cb.col, 1.8);
        ctx.fillStyle = cb.col;
        ctx.font = '800 11px Inter, sans-serif';
        ctx.fillText(cb.badge, rx + 40, by + 26);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(cb.title, rx + 40, by + 53);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '500 12px Inter, sans-serif';
        ctx.fillText(cb.desc, rx + 40, by + 77);
      });
    } else if (type === 'flight_rac3') {
      const boxes = [
        { title: '100% REEMBOLSO DEL TIQUETE (VÍA BANCO)', val: '$540.000 COP', col: '#38BDF8' },
        { title: '+ 30% COMPENSACIÓN MÍNIMA RAC 3 AEROCIVIL', val: '+ $162.000 COP', col: '#00C48C' },
        { title: 'TOTAL EXIGIBLE EN DINERO (NO EN VOUCHERS)', val: '= $702.000 COP', col: '#63FCC0' }
      ];
      boxes.forEach((b, i) => {
        const by = ry + 28 + i * 108;
        drawRoundedRect(ctx, rx + 28, by, rw - 56, 94, 14, '#0B132B', b.col, 2);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '700 11.5px Inter, sans-serif';
        ctx.fillText(b.title, rx + 46, by + 30);
        ctx.fillStyle = b.col;
        ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(b.val, rx + 46, by + 68);
      });
    } else if (type === 'benchmark_matrix') {
      const rows = [
        { name: 'SIC Facilita', limit: 'Solo comercios voluntarios', rev: 'ReversoYa: Vincula al banco' },
        { name: 'Formulario Banco', limit: 'Rechaza PSE / no entrega', rev: 'ReversoYa: Invoca Dec. 587' },
        { name: 'Apps Peticiones', limit: 'Solo escriben al vendedor', rev: 'ReversoYa: Contracargo 15d' },
        { name: 'Abogado Particular', limit: 'Cuesta $400k – $800k COP', rev: 'ReversoYa: $0 / $19.900 COP' }
      ];
      rows.forEach((r, i) => {
        const by = ry + 22 + i * 84;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 72, 12, '#0B132B', 'rgba(255,255,255,0.16)', 1.5);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${r.name}: `, rx + 38, by + 28);
        ctx.fillStyle = '#FCA5A5';
        ctx.font = '500 12.5px Inter, sans-serif';
        ctx.fillText(r.limit, rx + 185, by + 28);
        ctx.fillStyle = '#63FCC0';
        ctx.font = '800 13px Inter, sans-serif';
        ctx.fillText('✓ ' + r.rev, rx + 38, by + 52);
      });
    } else if (
      type === 'pricing_tiers' ||
      type === 'pricing_tier1' ||
      type === 'pricing_tier2' ||
      type === 'impact_summary'
    ) {
      const isImpact = type === 'impact_summary';
      const activeTierIdx = type === 'pricing_tier1' ? 0 : type === 'pricing_tier2' ? 1 : 1;
      const tiers = !isImpact
        ? [
            { tag: 'NIVEL 1 · ACCESO UNIVERSAL B2C', price: '$0 COP (Gratis)', desc: 'Diagnóstico de plazos, excusas y descarga de los 3 oficios.' },
            { tag: 'NIVEL 2 · RADICACIÓN ASISTIDA B2C', price: '$19.900 COP / caso', desc: '0% comisión sobre reembolso · Envío triple y control 15d.' },
            { tag: 'NIVEL 3 · LICENCIA B2B SAAS & API', price: '$290k – $1.2M / mes', desc: 'Autogestión de retractos y garantías para comercios y PSE.' }
          ]
        : [
            { tag: 'EXPEDIENTE FORMAL COMPLETO', price: '3 Oficios Legales', desc: 'Cumplimiento estricto de los requisitos del Decreto 587.' },
            { tag: 'PLAZO FORZOSO DEL BANCO EMISOR', price: 'Máx. 15 Días Hábiles', desc: 'Abono del 100% en cuenta sin depender del vendedor.' },
            { tag: 'SOSTENIBILIDAD Y ESCALA NACIONAL', price: '0% Comisión Abusiva', desc: 'Nivel gratuito ($0) + radicación ($19.900) + SaaS B2B.' }
          ];
      tiers.forEach((tr, i) => {
        const by = ry + 26 + i * 110;
        const isHighlighted = !isImpact ? i === activeTierIdx : i === 2;
        drawRoundedRect(
          ctx,
          rx + 24,
          by,
          rw - 48,
          96,
          12,
          isHighlighted ? 'rgba(0, 196, 140, 0.10)' : '#0B132B',
          isHighlighted ? '#63FCC0' : '#00C48C',
          isHighlighted ? 2.4 : 1.4
        );
        ctx.fillStyle = '#63FCC0';
        ctx.font = '800 11px Inter, sans-serif';
        ctx.fillText(tr.tag, rx + 40, by + 25);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(tr.price, rx + 40, by + 54);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '500 12px Inter, sans-serif';
        ctx.fillText(tr.desc, rx + 40, by + 78);
      });
    }

    ctx.restore();
  }

  // Renders the unified continuous animation across all 5 chapters and 23 scenes
  function renderUnifiedAnimationFrame(ctx, videos, globalTime) {
    const timeline = buildUnifiedTimeline(videos);
    if (!timeline.scenes.length) {
      return {
        timeline,
        activeScene: null,
        chapterIndex: 0,
        globalSceneIndex: 0,
        totalScenes: 0,
        totalDuration: timeline.totalDuration,
        clampedTime: 0
      };
    }
    const totalDur = timeline.totalDuration;
    const clampedTime = ((globalTime % totalDur) + totalDur) % totalDur;

    let activeScene = timeline.scenes[timeline.scenes.length - 1];
    for (let i = 0; i < timeline.scenes.length; i++) {
      const sc = timeline.scenes[i];
      if (clampedTime >= sc.globalStart && clampedTime < sc.globalEnd) {
        activeScene = sc;
        break;
      }
    }

    const localElapsed = Math.max(0, clampedTime - activeScene.globalStart);
    const sceneProgress = Math.max(0, Math.min(1, localElapsed / activeScene.duration));

    // Smooth entry/exit envelope for seamless transitions between all 23 scenes
    const fadeIn = easeOutCubic(Math.min(1, localElapsed / 0.55));
    const timeRemaining = Math.max(0, activeScene.globalEnd - clampedTime);
    const fadeOut = timeRemaining < 0.35 ? easeOutCubic(timeRemaining / 0.35) : 1;
    const contentAlpha = Math.max(0.15, Math.min(1, fadeIn * fadeOut));
    const chapterAccent = activeScene.chapterAccent || '#00C48C';

    // 1. Background Deep Navy + Subtle Grid
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, 1280, 720);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const offset = (clampedTime * 18) % 40;
    for (let x = -offset; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = -offset; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // 2. Top Brand Header Bar
    drawRoundedRect(ctx, 50, 28, 1180, 64, 14, 'rgba(19, 26, 51, 0.94)', 'rgba(255, 255, 255, 0.12)', 1);
    drawRoundedRect(ctx, 68, 40, 40, 40, 10, '#00C48C', null);
    ctx.fillStyle = '#0B132B';
    ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('R', 80, 68);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ReversoYa', 120, 66);
    ctx.fillStyle = '#00C48C';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillText('·  “Tu plata de vuelta por ley, sin rogarle al comercio”', 242, 65);

    drawRoundedRect(ctx, 780, 42, 432, 36, 18, 'rgba(0, 196, 140, 0.15)', chapterAccent, 1.2);
    ctx.fillStyle = '#63FCC0';
    ctx.font = '700 11.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeScene.tag, 996, 64);
    ctx.textAlign = 'left';

    // 3. Coherent 5-Chapter Narrative Ribbon inside the Canvas
    const chapterLabels = [
      'I. El Problema en Colombia',
      'II. Marco Constitucional y Legal',
      'III. Flujo Guiado (4 Pasos)',
      'IV. Casos y Vuelos RAC 3',
      'V. Diferenciación y Modelo'
    ];
    const segW = (1180 - 32) / 5;
    for (let c = 0; c < 5; c++) {
      const sx = 50 + c * (segW + 8);
      const sy = 104;
      const isCurrentChapter = c === activeScene.chapterIndex;
      const isPastChapter = c < activeScene.chapterIndex;
      drawRoundedRect(
        ctx,
        sx,
        sy,
        segW,
        30,
        8,
        isCurrentChapter ? 'rgba(0, 196, 140, 0.22)' : isPastChapter ? 'rgba(0, 196, 140, 0.08)' : 'rgba(19, 26, 51, 0.85)',
        isCurrentChapter ? chapterAccent : isPastChapter ? 'rgba(0, 196, 140, 0.4)' : 'rgba(255, 255, 255, 0.1)',
        isCurrentChapter ? 1.8 : 1
      );
      if (isCurrentChapter && timeline.chapters[c]) {
        const chObj = timeline.chapters[c];
        const chProg = Math.max(0.05, Math.min(1, (clampedTime - chObj.globalStart) / Math.max(1, chObj.globalEnd - chObj.globalStart)));
        drawRoundedRect(ctx, sx + 2, sy + 25, (segW - 4) * chProg, 3, 1.5, chapterAccent, null);
      }
      ctx.fillStyle = isCurrentChapter ? '#FFFFFF' : isPastChapter ? '#63FCC0' : '#94A3B8';
      ctx.font = isCurrentChapter ? '800 11px Inter, sans-serif' : '600 10.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(chapterLabels[c], sx + segW / 2, sy + 19);
    }
    ctx.textAlign = 'left';

    // 4. Left Kinetic Legal Argumentation Column
    const slideY = (1 - fadeIn) * 18;

    ctx.save();
    ctx.translate(0, slideY);
    ctx.globalAlpha = contentAlpha;

    ctx.font = '800 12px Inter, sans-serif';
    const kickerW = Math.max(260, Math.min(610, ctx.measureText(activeScene.kicker).width + 36));
    drawRoundedRect(ctx, 64, 162, kickerW, 32, 8, 'rgba(255, 255, 255, 0.08)', null);
    ctx.fillStyle = '#63FCC0';
    ctx.fillText(activeScene.kicker, 80, 183);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
    const afterHeadlineY = wrapText(ctx, activeScene.headline, 64, 242, 610, 45);

    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    const statW = Math.max(280, Math.min(480, ctx.measureText(activeScene.stat).width + 52));
    drawRoundedRect(ctx, 64, afterHeadlineY + 18, statW, 58, 14, '#00C48C', null);
    ctx.fillStyle = '#0B132B';
    ctx.fillText(activeScene.stat, 86, afterHeadlineY + 56);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 17px Inter, sans-serif';
    wrapText(ctx, activeScene.sub, 64, afterHeadlineY + 112, 610, 25);

    ctx.restore();

    // 5. Right Dynamic Legal Schematic Box
    ctx.save();
    ctx.globalAlpha = contentAlpha;
    drawArtifactBox(ctx, activeScene.visualType, 730, 152, 500, 385, sceneProgress, clampedTime);
    ctx.restore();

    // 6. Bottom Legal Narrative Box (no timers, only legal context + voiceover)
    drawRoundedRect(ctx, 50, 566, 1180, 84, 12, 'rgba(11, 19, 43, 0.94)', 'rgba(0, 196, 140, 0.45)', 1.5);
    ctx.fillStyle = '#00C48C';
    ctx.font = '800 11px Inter, sans-serif';
    ctx.fillText(
      `${activeScene.chapterTitle.toUpperCase()}  ·  ${activeScene.chapterLegalFocus.toUpperCase()}`,
      72,
      589
    );
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '500 13.5px Inter, sans-serif';
    wrapText(ctx, activeScene.voiceover, 72, 612, 1136, 19);

    // 7. Continuous Unified Narrative Progress Bar across all 5 chapters with chapter boundary ticks
    drawRoundedRect(ctx, 50, 666, 1180, 10, 5, 'rgba(255,255,255,0.12)', null);
    drawRoundedRect(ctx, 50, 666, Math.max(12, 1180 * (clampedTime / totalDur)), 10, 5, '#00C48C', null);
    for (let c = 1; c < timeline.chapters.length; c++) {
      const tickX = 50 + 1180 * (timeline.chapters[c].globalStart / totalDur);
      ctx.fillStyle = 'rgba(11, 19, 43, 0.9)';
      ctx.fillRect(tickX - 1.5, 665, 3, 12);
    }

    return {
      timeline,
      activeScene,
      chapterIndex: activeScene.chapterIndex,
      globalSceneIndex: activeScene.globalIndex,
      totalScenes: timeline.totalScenes,
      totalDuration: totalDur,
      clampedTime
    };
  }

  // Single-chapter fallback renderer (also free of timers)
  function renderFullVideoFrame(ctx, video, currentTime) {
    return renderUnifiedAnimationFrame(ctx, [video], currentTime);
  }

  // Renders an isolated high-resolution Legal Diagram for a Presentation Slide
  function renderSlideArtifact(ctx, width, height, artifactType, t) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    const logicalW = 520;
    const logicalH = 400;
    ctx.scale(width / logicalW, height / logicalH);

    drawRoundedRect(ctx, 0, 0, logicalW, logicalH, 18, '#0B132B', '#00C48C', 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const offset = (t * 15) % 32;
    for (let x = -offset; x < logicalW; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, logicalH);
      ctx.stroke();
    }
    for (let y = -offset; y < logicalH; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(logicalW, y);
      ctx.stroke();
    }

    const steadyProgress = t <= 0 ? 1 : Math.min(1, 0.35 + (t / 0.8) * 0.65);
    drawArtifactBox(ctx, artifactType, 10, 10, 500, 380, steadyProgress, t);
    ctx.restore();
  }

  return {
    buildUnifiedTimeline,
    renderUnifiedAnimationFrame,
    renderFullVideoFrame,
    renderSlideArtifact
  };
})();
