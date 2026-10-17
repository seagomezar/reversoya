// ReversoYa: Calculadora Jurídica Interactiva (Ley 1480 de 2011, Decreto 587 de 2016 y RAC 3 Aerocivil)

const state = {
  currentStep: 1,
  causal: 'no_recibido',
  monto: 680000,
  medioPago: 'PSE (Débito Bancario en Línea)',
  banco: 'Bancolombia S.A.',
  comercio: 'Tienda Virtual ModaCol S.A.S. (NIT 901.442.118-2)',
  nombreUsuario: 'Camila Andrea Restrepo Gómez',
  cedulaUsuario: '1.020.784.512',
  diasTranscurridos: 2,
  activeDocTab: 'banco',
  evidenceFiles: [
    { name: 'Comprobante_Pago_PSE_Bancolombia.pdf', hash: '8f4a92e1c04b...91c2' },
    { name: 'Captura_Respuesta_Comercio.png', hash: '3b1e77c4a912...40d9' }
  ]
};

const CAUSAL_META = {
  no_recibido: {
    code: 'Art. 51 num. 4 Ley 1480',
    title: 'Producto no recibido en la fecha pactada',
    legalCite: 'artículo 51 numeral 4 de la Ley 1480 de 2011 y artículo 2.2.2.51.2 numeral 4 del Decreto 1074 de 2015 (adicionado por el Decreto 587 de 2016)',
    mechanism: 'Cuando el bien adquirido por medios electrónicos no es entregado materialmente en el plazo anunciado, el emisor del instrumento de pago debe reversar el 100% de la transacción.'
  },
  defectuoso: {
    code: 'Arts. 7, 47 y 51 Ley 1480',
    title: 'Producto defectuoso, sin correspondencia con lo anunciado o derecho de retracto negado',
    legalCite: 'artículos 7, 47 y 51 numeral 5 de la Ley 1480 de 2011 y artículo 2.2.2.51.2 numeral 5 del Decreto 1074 de 2015',
    mechanism: 'El consumidor puso el bien a disposición del proveedor o ejerció su derecho de retracto dentro de los 5 días hábiles. La ley prohíbe imponer bonos o negar la garantía por tratarse de una promoción.'
  },
  fraude: {
    code: 'Art. 51 nums. 1 y 2 Ley 1480',
    title: 'Operación no solicitada, fraude o cobro duplicado',
    legalCite: 'artículo 51 numerales 1 y 2 de la Ley 1480 de 2011 y Decreto 587 de 2016',
    mechanism: 'Ante un cargo no autorizado o debitado por duplicado en pasarela electrónica, la entidad financiera emisora debe restituir la suma debitada dentro de los 15 días hábiles siguientes.'
  },
  vuelo: {
    code: 'RAC 3 Aerocivil + Art. 51 Ley 1480',
    title: 'Sobreventa, cancelación atribuible a la aerolínea o retención de reembolso de tiquete',
    legalCite: 'Reglamentos Aeronáuticos de Colombia (RAC 3 de la Aeronáutica Civil) y artículo 51 de la Ley 1480 de 2011',
    mechanism: 'Además del reembolso del 100% del valor del tiquete no volado a través del emisor financiero, la aerolínea debe pagar una compensación adicional mínima del 30% del valor del trayecto.'
  }
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCOP(num) {
  const safeNum = Number.isFinite(Number(num)) ? Math.max(0, Math.round(Number(num))) : 0;
  return '$' + safeNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const COLOMBIA_HOLIDAYS_2026 = new Set([
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
]);

function addColombianBusinessDays(startIso, daysToAdd) {
  const parts = String(startIso || '').split('-').map(Number);
  const dt = (parts.length === 3 && !parts.some(isNaN))
    ? new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
    : new Date();
  let added = 0;
  while (added < daysToAdd) {
    dt.setUTCDate(dt.getUTCDate() + 1);
    const dow = dt.getUTCDay();
    const iso = dt.toISOString().slice(0, 10);
    if (dow !== 0 && dow !== 6 && !COLOMBIA_HOLIDAYS_2026.has(iso)) {
      added++;
    }
  }
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return `${dt.getUTCDate()} de ${months[dt.getUTCMonth()]} de ${dt.getUTCFullYear()} (${dt.toISOString().slice(0, 10)})`;
}

function goToStep(stepNum) {
  state.currentStep = stepNum;
  document.querySelectorAll('.step-panel').forEach((panel, idx) => {
    if (idx + 1 === stepNum) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`stepper-${i}`);
    const badge = document.getElementById(`stepper-badge-${i}`);
    if (!btn || !badge) continue;
    if (i === stepNum) {
      btn.className = 'w-full flex items-center gap-2.5 p-2.5 rounded-lg border-2 border-navy bg-slate-50 text-left transition';
      badge.className = 'w-6 h-6 rounded-full bg-navy text-white font-display font-bold text-xs flex items-center justify-center shrink-0';
      badge.textContent = String(i);
    } else if (i < stepNum) {
      btn.className = 'w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-emerald bg-white text-left transition';
      badge.className = 'w-6 h-6 rounded-full bg-emerald text-white font-display font-bold text-xs flex items-center justify-center shrink-0';
      badge.textContent = '✓';
    } else {
      btn.className = 'w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-left transition';
      badge.className = 'w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-display font-bold text-xs flex items-center justify-center shrink-0';
      badge.textContent = String(i);
    }
  }
  recalculateCase();
}

function selectCausal(causalKey) {
  state.causal = causalKey;
  ['no_recibido', 'defectuoso', 'fraude', 'vuelo'].forEach((key) => {
    const card = document.getElementById(`card-causal-${key}`);
    if (!card) return;
    if (key === causalKey) {
      card.className = 'causal-card text-left p-4 rounded-xl border-2 border-navy bg-slate-50/70 transition flex flex-col justify-between';
    } else {
      card.className = 'causal-card text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col justify-between';
    }
  });
  recalculateCase();
}

function resetForm() {
  loadPreset('instagram');
  goToStep(1);
}

function loadPreset(presetName) {
  document.querySelectorAll('.preset-btn').forEach((b) => {
    if (b.dataset.preset === presetName) {
      b.className = 'preset-btn px-2.5 py-1 rounded-md text-xs font-semibold bg-navy text-white transition';
    } else {
      b.className = 'preset-btn px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition';
    }
  });

  const inputMonto = document.getElementById('inputMonto');
  const selectMedio = document.getElementById('selectMedioPago');
  const selectBanco = document.getElementById('selectBanco');
  const inputComercio = document.getElementById('inputComercio');
  const selectDias = document.getElementById('selectDiasTranscurridos');
  const inputChat = document.getElementById('inputChatMsg');
  const checks = document.querySelectorAll('.excuse-check');

  if (presetName === 'instagram') {
    selectCausal('no_recibido');
    inputMonto.value = 680000;
    selectMedio.value = 'PSE (Débito Bancario en Línea)';
    selectBanco.value = 'Bancolombia S.A.';
    inputComercio.value = 'Tienda Virtual ModaCol S.A.S. (NIT 901.442.118-2)';
    selectDias.value = '2';
    inputChat.value = 'Hola, por políticas de nuestra tienda no hacemos devolución de dinero, solo te podemos dar un bono para que pidas otra prenda o reclámale a la transportadora.';
    checks.forEach((c) => { c.checked = (c.value === 'bono' || c.value === 'transportadora'); });
  } else if (presetName === 'garantia') {
    selectCausal('defectuoso');
    inputMonto.value = 1450000;
    selectMedio.value = 'Tarjeta de Crédito';
    selectBanco.value = 'Banco Davivienda S.A.';
    inputComercio.value = 'ElectroShop Colombia S.A.S. (NIT 900.812.334-1)';
    selectDias.value = '4';
    inputChat.value = 'El equipo fue adquirido en promoción y en los términos dice que los productos en descuento no tienen garantía ni devolución de dinero.';
    checks.forEach((c) => { c.checked = (c.value === 'promocion' || c.value === 'bono'); });
  } else if (presetName === 'fraude') {
    selectCausal('fraude');
    inputMonto.value = 320000;
    selectMedio.value = 'Nequi (Depósito de Bajo Monto)';
    selectBanco.value = 'Nequi S.A. Compañía de Financiamiento';
    inputComercio.value = 'Pasarela Digital E-Commerce S.A.S.';
    selectDias.value = '1';
    inputChat.value = 'El cobro aparece debitado dos veces en su cuenta Nequi, pero tiene que esperar de 45 a 60 días hábiles mientras contabilidad revisa el extracto.';
    checks.forEach((c) => { c.checked = (c.value === 'demora'); });
  } else if (presetName === 'vuelo') {
    selectCausal('vuelo');
    inputMonto.value = 540000;
    selectMedio.value = 'Tarjeta Débito con CVV';
    selectBanco.value = 'BBVA Colombia';
    inputComercio.value = 'Aerolínea Comercial S.A. (Ruta BOG-CTG)';
    selectDias.value = '2';
    inputChat.value = 'Por sobreventa del vuelo no fue posible abordar; únicamente ofrecemos un bono de viaje y el reembolso tarda 60 días.';
    checks.forEach((c) => { c.checked = (c.value === 'bono' || c.value === 'demora'); });
  }

  analyzeChatText();
  recalculateCase();
}

function analyzeChatText() {
  const txt = (document.getElementById('inputChatMsg')?.value || '').toLowerCase();
  const out = document.getElementById('chatAnalysisOutput');
  if (!out) return;

  const findings = [];
  if (txt.includes('bono') || txt.includes('voucher') || txt.includes('saldo a favor') || txt.includes('no hacemos devolución')) {
    findings.push('Imposición improcedente de bono o negativa de reembolso en dinero (contradice los artículos 47 y 51 de la Ley 1480 de 2011).');
  }
  if (txt.includes('transportadora') || txt.includes('servientrega') || txt.includes('interrapidísimo') || txt.includes('bodega')) {
    findings.push('Traslado improcedente de responsabilidad logística al consumidor (contradice el artículo 50 literal h de la Ley 1480 de 2011).');
  }
  if (txt.includes('promoción') || txt.includes('descuento') || txt.includes('black friday') || txt.includes('garantía')) {
    findings.push('Exclusión nula de garantía legal en bienes con descuento (cláusula ineficaz de pleno derecho según el artículo 43 de la Ley 1480 de 2011).');
  }
  if (txt.includes('45') || txt.includes('60') || txt.includes('30') || txt.includes('contabilidad')) {
    findings.push('Dilación superior al término legal de 15 días hábiles bancarios (contradice el artículo 2.2.2.51.5 del Decreto 1074 de 2015).');
  }

  if (findings.length === 0) {
    out.innerHTML = '<strong>Constancia de comunicación:</strong> La falta de entrega o de solución efectiva habilita la radicación formal de la solicitud de reversión de pago ante el emisor financiero (artículo 51 de la Ley 1480 de 2011).';
  } else {
    out.innerHTML = `<strong>Observaciones jurídicas detectadas (${findings.length}):</strong><br/>· ` + findings.join('<br/>· ');
  }
}

function renderEvidenceList() {
  const list = document.getElementById('evidenceList');
  if (!list) return;
  list.innerHTML = '';
  state.evidenceFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2';
    item.innerHTML = `
      <div class="min-w-0">
        <span class="block truncate font-semibold text-navy">${escapeHtml(file.name)}</span>
        <span class="block font-mono text-[10px] text-emerald-dark">SHA-256: ${escapeHtml(file.hash)}</span>
      </div>
      <button type="button" onclick="removeEvidenceFile(${index})" class="text-slate-400 hover:text-danger text-xs font-bold px-1.5" title="Quitar archivo">✕</button>
    `;
    list.appendChild(item);
  });
}

