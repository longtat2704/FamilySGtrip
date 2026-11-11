/* This site runs on plain GitHub Pages, including repositories with a path prefix. */
const $ = id => document.getElementById(id);
const dayKeys = trip.days.map(day => day.key);
const initial = new URLSearchParams(location.search);
let lang = initial.get('lang') === 'zh' ? 1 : 0;
let active = Math.max(0, dayKeys.indexOf(initial.get('day')));
const t = (en, zh) => lang ? zh : en;
const map = place => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place);
const paths = {
  pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  flight:'m3 14 7-3 3-8 2-1 0 8 6-2 1 2-7 5-1 5-2 1-1-5-6 0z',
  food:'M5 3v6a3 3 0 0 0 6 0V3 M8 3v18 M17 13h3V3c-3 3-4 7-3 10z M20 13v8',
  walk:'M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 12l3-5 4 4 4 1 M11 8l-1 7 5 3 2 4 M10 15l-4 6',
  show:'m12 2 2.4 6.8L21 11l-6.6 2.2L12 20l-2.4-6.8L3 11l6.6-2.2z',
  fish:'M3 12c3-5 8-7 14-1l4-3v8l-4-3C11 19 6 17 3 12z M8 11h.2',
  camera:'M3 7h4l2-3h6l2 3h4v13H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  bag:'M4 7h16v14H4z M8 7V3h8v4 M8 11v7 M16 11v7'
};
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  const path = document.createElementNS(svg.namespaceURI,'path');
  for(const [key,value] of Object.entries({viewBox:'0 0 24 24',class:'icon',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'})) svg.setAttribute(key,value);
  path.setAttribute('d',paths[name]||paths.pin); svg.append(path); return svg;
}
function el(tag, cls, value) {
  const node = document.createElement(tag);
  if(cls) node.className=cls;
  if(value) node.textContent=value;
  return node;
}
function external(label, target, withIcon=false) {
  const link = el('a','',label);
  link.href=target.startsWith('https://') ? target : map(target);
  link.target='_blank'; link.rel='noopener noreferrer';
  if(withIcon) link.prepend(icon(target.startsWith('https://')?'bag':'pin'));
  return link;
}
const references=[
  [['Cheng Ji Seafood','海鮮餐廳及分店','https://chengjiseafood.com/'],['Garden Rhapsody showtimes','擎天樹演出時間','https://www.gardensbythebay.com.sg/en/things-to-do/calendar-of-events/garden-rhapsody.html'],['Fort Canning gardens','福康寧公園','https://www.nparks.gov.sg/visit/parks/fort-canning-park/special-features/historical-gardens']],
  [['Oceanarium hours & tickets','海洋館時間及門票','https://www.singaporeoceanarium.com/en/visit.html'],['Jypsy One Fullerton','Jypsy 餐廳資料','https://www.pscafe.com/jypsy-one-fullerton'],['Spectra at Marina Bay Sands','金沙水舞資訊','https://www.marinabaysands.com/attractions/spectra.html']],
  [['Little India walking map','小印度步行地圖','https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/little-india/Little-India_Digital-Version_Final_%281%29_%281%29.pdf'],['Cat & the Fiddle locations','芝士蛋糕門市','https://www.catandthefiddle.com/pages/locations-singapore'],['The Coconut Club','餐廳及訂位','https://www.thecoconutclub.sg/reservations']],
  [['Departure flight status','離境航班狀態','https://www.changiairport.com/en/fly/flight-information/departures.html'],['Early check-in eligibility','提早登機資格','https://www.changiairport.com/en/fly/departure-guide/early-check-in-services.html'],['Rain Vortex hours','瀑布開放時間','https://www.jewelchangiairport.com/en/attractions/rain-vortex.html']]
];
function route(dayIndex,language,scroll=false) {
  active=dayIndex; lang=language;
  const url=new URL(location.href);
  url.searchParams.set('day',dayKeys[active]); url.searchParams.set('lang',lang?'zh':'en');
  url.hash='';
  try { history.replaceState(null,'',url); } catch { /* Local file previews may restrict history. */ }
  render();
  if(scroll) { $('plan').focus({preventScroll:true}); $('plan').scrollIntoView({block:'start'}); }
}
function renderStop(row) {
  const [clock,category,kind,title,description,locations]=row;
  const li=el('li','stop '+category);
  const rail=el('div','rail'); const marker=el('span','marker'); marker.append(icon(category));rail.append(marker);
  const info=el('div','info');
  const nav=el('div','maplinks');
  locations.forEach(link=>nav.append(external(link[lang],link[2],true)));
  info.append(el('span','kind',kind[lang]),el('h3','',title[lang]),el('p','',description[lang]),nav);
  li.append(el('span','time',clock),rail,info); return li;
}
function render(){
  const d=trip.days[active];
  document.documentElement.lang=lang?'zh-Hant':'en';
  document.title=t('Singapore, together','一起遊獅城')+' · '+d.name[lang]+' · 13–16 Nov 2026';
  document.querySelector('.skip').textContent=t('Skip to itinerary','跳至當日行程');
  $('brand').lastElementChild.textContent=t('Family fieldnotes','家庭旅行手記');
  $('en').setAttribute('aria-pressed',String(!lang)); $('zh').setAttribute('aria-pressed',String(!!lang));
  const hotel=$('hotel'); hotel.href=map(trip.hotel); hotel.target='_blank'; hotel.rel='noopener noreferrer';
  hotel.replaceChildren(icon('pin'),document.createTextNode(t('Hotel map','酒店地圖')));
  $('dates').textContent=t('13 — 16 NOVEMBER 2026','2026 年 11 月 13 — 16 日');
  const accent=el('em','',t('together.','獅城'));
  $('heroTitle').replaceChildren(document.createTextNode(t('Singapore,','一起遊')),el('br'),accent);
  $('sub').textContent=t('Four days with the family in the Lion City.','一家人的新加坡四日行程');
  $('location').textContent=t('MARINA BAY, SINGAPORE','新加坡 · 濱海灣');
  $('days').setAttribute('aria-label',t('Select a day','選擇日期'));
  $('days').replaceChildren(...trip.days.map((item,i)=>{
    const b=el('button','day');
    b.setAttribute('aria-current',i===active?'true':'false');
    b.append(el('span','tab-date',t('NOV '+item.date,'11 月 '+item.date+' 日')),el('span','',item.name[lang]));
    if(i===active) b.append(el('span','arrow','↘'));
    b.onclick=()=>{route(i,lang);$('days').children[i].focus({preventScroll:true})};
    return b;
  }));
  $('dateLabel').textContent=t(d.name[0]+' / November '+d.date,d.name[1]+' ／ 11 月 '+d.date+' 日');
  $('dayTitle').textContent=d.title[lang]; $('intro').textContent=d.intro[lang];
  $('stops').replaceChildren(...d.stops.map(renderStop));
  $('dayPhoto').src='img/'+d.photo+'.jpg';$('dayPhoto').alt=d.caption[lang];$('caption').textContent=d.caption[lang];
  $('noteHeading').replaceChildren(icon('walk'),document.createTextNode(t('Getting around','交通小提示')));$('note').textContent=d.tip[lang];
  $('linksHeading').textContent=t('Visitor information','實用資訊');
  $('official').replaceChildren(...references[active].map(r=>{ const a=external(r[lang],r[2]);a.append(el('span','','↗'));return a; }));
  $('prev').disabled=active===0;$('next').disabled=active===3;
  $('prev').textContent='← '+(trip.days[active-1]?.name[lang]||'');$('next').textContent=(trip.days[active+1]?.name[lang]||'')+' →';
  $('back').textContent=t('Back to top ↑','回到頁首 ↑');$('creditsLink').textContent=t('Photography credits','照片來源');
}
$('en').onclick=()=>route(active,0);$('zh').onclick=()=>route(active,1);
$('prev').onclick=()=>route(active-1,lang,true);$('next').onclick=()=>route(active+1,lang,true);
render();
