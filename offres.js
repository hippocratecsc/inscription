/* Hippocrate — « Nos formules » : bandeau qui surgit sur le téléphone (pages en ligne).
   • Une petite barre « 💡 Nos formules » glisse en bas de l'écran quelques secondes après l'ouverture.
   • Espace étudiant seulement, après connexion : la fiche s'ouvre d'elle-même au plus une fois par semaine.
   • ✕ sur la barre : elle disparaît pendant une semaine.
   • Chaque carte présente une formule ; l'étudiant choisit lui-même.
   • « Ça m'intéresse » (espace étudiant, étudiant identifié) : son nom arrive dans l'application
     (Administration → 📣 Intéressés par nos formules). Sinon : appel ou e-mail (hippocratecsc@gmail.com).
   Les prix suivent les prix modifiés dans l'application (formules_prix_override). */
(function(){
  'use strict';
  if(window.hccOffres) return;
  var TEL = '98269561', TEL_AFF = '98 269 561', MAIL = 'hippocratecsc@gmail.com';
  function mailto(titre){
    var qui = etat.id ? (etat.id.nom+' (N°'+etat.id.n+')') : '';
    return 'mailto:'+MAIL+'?subject='+encodeURIComponent('Hippo : je m’intéresse à '+(titre||'vos formules'))
      +'&body='+encodeURIComponent('Bonjour,\n\nJe souhaite des informations sur '+(titre||'vos formules')+'.\n'+(qui?'\nMoi : '+qui+'\n':'')+'Mon téléphone : \n\nMerci');
  }
  var LANCEMENT_PASS = '2026-11-15';

  function auj(){ var d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  // Discrétion : fiche ouverte d'elle-même au plus une fois par semaine ; barre masquée (✕) pendant une semaine.
  var PAUSE_JOURS = 7;
  function joursDepuis(k){ var d = lsGet(k); if(!d) return 1e9; return Math.floor((new Date(auj()+'T12:00:00') - new Date(d+'T12:00:00'))/86400000); }
  function f0(v){ v = Math.round(Number(v)*1000)/1000; return (v % 1 ? v.toFixed(3).replace(/0+$/,'').replace('.',',') : String(v)); }

  // Prix par défaut (identiques à l'application) — remplacés par formules_prix_override si disponible
  var P = { JC:9, DJ:7, MATIN_EXP:8, SOIR:5, HORAIRE:2, SEM_JC:49, SEM_DJ:42, MOIS_JC:180, MOIS_DJ:168,
            FLEXI_7:56, FLEXI_14:98, BIN_JC:17, TRI_JC:20, TRIM_JC:480, TRIM_DJ:440 };

  function cartes(){
    var avant = auj() < LANCEMENT_PASS;
    return [
      { id:'PASS_BAC', tag:'Bac 2027 · 4ᵉ année', titre:'Pass Hippo Bac', prix:'99 TND', unite:'/ mois',
        points:['Jusqu’à 4 h par jour, quand tu veux','Journée complète pendant toutes les vacances (35 jours)','Place garantie pour la révision finale (mai – juin)','Payable en 3 fois · 60 places'],
        note: avant ? 'Inscriptions dès le 15 novembre : réserve ta place' : 'Inscriptions ouvertes · 60 places', vedette:true },
      { id:'MOIS', tag:'Le plus avantageux', titre:'Abonnement Mois', prix:f0(P.MOIS_JC)+' TND', unite:'/ 30 jours',
        points:['Journée complète : '+f0(P.MOIS_JC/30)+' TND par jour au lieu de '+f0(P.JC),'Demi-journée : '+f0(P.MOIS_DJ)+' TND le mois','10 % rendus en crédit fidélité au coffee shop'] },
      { id:'SEMAINE', tag:'Pour une semaine chargée', titre:'Abonnement Semaine', prix:f0(P.SEM_JC)+' TND', unite:'/ 7 jours',
        points:['Journée complète 7 jours de suite','Demi-journée : '+f0(P.SEM_DJ)+' TND la semaine'] },
      { id:'FLEXI', tag:'Tu viens quand tu peux', titre:'Flexi', prix:f0(P.FLEXI_7)+' TND', unite:'/ 7 séances',
        points:['7 journées libres à utiliser en 10 jours','Flexi 14 : '+f0(P.FLEXI_14)+' TND pour 14 journées en 21 jours'] },
      { id:'CRENEAUX', tag:'À la carte', titre:'Créneaux malins', prix:'dès '+f0(P.HORAIRE)+' TND', unite:'',
        points:['Matinée 8 h – 13 h : '+f0(P.MATIN_EXP)+' TND','Soirée dès 20 h : '+f0(P.SOIR)+' TND','À l’heure : '+f0(P.HORAIRE)+' TND l’heure'] },
      { id:'GROUPE', tag:'Avec ta bande', titre:'En binôme ou trinôme', prix:f0(P.BIN_JC)+' TND', unite:'/ 2 pers.',
        points:['Journée complète à 2 : '+f0(P.BIN_JC)+' TND','Journée complète à 3 : '+f0(P.TRI_JC)+' TND','Aussi en semaine et au mois'] },
      { id:'TRIM', tag:'Pour tout un trimestre', titre:'Trimestre', prix:f0(P.TRIM_JC)+' TND', unite:'/ 90 jours',
        points:['Journée complète pendant 90 jours','Demi-journée : '+f0(P.TRIM_DJ)+' TND','10 % rendus en crédit fidélité au coffee shop'] }
    ];
  }

  var CSS = ''
  + '#hof-barre{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147483000;max-width:460px;margin:0 auto;display:flex;align-items:center;gap:10px;background:#F2B544;color:#14282C;border-radius:14px;padding:11px 12px 11px 14px;box-shadow:0 8px 24px rgba(0,0,0,.35);font:600 14px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;transform:translateY(160%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}'
  + '#hof-barre.on{transform:none}'
  + '#hof-barre button{font:inherit;border:0;cursor:pointer}'
  + '#hof-barre .hof-ouvrir{flex:1;text-align:left;background:none;color:inherit;padding:0}'
  + '#hof-barre .hof-ouvrir b{display:block;font-size:15px;font-weight:800}'
  + '#hof-barre .hof-ouvrir span{font-weight:500;font-size:12.5px}'
  + '#hof-barre .hof-x{background:rgba(20,40,44,.12);color:#14282C;width:30px;height:30px;border-radius:50%;font-size:16px;flex:none}'
  + '#hof-fond{position:fixed;inset:0;z-index:2147483001;background:rgba(4,20,24,.6);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;justify-content:center}'
  + '#hof-fond.on{opacity:1}'
  + '#hof-fiche{width:100%;max-width:480px;max-height:92vh;overflow:auto;background:#0A353D;color:#F6F1E4;border-radius:22px 22px 0 0;border-top:3px solid #F2B544;padding:16px 0 calc(16px + env(safe-area-inset-bottom));transform:translateY(100%);transition:transform .4s cubic-bezier(.2,.8,.2,1);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}'
  + '#hof-fond.on #hof-fiche{transform:none}'
  + '.hof-tete{display:flex;align-items:center;justify-content:space-between;padding:0 18px 10px}'
  + '.hof-tete b{font-size:18px}.hof-tete small{display:block;font-size:12.5px;color:rgba(246,241,228,.66);margin-top:2px;font-weight:400}'
  + '.hof-tete button{background:rgba(255,255,255,.1);border:0;color:#F6F1E4;width:34px;height:34px;border-radius:50%;font-size:18px;cursor:pointer;flex:none}'
  + '.hof-rail{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 18px 8px;scrollbar-width:none;-webkit-overflow-scrolling:touch}'
  + '.hof-rail::-webkit-scrollbar{display:none}'
  + '.hof-c{flex:0 0 86%;scroll-snap-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(93,202,165,.32);border-radius:16px;padding:14px 14px 12px;display:flex;flex-direction:column;gap:8px}'
  + '.hof-c.v{background:linear-gradient(160deg,#0E4A55,#0A353D);border:2px solid #F2B544}'
  + '.hof-tag{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;background:rgba(93,202,165,.18);color:#5DCAA5;border-radius:999px;padding:3px 9px}'
  + '.hof-c.v .hof-tag{background:#F2B544;color:#14282C}'
  + '.hof-t{font-size:19px;font-weight:800;margin:0}'
  + '.hof-p{font-family:ui-monospace,Menlo,monospace;font-size:24px;font-weight:800;color:#5DCAA5}.hof-c.v .hof-p{color:#F2B544}'
  + '.hof-p small{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:13px;font-weight:600;color:rgba(246,241,228,.66);margin-left:4px}'
  + '.hof-c ul{margin:0;padding:0 0 0 18px;font-size:13.5px;line-height:1.45}'
  + '.hof-n{font-size:12.5px;font-weight:700;color:#F2B544}'
  + '.hof-act{display:flex;gap:8px;margin-top:auto;padding-top:4px}'
  + '.hof-act button,.hof-act a{flex:1;display:block;text-align:center;text-decoration:none;border:0;border-radius:11px;padding:11px 6px;font:800 13.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;cursor:pointer}'
  + '.hof-int{background:#F2B544;color:#14282C}.hof-int[disabled]{background:#5DCAA5;opacity:1}'
  + '.hof-tel{background:rgba(255,255,255,.1);color:#F6F1E4}'
  + '.hof-points{display:flex;justify-content:center;gap:6px;padding:4px 0 10px}'
  + '.hof-points i{width:7px;height:7px;border-radius:50%;background:rgba(246,241,228,.25)}.hof-points i.on{background:#F2B544;width:18px;border-radius:4px}'
  + '.hof-pied{display:flex;gap:8px;padding:0 18px}'
  + '.hof-pied a{flex:1;text-align:center;text-decoration:none;border-radius:12px;padding:12px 6px;font-weight:800;font-size:14px;color:#14282C;background:#5DCAA5}'
  + '.hof-pied a.ml{background:#F2B544}'
  + '.hof-merci{font-size:12.5px;color:#5DCAA5;text-align:center;padding:2px 18px 8px;min-height:18px}'
  + '@media (prefers-reduced-motion:reduce){#hof-barre,#hof-fiche,#hof-fond{transition:none}}';

  var etat = { id:null, page:(location.pathname.split('/').pop()||'index.html'), envoyes:{} };
  var db = null;

  function fb(){
    if(db) return db;
    try{ if(typeof firebase!=='undefined' && firebase.apps && firebase.apps.length && firebase.database){ db = firebase.database(); } }catch(e){}
    return db;
  }
  function chargerPrix(essai){
    var d = fb();
    if(!d){ if((essai||0) < 20) setTimeout(function(){ chargerPrix((essai||0)+1); }, 1500); return; }
    d.ref('formules_prix_override').once('value').then(function(s){
      var o = s.val()||{}; Object.keys(P).forEach(function(k){ if(o[k]!=null && !isNaN(Number(o[k]))) P[k] = Number(o[k]); });
    }).catch(function(){});
  }

  function esc(v){ return String(v==null?'':v).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function barre(){
    if(document.getElementById('hof-barre')) return;
    var b = document.createElement('div'); b.id = 'hof-barre'; b.setAttribute('role','region'); b.setAttribute('aria-label','Nos formules');
    b.innerHTML = '<button class="hof-ouvrir" type="button"><b>💡 Nos formules</b><span>Pass Hippo Bac, Mois, Semaine, Flexi… choisis la tienne</span></button><button class="hof-x" type="button" aria-label="Masquer">✕</button>';
    document.body.appendChild(b);
    b.querySelector('.hof-ouvrir').onclick = ouvrir;
    // La barre ne doit jamais cacher le bas de la page (bouton « Suivant » / « Envoyer ») : on réserve sa hauteur.
    var pbInit = parseFloat(getComputedStyle(document.body).paddingBottom)||0;
    var reserver = function(on){ document.body.style.paddingBottom = on ? (pbInit + b.offsetHeight + 24)+'px' : ''; };
    b.querySelector('.hof-x').onclick = function(){ b.classList.remove('on'); reserver(false); lsSet('hcc_offres_barre_masquee', auj()); };
    setTimeout(function(){ if(joursDepuis('hcc_offres_barre_masquee') >= PAUSE_JOURS){ b.classList.add('on'); reserver(true); } }, 50);
  }

  function ouvrir(){
    lsSet('hcc_offres_vue', auj());
    var ancien = document.getElementById('hof-fond'); if(ancien) ancien.remove();
    var cs = cartes();
    var f = document.createElement('div'); f.id = 'hof-fond';
    f.innerHTML = '<div id="hof-fiche" role="dialog" aria-modal="true" aria-labelledby="hof-titre">'
      + '<div class="hof-tete"><div><b id="hof-titre">Nos formules</b><small>Fais défiler et choisis celle qui te va</small></div><button type="button" class="hof-fermer" aria-label="Fermer">✕</button></div>'
      + '<div class="hof-rail">' + cs.map(function(c){
          return '<article class="hof-c'+(c.vedette?' v':'')+'" data-id="'+c.id+'">'
            + '<span class="hof-tag">'+esc(c.tag)+'</span>'
            + '<h3 class="hof-t">'+esc(c.titre)+'</h3>'
            + '<div class="hof-p">'+esc(c.prix)+(c.unite?'<small>'+esc(c.unite)+'</small>':'')+'</div>'
            + '<ul>'+c.points.map(function(p){ return '<li>'+esc(p)+'</li>'; }).join('')+'</ul>'
            + (c.note ? '<div class="hof-n">'+esc(c.note)+'</div>' : '')
            + '<div class="hof-act">'
            + (etat.id ? '<button type="button" class="hof-int" data-id="'+c.id+'" data-t="'+esc(c.titre)+'">'+(etat.envoyes[c.id]?'✓ C’est noté':'Ça m’intéresse')+'</button>' : '')
            + (etat.id ? '' : '<a class="hof-tel hof-mail" href="'+mailto(c.titre)+'">✉️ Écrire</a>')
            + '<a class="hof-tel" href="tel:'+TEL+'">📞 Appeler</a>'
            + '</div></article>';
        }).join('') + '</div>'
      + '<div class="hof-points">'+cs.map(function(c,i){ return '<i'+(i?'':' class="on"')+'></i>'; }).join('')+'</div>'
      + '<div class="hof-merci" aria-live="polite"></div>'
      + '<div class="hof-pied"><a class="ml" href="'+mailto('')+'">✉️ E-mail</a><a href="tel:'+TEL+'">📞 '+TEL_AFF+'</a></div>'
      + '</div>';
    document.body.appendChild(f);
    var fermer = function(){ f.classList.remove('on'); setTimeout(function(){ f.remove(); }, 350); };
    f.addEventListener('click', function(ev){ if(ev.target===f) fermer(); });
    f.querySelector('.hof-fermer').onclick = fermer;
    document.addEventListener('keydown', function k(ev){ if(ev.key==='Escape'){ fermer(); document.removeEventListener('keydown', k); } });
    var rail = f.querySelector('.hof-rail'), pts = f.querySelectorAll('.hof-points i');
    rail.addEventListener('scroll', function(){
      var cartesEl = rail.querySelectorAll('.hof-c'), mil = rail.scrollLeft + rail.clientWidth/2, idx = 0, best = 1e9;
      cartesEl.forEach(function(el,i){ var c = el.offsetLeft + el.offsetWidth/2 - rail.offsetLeft; var dd = Math.abs(c-mil); if(dd<best){ best = dd; idx = i; } });
      pts.forEach(function(p,i){ p.classList.toggle('on', i===idx); });
    }, {passive:true});
    f.querySelectorAll('.hof-int').forEach(function(btn){
      if(etat.envoyes[btn.getAttribute('data-id')]) btn.disabled = true;
      btn.onclick = function(){ interesse(btn, f.querySelector('.hof-merci')); };
    });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ f.classList.add('on'); }); });
  }

  function interesse(btn, merci){
    var id = btn.getAttribute('data-id'), titre = btn.getAttribute('data-t');
    if(etat.envoyes[id] || !etat.id) return;
    btn.disabled = true; btn.textContent = '…';
    var d = fb(); var t = new Date();
    var rec = { num:Number(etat.id.n)||etat.id.n, nom:etat.id.nom||'', offre:id, titre:titre, page:etat.page, date:auj(),
                heure:String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0'), ts:Date.now() };
    var ok = function(){ etat.envoyes[id] = true; btn.textContent = '✓ C’est noté'; if(merci) merci.textContent = 'Merci ! L’accueil te recontacte pour « '+titre+' ».'; };
    var ko = function(){ btn.disabled = false; btn.textContent = 'Ça m’intéresse'; if(merci) merci.textContent = 'Envoi impossible pour le moment : appelle-nous ou écris-nous par e-mail.'; };
    if(!d){ ko(); return; }
    try{ d.ref('interets_offres/'+rec.date+'/'+rec.ts+'_'+rec.num).set(rec).then(ok).catch(ko); }catch(e){ ko(); }
  }

  function demarrer(){
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    chargerPrix(0);
    // Page d'inscription (index) : seulement la petite barre, jamais de fiche qui s'ouvre d'elle-même
    // (l'étudiant est occupé à s'inscrire). Espace étudiant : attendre la connexion (identifier()).
    if(!/espace/i.test(etat.page)) setTimeout(barre, 4000);
  }

  window.hccOffres = {
    ouvrir: ouvrir,
    // Appelée par l'espace étudiant une fois l'étudiant reconnu : {n, nom}
    identifier: function(id){
      etat.id = id && id.n ? id : null;
      setTimeout(barre, 1500);
      if(etat.id && joursDepuis('hcc_offres_vue') >= PAUSE_JOURS) setTimeout(function(){ if(!document.getElementById('hof-fond')) ouvrir(); }, 3500);
    },
    oublier: function(){ etat.id = null; }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
