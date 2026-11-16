type SearchProduct={id:string;name:string;category:string;purpose:string|null;ingredients:string|null;full_ingredients:string|null};
const aliases:Record<string,string>={rollon:'roll on',rollons:'roll on',facewash:'face wash',bodywash:'body wash',hairfall:'hair fall',fallng:'falling',sugest:'suggest',siggest:'suggest',shamppo:'shampoo',shampoo:'shampoo',shampu:'shampoo',pimples:'acne',pimple:'acne',breakouts:'acne',breakout:'acne',spots:'marks',gummie:'gummies',gummy:'gummies',salicylicacid:'salicylic acid',hyaluronicacid:'hyaluronic acid',niacinimide:'niacinamide'};
const ignore=new Set('what which when where how does with about would should this that product products bodywise have from your please tell like use using much often long take results skin care the for and are you can its between difference want need looking find contain contains has show does have me my is it on in of a to'.split(' '));
const numerals:Record<string,string>={one:'1',two:'2',three:'3',four:'4',five:'5',six:'6',seven:'7',eight:'8',nine:'9',ten:'10',twenty:'20',thirty:'30'};
export function normalizeSearch(s:string){let t=s.toLowerCase().replace(/(\d)\s*(?:per\s*cent|percent|%)/g,'$1 percent').replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty)\s*(?:per\s*cent|percent|%)/g,(_,n:string)=>`${numerals[n]} percent`).replace(/[^a-z0-9]+/g,' ').trim();for(const [from,to] of Object.entries(aliases))t=t.replace(new RegExp(`\\b${from}\\b`,'g'),to);return t.replace(/\s+/g,' ');}
export function requestedProductFormat(query:string):string|null {
 const q=normalizeSearch(query);
 if(/\bspf(?:\s*\d+)?\b/.test(q))return 'sunscreen';
 const formats=['body wash','face wash','shampoo','conditioner','lotion','serum','scrub','sunscreen','moisturizer','roll on','cream'];
 return formats.find(format=>new RegExp(`\\b${format}\\b`).test(q))??null;
}
export function matchesProductFormat(product:{name:string},format:string):boolean {
 const name=normalizeSearch(product.name);
 return new RegExp(`\\b${format}\\b`).test(name) && !/\b(kit|pack|bundle|duo|combo)\b/.test(name);
}
function close(a:string,b:string){if(a===b)return true;if(Math.min(a.length,b.length)<4)return false;if(Math.abs(a.length-b.length)>1)return false;if(a.length>=5&&b.startsWith(a))return true;let i=0,j=0,errors=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++errors>1)return false;if(a.length>b.length)i++;else if(b.length>a.length)j++;else{i++;j++;}}return errors+(i<a.length||j<b.length?1:0)<=1;}
export function rankProducts<T extends SearchProduct>(query:string,products:T[]):T[]{
 const q=normalizeSearch(query);const terms=q.split(' ').filter(t=>t.length>2&&!ignore.has(t)&&t!=='percent');const numbers=[...q.matchAll(/\b(\d{1,2})(?:\s+percent)?\b/g)].map(m=>m[1]);
 if(!terms.length&&!numbers.length)return [];
 return products.map((p,index)=>{const name=normalizeSearch(p.name),ingredient=normalizeSearch(`${p.ingredients??''} ${p.full_ingredients??''}`),purpose=normalizeSearch(`${p.category} ${p.purpose??''}`);const nameTokens=name.split(' '),ingredientTokens=ingredient.split(' '),purposeTokens=purpose.split(' ');let score=0,hits=0;
 for(const t of terms){if(/^\d+$/.test(t))continue;let points=0;if(nameTokens.some(w=>w===t))points=5;else if(ingredientTokens.some(w=>w===t))points=3;else if(purposeTokens.some(w=>w===t))points=2;else if(nameTokens.some(w=>close(t,w)))points=2;else if(ingredientTokens.some(w=>close(t,w)))points=1;if(points){score+=points;hits++;}}
 if(q.includes(name))score+=30;const productNumbers=[...name.matchAll(/\b(\d{1,2})\s+percent\b/g)].map(m=>m[1]);if(numbers.length&&productNumbers.length){if(productNumbers.some(n=>numbers.includes(n)))score+=8;else score-=12;}
 return {p,score,hits,index};}).filter(x=>x.hits>0&&x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.p);
}
