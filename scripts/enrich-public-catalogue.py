import requests,re,json,concurrent.futures,html
from pathlib import Path
cp=Path('worker/data/chatProducts.json');dp=Path('worker/data/productDescriptions.json');products=json.loads(cp.read_text(encoding='utf-8'));descriptions=json.loads(dp.read_text(encoding='utf-8'));targets=[p for p in products if p.get('verification_status')=='source_snapshot']
def clean(v):return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',v or ''))).strip()
def fetch(p):
 try:
  text=requests.get(p['source_url'],timeout=25).text;d=json.loads(re.search(r'<script[^>]*__NEXT_DATA__[^>]*>(.*?)</script>',text,re.S).group(1))['props']['pageProps']['pageData']['data'];items=[]
  for w in d.get('widgets',[]):
   if w.get('type')=='ACCORDION':items.extend(w.get('widgetData',{}).get('list',[]))
  ingredients=next((x.get('content','') for x in items if re.search(r'full list of ingredients',x.get('title',''),re.I)),'');ingredients=re.split(r'<b>\s*Formulated Without',ingredients,flags=re.I)[0];ingredients=clean(ingredients);ingredients=re.sub(r'^Ingredient Names\s*','',ingredients,flags=re.I)
  warning=next((clean(x.get('content')) for x in items if re.search(r'important information',x.get('title',''),re.I)),'')
  timeline=next((clean(x.get('content')) for x in items if re.search(r'(how (?:much|long).*time|when).*result|how long.*(work|result)',x.get('title',''),re.I)),'')
  details=clean(d.get('description',{}).get('details',{}).get('text'))
  return p['id'],ingredients[:5000],warning[:2500],timeline[:1200],details[:5000],None
 except Exception as e:return p['id'],'','','','',str(e)[:120]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(fetch,targets))
by={p['id']:p for p in products};errors=[]
for id,ing,warn,timeline,details,error in rows:
 if error:errors.append((id,error));continue
 p=by[id]
 if ing:p['full_ingredients']=ing
 if warn:p['warnings']=warn;p['warning_fields']['other']=warn
 if timeline:p['timeline']=timeline;p['timeline_fields']['expected_results_timeframe']=timeline
 if details:descriptions[id]=details
cp.write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');dp.write_text(json.dumps(descriptions,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print('Enriched',len(rows)-len(errors),'of',len(rows),'products; errors',errors)
