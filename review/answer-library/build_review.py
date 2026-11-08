import html, itertools, json, re
from pathlib import Path
from ingredient_research import facts as researched_ingredients

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
products = json.loads((ROOT / 'worker/data/chatProducts.json').read_text(encoding='utf-8'))
research = json.loads((ROOT / 'research/product-information-reviewed.json').read_text(encoding='utf-8'))
assert len(products) == 56 and len({p['id'] for p in products}) == 56

# Plain-language descriptions are review copy, not substitutions for the source.
goals = [
 'body breakouts and rough-looking skin', 'underarm odour and mild uneven-looking tone', 'underarm odour and more stubborn uneven-looking tone',
 'mild to moderate body dryness', 'dry, rough heels', 'mild, occasional facial breakouts on oily skin', 'skin hydration and support for the skin barrier', 'everyday facial sun protection',
 'hair thinning and a hair-growth routine', 'scalp flakes and dandruff', 'dandruff and visible scalp flakes', 'hair nutrition as part of a hair-care routine',
 'hair thinning and a hair-growth routine with a roll-on', 'hair thinning and hair fall with a roll-on and gummies', 'frizz and dry or damaged hair',
 'washing hair as part of a hair-fall care routine', 'hair thinning with a spray-on scalp routine', 'advanced hair thinning with a roll-on scalp routine',
 'conditioning hair after washing', 'hair nutrition after pregnancy', 'massaging the scalp during a hair-care routine', 'smoothing dry, damaged or frizzy hair',
 'moderate dandruff and scalp dryness', 'hair thinning and a hair-growth routine', 'body breakouts and dry skin', 'exfoliating and cleansing the body',
 'underarm odour and more noticeable uneven-looking tone', 'sun protection for face and body', 'body sun protection', 'body cleansing and sun protection',
 'cleansing dry or dehydrated skin', 'the appearance of stretch marks', 'cleansing and moisturising mildly to moderately dry skin',
 'very dry skin and rough heels', 'very dry, rough heels with stubborn hard skin', 'body moisturising after activity', 'cleansing and moisturising very dry skin',
 'cleansing dry or dehydrated skin', 'body dryness and rough heels', 'dry to very dry, flaky skin', 'cleansing skin prone to persistent body breakouts',
 'adding calcium and vitamin D to a nutrition routine', 'adding magnesium and vitamins to a nutrition routine', 'adding vitamins and minerals to a nutrition routine',
 'a skin-focused nutrition routine', 'a skin-focused nutrition routine', 'easy-to-apply body sun protection', 'a summer body-care and sun-protection routine',
 'sun protection for face and body', 'mineral facial sun protection', 'covering a blemish with a hydrocolloid patch',
 'mild, occasional facial breakouts with dry or combination skin', 'a cooling facial-care routine', 'cleansing skin prone to persistent facial breakouts',
 'a dandruff and hair-care routine', 'a dandruff and hair-fall care routine'
]
assert len(goals) == len(products)
goal_by_id = dict(zip((p['id'] for p in products), goals))
lookup = {p['id']: p for p in products}

def clean(text):
    text = re.sub(r'[^\x20-\x7E\u00a0-\uFFFF]+', '', text or '')
    text = re.sub(r'\s+', ' ', text).strip(' ;.')
    return text

def sentence(text):
    text=clean(text)
    return text if not text or text[-1] in '.!?' else text+'.'

def usage(p):
    uf=p['usage_fields']; steps=uf.get('steps'); flags=p.get('review_fields',[])
    if not steps or any(x.startswith('usage.steps') or x.startswith('usage.rinse_or_leave_on') for x in flags):
        return ('For '+p['name']+', follow the directions on your own pack for the amount and application. '
                'Would you like to explore what it is designed for?'), 'needs_review'
    steps=re.sub(r'\s*(?:✅|🗓|💙|✨|▶|🌞|☀|⚠|️)', ' ', steps)
    steps=re.sub(r'\bStep\s*\d+\s*[:\-]\s*', '', steps, flags=re.I)
    steps=re.sub(r'\s*(?:Use (?:daily|everyday).*?results.*|For best results, use it once a day for 3 months\..*)$', '', steps, flags=re.I)
    steps=clean(steps)
    if len(steps)>800: steps=steps[:800].rsplit('.',1)[0]+'.'
    # Oral supplement amounts and conflicted instructions must be checked against the package.
    if 'gumm' in p['name'].lower() or any(x.startswith('usage.amount') for x in flags):
        return ('For '+p['name']+', follow the serving directions on your pack, preferably as part of your regular routine. '
                'Would you like to know about its highlighted ingredients?'), 'needs_review'
    return sentence(steps)+' Would you like help fitting it into your routine?', 'source_based'

