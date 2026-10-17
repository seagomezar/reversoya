// ReversoYa: Motor Compartido de Motion Design (60 FPS Canvas 2D)
// Usado tanto en videos-motion-graphics.html como en las diapositivas de presentacion-10-minutos.html

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

  // Draws a motion design visual widget inside the bounding box (rx, ry, rw, rh)
  function drawArtifactBox(ctx, type, rx, ry, rw, rh, sceneProgress, t) {
    drawRoundedRect(ctx, rx, ry, rw, rh, 18, '#131A33', 'rgba(255,255,255,0.14)', 1.5);
    const p = easeOutCubic(Math.min(1, sceneProgress * 1.8));
    const cx = rx + rw / 2;

    ctx.save();
    ctx.textAlign = 'left';

    if (type === 'brand_shield') {
      // Animated Shield + 360 Restitution Arc + 5d -> 15d flow
      const scy = ry + 130;
      for (let ring = 1; ring <= 3; ring++) {
        const rad = 42 * ring + ((t * 22) % 30);
        ctx.beginPath();
        ctx.arc(cx, scy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 196, 140, ${0.26 - ring * 0.06})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // Shield center badge
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

      // Bottom 2 flow cards
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
      const maxDays = is5 ? 5 : 15;
      const curDay = Math.max(1, Math.min(maxDays, Math.ceil(((t % 9) / 9) * maxDays)));
      drawRoundedRect(ctx, rx + 26, ry + 26, rw - 52, 108, 14, '#0B132B', '#00C48C', 2);
      ctx.fillStyle = '#63FCC0';
      ctx.font = '800 12px Inter, sans-serif';
      ctx.fillText(
        is5 ? 'VENTANA LEGAL PARA NOTIFICAR AL BANCO (DEC. 587)' : 'TÉRMINO PERENTORIO DE REEMBOLSO BANCARIO',
        rx + 44,
        ry + 56
      );
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Día ${curDay} de ${maxDays} Días Hábiles`, rx + 44, ry + 102);

      drawRoundedRect(ctx, rx + 26, ry + 154, rw - 52, 20, 10, '#0B132B', 'rgba(255,255,255,0.15)');
      drawRoundedRect(ctx, rx + 26, ry + 154, Math.max(24, (rw - 52) * (curDay / maxDays)), 20, 10, '#00C48C', null);

      const milestones = is5
        ? [
            'Día 1: Incumplimiento de entrega o defecto del bien',
            'Día 3: Reclamación al comercio y sello SHA-256',
            'Día 5: Orden de reversión radicada ante el banco/PSE'
          ]
        : [
            'Día 1: Radicación ante Comercio + Banco + SIC',
            'Día 5: Cierre del plazo de objeción del comercio',
            'Día 15: Abono obligatorio del 100% en tu cuenta'
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
        drawRoundedRect(ctx, rx + 40, by + 14, 150, 22, 6, 'rgba(0,196,140,0.18)', null);
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
            { step: 'PASO 4', name: 'Guía de radicación y reloj de 15 días', status: 'Abono bancario 100%' }
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
    } else if (type === 'pricing_tiers' || type === 'impact_summary') {
      const tiers = type === 'pricing_tiers'
        ? [
            { tag: 'NIVEL 1 · ACCESO UNIVERSAL B2C', price: '$0 COP (Gratis)', desc: 'Diagnóstico de plazos, detector de excusas y descarga de los 3 oficios.' },
            { tag: 'NIVEL 2 · RADICACIÓN ASISTIDA B2C', price: '$19.900 COP / caso', desc: '0% comisión sobre el reembolso · Envío simultáneo y seguimiento 15d.' },
            { tag: 'NIVEL 3 · LICENCIA B2B SAAS & API', price: '$290k – $1.2M / mes', desc: 'Botón de autogestión para comercios y pasarelas (previene multas SIC).' }
          ]
        : [
            { tag: 'TIEMPO DE RESPUESTA CIUDADANA', price: '3 Minutos', desc: 'Generación completa de los 3 oficios con requisitos del Decreto 587.' },
            { tag: 'PLAZO FORZOSO DEL BANCO EMISOR', price: 'Máx. 15 Días Hábiles', desc: 'Abono del 100% en cuenta o tarjeta sin depender del vendedor.' },
            { tag: 'SOSTENIBILIDAD Y ESCALA NACIONAL', price: '0% Comisión Abusiva', desc: 'Nivel gratuito universal + micro-pago $19.900 + SaaS B2B.' }
          ];
      tiers.forEach((tr, i) => {
        const by = ry + 26 + i * 110;
        drawRoundedRect(ctx, rx + 24, by, rw - 48, 96, 12, '#0B132B', i === 1 ? '#63FCC0' : '#00C48C', i === 1 ? 2.2 : 1.5);
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

  // Renders a full 1280x720 motion design video frame
  function renderFullVideoFrame(ctx, video, currentTime) {
    const t = currentTime;
    const numScenes = video.scenes.length;
    let sceneIdx = 0;
    for (let i = 0; i < numScenes; i++) {
      if (t >= video.scenes[i].start && t <= video.scenes[i].end) {
        sceneIdx = i;
        break;
      }
    }
    const scene = video.scenes[sceneIdx];
    const sceneDuration = Math.max(0.1, scene.end - scene.start);
    const sceneProgress = Math.max(0, Math.min(1, (t - scene.start) / sceneDuration));

    // 1. Background Deep Navy + Animated Grid
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, 1280, 720);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const offset = (t * 18) % 40;
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
    drawRoundedRect(ctx, 50, 36, 1180, 68, 14, 'rgba(19, 26, 51, 0.92)', 'rgba(255, 255, 255, 0.12)', 1);
    drawRoundedRect(ctx, 70, 50, 40, 40, 10, '#00C48C', null);
    ctx.fillStyle = '#0B132B';
    ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('R', 82, 78);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ReversoYa', 122, 76);
    ctx.fillStyle = '#00C48C';
    ctx.font = '700 13px Inter, sans-serif';
    ctx.fillText('·  “Tu plata de vuelta por ley, sin rogarle al comercio”', 248, 75);

    drawRoundedRect(ctx, 890, 52, 320, 36, 18, 'rgba(0, 196, 140, 0.15)', '#00C48C', 1);
    ctx.fillStyle = '#63FCC0';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(scene.tag, 1050, 74);
    ctx.textAlign = 'left';

    // 3. Left Kinetic Typography Column
    const enter = easeOutCubic(Math.min(1, sceneProgress * 3.0));
    const slideY = (1 - enter) * 24;

    ctx.save();
    ctx.translate(0, slideY);
    ctx.globalAlpha = enter;

    drawRoundedRect(ctx, 64, 165, 480, 32, 8, 'rgba(255, 255, 255, 0.08)', null);
    ctx.fillStyle = '#63FCC0';
    ctx.font = '800 12px Inter, sans-serif';
    ctx.fillText(scene.kicker, 80, 186);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
    const afterHeadlineY = wrapText(ctx, scene.headline, 64, 248, 610, 48);

    drawRoundedRect(ctx, 64, afterHeadlineY + 20, 410, 62, 14, '#00C48C', null);
    ctx.fillStyle = '#0B132B';
    ctx.font = '800 27px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(scene.stat, 86, afterHeadlineY + 60);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 17.5px Inter, sans-serif';
    wrapText(ctx, scene.sub, 64, afterHeadlineY + 118, 610, 26);

    ctx.restore();

    // 4. Right Dynamic Motion Widget
    drawArtifactBox(ctx, scene.visualType, 730, 155, 500, 385, sceneProgress, t);

    // 5. Bottom Subtitle & 45-Second Progress Bar
    drawRoundedRect(ctx, 50, 574, 1180, 78, 12, 'rgba(11, 19, 43, 0.94)', 'rgba(0, 196, 140, 0.4)', 1.5);
    ctx.fillStyle = '#00C48C';
    ctx.font = '800 11px Inter, sans-serif';
    ctx.fillText(`GUION SINCRONIZADO (${t.toFixed(1)}s / 45.0s):`, 72, 595);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '500 13.5px Inter, sans-serif';
    wrapText(ctx, scene.voiceover, 72, 616, 1136, 19);

    drawRoundedRect(ctx, 50, 668, 1180, 10, 5, 'rgba(255,255,255,0.12)', null);
    drawRoundedRect(ctx, 50, 668, Math.max(12, 1180 * (t / 45.0)), 10, 5, '#00C48C', null);

    return { sceneIdx, scene };
  }

  // Renders an isolated high-resolution Motion Design Artifact for a Presentation Slide
  function renderSlideArtifact(ctx, width, height, artifactType, t) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    // Scale 520x400 logical coordinate system to canvas width x height
    const logicalW = 520;
    const logicalH = 400;
    ctx.scale(width / logicalW, height / logicalH);

    // Subtle animated grid background inside artifact canvas
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
    renderFullVideoFrame,
    renderSlideArtifact
  };
})();