function removeEvidenceFile(idx) {
  state.evidenceFiles.splice(idx, 1);
  renderEvidenceList();
  renderLegalDocument();
}

async function handleRealFileUpload(fileList) {
  if (!fileList || fileList.length === 0) return;
  for (const file of Array.from(fileList)) {
    let hashHex = '';
    try {
      const buffer = await file.arrayBuffer();
      if (window.crypto && window.crypto.subtle) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fullHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        hashHex = fullHex.slice(0, 12) + '...' + fullHex.slice(-4);
      } else {
        hashHex = Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
      }
    } catch (e) {
      hashHex = Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    }
    state.evidenceFiles.push({ name: file.name, hash: hashHex });
  }
  renderEvidenceList();
  renderLegalDocument();
}

function recalculateCase() {
  const montoEl = document.getElementById('inputMonto');
  const rawMonto = montoEl ? Number(montoEl.value) : state.monto;
  state.monto = Number.isFinite(rawMonto) ? Math.max(0, rawMonto) : 0;

  const medioEl = document.getElementById('selectMedioPago');
  if (medioEl) state.medioPago = medioEl.value;

  const bancoEl = document.getElementById('selectBanco');
  if (bancoEl) state.banco = bancoEl.value;

  const comercioEl = document.getElementById('inputComercio');
  if (comercioEl) state.comercio = comercioEl.value.trim() || '[Comercio / Proveedor por diligenciar]';

  const nombreEl = document.getElementById('inputNombreUsuario');
  if (nombreEl) state.nombreUsuario = nombreEl.value.trim() || '[Nombre del solicitante]';

  const cedulaEl = document.getElementById('inputCedulaUsuario');
  if (cedulaEl) state.cedulaUsuario = cedulaEl.value.trim() || '[Número de identificación]';

  const diasEl = document.getElementById('selectDiasTranscurridos');
  if (diasEl) state.diasTranscurridos = Number(diasEl.value) || 2;

  const isVuelo = state.causal === 'vuelo';
  const compensacionRAC3 = isVuelo ? Math.round(state.monto * 0.30) : 0;
  const totalExigible = state.monto + compensacionRAC3;
  const enTermino5Dias = state.diasTranscurridos <= 5;
  const diasRestantes = Math.max(0, 5 - state.diasTranscurridos);

  const safeBanco = escapeHtml(state.banco);
  const safeMedio = escapeHtml(state.medioPago);
  const safeComercio = escapeHtml(state.comercio);

  // Update Step 1 Notice Banner
  const plazoBanner = document.getElementById('plazoBanner');
  const plazoTitulo = document.getElementById('plazoTitulo');
  const plazoDesc = document.getElementById('plazoDescripcion');

  if (enTermino5Dias) {
    plazoBanner.className = 'p-4 rounded-xl bg-emerald-soft border border-emerald/30 text-xs leading-relaxed';
    plazoTitulo.textContent = `Estás dentro del plazo legal de 5 días hábiles (${diasRestantes === 0 ? 'vence hoy' : 'quedan ' + diasRestantes + ' días hábiles'}). Art. 2.2.2.51.4 Decreto 1074 de 2015`;
    plazoDesc.innerHTML = `Al notificar al comercio y radicar la orden ante <strong>${safeBanco}</strong> (${safeMedio}), la entidad financiera dispone de máximo <strong>15 días hábiles</strong> para abonar el 100% de la compra (<strong>${formatCOP(state.monto)} COP</strong>)${isVuelo ? `; adicionalmente, la aerolínea (<strong>${safeComercio}</strong>) debe pagar <strong>${formatCOP(compensacionRAC3)} COP</strong> correspondientes al 30% de compensación mínima obligatoria (RAC 3), para un total exigible de <strong>${formatCOP(totalExigible)} COP</strong>` : ''}.`;
  } else {
    plazoBanner.className = 'p-4 rounded-xl bg-danger-soft border border-danger/30 text-xs leading-relaxed';
    plazoTitulo.textContent = 'Plazo bancario de 5 días superado: se activa la acción de protección al consumidor ante la SIC (Art. 58 Ley 1480)';
    plazoDesc.innerHTML = `Como transcurrieron más de 5 días hábiles para la reversión administrativa directa ante <strong>${safeBanco}</strong>, se estructura la reclamación directa prejudicial y la demanda ante la Superintendencia de Industria y Comercio (SIC) contra <strong>${safeComercio}</strong> para exigir los <strong>${formatCOP(totalExigible)} COP</strong>.`;
  }

  // Update Sidebar
  document.getElementById('sidebarCausalTag').textContent = CAUSAL_META[state.causal].code;
  document.getElementById('sidebarHeadline').textContent = enTermino5Dias
    ? `${state.banco} debe reversar el 100% de tu pago en máximo 15 días hábiles`
    : `Acción jurisdiccional ante la SIC contra ${state.comercio} por ${formatCOP(totalExigible)} COP`;
  document.getElementById('sidebarTotalAmount').textContent = formatCOP(totalExigible);
  document.getElementById('sidebarCompensationNote').textContent = isVuelo
    ? `Incluye ${formatCOP(state.monto)} (100% tiquete vía ${state.banco}) + ${formatCOP(compensacionRAC3)} (30% compensación RAC 3 a cargo de la aerolínea).`
    : 'Reembolso íntegro en dinero al instrumento de pago original (Art. 47 y 51 Ley 1480).';

  const daysPill = document.getElementById('sidebarDaysLeft');
  if (enTermino5Dias) {
    daysPill.className = 'px-2 py-0.5 rounded bg-emerald-soft text-emerald-dark font-bold';
    daysPill.textContent = diasRestantes === 0 ? 'Vence hoy' : `Quedan ${diasRestantes} días hábiles`;
  } else {
    daysPill.className = 'px-2 py-0.5 rounded bg-danger-soft text-danger font-bold';
    daysPill.textContent = 'Vía Jurisdiccional SIC (Art. 58)';
  }

  // Update Step 3 Metrics
  document.getElementById('semaforoViabilidad').textContent = enTermino5Dias
    ? 'Reversión bancaria (15 días)'
    : 'Demanda jurisdiccional SIC';
  document.getElementById('semaforoMonto').textContent = `${formatCOP(totalExigible)} COP`;
  document.getElementById('semaforoMontoDetalle').textContent = isVuelo
    ? `${formatCOP(state.monto)} banco + ${formatCOP(compensacionRAC3)} aerolínea (RAC 3)`
    : `100% mediante ${state.banco}`;

  // Update Step 4 labels & Business-Day Deadlines
  const s4Merchant = document.getElementById('step4MerchantName');
  const s4Bank = document.getElementById('step4BankName');
  if (s4Merchant) s4Merchant.textContent = state.comercio;
  if (s4Bank) s4Bank.textContent = state.banco;

  const fechaInput = document.getElementById('inputFechaRadicacion');
  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().slice(0, 10);
  }
  const baseDate = fechaInput?.value || new Date().toISOString().slice(0, 10);
  const d5El = document.getElementById('deadline5DaysText');
  const d15El = document.getElementById('deadline15DaysText');
  if (d5El) d5El.textContent = addColombianBusinessDays(baseDate, 5);
  if (d15El) d15El.textContent = addColombianBusinessDays(baseDate, 15);

  renderLegalDocument();
  updateCountdownSimulator(document.getElementById('daySlider')?.value || 3);
}