def timeline(p):
    tf=p['timeline_fields']; result=tf.get('expected_results_timeframe'); duration=tf.get('recommended_usage_duration')
    subject='hair' if p['category']=='Hair Care' else 'skin' if p['category'] in ('Body Care','Face Care','Sun Protection') else None
    variation=('Everyone’s '+subject+' is different, so you may notice changes at your own pace. ') if subject else 'Everyone is different, so you may notice changes at your own pace. '
    if 'sunscreen' in p['name'].lower() or 'sun shield' in p['name'].lower():
        return ('Everyone’s skin is different, but sunscreen is designed to protect from the time you apply it as directed. '
                'For continued protection, **reapply as directed**, especially when outdoors.'), 'source_based'
    if duration and re.search(r'3\s*[-–]\s*4\s*months|3\s*to\s*4\s*months',duration,re.I):
        return (variation+'For the best results, the brand recommends using '+p['name']+' consistently for **three to four months**.'), 'source_based'
    if duration and re.search(r'\b(?:3|three)\s*(?:months|month)',duration,re.I) and not re.search(r'3\s*[-–]\s*4|3\s*to\s*4',duration,re.I):
        period='at least three months' if p['id']=='1-salicylic-acid-body-wash-350ml' or re.search(r'at least\s+3\s*months',duration,re.I) else 'three months'
        return (variation+
                'For the best results, the brand recommends using '+p['name']+' consistently for **'+period+'**.'), 'source_based'
    if result and not any(x.startswith('timeline.expected_results_timeframe') for x in p.get('review_fields',[])):
        # Source statements need individual editorial review, especially conflicting studies.
        if any(w in result.lower() for w in ['also says', 'also say', 'faq:', 'gallery', 'study', 'self-assessment', 'month 1', 'month 2', 'month 3', 'month 4', 'month 6', 'week 4', 'week 6', 'week 10']):
            return (variation+'Build '+p['name']+' into your routine consistently, and follow the instructions on your pack. '
                    'Would you like help with the routine?'), 'needs_review'
        curated_results={
            '1-zpto-anti-dandruff-shampoo':'You may start to notice fewer visible flakes after **around three washes**, according to the brand.',
            'sun-care-duo-head-to-toe':'With consistent daily sun protection, you may notice a more even-looking tone over **a few weeks**, according to the brand.',
            'triple-milk-deep-hydrating-bodywash-xp':'The brand suggests allowing **up to three months** of consistent use to notice a change.',
            'triple-milk-deep-hydrating-bodywash':'The brand suggests allowing **up to three months** of consistent use to notice a change.',
            'anti-stretch-mark-roll-on':'The brand suggests allowing **up to three months** of consistent use to notice a change in the appearance of stretch marks.',
            'hydrocolloid-acne-pimple-patch':'The brand says the patch can help calm the appearance of a blemish within **24 to 48 hours**.',
        }
        if p['id'] in curated_results:return variation+curated_results[p['id']], 'source_based'
        return variation+'Use '+p['name']+' consistently as directed on the pack; some changes may take time.', 'needs_review'
    return (variation+'Use '+p['name']+' consistently as directed on the pack, '
            'and I can help you plan the routine.'), 'needs_review'

def split_highlights(s):
    # Do not split commas within a named ingredient blend.
    parts=[]; buf=''; depth=0
    for ch in s or '':
        if ch=='(': depth+=1
        if ch==')': depth=max(0,depth-1)
        if ch==',' and depth==0:
            if clean(buf): parts.append(clean(buf))
            buf=''
        else: buf+=ch
    if clean(buf): parts.append(clean(buf))
    return parts

