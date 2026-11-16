const DB_PRICES = {
    pun: { 
        '01': { mono: 0.133, f1: 0.151, f2: 0.137, f3: 0.118 }, '02': { mono: 0.114, f1: 0.122, f2: 0.120, f3: 0.105 },
        '03': { mono: 0.143, f1: 0.143, f2: 0.153, f3: 0.138 }, '04': { mono: 0.119, f1: 0.111, f2: 0.138, f3: 0.116 },
        '05': { mono: 0.119, f1: 0.107, f2: 0.131, f3: 0.120 }, '06': { mono: 0.132, f1: 0.125, f2: 0.151, f3: 0.127 },
        '07': { mono: 0.157, f1: 0.154, f2: 0.169, f3: 0.152 }, '08': { mono: 0.180, f1: 0.174, f2: 0.204, f3: 0.171 }, '09': { mono: 0.207, f1: 0.206, f2: 0.227, f3: 0.197 },
        '10': { mono: 0.230, f1: 0.233, f2: 0.252, f3: 0.215 }
    }, psv: { 
        '01': 0.45, '02': 0.377, '03': 0.558, '04': 0.493, '05': 0.502, '06': 0.505, '07': 0.606, '08': 0.686, '09': 0.843, '10': 0.945
    }
};

const OFFERTE_CONFIG = {
    // Residenziali Luce
    'casaProtetta': { type: 'luce', segment: 'consumer', spread: 0.044, pcv: 13.00 },
    'beFamilyFast26': { type: 'luce', segment: 'consumer', spread: 0.044, pcv: 11.90 },
    'portaUnAmicoFamily': { type: 'luce', segment: 'consumer', spread: 0.044, pcv: 13.00 },
    
    // Residenziali Gas
    'gasFamily26': { type: 'gas', segment: 'consumer', spread: 0.18, pcv: 14.00 },
    
    // Business Luce
    'beSmart': { type: 'luce', segment: 'business', spread: 0.034, pcv: 15.00 },
    'beSpecialNew': { type: 'luce', segment: 'business', spread: 0.026, pcv: 15.00 },
    'beStrong': { type: 'luce', segment: 'business', spread: 0.024, pcv: 15.00 },
    
    // Business Gas
    'gasTop26': { type: 'gas', segment: 'business', spread: 0.159, pcv: 15.00 },
    'beStrongGas': { type: 'gas', segment: 'business', spread: 0.109, pcv: 15.00, minSmc: 3500 },
    'gasRelax': { type: 'gas', segment: 'business', spread: 0.209, pcv: 15.00 }
};

const months = [
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}, {v:'03', t:'Marzo 2026'}, {v:'04', t:'Aprile 2026'}, {v:'05', t:'Maggio 2026'}, {v:'06', t:'Giugno 2026'},
    {v:'07', t:'Luglio 2026'}, {v:'08', t:'Agosto 2026'}, {v:'09', t:'Settembre 2026'}, {v:'10', t:'Ottobre 2026'}
];

function gestisciVisibilitaCap() {
    const hL = document.getElementById('hasCapLuce');
    const colonnaLuce = hL ? hL.closest('.col') : null;
    if (hL && colonnaLuce) {
        colonnaLuce.style.display = 'none';
        hL.value = 'no';
    }

    const hG = document.getElementById('hasCapGas');
    const colonnaGas = hG ? hG.closest('.col') : null;
    if (hG && colonnaGas) {
        colonnaGas.style.display = 'none';
        hG.value = 'no';
    }
}

