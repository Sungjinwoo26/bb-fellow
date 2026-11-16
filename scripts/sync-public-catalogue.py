import requests,re,json,xml.etree.ElementTree as ET,concurrent.futures,sys,time,html,io
from pathlib import Path
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')
root=Path('.');sp=root/'src/data/storefrontProducts.json';cp=root/'worker/data/chatProducts.json';store=json.loads(sp.read_text(encoding='utf-8'));chat=json.loads(cp.read_text(encoding='utf-8'));known={p['id'] for p in chat}
r=requests.get('https://bebodywise.com/sitemap-products.xml',timeout=30);r.raise_for_status();urls=[x.text for x in ET.fromstring(r.content).iter() if x.tag.endswith('loc') and x.text];missing=[u for u in urls if u.rstrip('/').split('/')[-1] not in known];print('Missing sitemap URLs:',len(missing),flush=True)

def clean(value):
 if not value:return ''
 if isinstance(value,list):return '; '.join(clean(v) for v in value if v)
 if not isinstance(value,str):return str(value)
 return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',value))).strip()
def get(url):
 slug=url.rstrip('/').split('/')[-1]
 try:
  response=requests.get(url,timeout=25);response.raise_for_status();match=re.search(r'<script[^>]*__NEXT_DATA__[^>]*>(.*?)</script>',response.text,re.S)
  if not match:return {'slug':slug,'error':'no structured data'}
  data=json.loads(match.group(1))['props']['pageProps']['pageData']['data'];p=data['productInfo'];p['discountedPrice']=p.get('discountedPrice') if isinstance(p.get('discountedPrice'),(int,float)) else p.get('actualPrice');name=clean(p.get('name'));image=p.get('prod_img');
  if not name or not image or not isinstance(p.get('discountedPrice'),(int,float)):return {'slug':slug,'error':'incomplete product identity/price/image'}
  im=requests.get(image,timeout=25);im.raise_for_status();photo=Image.open(io.BytesIO(im.content));photo.thumbnail((720,720));photo=photo.convert('RGB');output=root/'public/storefront/catalogue'/f'{slug}.jpg';photo.save(output,'JPEG',quality=80,optimize=True)
  cat=str(p.get('category','')).lower();category='Hair Care' if 'hair' in cat else 'Face Care' if 'face' in cat else 'Health & Fitness' if any(x in cat for x in ['nutrition','wellness','health','fitness']) else 'Body Care'
  usage=clean(data.get('description',{}).get('usage',{}).get('text')) or clean(p.get('usage_instructions'));purpose=clean(p.get('productFor') or p.get('subtitle') or p.get('concern'));ingredients=clean(p.get('key_ingredients'));description=clean(data.get('description',{}).get('details',{}).get('text'))
  product={'id':slug,'name':name,'category':category,'source_url':url,'image_url':f'/storefront/catalogue/{slug}.jpg','purpose':purpose or None,'ingredients':ingredients or None,'usage':usage or None,'timeline':None,'warnings':None,'usage_fields':{'steps':usage} if usage else {},'timeline_fields':{},'warning_fields':{},'full_ingredients':None,'review_fields':['source import: verify product data before use'],'demo_assumption':None,'verification_status':'source_snapshot','last_verified_at':'2026-11-12','notes':'Imported from the product page; unspecified fields have not been inferred.'}
  listing={'id':f"{category.lower().replace(' ','-')}-{slug}",'category':category,'concern':purpose,'name':name,'tags':[clean(t) for t in p.get('tags',[]) if isinstance(t,str)][:2],'price':f"₹{p['discountedPrice']:g}",'mrp':f"₹{p.get('actualPrice',p['discountedPrice']):g}",'rating':clean(p.get('rating')),'label':'','available':not (p.get('outOfStock') or p.get('isProductDiscontinued')),'image':f'/storefront/catalogue/{slug}.jpg','source':url}
  return {'slug':slug,'chat':product,'listing':listing,'description':description}
 except Exception as e:return {'slug':slug,'error':str(e)[:200]}
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,row in enumerate(pool.map(get,missing),1):
  results.append(row);print(f"{i}/{len(missing)} {row['slug']} {'OK' if 'chat' in row else row.get('error')}",flush=True)
for row in results:
 if 'chat' in row:chat.append(row['chat']);store.append(row['listing'])
sp.write_text(json.dumps(store,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');cp.write_text(json.dumps(chat,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(root/'research/catalogue-sync-report.json').write_text(json.dumps([{'slug':x['slug'],'error':x.get('error')} for x in results],indent=2)+'\n',encoding='utf-8')
print('Imported:',sum('chat' in x for x in results),'Failed:',sum('error' in x for x in results),flush=True)