guide = {
 'salicylic acid': ('helps exfoliate skin and unclog pores, which can be useful for skin prone to breakouts','https://www.aad.org/news/updated-guidelines-acne-management'),
 'niacinamide': ('can help support the skin barrier and reduce excess oiliness','https://www.aad.org/public/everyday-care/skin-care-secrets/routine/facial-masks-and-skin-care'),
 'ceramide': ('helps support the skin barrier and hydration','https://www.aad.org/public/everyday-care/skin-care-secrets/routine/facial-masks-and-skin-care'),
 'hyaluronic acid': ('helps the skin stay hydrated','https://www.aad.org/public/everyday-care/skin-care-secrets/routine/facial-masks-and-skin-care'),
 'lactic acid': ('helps exfoliate the surface of the skin and improve its texture','https://www.aad.org/public/everyday-care/skin-care-secrets/routine/facial-masks-and-skin-care'),
 'glycerin': ('helps smooth and soften skin','https://www.aad.org/public/everyday-care/skin-care-secrets/routine/facial-masks-and-skin-care'),
 'urea': ('helps moisturise and soften rough skin; stronger formulations also help loosen thickened skin','https://dermnetnz.org/topics/urea'),
}
brand_ingredient_descriptions={}
research_by_id={item['id']:item for item in research}
for item in research:
    for ingredient in (item.get('ingredients') or {}).get('highlighted',[]):
        name=ingredient.get('name'); description=ingredient.get('brand_description')
        if name and description and ingredient.get('field_statuses',{}).get('brand_description')=='verified':
            key=clean(name).lower().replace('glycerine','glycerin')
            brand_ingredient_descriptions.setdefault(key,[]).append({'text':clean(description),'url':ingredient.get('source_url') or item.get('source_url')})

def guide_match(text):
    low=text.lower().replace('glycerine','glycerin')
    return next(((k,v) for k,v in guide.items() if k in low),None)

def ingredient_answer(p):
    items=(research_by_id.get(p['id'],{}).get('ingredients') or {}).get('highlighted') or []
    if not items:
        return ('This is a care tool rather than a typical ingredient-led formula. '
                'Would you like to know how to use it?'), 'needs_review'
    descriptions={
      'salicylic acid':'helps exfoliate the skin and unclog pores',
      'mandelic acid':'helps exfoliate and improve the appearance of uneven skin tone',
      'lactic acid':'helps smooth skin by removing dead skin cells',
      'alpha arbutin':'helps reduce the appearance of dark spots and uneven tone',
      'urea':'helps moisturise and soften rough skin',
      'chamomile extract':'helps soothe the skin',
      'pentavitin':'helps keep skin hydrated',
      'glycerin':'helps skin retain moisture',
      'glycerin - hyaluronic acid complex':'helps skin retain moisture',
      'ceramide complex':'helps support the skin barrier and retain moisture',
      'niacinamide':'helps support the skin barrier and improve the appearance of uneven tone',
      'allantoin':'helps soothe the skin',
      'd-panthenol':'helps moisturise the skin',
      'copper tripeptide-1':'is included in the formula to support the appearance of firm skin',
      'kojic acid':'helps reduce the appearance of dark spots',
      'glycolic acid':'helps exfoliate skin and improve its texture',
      'hyaluronic acid':'helps skin retain moisture',
      'mango seed butter':'helps nourish and soften dry skin',
      'kokum seed butter':'helps moisturise dry skin',
      'shea, mango and kokum emollients':'help soften and moisturise dry skin',
      'olea europaea (olive) fruit oil':'helps nourish skin and retain moisture',
      'tocopheryl acetate':'is a form of vitamin E used to help protect skin from oxidative stress',
      'benzoyl peroxide':'helps reduce acne-causing bacteria',
      'aloe vera extract':'helps soothe the skin',
      'biotin':'is a vitamin included to support normal hair nutrition',
      'zinc & multivitamins':'provide nutrients used in the body’s normal functions',
      'chicory root':'provides prebiotic fibre',
      'keratin':'is included to help care for hair fibres',
      'argan oil':'helps condition and soften hair',
      'olive oil':'helps condition and soften hair',
      'menthol':'gives the scalp a cooling sensation',
      'ketoconazole':'is an antifungal ingredient used in dandruff care',
      'zinc pyrithione':'is an anti-dandruff ingredient',
      'hydrocolloid':'helps absorb fluid from a blemish while covering it',
      'titanium dioxide':'is a mineral UV filter used in sunscreen',
      'zinc oxide':'is a mineral UV filter used in sunscreen',
      'aloe vera':'helps soothe the skin',
      'tea tree oil':'is included in scalp-care formulas for its potential dandruff-care benefits',
      'vitamin b6':'supports normal protein metabolism',
      'vitamin b9':'supports normal cell division',
      'folic acid':'is a form of vitamin B9 that supports normal cell division',
      'vitamins b12 and d':'contribute to the body’s normal functions',
      'triple milk blend (shea, coconut & oat milk extracts)':'helps cleanse and soften dry skin',
      'hydration boosters (erythritol, pentavitin, trehalose)':'help skin retain moisture',
      'centella extract':'is included to help soothe skin',
      'urea (pigmentation repair cream)':'helps moisturise and soften skin',
      'lactic acid (pigmentation repair cream)':'helps exfoliate and smooth skin',
      'retinol (pigmentation repair cream)':'is included to help improve the appearance of uneven skin tone',
      'regeneryl':'is part of the blend intended to improve the appearance of stretch marks',
      'striover':'is part of the blend intended to improve the appearance of stretch marks',
    }
    lines=[]; missing=False
    for item in items:
        name=clean(item.get('name')); key=name.lower().replace('glycerine','glycerin')
        if not name or item.get('field_statuses',{}).get('name')!='verified':continue
        role=descriptions.get(key)
        if key=='salicylic acid' and 'underarm' in p['name'].lower():role='helps exfoliate the skin and supports odour control'
        if not role:
            fact=researched_ingredients.get(key)
            if fact:
                role=fact[0]
                if fact[2]!='independent':missing=True
            else:
                role='is highlighted in this formula; its specific role needs review'
                missing=True
        lines.append('- **'+name+'** '+sentence(role))
    return '**Key ingredients and how they help**\n\n'+'\n'.join(lines)+'\n\nWould you like to know how to add it to your routine?', 'needs_review' if missing else 'source_based'