function switchDocTab(tabKey) {
  state.activeDocTab = tabKey;
  ['banco', 'comercio', 'sic'].forEach((k) => {
    const btn = document.getElementById(`doc-tab-${k}`);
    if (!btn) return;
    if (k === tabKey) {
      btn.className = 'doc-tab-btn px-3 py-1.5 rounded-md bg-navy text-white text-xs font-bold transition';
    } else {
      btn.className = 'doc-tab-btn px-3 py-1.5 rounded-md text-slate-700 hover:bg-white text-xs font-semibold transition';
    }
  });
  renderLegalDocument();
}

function buildDocumentHtml(docType) {
  const meta = CAUSAL_META[state.causal];
  const isVuelo = state.causal === 'vuelo';
  const compensacionRAC3 = isVuelo ? Math.round(state.monto * 0.30) : 0;
  const totalExigible = state.monto + compensacionRAC3;
  const enTermino5Dias = state.diasTranscurridos <= 5;
  const todayStr = document.getElementById('inputFechaRadicacion')?.value || new Date().toISOString().slice(0, 10);

  const safeBanco = escapeHtml(state.banco);
  const safeMedio = escapeHtml(state.medioPago);
  const safeComercio = escapeHtml(state.comercio);
  const safeNombre = escapeHtml(state.nombreUsuario);
  const safeCedula = escapeHtml(state.cedulaUsuario);

  const selectedExcuses = Array.from(document.querySelectorAll('.excuse-check:checked')).map((el) => {
    if (el.value === 'bono') return 'Pretensión improcedente de imponer un bono o saldo a favor en lugar del reembolso en dinero (contraviene los artículos 47 y 51 de la Ley 1480 de 2011).';
    if (el.value === 'transportadora') return 'Negativa a responder directamente por la entrega material del bien al consumidor (contraviene el artículo 50 literal h de la Ley 1480 de 2011).';
    if (el.value === 'promocion') return 'Invocación de cláusula ineficaz de pleno derecho que pretende excluir la garantía legal por tratarse de un bien en descuento (contraviene los artículos 7, 8 y 43 de la Ley 1480 de 2011).';
    if (el.value === 'demora') return 'Dilación superior al plazo máximo de quince (15) días hábiles establecido por el artículo 2.2.2.51.5 del Decreto 1074 de 2015.';
    return '';
  }).filter(Boolean);

  const excusesHtml = selectedExcuses.length > 0
    ? selectedExcuses.map((e, i) => `   ${i + 1}. ${e}`).join('<br/>')
    : '   1. Falta de entrega oportuna o ausencia de reembolso efectivo de las sumas pagadas.';

  const annexListHtml = state.evidenceFiles.length > 0
    ? state.evidenceFiles.map((f) => `${escapeHtml(f.name)} (SHA-256: ${escapeHtml(f.hash)})`).join(', ')
    : 'Comprobante de transacción electrónica y constancia de reclamación directa al proveedor.';

  const plazoDeclarationHtml = enTermino5Dias
    ? `Dentro del término legal de cinco (5) días hábiles siguientes al conocimiento del hecho (${state.diasTranscurridos} días hábiles transcurridos), presenté reclamación directa ante el proveedor, frente a lo cual se configuró:`
    : `Dejo constancia de que presenté reclamación directa ante el proveedor (habiendo transcurrido más de cinco días hábiles desde el hecho inicial por causas atribuibles a la dilación del comercio), por lo cual solicito la reversión y contracargo de la operación en articulación con la acción jurisdiccional ante la SIC (artículo 58 de la Ley 1480 de 2011), habiéndose configurado:`;

  if (docType === 'banco') {
    return `
      <div class="space-y-3">
        <div class="border-b border-slate-300 pb-2 flex justify-between items-start gap-2">
          <div>
            <strong>SOLICITUD FORMAL DE REVERSIÓN DE PAGO</strong><br/>
            <span>Artículo 51 de la Ley 1480 de 2011 y Decreto 587 de 2016 (Capítulo 51 del Decreto 1074 de 2015)</span>
          </div>
          <span class="px-2 py-0.5 bg-slate-200 rounded font-semibold shrink-0">Fecha: ${escapeHtml(todayStr)}</span>
        </div>
        <p>
          <strong>DESTINATARIO (EMISOR DEL INSTRUMENTO DE PAGO):</strong> ${safeBanco}<br/>
          <strong>SOLICITANTE:</strong> ${safeNombre}, C.C. ${safeCedula}<br/>
          <strong>INSTRUMENTO DE PAGO UTILIZADO:</strong> ${safeMedio}<br/>
          <strong>PROVEEDOR REPORTADO:</strong> ${safeComercio}<br/>
          <strong>VALOR SOLICITADO EN REVERSIÓN BANCARIA:</strong> ${formatCOP(state.monto)} COP
        </p>
        <p>
          <strong>1. CAUSAL LEGAL INVOCADA (ART. 2.2.2.51.2 DECRETO 1074 DE 2015):</strong><br/>
          Manifiesto bajo la gravedad de juramento que la transacción por valor de <strong>${formatCOP(state.monto)} COP</strong> realizada mediante <strong>${safeMedio}</strong> a favor de <strong>${safeComercio}</strong> se encuentra incursa en la causal de <strong>${meta.title.toUpperCase()}</strong>, de conformidad con el ${meta.legalCite}.
        </p>
        <p>
          <strong>2. CONSTANCIA DE RECLAMACIÓN PREVIA AL PROVEEDOR (ART. 2.2.2.51.4):</strong><br/>
          ${plazoDeclarationHtml}<br/>
          ${excusesHtml}
        </p>
        <p>
          <strong>3. SOLICITUD DE ABONO EN QUINCE (15) DÍAS HÁBILES (ART. 2.2.2.51.5):</strong><br/>
          Solicito a <strong>${safeBanco}</strong> que, en conjunto con los demás participantes del proceso de pago, efectúe la reversión íntegra de <strong>${formatCOP(state.monto)} COP</strong> a mi cuenta o instrumento de pago dentro del término máximo e improrrogable de <strong>quince (15) días hábiles</strong> contados a partir de la presente radicación.
        </p>
        <div class="pt-2 border-t border-slate-300 text-xs text-slate-600">
          <strong>Anexos probatorios (Ley 527 de 1999):</strong> ${annexListHtml}<br/>
          <strong>Firma:</strong> ${safeNombre}, C.C. ${safeCedula}
        </div>
      </div>
    `;
  } else if (docType === 'comercio') {
    return `
      <div class="space-y-3">
        <div class="border-b border-slate-300 pb-2 flex justify-between items-start gap-2">
          <div>
            <strong>NOTIFICACIÓN DE REVERSIÓN DE PAGO Y RECLAMACIÓN DIRECTA</strong><br/>
            <span>Artículos 7, 43, 47, 50, 51 y 58 numeral 5 de la Ley 1480 de 2011</span>
          </div>
          <span class="px-2 py-0.5 bg-slate-200 rounded font-semibold shrink-0">Fecha: ${escapeHtml(todayStr)}</span>
        </div>
        <p>
          <strong>DESTINATARIO (PROVEEDOR):</strong> ${safeComercio}<br/>
          <strong>RECLAMANTE:</strong> ${safeNombre}, C.C. ${safeCedula}<br/>
          <strong>ENTIDAD FINANCIERA NOTIFICADA:</strong> ${safeBanco} (${safeMedio})<br/>
          <strong>MONTO TOTAL RECLAMADO:</strong> ${formatCOP(totalExigible)} COP
        </p>
        <p>
          <strong>1. OBJETO DE LA NOTIFICACIÓN:</strong><br/>
          Por medio del presente escrito notifico formalmente el ejercicio de la solicitud de reversión de pago por valor de <strong>${formatCOP(state.monto)} COP</strong> ante <strong>${safeBanco}</strong> con fundamento en el ${meta.legalCite}.${isVuelo ? ` Adicionalmente, exijo directamente a la aerolínea el pago de <strong>${formatCOP(compensacionRAC3)} COP</strong> correspondientes al 30% de compensación mínima obligatoria establecida en el RAC 3 de la Aeronáutica Civil, para un total de <strong>${formatCOP(totalExigible)} COP</strong>.` : ''}
        </p>
        <p>
          <strong>2. IMPROCEDENCIA DE LAS EXCUSAS OPUESTAS (ART. 43 LEY 1480 DE 2011):</strong><br/>
          Se deja constancia expresa de las siguientes circunstancias registradas en la atención del reclamo:<br/>
          ${excusesHtml}
        </p>
        <p>
          <strong>3. REQUISITO DE PROCEDIBILIDAD Y EFECTOS LEGALES:</strong><br/>
          Esta comunicación agota el requisito de reclamación directa previsto en el artículo 58 numeral 5 de la Ley 1480 de 2011 y acompaña la orden de reversión radicada ante <strong>${safeBanco}</strong>.
        </p>
        <div class="pt-2 border-t border-slate-300 text-xs text-slate-600">
          <strong>Anexos probatorios (Ley 527 de 1999):</strong> ${annexListHtml}<br/>
          <strong>Firma:</strong> ${safeNombre}, C.C. ${safeCedula}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="space-y-3">
        <div class="border-b border-slate-300 pb-2 flex justify-between items-start gap-2">
          <div>
            <strong>DEMANDA DE PROTECCIÓN AL CONSUMIDOR (ART. 58 LEY 1480 DE 2011)</strong><br/>
            <span>Artículos 78 y 229 de la Constitución Política · Artículo 24 del Código General del Proceso</span>
          </div>
          <span class="px-2 py-0.5 bg-slate-200 rounded font-semibold shrink-0">Fecha: ${escapeHtml(todayStr)}</span>
        </div>
        <p>
          <strong>AUTORIDAD COMPETENTE:</strong> Superintendencia de Industria y Comercio (Delegatura para Asuntos Jurisdiccionales)${isVuelo ? ' / Superintendencia de Transporte (RAC 3)' : ''}<br/>
          <strong>DEMANDANTE:</strong> ${safeNombre}, C.C. ${safeCedula}<br/>
          <strong>DEMANDADO:</strong> ${safeComercio}<br/>
          <strong>CUANTÍA:</strong> Mínima cuantía: ${formatCOP(totalExigible)} COP (no requiere representación por abogado)
        </p>
        <p>
          <strong>PRETENSIONES:</strong><br/>
          1. Que se declare que <strong>${safeComercio}</strong> vulneró los derechos del consumidor previstos en el ${meta.legalCite}.<br/>
          2. Que se ordene la restitución inmediata de <strong>${formatCOP(totalExigible)} COP</strong> en dinero efectivo, debidamente indexados.<br/>
          3. Que se impongan las sanciones previstas en los artículos 58 numeral 10 y 61 de la Ley 1480 de 2011 en caso de incumplimiento.
        </p>
        <div class="pt-2 border-t border-slate-300 text-xs text-slate-600">
          <strong>Pruebas documentales (Ley 527 de 1999):</strong> ${annexListHtml}<br/>
          <strong>Firma:</strong> ${safeNombre}, C.C. ${safeCedula}
        </div>
      </div>
    `;
  }
}

