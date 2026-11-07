import json,re,sys
from pathlib import Path
from collections import Counter
source=Path(r'C:\Users\AAKSHAT MUKKAWAR\Downloads\bebodywise-56-products-c3cdc240.json.txt')
products=json.loads(source.read_text(encoding='utf-8-sig')); pages={x['id']:x for x in json.loads(Path('test-results/product-research-pages.json').read_text(encoding='utf8'))}
store=json.loads(Path('src/data/storefrontProducts.json').read_text(encoding='utf8')); old=json.loads(Path('worker/data/chatProducts.json').read_text(encoding='utf8'));before_missing=sum(len(p['verification'].get('missing_fields',[])) for p in products)
findings=[('6-aha-bha-underarm-roll-on-flora-75ml','warnings','broken_or_irritated_skin','Do not apply to broken or irritated skin.','do not apply on broken or irritated skin'),('1-zpto-anti-dandruff-shampoo','warnings','broken_or_irritated_skin','Do not apply on injured areas.','do not apply on injured areas'),('1-zpto-anti-dandruff-shampoo','warnings','other',['Avoid contact with eyes; if contact occurs, rinse thoroughly. Stop use and consult a doctor if the condition worsens. Keep out of reach of children; for external use only.'],'caution: avoid contact with eyes')]
added=[]
for id,group,field,value,evidence in findings:
 p=next(x for x in products if x['id']==id)
 if evidence not in pages[id].get('text','').lower():raise RuntimeError('Evidence not found: '+id)
 if p[group].get(field) not in (None,[], ''):continue
 p[group][field]=value;p[group]['field_statuses'][field]='verified';p['verification']['missing_fields']=[x for x in p['verification']['missing_fields'] if x!=group+'.'+field];p.setdefault('independent_research',[]).append({'field':group+'.'+field,'source_url':p['product_url'],'checked_at':'2026-11-07','method':'Exact product page, explicit caution text','status':'verified'});added.append((id,group+'.'+field))
manual={
 '1-salicylic-acid-body-wash-350ml':'Use 375 mL as the demo variant because the current page heading and selector say 375 mL; do not use the 350 mL URL slug as a size claim. Do not state all-skin suitability because the page conflicts on very dry skin.',
 '4-aha-bha-underarm-rollon-frag-free-75':'Use the product heading as the variant name, but do not claim fragrance-free suitability: the ingredient block lists perfume. Treat that conflict as unresolved until the label or brand confirms it.',
 'advanced-hair-growth-serum':'For demo navigation use the 50 mL dropper selected by the product page; do not assume the conflicting spray instruction or pick 1% versus 3% rosemary without the label.',
 'advanced-hair-growth-serum-30ml':'For demo navigation use the 30 mL dropper shown in the selector; do not infer the conflicting spray steps or rosemary percentage.',
 'anti-frizz-serum':'Prefer the current text how-to of 2–3 pumps as a tentative demo reference; the gallery says 1–2, so do not serve an unqualified dosage and direct the user to the product label.',
 'magnesium-glycinate-gummies-60n':'The page says its updated recommendation is two gummies while existing packaging says one; prefer the updated page as a tentative demo reference, but disclose the mismatch and do not resolve dosage without the label or professional advice.',
 'multivitamin-gummies':'Prefer the how-to and nutrition label showing one gummy as a tentative reference; because an FAQ says two, do not give an unqualified dose or select one disputed ingredient list.',
 '30-urea-foot-roll-on':'Treat the silicone-free exclusion as unconfirmed because the ingredient list names silicones; do not present the product as silicone-free.',
 '1-peptide-ceramide-moisturizer':'Do not select a copper tripeptide concentration: 1% and 2000 ppm are materially inconsistent and may describe different scopes.',
 'folli-advanced-plus-hair-growth-serum':'Do not select an AnaGain percentage: the text and image give different values, and the source does not establish their equivalence.',
 'daily-hydration-kit':'Keep the named 10% lotion and body wash as the kit identity and do not assign the mismatched 20% product ingredient block to either component.',
 'face-body-sunscreen-kit':'Keep the kit products separate; do not choose a disputed size or assert both are fragrance-free from the conflicting page blocks.',
 'hydrocolloid-acne-pimple-patch':'Prefer the detailed how-to as a tentative reference, but report that the FAQ gives a conflicting duration and do not recommend a single wear-time as confirmed.',
 'calcium-gummies':'Do not assume elemental calcium equals the mass of calcium salt or convert the ambiguous nutrition table into a dose.',
 'dandruff-and-hairfall-kit':'Do not claim sulfate-free because the kit shampoo ingredient list names a sulfate.',
 'sun-care-duo-head-to-toe':'Do not claim the whole kit is fragrance-free while the component information conflicts.',
 'summer-essentials-kit':'Do not apply an unscoped fragrance-free statement to all three components.'}
