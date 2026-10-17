// ReversoYa — Motor Jurídico Interactivo (Ley 1480 de 2011, Decreto 587 de 2016 y RAC 3 Aerocivil)

const state = {
  currentStep: 1,
  allScreensMode: false,
  causal: 'no_recibido',
  monto: 680000,
  medioPago: 'PSE (Débito Bancario en Línea)',
  banco: 'Bancolombia S.A.',
  comercio: 'Tienda Virtual @ModaCol_Oficial (NIT 901.442.118-2)',
  diasTranscurridos: 2,
  activeDocTab: 'banco',
  evidenceFiles: [
    { name: 'Comprobante_Pago_PSE_Bancolombia.pdf', hash: '8f4a92e1...91c2' },
    { name: 'Captura_WhatsApp_Negativa_Comercio.png', hash: '3b1e77c4...40d9' }
  ]
};

const CAUSAL_META = {
  no_recibido: {
    code: 'Causal 4 • Art. 51 Ley 1480',
    title: 'Producto no recibido en la fecha pactada',
    legalCite: 'Artículo 51 numeral 4 de la Ley 1480 de 2011 y Artículo 2.2.2.51.2 numeral 4 del Decreto 1074 de 2015 (adicionado por el Decreto 587 de 2016)',
    mechanism: 'Cuando el bien adquirido por comercio electrónico no es entregado materialmente en el plazo anunciado, el emisor del instrumento de pago debe reversar el 100% de la transacción.'
  },
  defectuoso: {
    code: 'Causal 5 • Art. 51 + Art. 47 Ley 1480',
    title: 'Producto defectuoso, sin correspondencia con lo anunciado o Retracto negado',
    legalCite: 'Artículos 7, 47 y 51 numeral 5 de la Ley 1480 de 2011 y Artículo 2.2.2.51.2 numeral 5 del Decreto 1074 de 2015',
    mechanism: 'El consumidor puso el bien a disposición del proveedor o ejerció su derecho de retracto dentro de los 5 días hábiles. Es ilegal imponer bonos o negar la garantía por tratarse de una promoción.'
  },
  fraude: {
    code: 'Causales 1 y 2 • Art. 51 Ley 1480',
    title: 'Operación no solicitada, fraude o cobro duplicado',
    legalCite: 'Artículo 51 numerales 1 y 2 de la Ley 1480 de 2011 y Decreto 587 de 2016',
    mechanism: 'Ante un cargo no autorizado o debitado por duplicado en pasarela electrónica, la entidad financiera emisora debe restituir la suma debitada dentro de los 15 días hábiles siguientes.'
  },
  vuelo: {
    code: 'RAC 3 Aerocivil + Art. 51 Ley 1480',
    title: 'Sobreventa (Overbooking), cancelación atribuible a la aerolínea o retracto de tiquete',
    legalCite: 'Reglamentos Aeronáuticos de Colombia (RAC 3 de la Aerocivil, sección 3.10.2.13.2) y Artículo 51 de la Ley 1480 de 2011',
    mechanism: 'Además del reembolso del 100% del valor del tiquete no volado a través del emisor financiero, la aerolínea debe pagar una compensación adicional mínima del 30% del valor del trayecto.'
  }
};