entries=[]
for p in products:
    pid=p['id']; sources=[p['source_url']]
    overview=f"The {p['name']} is designed for {goal_by_id[pid]}. Would you like to know how to use it?"
    entries.append({'id':'overview:'+pid,'type':'overview','products':[pid],'answer':overview,'sources':sources,'status':'draft'})
    for typ,make in [('usage',usage),('ingredients',ingredient_answer),('timeline',timeline)]:
        value,status=make(p)
        entries.append({'id':typ+':'+pid,'type':typ,'products':[pid],'answer':value,'sources':sources,'status':status,'review_flags':p.get('review_fields',[])})

for a,b in itertools.combinations(products,2):
    pair={a['id'],b['id']}; ga=goal_by_id[a['id']];gb=goal_by_id[b['id']]
    if pair=={'20-urea-roll-on-75ml','30-urea-foot-roll-on'}:
        answer=('For dry, rough heels with light flaking, the 20% roll-on is a practical starting point; '
                'for thicker, stubborn hard skin, the 30% roll-on is the more intensive option. '
                'Both help soften heels; avoid open cracks, as urea can sting on broken skin.')
        extra=['https://dermnetnz.org/topics/urea']
    elif pair=={'4-aha-bha-underarm-rollon-frag-free-75','6-aha-bha-underarm-roll-on-flora-75ml'}:
        answer=('Both help with underarm odour and uneven-looking tone. The 4% roll-on is positioned for mild pigmentation; '
                'the 6% version offers more exfoliation and is positioned for more stubborn pigmentation. '
                'Which concern would you like to focus on?')
        extra=[]
    elif ga==gb:
        answer=(f"Both {a['name']} and {b['name']} are designed for {ga}. "
                'Their formats or formulations may differ; what matters most to you in your routine?')
        extra=[]
    else:
        answer=(f"Choose {a['name']} if you want to focus on {ga}; "
                f"explore {b['name']} if your priority is {gb}. What would you like help with first?")
        extra=[]
    entries.append({'id':'compare:'+a['id']+'|'+b['id'],'type':'comparison','products':[a['id'],b['id']],
                    'answer':answer,'sources':[a['source_url'],b['source_url']]+extra,
                    'status':'draft','review_flags':list(dict.fromkeys(a.get('review_fields',[])+b.get('review_fields',[])))})

ingredient_index={}
for p in products:
    highlighted=(research_by_id.get(p['id'],{}).get('ingredients') or {}).get('highlighted') or []
    for item in highlighted:
        if item.get('field_statuses',{}).get('name')!='verified':continue
        key=clean(item.get('name'))
        if not key: continue
        norm=key.lower().replace('glycerine','glycerin')
        row=ingredient_index.setdefault(norm,{'name':key,'products':[]})
        if p['id'] not in row['products']:row['products'].append(p['id'])
