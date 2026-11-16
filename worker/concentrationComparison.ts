import type { catalogue } from './catalogue';

type Item=(typeof catalogue)[number];

// Only compare the same named active and product format. A size or scent is
// not a concentration; combinations with different actives stay separate.
function family(name:string){
 const strength=name.match(/^\s*(\d+(?:\.\d+)?)%\s+/);
 if(!strength)return null;
 const key=name.slice(strength[0].length).toLowerCase()
  .replace(/\b\d+(?:\.\d+)?\s*(?:ml|gm|g|grams?)\b/g,' ')
  .replace(/\b(?:flora|aqua|watermelon|oudh|fragrance|free|no|foam|based|body)\b/g,' ')
  .replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
 return key?{key,strength:strength[1]}:null;
}

/** Supplement recommendations with catalogue facts, without inferring that a
 * higher percentage is more suitable, effective or irritating. */
export function addConcentrationContext(message:string,items:Item[]):string{
 const groups=new Map<string,{item:Item;strength:string}[]>();
 for(const item of items){const f=family(item.name);if(!f)continue;groups.set(f.key,[...(groups.get(f.key)??[]),{item,strength:f.strength}]);}
 let result=message;let needsCaveat=false;
 for(const group of groups.values()){
  if(new Set(group.map(x=>x.strength)).size<2)continue;
  if(group.filter(({item})=>result.toLowerCase().includes(item.name.toLowerCase())).length<2)continue;
  const purposes=group.map(({item})=>item.purpose?.trim()??'');
  const usable=group.every(({item},i)=>!!purposes[i]&&!item.review_fields.some(x=>x==='purpose'||x.startsWith('purpose.')));
  const useProfile=(s:string)=>(s.toLowerCase().match(/\b(?:oily|combination|dry|flaky|mild|moderate|very|severe|sensitive)\b/g)??[]).sort().join(' ');
  const distinct=usable&&purposes.every(x=>!!useProfile(x))&&new Set(purposes.map(useProfile)).size>1;
  if(!distinct){needsCaveat=true;continue;}
  // Put the catalogue's own specific use beside each named product.
  for(const {item} of group){
   const index=result.toLowerCase().indexOf(item.name.toLowerCase());
   if(index<0)continue;
   const end=result.indexOf('\n\n',index);
   const at=end<0?result.length:end;
   const paragraph=result.slice(index,at).toLowerCase();
   if(!paragraph.includes(item.purpose!.toLowerCase()))result=result.slice(0,at)+` (Listed for: ${item.purpose!.replace(/^for\s*:?\s*/i,'').replace(/[.\s]+$/,'') }.)`+result.slice(at);
  }
 }
 if(needsCaveat){
  const note='The concentrations differ, but the product information does not say which is better for your needs.';
  const question=result.match(/\n\n([^\n?]+\?)\s*$/);
  if(question&&question.index!==undefined)result=result.slice(0,question.index)+`\n\n${note}`+result.slice(question.index);
  else result+=`\n\n${note}`;
 }
 return result;
}