function toggleSections() {
    const u = document.getElementById('utilityType').value, l = document.getElementById('tipoLettura').value;
    const fL = document.getElementById('freqLuce').value, fG = document.getElementById('freqGas').value;
    
    document.getElementById('light-section').style.display = (u === 'light' || u === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (u === 'gas' || u === 'lightAndGas') ? 'block' : 'none';
    
    const offersSection = document.getElementById('offers-section');
    if (offersSection) {
        offersSection.style.display = (u === 'light' || u === 'gas' || u === 'lightAndGas') ? 'block' : 'none';
    }

    if (document.getElementById('offer-light-row')) {
        document.getElementById('offer-light-row').style.display = (u === 'light' || u === 'lightAndGas') ? 'flex' : 'none';
    }
    if (document.getElementById('offer-gas-row')) {
        document.getElementById('offer-gas-row').style.display = (u === 'gas' || u === 'lightAndGas') ? 'flex' : 'none';
    }
    if (fL === "2" && (u === 'light' || u === 'lightAndGas')) { document.getElementById('light-mese2').classList.remove('hidden'); } else { document.getElementById('light-mese2').classList.add('hidden'); }
    if (fG === "2" && (u === 'gas' || u === 'lightAndGas')) { document.getElementById('gas-mese2').classList.remove('hidden'); } else { document.getElementById('gas-mese2').classList.add('hidden'); }
    if (l === 'fasce') { document.getElementById('div-fasce1').classList.remove('hidden'); document.getElementById('div-mono1').classList.add('hidden'); document.getElementById('div-fasce2').classList.remove('hidden'); document.getElementById('div-mono2').classList.add('hidden'); }
    else { document.getElementById('div-fasce1').classList.add('hidden'); document.getElementById('div-mono1').classList.remove('hidden'); document.getElementById('div-fasce2').classList.add('hidden'); document.getElementById('div-mono2').classList.remove('hidden'); }
    gestisciVisibilitaCap();
}

function updateOffersDropdown() {
    const t = document.getElementById('userType').value;
    const annGas = parseFloat(document.getElementById('annuoGas')?.value) || 0;
    const sL = document.getElementById('selectedOfferLuce');
    const sG = document.getElementById('selectedOfferGas');
    
    if (sL) {
        Array.from(sL.options).forEach(opt => {
            if (opt.value === "") return;
            const conf = OFFERTE_CONFIG[opt.value];
            if (conf && conf.segment === t) {
                opt.style.display = 'block';
                opt.disabled = false;
                opt.hidden = false;
            } else {
                opt.style.display = 'none';
                opt.disabled = true;
                opt.hidden = true;
            }
        });
        const currentOptL = sL.options[sL.selectedIndex];
        if (currentOptL && currentOptL.disabled) sL.value = "";
    }

    if (sG) {
        Array.from(sG.options).forEach(opt => {
            if (opt.value === "") return;
            const conf = OFFERTE_CONFIG[opt.value];
            if (conf && conf.segment === t) {
                if (opt.value === 'beStrongGas' && annGas < 3500) {
                    opt.style.display = 'none';
                    opt.disabled = true;
                    opt.hidden = true;
                } else {
                    opt.style.display = 'block';
                    opt.disabled = false;
                    opt.hidden = false;
                }
            } else {
                opt.style.display = 'none';
                opt.disabled = true;
                opt.hidden = true;
            }
        });
        const currentOptG = sG.options[sG.selectedIndex];
        if (currentOptG && currentOptG.disabled) sG.value = "";
    }
    
    gestisciVisibilitaCap();
}

document.addEventListener('DOMContentLoaded', () => {
    ['monthLuce1', 'monthLuce2', 'monthGas1', 'monthGas2'].forEach(id => { const el = document.getElementById(id); if (el) months.forEach(m => el.add(new Option(m.t, m.v))); });
    ['utilityType', 'tipoLettura', 'freqLuce', 'freqGas'].forEach(id => document.getElementById(id).addEventListener('change', toggleSections));
    document.getElementById('userType').addEventListener('change', updateOffersDropdown);
    
    const annLuceInput = document.getElementById('annuoLuce');
    if (annLuceInput) annLuceInput.addEventListener('input', updateOffersDropdown);
    const annGasInput = document.getElementById('annuoGas');
    if (annGasInput) annGasInput.addEventListener('input', updateOffersDropdown);

    document.getElementById('selectedOfferLuce').addEventListener('change', gestisciVisibilitaCap);
    document.getElementById('selectedOfferGas').addEventListener('change', gestisciVisibilitaCap);
    
    toggleSections(); updateOffersDropdown(); gestisciVisibilitaCap();
});

document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const utente = document.getElementById('clientName').value, utility = document.getElementById('utilityType').value;
    const oL = document.getElementById('selectedOfferLuce').value, nL = oL ? document.getElementById('selectedOfferLuce').options[document.getElementById('selectedOfferLuce').selectedIndex].text : '';
    const hL = document.getElementById('hasCapLuce').value === 'si';
    const oG = document.getElementById('selectedOfferGas').value, nG = oG ? document.getElementById('selectedOfferGas').options[document.getElementById('selectedOfferGas').selectedIndex].text : '';
    const hG = document.getElementById('hasCapGas').value === 'si';
    
    const LIM_L = 0.200, LIM_G = 0.95, oggi = new Date(), uG = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0), dS = `${String(uG.getDate()).padStart(2,'0')}/${String(uG.getMonth()+1).padStart(2,'0')}/${uG.getFullYear()}`;
    
    let totSave = 0, dCap = '';
    if ((utility === 'light' || utility === 'lightAndGas') && hL) dCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Luce Attivo</strong> (€ ${LIM_L.toFixed(3)})</p>`;
    if ((utility === 'gas' || utility === 'lightAndGas') && hG) dCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Gas Attivo</strong> (€ ${LIM_G.toFixed(3)})</p>`;
    
    let rHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px; font-family:'Roboto',sans-serif;"><div style="text-align:center; border-bottom:2px solid #eee; padding-bottom:15px; margin-bottom:20px;"><h2 style="color:#2e7d32; margin-bottom:5px;">Simulazione di Risparmio</h2><p style="font-size:1.2em; margin:5px 0;">Cliente: <strong>${utente}</strong></p>${dCap}<p style="font-size:0.95em; color:#d32f2f;"><strong>Scadenza: ${dS}</strong></p></div>`;
    
    function fRes(vA, et, sA, sN, nO, fr) {
        // vA è il risparmio annuo calcolato col consumo annuo (Negativo se si risparmia)
        const vM = vA / 12; 
        const isR = vA <= 0; // Se <= 0 è un risparmio (costo nuovo < costo attuale)
        const col = isR ? "#1b5e20" : "#d32f2f";
        const bg = isR ? "#f1f8e9" : "#ffebee";
        const bCol = isR ? "green" : "red";
        const seg = isR ? "-" : "+"; 
        const lbl = isR ? "Proiezione di Risparmio" : "Proiezione di Differenza"; 
        const tP = (fr === 1) ? "Mensile" : "Bimestrale";
        
        return `<div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid ${bCol}; background: ${bg}; border-radius: 0 5px 5px 0;"><p style="font-size:1.15em; margin: 5px 0; color: ${col}; text-transform: uppercase;"><strong>${et}</strong></p><div style="font-size:0.95em; color: #444; margin-bottom: 10px;"><p style="margin: 2px 0;">Attuale (${tP}): <strong>€ ${sA.toFixed(2)}</strong></p><p style="margin: 2px 0;">Con ${nO} (${tP}): <strong>€ ${sN.toFixed(2)}</strong></p></div><div style="border-top: 1px dotted #ccc; padding-top: 10px;"><p style="font-size:1.05em; margin: 3px 0;">${lbl} Mensile: <strong style="color:${bCol};">€ ${seg}${Math.abs(vM).toFixed(2)}</strong></p><p style="font-size:1.05em; margin: 3px 0;">${lbl} Annuo: <strong style="color:${bCol};">€ ${seg}${Math.abs(vA).toFixed(2)}</strong></p></div></div>`;
    }
    
    if (utility === 'light' || utility === 'lightAndGas') {
        const fr = parseInt(document.getElementById('freqLuce').value), ann = parseFloat(document.getElementById('annuoLuce').value) || 0, sP = parseFloat(document.getElementById('costMateriaLuce').value) || 0, pP = parseFloat(document.getElementById('pcvAttualeLuce').value) || 0, tL = document.getElementById('tipoLettura').value;
        const offerL = OFFERTE_CONFIG[oL];
        let pcv = offerL ? offerL.pcv : 13.00;
        let spreadLuce = offerL ? offerL.spread : 0.044;

        let cT = 0, cE = 0, cE_WorstCase = 0;
        if (tL === 'fasce') { cT += (parseFloat(document.getElementById('kWhF1_M1').value)||0)+(parseFloat(document.getElementById('kWhF2_M1').value)||0)+(parseFloat(document.getElementById('kWhF3_M1').value)||0); } else { cT += parseFloat(document.getElementById('kWhTot1').value)||0; }
        if (fr === 2) { if (tL === 'fasce') { cT += (parseFloat(document.getElementById('kWhF1_M2').value)||0)+(parseFloat(document.getElementById('kWhF2_M2').value)||0)+(parseFloat(document.getElementById('kWhF3_M2').value)||0); } else { cT += parseFloat(document.getElementById('kWhTot2').value)||0; } }

        const m1 = document.getElementById('monthLuce1').value, p1 = DB_PRICES.pun[m1];
        let f1 = hL ? Math.min(p1.f1, LIM_L) : p1.f1, f2 = hL ? Math.min(p1.f2, LIM_L) : p1.f2, f3 = hL ? Math.min(p1.f3, LIM_L) : p1.f3, mo = hL ? Math.min(p1.mono, LIM_L) : p1.mono;
        
        if (tL === 'fasce') { cE += ((parseFloat(document.getElementById('kWhF1_M1').value)||0)*f1)+((parseFloat(document.getElementById('kWhF2_M1').value)||0)*f2)+((parseFloat(document.getElementById('kWhF3_M1').value)||0)*f3); } else { cE += (parseFloat(document.getElementById('kWhTot1').value)||0)*mo; }
        if (fr === 2) {
            const m2 = document.getElementById('monthLuce2').value, p2 = DB_PRICES.pun[m2];
            let f12 = hL ? Math.min(p2.f1, LIM_L) : p2.f1, f22 = hL ? Math.min(p2.f2, LIM_L) : p2.f2, f32 = hL ? Math.min(p2.f3, LIM_L) : p2.f3, mo2 = hL ? Math.min(p2.mono, LIM_L) : p2.mono;
            if (tL === 'fasce') { cE += ((parseFloat(document.getElementById('kWhF1_M2').value)||0)*f12)+((parseFloat(document.getElementById('kWhF2_M2').value)||0)*f22)+((parseFloat(document.getElementById('kWhF3_M2').value)||0)*f32); } else { cE += (parseFloat(document.getElementById('kWhTot2').value)||0)*mo2; }
        }
        let sE = hL ? (spreadLuce + 0.009) : spreadLuce;
        cE += (cT * sE);
        if (hL) { cE_WorstCase = cT * (LIM_L + sE); }

        let sAt = sP + (pP * fr);
        let sUG = cE + (pcv * fr);
        
        // La tua formula originale ripristinata: (Costo Attuale - Costo Nuovo) diviso il consumo del periodo, moltiplicato per il consumo annuo
        let svA = -(((sAt - sUG) / (cT || 1)) * ann);

        totSave += svA; 
        rHtml += fRes(svA, "⚡ Fornitura Luce", sAt, sUG, nL, fr);
        
        if (hL) {
            let sUG_Worst = cE_WorstCase + (pcv * fr);
            let svA_Worst = -(((sAt - sUG_Worst) / (cT || 1)) * ann);
            let isWorstSave = svA_Worst <= 0;
            let colWorst = isWorstSave ? "green" : "red";
            let descWorst = isWorstSave 
                ? `In caso di forti rincari di mercato sopra i 0,200 €/kWh, avrai un risparmio stimato di <strong style="color: ${colWorst};">€ -${Math.abs(svA_Worst).toFixed(2)}</strong>`
                : `In caso di forti rincari di mercato sopra i 0,200 €/kWh, non avrai un risparmio stimato ma un delta di <strong style="color: ${colWorst};">€ +${Math.abs(svA_Worst).toFixed(2)}</strong>`;
            rHtml += `<div style="margin-top: -15px; margin-bottom: 20px; padding: 10px 15px; border-left: 4px solid ${colWorst}; background: ${isWorstSave ? '#e8f5e9' : '#ffebee'}; border-radius: 0 5px 5px 0; font-size: 0.9em;"><p style="margin: 2px 0; color: ${isWorstSave ? '#1b5e20' : '#d32f2f'};">🛡️ <strong>Scenario di picco (PUN ad un anno ≥ CAP):</strong></p><p style="margin: 2px 0; color: #444;">${descWorst}</p></div>`;
        }
    }

    if (utility === 'gas' || utility === 'lightAndGas') {
        const fr = parseInt(document.getElementById('freqGas').value), ann = parseFloat(document.getElementById('annuoGas').value) || 0, sP = parseFloat(document.getElementById('costMateriaGas').value) || 0, pP = parseFloat(document.getElementById('pcvAttualeGas').value) || 0;
        const offerG = OFFERTE_CONFIG[oG];
        let pcvGas = offerG ? offerG.pcv : 14.00;
        let spreadGas = offerG ? offerG.spread : 0.18;

        let cT = 0, cG = 0, cG_WorstCase = 0;
        const m1 = document.getElementById('monthGas1').value, c1 = parseFloat(document.getElementById('smcTot1').value) || 0;
        cT += c1; let psv1 = hG ? Math.min(DB_PRICES.psv[m1], LIM_G) : DB_PRICES.psv[m1]; cG += c1 * psv1;
        if (fr === 2) { const m2 = document.getElementById('monthGas2').value, c2 = parseFloat(document.getElementById('smcTot2').value) || 0; cT += c2; let psv2 = hG ? Math.min(DB_PRICES.psv[m2], LIM_G) : DB_PRICES.psv[m2]; cG += c2 * psv2; }
        
        let sEGas = hG ? (spreadGas + 0.09) : spreadGas;
        cG += (cT * sEGas);
        if (hG) { cG_WorstCase = cT * (LIM_G + sEGas); }

        let sAt = sP + (pP * fr);
        let sUG = cG + (pcvGas * fr);
        
        // La tua formula originale ripristinata per il gas
        let svA = -(((sAt - sUG) / (cT || 1)) * ann);

        totSave += svA; 
        rHtml += fRes(svA, "🔥 Fornitura Gas", sAt, sUG, nG, fr);
        
        if (hG) {
            let sUG_Worst = cG_WorstCase + (pcvGas * fr);
            let svA_Worst = -(((sAt - sUG_Worst) / (cT || 1)) * ann);
            let isWorstSaveGas = svA_Worst <= 0;
            let colWorstGas = isWorstSaveGas ? "green" : "red";
            let descWorstGas = isWorstSaveGas 
                ? `In caso di forti rincari di mercato sopra i 0,95 €/smc, avrai un risparmio stimato di <strong style="color: ${colWorstGas};">€ -${Math.abs(svA_Worst).toFixed(2)}</strong>`
                : `In caso di forti rincari di mercato sopra i 0,95 €/smc, non avrai un risparmio stimato ma un delta di <strong style="color: ${colWorstGas};">€ +${Math.abs(svA_Worst).toFixed(2)}</strong>`;
            rHtml += `<div style="margin-top: -15px; margin-bottom: 20px; padding: 10px 15px; border-left: 4px solid ${colWorstGas}; background: ${isWorstSaveGas ? '#e8f5e9' : '#ffebee'}; border-radius: 0 5px 5px 0; font-size: 0.9em;"><p style="margin: 2px 0; color: ${isWorstSaveGas ? '#1b5e20' : '#d32f2f'};">🛡️ <strong>Scenario di picco (PSV ad un anno ≥ CAP):</strong></p><p style="margin: 2px 0; color: #444;">${descWorstGas}</p></div>`;
        }
    }

    let tSt = "", tTx = "";
    // totSave è negativo se c'è un risparmio complessivo
    if (totSave < 0) { 
        tSt = "background:#2e7d32; color:white;"; 
        tTx = `RISPARMIO ANNUO STIMATO<br><span style='font-size:2.5em; font-weight:bold;'>€ -${Math.abs(totSave).toFixed(2)}</span>`; 
    } else if (totSave > 0) { 
        tSt = "background:#d32f2f; color:white;"; 
        tTx = `DIFFERENZA ANNUALE<br><span style='font-size:2.5em; font-weight:bold;'>+€ ${Math.abs(totSave).toFixed(2)}</span>`; 
    } else { 
        tSt = "background:#757575; color:white;"; 
        tTx = `RISPARMIO ANNUO<br><span style='font-size:2.5em; font-weight:bold;'>€ 0.00</span>`; 
    }
    
    rHtml += `<div style="${tSt} padding:20px; text-align:center; border-radius:8px; margin-top:20px;"><span style='text-transform:uppercase; font-size:0.9em;'>${tTx}</span></div></div>`;
    document.getElementById('result').innerHTML = rHtml; document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').classList.remove('hidden'); document.getElementById('export-actions').style.display = 'block';
};

window.exportDoc = function(t) {
    const el = document.getElementById('report-box');
    if (!el) return;
    
    if (t === 'pdf') {
        window.print();
    } else if (t === 'png') {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'Analisi_Risparmio_BPower.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error("Errore durante la generazione dell'immagine:", err);
            alert("Impossibile generare l'immagine PNG.");
        });
    }
};