for norm,row in sorted(ingredient_index.items()):
    fact=researched_ingredients.get(norm); names=[lookup[i]['name'] for i in row['products']]
    if fact:
        text,url,kind=fact
        answer=f"**How it helps:** {row['name']} {text}.\n\n**Products featuring it:** "+'; '.join(names)+'.'
        sources=([url] if url else [])+[lookup[i]['source_url'] for i in row['products']]
        status='source_based' if kind=='independent' or (kind=='brand' and url) else 'needs_review'
    elif norm in brand_ingredient_descriptions:
        description=brand_ingredient_descriptions[norm][0]
        answer=f"**How it helps:** {row['name']} is described by the brand as: "+sentence(description['text'])+'\n\n**Products featuring it:** '+ '; '.join(names)+'.'
        sources=[description['url']]+[lookup[i]['source_url'] for i in row['products']];status='needs_review'
    else:
        answer=f"{row['name']} is highlighted in: "+'; '.join(names)+'. Its specific role requires further review.'
        sources=[lookup[i]['source_url'] for i in row['products']]; status='needs_review'
    entries.append({'id':'ingredient:'+norm,'type':'ingredient','products':row['products'],'answer':answer,'sources':sources,'status':status,'ingredient':row['name'],'evidence_kind':fact[2] if fact else 'product_source'})

def display_name(name):
    # Remove package sizes from product names only, never from use directions,
    # ingredient strengths, or recommended durations.
    name=re.sub(r'\s*\(\s*\d+\s*(?:ml|g|kg|n|pcs|pieces)?\s*\)', '', name, flags=re.I)
    name=re.sub(r'\s*[-–—]?\s*\b\d+(?:\.\d+)?\s*(?:ml|g|kg|pcs|pieces|n)\b', '', name, flags=re.I)
    return re.sub(r'\s+', ' ', name).strip(' -–—')

for entry in entries:
    for p in sorted(products,key=lambda product:len(product['name']),reverse=True):
        entry['answer']=entry['answer'].replace(p['name'],display_name(p['name']))
    if entry['type']=='comparison':
        first,second=(lookup[pid] for pid in entry['products'])
        if first['name']!=second['name'] and display_name(first['name'])==display_name(second['name']):
            entry['answer']=f"Both versions of {display_name(first['name'])} are designed for {goal_by_id[first['id']]}. Which part of your routine would you like help with?"