function formatCOP(num) {
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function goToStep(stepNum) {
  state.currentStep = stepNum;
  if (!state.allScreensMode) {
    document.querySelectorAll('.step-panel').forEach((panel, idx) => {
      if (idx + 1 === stepNum) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  } else {
    const target = document.getElementById(`step-${stepNum}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`stepper-${i}`);
    const badge = document.getElementById(`stepper-badge-${i}`);
    if (!btn || !badge) continue;
    if (i === stepNum) {
      btn.className = 'step-tab flex items-center gap-3 p-2.5 rounded-xl border-2 border-primary bg-surface-container-low text-left transition';
      badge.className = 'w-8 h-8 rounded-full bg-primary text-white font-display font-bold text-sm flex items-center justify-center shrink-0';
      badge.textContent = String(i);
    } else if (i < stepNum) {
      btn.className = 'step-tab flex items-center gap-3 p-2.5 rounded-xl border border-secondary bg-white text-left transition';
      badge.className = 'w-8 h-8 rounded-full bg-secondary text-primary font-display font-bold text-sm flex items-center justify-center shrink-0';
      badge.textContent = '✓';
    } else {
      btn.className = 'step-tab flex items-center gap-3 p-2.5 rounded-xl border border-outline-variant/60 bg-white hover:border-primary/50 text-left transition';
      badge.className = 'w-8 h-8 rounded-full bg-surface-container text-primary font-display font-bold text-sm flex items-center justify-center shrink-0';
      badge.textContent = String(i);
    }
  }
  recalculateCase();
}

function toggleAllScreensMode() {
  state.allScreensMode = !state.allScreensMode;
  const workbench = document.getElementById('mainWorkbench');
  const label = document.getElementById('toggleAllScreensLabel');
  if (state.allScreensMode) {
    workbench.classList.add('all-screens-mode');
    label.textContent = 'Modo Paso a Paso';
  } else {
    workbench.classList.remove('all-screens-mode');
    label.textContent = 'Ver 4 Pantallas Juntas';
    goToStep(state.currentStep);
  }
}

function selectCausal(causalKey) {
  state.causal = causalKey;
  ['no_recibido', 'defectuoso', 'fraude', 'vuelo'].forEach((key) => {
    const card = document.getElementById(`card-causal-${key}`);
    if (!card) return;
    if (key === causalKey) {
      card.className = 'causal-card text-left p-4 rounded-xl border-2 border-primary bg-surface-container-low/50 transition flex flex-col justify-between';
    } else {
      card.className = 'causal-card text-left p-4 rounded-xl border border-outline-variant/60 bg-white hover:border-primary/50 transition flex flex-col justify-between';
    }
  });
  recalculateCase();
}

function setAmount(val) {
  const input = document.getElementById('inputMonto');
  if (input) input.value = val;
  recalculateCase();
}

function loadPreset(presetName) {
  document.querySelectorAll('.preset-btn').forEach((b) => {
    if (b.dataset.preset === presetName) {
      b.className = 'preset-btn px-2.5 py-1 rounded text-xs font-semibold bg-primary text-white transition';
    } else {
      b.className = 'preset-btn px-2.5 py-1 rounded text-xs font-medium text-primary hover:bg-surface-container transition';
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
    inputComercio.value = 'Tienda Virtual @ModaCol_Oficial (NIT 901.442.118-2)';
    selectDias.value = '2';
    inputChat.value = 'Hola, por políticas de nuestra tienda en Instagram no hacemos devolución de dinero, solo te podemos dar un bono para que pidas otra prenda o reclámale a la transportadora.';
    checks.forEach((c) => { c.checked = (c.value === 'bono' || c.value === 'transportadora'); });
  } else if (presetName === 'garantia') {
    selectCausal('defectuoso');
    inputMonto.value = 1450000;
    selectMedio.value = 'Tarjeta de Crédito';
    selectBanco.value = 'Banco Davivienda S.A.';
    inputComercio.value = 'ElectroShop Colombia S.A.S. (NIT 900.812.334-1)';
    selectDias.value = '4';
    inputChat.value = 'El equipo fue adquirido en promoción de Black Friday y en los términos dice que productos en descuento no tienen garantía ni devolución de dinero.';
    checks.forEach((c) => { c.checked = (c.value === 'promocion' || c.value === 'bono'); });
  } else if (presetName === 'fraude') {
    selectCausal('fraude');
    inputMonto.value = 320000;
    selectMedio.value = 'Nequi (Depósito de Bajo Monto)';
    selectBanco.value = 'Nequi S.A. Compañía de Financiamiento';
    inputComercio.value = 'Pasarela Digital / Comercio E-Commerce S.A.S.';
    selectDias.value = '1';
    inputChat.value = 'El cobro aparece debitado dos veces en su cuenta Nequi, pero tiene que esperar de 45 a 60 días hábiles mientras contabilidad revisa el extracto.';
    checks.forEach((c) => { c.checked = (c.value === 'demora'); });
  } else if (presetName === 'vuelo') {
    selectCausal('vuelo');
    inputMonto.value = 540000;
    selectMedio.value = 'Tarjeta Débito con CVV';
    selectBanco.value = 'BBVA Colombia';
    inputComercio.value = 'Aerolínea Comercial S.A. (Vuelo BOG-CTG)';
    selectDias.value = '2';
    inputChat.value = 'Por sobreventa del vuelo no fue posible abordar; únicamente ofrecemos un voucher o bono para viajar después y el reembolso tarda 60 días.';
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
    findings.push('Imposición ilegal de bono o negativa de reembolso en dinero (viola Art. 47 y 51 Ley 1480 de 2011)');
  }
  if (txt.includes('transportadora') || txt.includes('servientrega') || txt.includes('interrapidísimo') || txt.includes('bodega')) {
    findings.push('Traslado ilegal de responsabilidad logística al consumidor (viola Art. 50 lit. h Ley 1480 de 2011)');
  }
  if (txt.includes('promoción') || txt.includes('descuento') || txt.includes('black friday') || txt.includes('garantía')) {
    findings.push('Exclusión nula de garantía legal en bienes con descuento (cláusula ineficaz de pleno derecho según Art. 43 Ley 1480)');
  }
  if (txt.includes('45') || txt.includes('60') || txt.includes('30') || txt.includes('contabilidad')) {
    findings.push('Dilación superior al término perentorio de 15 días hábiles bancarios (viola Art. 2.2.2.51.5 Decreto 587 de 2016)');
  }

  if (findings.length === 0) {
    out.innerHTML = '<strong>Mensaje registrado:</strong> Aunque el texto no contiene cláusulas expresas, la falta de entrega o respuesta habilita la notificación formal de reversión de pago ante el emisor financiero (Art. 51 Ley 1480).';
  } else {
    out.innerHTML = `<strong>Hallazgo forense en el mensaje (${findings.length} infracciones a la Ley 1480):</strong><br/>• ` + findings.join('<br/>• ');
  }
}

function simulateEvidenceUpload() {
  const list = document.getElementById('evidenceList');
  if (!list) return;
  const randomHash = Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6);
  const item = document.createElement('div');
  item.className = 'p-2 rounded bg-white border border-secondary/60 flex items-center justify-between';
  item.innerHTML = `<span class="truncate font-medium">📸 Evidencia_Adicional_${state.evidenceFiles.length + 1}.png</span><span class="font-mono text-[10px] text-secondary font-bold">SHA-256: ${randomHash} ✓</span>`;
  list.appendChild(item);
  state.evidenceFiles.push({ name: `Evidencia_Adicional_${state.evidenceFiles.length + 1}.png`, hash: randomHash });
}

function recalculateCase() {
  state.monto = Math.max(0, Number(document.getElementById('inputMonto')?.value || 680000));
  state.medioPago = document.getElementById('selectMedioPago')?.value || state.medioPago;
  state.banco = document.getElementById('selectBanco')?.value || state.banco;
  state.comercio = document.getElementById('inputComercio')?.value || state.comercio;
  state.diasTranscurridos = Number(document.getElementById('selectDiasTranscurridos')?.value || 2);

  const isVuelo = state.causal === 'vuelo';
  const compensacionRAC3 = isVuelo ? Math.round(state.monto * 0.30) : 0;
  const totalExigible = state.monto + compensacionRAC3;
  const enTermino5Dias = state.diasTranscurridos <= 5;
  const diasRestantes = Math.max(0, 5 - state.diasTranscurridos);

  // Update Step 1 Banner
  const plazoBanner = document.getElementById('plazoBanner');
  const plazoTitulo = document.getElementById('plazoTitulo');
  const plazoDesc = document.getElementById('plazoDescripcion');
  const plazoIcon = document.getElementById('plazoIcon');

  if (enTermino5Dias) {
    plazoBanner.className = 'mt-5 p-4 rounded-xl bg-surface-container-low border border-secondary/40 flex items-start gap-3';
    plazoIcon.className = 'material-symbols-outlined text-secondary text-2xl shrink-0';
    plazoIcon.textContent = 'timer';
    plazoTitulo.textContent = `Ventana perentoria activa: te quedan ${diasRestantes === 0 ? 'horas (vence hoy)' : diasRestantes + ' días hábiles'} para obligar al banco a reversar (Art. 2.2.2.51.4 Decreto 587/2016)`;
    plazoDesc.innerHTML = `Al radicar hoy ante <strong>${state.comercio}</strong> y notificar a <strong>${state.banco}</strong> (${state.medioPago}), el banco tiene máximo <strong>15 días hábiles</strong> para devolverte <strong>${formatCOP(state.monto)} COP</strong>${isVuelo ? ` más <strong>${formatCOP(compensacionRAC3)} COP</strong> (30% de compensación RAC 3 exigible a la aerolínea)` : ''}.`;
  } else {
    plazoBanner.className = 'mt-5 p-4 rounded-xl bg-error-container/25 border border-error/40 flex items-start gap-3';
    plazoIcon.className = 'material-symbols-outlined text-error text-2xl shrink-0';
    plazoIcon.textContent = 'gavel';
    plazoTitulo.textContent = 'Plazo bancario de 5 días superado: ReversoYa activa la Ruta Jurisdiccional SIC (Art. 58 Ley 1480)';
    plazoDesc.innerHTML = `Como pasaron más de 5 días hábiles para la reversión administrativa ante ${state.banco}, ReversoYa transforma tu solicitud en Reclamación Directa Prejudicial y Demanda Verbal Sumaria ante la Superintendencia de Industria y Comercio (SIC) para exigir los <strong>${formatCOP(totalExigible)} COP</strong> más sanciones.`;
  }

  // Update Sticky Sidebar
  document.getElementById('sidebarCausalTag').textContent = CAUSAL_META[state.causal].code;
  document.getElementById('sidebarHeadline').textContent = enTermino5Dias
    ? `${state.banco} está obligado a reversar el 100% de tu pago en máx. 15 días hábiles`
    : `Ruta Jurisdiccional SIC activa contra ${state.comercio} por ${formatCOP(totalExigible)} COP`;
  document.getElementById('sidebarTotalAmount').textContent = formatCOP(totalExigible);
  document.getElementById('sidebarCompensationNote').textContent = isVuelo
    ? `Incluye ${formatCOP(state.monto)} (100% tiquete vía banco) + ${formatCOP(compensacionRAC3)} (30% compensación obligatoria RAC 3 Aerocivil).`
    : 'Reembolso íntegro en dinero a tu cuenta o tarjeta (Art. 47 y 51 Ley 1480 prohíben imponer bonos).';

  const daysPill = document.getElementById('sidebarDaysLeft');
  if (enTermino5Dias) {
    daysPill.className = 'text-on-secondary-container bg-secondary/20 px-2 py-0.5 rounded font-bold';
    daysPill.textContent = diasRestantes === 0 ? '¡Vence hoy!' : `Quedan ${diasRestantes} días hábiles`;
  } else {
    daysPill.className = 'text-on-error-container bg-error-container px-2 py-0.5 rounded font-bold';
    daysPill.textContent = 'Vía Jurisdiccional SIC (Art. 58)';
  }

  // Update Step 3 Traffic Light
  document.getElementById('semaforoViabilidad').textContent = enTermino5Dias
    ? '🟢 ALTA (Reversión Bancaria 15d)'
    : '🟡 VÍA JURISDICCIONAL SIC';
  document.getElementById('semaforoMonto').textContent = `${formatCOP(totalExigible)} COP`;
  document.getElementById('semaforoMontoDetalle').textContent = isVuelo
    ? `${formatCOP(state.monto)} tiquete + ${formatCOP(compensacionRAC3)} RAC 3`
    : `100% a través de ${state.banco}`;

  // Update Modal Targets
  document.getElementById('modalMerchantTarget').textContent = state.comercio;
  document.getElementById('modalBankTarget').textContent = `${state.banco} — ${state.medioPago} (${formatCOP(state.monto)} COP)`;

  renderLegalDocument();
}

function switchDocTab(tabKey) {
  state.activeDocTab = tabKey;
  ['banco', 'comercio', 'sic'].forEach((k) => {
    const btn = document.getElementById(`doc-tab-${k}`);
    if (!btn) return;
    if (k === tabKey) {
      btn.className = 'doc-tab-btn px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold transition';
    } else {
      btn.className = 'doc-tab-btn px-3 py-1.5 rounded-lg text-primary hover:bg-white/60 text-xs font-semibold transition';
    }
  });
  renderLegalDocument();
}

function renderLegalDocument() {
  const container = document.getElementById('liveLegalDocument');
  if (!container) return;

  const meta = CAUSAL_META[state.causal];
  const isVuelo = state.causal === 'vuelo';
  const compensacionRAC3 = isVuelo ? Math.round(state.monto * 0.30) : 0;
  const totalExigible = state.monto + compensacionRAC3;
  const todayStr = new Date().toISOString().slice(0, 10);

  const selectedExcuses = Array.from(document.querySelectorAll('.excuse-check:checked')).map((el) => {
    if (el.value === 'bono') return 'Pretensión ilegal de imponer un bono o saldo a favor en lugar de reembolso en dinero (violación del Art. 47 y 51 de la Ley 1480 de 2011).';
    if (el.value === 'transportadora') return 'Evasión de la responsabilidad solidaria y directa de entrega material al consumidor (violación del Art. 50 literal h de la Ley 1480 de 2011).';
    if (el.value === 'promocion') return 'Invocación de cláusula ineficaz de pleno derecho que pretende negar la garantía legal por tratarse de un bien en promoción (violación de los Arts. 7, 8 y 43 de la Ley 1480 de 2011).';
    if (el.value === 'demora') return 'Dilación injustificada superior al plazo perentorio de quince (15) días hábiles fijado por el Art. 2.2.2.51.5 del Decreto 1074 de 2015.';
    return '';
  }).filter(Boolean);

  const excusesHtml = selectedExcuses.length > 0
    ? selectedExcuses.map((e, i) => `   ${i + 1}. ${e}`).join('<br/>')
    : '   1. Silencio o negativa frente a la solicitud directa de cumplimiento o reembolso.';

  if (state.activeDocTab === 'banco') {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="border-b border-outline-variant pb-2 flex justify-between items-start">
          <div>
            <strong>SOLICITUD FORMAL Y VINCULANTE DE REVERSIÓN DE PAGO</strong><br/>
            <span>Artículo 51 Ley 1480 de 2011 y Decreto 587 de 2016 (Cap. 51 Decreto 1074 de 2015)</span>
          </div>
          <span class="px-2 py-0.5 bg-surface-container rounded font-bold">Fecha: ${todayStr}</span>
        </div>
        <p>
          <strong>DESTINATARIO (EMISOR DEL INSTRUMENTO DE PAGO):</strong> ${state.banco}<br/>
          <strong>CANAL / INSTRUMENTO UTILIZADO:</strong> ${state.medioPago}<br/>
          <strong>PROVEEDOR / COMERCIO REPORTADO:</strong> ${state.comercio}<br/>
          <strong>VALOR A REVERSAR:</strong> ${formatCOP(state.monto)} COP
        </p>
        <p>
          <strong>1. CAUSAL INVOCADA (ART. 2.2.2.51.2 DECRETO 1074 DE 2015):</strong><br/>
          Manifiesto bajo la gravedad de juramento que la transacción por valor de <strong>${formatCOP(state.monto)} COP</strong> realizada mediante <strong>${state.medioPago}</strong> a favor de <strong>${state.comercio}</strong> se encuentra incursa en la causal legal de: <strong>${meta.title.toUpperCase()}</strong> (${meta.legalCite}).
        </p>
        <p>
          <strong>2. CONSTANCIA DE RECLAMACIÓN PREVIA AL PROVEEDOR (ART. 2.2.2.51.4):</strong><br/>
          Dentro de los cinco (5) días hábiles siguientes al conocimiento del hecho, presenté reclamación directa al proveedor, quien incurrió en:<br/>
          ${excusesHtml}
        </p>
        <p>
          <strong>3. PETICIÓN PERENTORIA DE REVERSIÓN EN 15 DÍAS HÁBILES (ART. 2.2.2.51.5):</strong><br/>
          Solicito a <strong>${state.banco}</strong> que, junto con los demás participantes del proceso de pago, haga efectiva la reversión íntegra de <strong>${formatCOP(state.monto)} COP</strong> en mi cuenta o instrumento de pago dentro del término improrrogable de <strong>quince (15) días hábiles</strong> contados a partir de la presente radicación, advirtiendo que el incumplimiento acarrea las sanciones de la Superintendencia Financiera de Colombia y de la Superintendencia de Industria y Comercio.
        </p>
        <div class="pt-2 border-t border-outline-variant/60 text-[11px] text-on-surface-variant flex justify-between">
          <span>Anexos: Comprobante de pago y capturas certificadas con hash SHA-256 (Ley 527/1999)</span>
          <span class="font-bold text-secondary">Documento validado con estándar Clarity</span>
        </div>
      </div>
    `;
  } else if (state.activeDocTab === 'comercio') {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="border-b border-outline-variant pb-2 flex justify-between items-start">
          <div>
            <strong>NOTIFICACIÓN DE REVERSIÓN DE PAGO Y RECLAMACIÓN DIRECTA PREJUDICIAL</strong><br/>
            <span>Artículos 7, 43, 47, 50, 51 y 58 numeral 5 de la Ley 1480 de 2011</span>
          </div>
          <span class="px-2 py-0.5 bg-surface-container rounded font-bold">Fecha: ${todayStr}</span>
        </div>
        <p>
          <strong>DESTINATARIO (PROVEEDOR / EXPENDEDOR):</strong> ${state.comercio}<br/>
          <strong>COPIA VINCULANTE A:</strong> ${state.banco} (${state.medioPago})<br/>
          <strong>MONTO RECLAMADO:</strong> ${formatCOP(totalExigible)} COP
        </p>
        <p>
          <strong>1. HECHOS Y FUNDAMENTOS DE DERECHO:</strong><br/>
          Notifico formalmente la solicitud de reversión del pago por <strong>${formatCOP(state.monto)} COP</strong> conforme al <strong>${meta.legalCite}</strong>.${isVuelo ? ` Adicionalmente, exijo el pago de <strong>${formatCOP(compensacionRAC3)} COP</strong> correspondientes al 30% de compensación obligatoria prevista en el RAC 3 de la Aeronáutica Civil.` : ''}
        </p>
        <p>
          <strong>2. INEFICACIA DE PLENO DERECHO DE LAS EXCUSAS OPUESTAS (ART. 43 LEY 1480):</strong><br/>
          Se deja constancia probatoria de las siguientes respuestas ilegales emitidas por su comercio:<br/>
          ${excusesHtml}
        </p>
        <p>
          <strong>3. ADVERTENCIA SANCIONATORIA Y REQUISITO DE PROCEDIBILIDAD:</strong><br/>
          El presente escrito surte el requisito de reclamación directa del Artículo 58 numeral 5 de la Ley 1480 de 2011 y activa la orden de reversión ante <strong>${state.banco}</strong>. La obstrucción a la reversión o el suministro de información falsa al emisor financiero se sanciona con multas de hasta <strong>dos mil (2.000) SMLMV</strong> (Art. 61 Ley 1480 de 2011).
        </p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="border-b border-outline-variant pb-2 flex justify-between items-start">
          <div>
            <strong>QUEJA Y DEMANDA DE PROTECCIÓN AL CONSUMIDOR (SIC / AEROCIVIL)</strong><br/>
            <span>Artículo 78 y 229 Constitución Política • Artículo 24 Código General del Proceso • Art. 58 Ley 1480</span>
          </div>
          <span class="px-2 py-0.5 bg-surface-container rounded font-bold">Fecha: ${todayStr}</span>
        </div>
        <p>
          <strong>AUTORIDAD COMPETENTE:</strong> Superintendencia de Industria y Comercio (Delegatura para Asuntos Jurisdiccionales)${isVuelo ? ' y Superintendencia de Transporte / Aeronáutica Civil (RAC 3)' : ''}<br/>
          <strong>DEMANDADO:</strong> ${state.comercio}<br/>
          <strong>CUANTÍA MÍNIMA:</strong> ${formatCOP(totalExigible)} COP (No requiere abogado según Art. 24 CGP y Art. 58 Ley 1480)
        </p>
        <p>
          <strong>PRETENSIONES:</strong><br/>
          1. Que se declare que <strong>${state.comercio}</strong> vulneró los derechos del consumidor consagrados en el ${meta.legalCite}.<br/>
          2. Que se ordene la restitución inmediata de <strong>${formatCOP(totalExigible)} COP</strong> debidamente indexados.<br/>
          3. Que se imponga la multa sucesiva prevista en el numeral 10 del artículo 58 de la Ley 1480 de 2011 en caso de incumplimiento.
        </p>
      </div>
    `;
  }
}

function copyCurrentDocument() {
  const container = document.getElementById('liveLegalDocument');
  const label = document.getElementById('copyBtnLabel');
  if (!container) return;
  navigator.clipboard.writeText(container.innerText).then(() => {
    label.textContent = '¡Copiado!';
    setTimeout(() => { label.textContent = 'Copiar Oficio'; }, 1800);
  });
}

function updateCountdownSimulator(dayVal) {
  const day = Number(dayVal);
  document.getElementById('currentDayLabel').textContent = String(day);
  const pill = document.getElementById('countdownStatusPill');
  const detail = document.getElementById('daySimulatorDetail');

  if (day <= 5) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-secondary/20 text-on-secondary-container font-bold text-xs';
    pill.textContent = `Faltan ${15 - day} días hábiles para el abono forzoso`;
    detail.innerHTML = `<strong>Estado en Día ${day} hábil (Etapa de verificación):</strong> La orden ya fue radicada ante <strong>${state.banco}</strong> y notificada a <strong>${state.comercio}</strong>. Según el Art. 2.2.2.51.6 del Decreto 587 de 2016, el comercio no puede frenar la reversión con simples excusas: tendría que probar documentalmente que ya entregó el bien o que ya devolvió el dinero.`;
  } else if (day <= 14) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs';
    pill.textContent = `Recta final: faltan ${15 - day} días hábiles para el desembolso`;
    detail.innerHTML = `<strong>Estado en Día ${day} hábil (Procesamiento en red de pagos):</strong> Venció el plazo del comercio para oponerse. <strong>${state.banco}</strong> y la red procesadora (${state.medioPago}) están ejecutando el contracargo obligatorio a tu cuenta.`;
  } else if (day === 15) {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-secondary text-primary font-bold text-xs';
    pill.textContent = '¡Hoy vence el plazo perentorio de 15 días hábiles!';
    detail.innerHTML = `<strong>Estado en Día 15 hábil (Plazo límite legal - Art. 2.2.2.51.5 Decreto 587/2016):</strong> Hoy a más tardar <strong>${state.banco}</strong> debe acreditar los <strong>${formatCOP(state.monto)} COP</strong> en tu cuenta o tarjeta sin cobrarte comisión alguna.`;
  } else {
    pill.className = 'px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold text-xs';
    pill.textContent = 'Incumplimiento bancario: Queja automática ante Superfinanciera';
    detail.innerHTML = `<strong>Estado en Día 16+ hábil (Mora regulatoria del emisor):</strong> Si <strong>${state.banco}</strong> no abonó el dinero al día 15 hábil, incumple el Decreto 587 de 2016. ReversoYa radica automáticamente la queja ante el <strong>Defensor del Consumidor Financiero</strong> y la <strong>Superintendencia Financiera de Colombia</strong>.`;
  }
}

function openFilingModal() {
  const m = document.getElementById('filingModal');
  if (m) {
    m.classList.remove('hidden');
    m.classList.add('flex');
  }
}

function closeFilingModal() {
  const m = document.getElementById('filingModal');
  if (m) {
    m.classList.add('hidden');
    m.classList.remove('flex');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  analyzeChatText();
  recalculateCase();
});