store_by_url={p['source']:p for p in store};old_by_id={p['id']:p for p in old};normalized=[]
def clean(v):
 if isinstance(v,str):return re.sub(r'\s+',' ',v).strip() or None
 return None
def safe_fields(p,group):
 d=p.get(group,{}) or {};flags=d.get('field_statuses',{});review=' '.join(p['verification'].get('review_fields',[])).lower();o={}
 for k in ['amount','frequency','time_of_day','steps','application_area','rinse_or_leave_on','wet_or_dry','storage','recommended_usage_duration','expected_results_timeframe','what_it_relates_to','results_vary','package_duration','patch_test','age_restrictions','broken_or_irritated_skin','pregnancy_breastfeeding','prescription_status','other']:
  v=d.get(k);flag=flags.get(k)
  if flag!='verified' or not v:continue
  if group=='usage' and k=='steps' and (d.get('status')=='needs_review' or 'usage.' in review):continue
  if group=='usage' and k=='amount' and ('usage.amount' in review or 'packaging' in review):continue
  if isinstance(v,list):v=' '.join(str(x) for x in v if x)
  if isinstance(v,bool):v='Yes' if v else 'No'
  if isinstance(v,str):o[k]=re.sub(r'\s+',' ',v).strip()[:800]
 return o
for p in products:
 refs=store_by_url.get(p['product_url'],{}); previous=old_by_id.get(p['id'],{}); highlighted=[]
 for ing in (p.get('ingredients',{}).get('highlighted') or []):
  if not isinstance(ing,dict):continue
  flags=ing.get('field_statuses',{});name=ing.get('name');pct=ing.get('percentage')
  if not name or flags.get('name') not in (None,'verified'):continue
  highlighted.append((str(pct)+' ' if pct and flags.get('percentage')=='verified' else '')+name)
 review=p['verification'].get('review_fields',[])
 usage_fields=safe_fields(p,'usage');timeline_fields=safe_fields(p,'timeline');warning_fields=safe_fields(p,'warnings')
 # Preserve dosage/wear-time conflicts and do not let generic how-to summaries hide them.
 if p['id'] in ('anti-frizz-serum','magnesium-glycinate-gummies-60n','multivitamin-gummies','hydrocolloid-acne-pimple-patch'):
  usage_fields.pop('amount',None);usage_fields.pop('steps',None)
 if p['id']=='hydrocolloid-acne-pimple-patch':usage_fields.pop('rinse_or_leave_on',None)
 ing_group=p.get('ingredients',{});full=ing_group.get('full_list') if ing_group.get('field_statuses',{}).get('full_list')=='verified' else None
 if not isinstance(full,str):full=None
 purpose=p.get('purpose',{});tags=purpose.get('concern_tags') or []
 purpose_text='; '.join(str(t) for t in tags) or clean(purpose.get('brand_description'))
 if purpose_text:purpose_text=purpose_text[:350]
 usage='; '.join(usage_fields[k] for k in ['frequency','steps','rinse_or_leave_on'] if k in usage_fields) or None
 timeline=timeline_fields.get('expected_results_timeframe') or timeline_fields.get('recommended_usage_duration')
 warnings='; '.join(warning_fields.values()) or None
 normalized.append({'id':p['id'],'name':p['name'],'category':p.get('category') or '', 'source_url':p['product_url'],'image_url':refs.get('image') or previous.get('image_url') or '/products/placeholder.svg','purpose':purpose_text,'ingredients':', '.join(highlighted) or None,'usage':usage,'timeline':timeline,'warnings':warnings,'usage_fields':usage_fields,'timeline_fields':timeline_fields,'warning_fields':warning_fields,'full_ingredients':full,'review_fields':review,'demo_assumption':manual.get(p['id']),'verification_status':'partially_verified','last_verified_at':'2026-11-07','notes':'Source-backed fields may be incomplete; conflicted fields require review.'})
Path('research/product-information-reviewed.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
Path('worker/data/chatProducts.json').write_text(json.dumps(normalized,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
after_missing=sum(len(p['verification'].get('missing_fields',[])) for p in products)
def counts(rows):return {k:sum(bool(x.get(k)) for x in rows) for k in ('purpose','ingredients','usage','timeline','warnings')}
report={'supplied_products':len(products),'previous_chat_products':len(old),'input_missing_field_entries':before_missing,'research_fields_added':len(added),'remaining_missing_field_entries':after_missing,'input_review_field_entries':sum(len(p['verification'].get('review_fields',[])) for p in products),'prior_chat_field_coverage':counts(old),'new_chat_field_coverage':counts(normalized),'independent_findings':[{'product_id':id,'field':field} for id,field in added],'pages_checked':len(pages),'pages_accessible':sum(p['status']==200 for p in pages.values()),'demo_decisions':manual}
Path('research/product-coverage-summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps(report,ensure_ascii=True,indent=2)[:2500])