payload={'status':'draft_not_approved','description':'Review draft generated from the existing catalogue; not connected to the assistant.',
         'counts':{'products':len(products),'per_product_answers':len(products)*4,'comparisons':len(products)*(len(products)-1)//2,'ingredient_entries':len(ingredient_index),'total_answers':len(entries)},
         'products':[{'id':p['id'],'name':p['name'],'display_name':display_name(p['name']),'source_url':p['source_url']} for p in products], 'answers':entries}
(OUT/'answers-draft.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bodywise answer library — review draft</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f8fb;color:#173850;font:16px/1.5 system-ui,sans-serif}header{background:#083659;color:white;padding:28px 5vw}header h1{margin:0;font-size:clamp(24px,4vw,36px)}header p{max-width:900px;margin:8px 0}.wrap{max-width:1160px;margin:auto;padding:24px 5vw}.notice{padding:14px 16px;border-radius:12px;background:#e5f3fc}.filters{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}input,select,button{font:inherit;border:1px solid #bcd5e3;border-radius:10px;padding:10px;background:white;color:#173850}input{flex:1;min-width:220px}button{cursor:pointer}.card{background:white;border:1px solid #d8e9f1;border-radius:14px;margin:12px 0;padding:16px}.card h2{font-size:16px;margin:0 0 8px;color:#075487}.card p{margin:8px 0;white-space:pre-line}.meta{font-size:12px;color:#506d7c}.sources{font-size:12px;display:flex;flex-wrap:wrap;gap:8px}.sources a{color:#075487}.badge{display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;border-radius:20px;padding:3px 8px;background:#e9f4fa;color:#075487;margin-right:6px}.badge.review{background:#fff0d8;color:#855200}.pagination{display:flex;gap:12px;align-items:center;margin:18px 0}button:disabled{opacity:.4}
</style></head><body><header><h1>Product assistant answer library</h1><p>Complete review draft · 56 products · 1,540 unique product pairs · not connected to the chatbot</p></header><main class="wrap"><div class="notice">Review the wording and flagged details before approval. Product names, source links, and review flags are shown with each answer. Some source details conflict or are absent; the draft does not invent exact directions or dates.</div><div class="filters"><input id="search" type="search" placeholder="Search product, ingredient or answer" aria-label="Search answers"><select id="type" aria-label="Answer category"><option value="">All answer types</option><option value="overview">Product overview</option><option value="usage">How to use</option><option value="ingredients">Product ingredients</option><option value="timeline">When to expect results</option><option value="ingredient">Ingredient guide</option><option value="comparison">Product comparisons</option></select><select id="status" aria-label="Review status"><option value="">All review states</option><option value="needs_review">Needs source review</option><option value="source_based">Source-based draft</option><option value="draft">Other draft</option></select></div><p id="count" class="meta"></p><div id="results"></div><div class="pagination"><button id="prev">Previous</button><span id="page"></span><button id="next">Next</button></div></main><script>
const data=__DATA__;const byId=Object.fromEntries(data.products.map(p=>[p.id,p]));let page=0,filtered=[];const size=30;const $=id=>document.getElementById(id);
function update(){const q=$('search').value.toLowerCase().trim(),type=$('type').value,status=$('status').value;filtered=data.answers.filter(a=>(!type||a.type===type)&&(!status||a.status===status)&&(!q||(a.answer+' '+(a.ingredient||'')+' '+a.products.map(id=>byId[id]?.name||'').join(' ')).toLowerCase().includes(q)));page=0;render()}
function render(){const root=$('results');root.replaceChildren();$('count').textContent=filtered.length.toLocaleString()+' answers match your search';const pages=Math.max(1,Math.ceil(filtered.length/size));page=Math.max(0,Math.min(page,pages-1));$('page').textContent=`Page ${page+1} of ${pages}`;$('prev').disabled=page===0;$('next').disabled=page>=pages-1;
 for(const a of filtered.slice(page*size,(page+1)*size)){const card=document.createElement('article');card.className='card';const heading=document.createElement('h2');heading.textContent=(a.ingredient||a.products.map(id=>byId[id]?.display_name||id).join('  vs  '));card.append(heading);const meta=document.createElement('div');meta.className='meta';const badge=document.createElement('span');badge.className='badge'+(a.status==='needs_review'?' review':'');badge.textContent=a.status.replaceAll('_',' ');meta.append(badge,document.createTextNode(a.type.replaceAll('_',' ')+(a.evidence_kind?' · '+({'independent':'external research','brand':'manufacturer description','review':'further review','product_source':'product source'}[a.evidence_kind]||a.evidence_kind):'')));card.append(meta);const answer=document.createElement('div');answer.className='answer';let list=null;for(const line of a.answer.split('\\n')){if(!line.trim()){list=null;continue}const bullet=line.startsWith('- ');let el;if(bullet){if(!list){list=document.createElement('ul');answer.append(list)}el=document.createElement('li');list.append(el)}else{list=null;el=document.createElement('p');answer.append(el)}for(const part of (bullet?line.slice(2):line).split(/(\\*\\*[^*]+\\*\\*)/g)){if(part.startsWith('**')&&part.endsWith('**')){const strong=document.createElement('strong');strong.textContent=part.slice(2,-2);el.append(strong)}else el.append(document.createTextNode(part))}}card.append(answer);if(a.review_flags?.length){const flag=document.createElement('p');flag.className='meta';flag.textContent='Source review: '+a.review_flags.join(', ');card.append(flag)}const links=document.createElement('div');links.className='sources';for(const [i,url] of [...new Set(a.sources)].entries()){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noreferrer';link.textContent='Source '+(i+1)+' ↗';links.append(link)}card.append(links);root.append(card)}}
for(const id of ['search','type','status'])$(id).addEventListener('input',update);$('prev').onclick=()=>{page--;render();window.scrollTo(0,0)};$('next').onclick=()=>{page++;render();window.scrollTo(0,0)};update();
</script></body></html>'''.replace('__DATA__',json.dumps(payload,ensure_ascii=False).replace('</','<\\/'))
(OUT/'review-answers.html').write_text(page,encoding='utf-8')
(OUT/'review-answers-updated.html').write_text(page,encoding='utf-8')
(OUT/'review-answers-ingredient-research.html').write_text(page,encoding='utf-8')
print(json.dumps(payload['counts']))