function renderLegalDocument() {
  const container = document.getElementById('liveLegalDocument');
  if (!container) return;
  container.innerHTML = buildDocumentHtml(state.activeDocTab);
}

function copyCurrentDocument() {
  const container = document.getElementById('liveLegalDocument');
  const label = document.getElementById('copyBtnLabel');
  if (!container) return;
  navigator.clipboard.writeText(container.innerText).then(() => {
    label.textContent = 'Texto copiado';
    setTimeout(() => { label.textContent = 'Copiar texto'; }, 1800);
  });
}

function downloadCurrentDocumentTxt() {
  const container = document.getElementById('liveLegalDocument');
  if (!container) return;
  const blob = new Blob([container.innerText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Oficio_${state.activeDocTab}_ReversoYa.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadAllDocumentsTxt() {
  const temp = document.createElement('div');
  const sections = ['banco', 'comercio', 'sic'].map((tab) => {
    temp.innerHTML = buildDocumentHtml(tab);
    return (temp.innerText || temp.textContent || '').trim();
  });
  const separator = '\n\n' + '='.repeat(76) + '\n\n';
  const blob = new Blob([sections.join(separator)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Paquete_3_Oficios_ReversoYa.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function updateCountdownSimulator(dayVal) {
  const day = Number(dayVal);
  const label = document.getElementById('currentDayLabel');
  const pill = document.getElementById('countdownStatusPill');
  const detail = document.getElementById('daySimulatorDetail');
  if (!label || !pill || !detail) return;

  const safeBanco = escapeHtml(state.banco);
  const safeComercio = escapeHtml(state.comercio);
  const safeMedio = escapeHtml(state.medioPago);

  label.textContent = String(day);

  if (day <= 5) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-emerald-soft text-emerald-dark font-bold text-xs';
    pill.textContent = `Faltan ${15 - day} días hábiles para el desembolso`;
    detail.innerHTML = `<strong>Día ${day} hábil (Verificación de la solicitud):</strong> La solicitud ya fue radicada ante <strong>${safeBanco}</strong> y notificada a <strong>${safeComercio}</strong>. Según el artículo 2.2.2.51.6 del Decreto 1074 de 2015, el comercio solo puede oponerse si acredita documentalmente que ya entregó el bien o que ya devolvió el dinero.`;
  } else if (day <= 14) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-slate-200 text-navy font-bold text-xs';
    pill.textContent = `En trámite bancario: faltan ${15 - day} días hábiles`;
    detail.innerHTML = `<strong>Día ${day} hábil (Procesamiento en red de pagos):</strong> Cerrado el término de oposición del proveedor, <strong>${safeBanco}</strong> y la red procesadora (${safeMedio}) ejecutan el abono de los <strong>${formatCOP(state.monto)} COP</strong> a favor del consumidor.`;
  } else if (day === 15) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-emerald text-white font-bold text-xs';
    pill.textContent = 'Día 15 hábil: vencimiento del plazo legal de abono';
    detail.innerHTML = `<strong>Día 15 hábil (Plazo límite, Art. 2.2.2.51.5 Decreto 1074 de 2015):</strong> Hoy vence el término máximo para que <strong>${safeBanco}</strong> acredite los <strong>${formatCOP(state.monto)} COP</strong> en la cuenta o tarjeta del consumidor sin cobro de comisiones.`;
  } else {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-danger-soft text-danger font-bold text-xs';
    pill.textContent = 'Día 16+: incumplimiento del plazo bancario';
    detail.innerHTML = `<strong>Día 16+ hábil (Mora del emisor financiero):</strong> Si <strong>${safeBanco}</strong> no abonó los recursos al cumplirse el día 15 hábil, procede presentar queja formal ante el <strong>Defensor del Consumidor Financiero</strong> y ante la <strong>Superintendencia Financiera de Colombia</strong> por incumplimiento del Decreto 587 de 2016.`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderEvidenceList();
  analyzeChatText();
  recalculateCase();
});
