import {catalogueById} from './catalogue';
import {normalizeSearch} from './productMatcher';

// The brand's Body Acne Pack describes the 250 mL 1% wash and 10% lotion:
// wash/rinse/pat dry, then apply lotion after the shower.
const packSource='https://bebodywise.com/product/body-care-mini-pack';
export function supportedPairRoutine(message:string,activeIds:string[],history:{role:'user'|'assistant';text:string}[]){
 const q=normalizeSearch(message),past=history.filter(x=>x.role==='user').slice(-2).map(x=>x.text).join(' ');
 const mentionsPair=/\b(?:together|both|pair|which first|what order|in what order|order|after it|after the wash)\b/i.test(message);
 if(!mentionsPair)return null;
 // Avoid interpreting adverse reactions, pregnancy or requests for individual
 // medical compatibility as approval of a routine.
 if(/\b(?:pregnan\w*|breast.?feed\w*|rash|irritat\w*|allerg\w*|burn\w*|bleed\w*|sensitive|freshly shaved|same shower|benzoyl|peroxide)\b/i.test(message))return null;
 // A newly named product replaces an earlier pair; past mentions must not
 // silently turn an underarm or face routine into the body-acne pack.
 if(/\b(?:underarm|armpit|face\s*wash|roll[\s-]*on|serum|sunscreen|cream)\b/i.test(message))return null;
 const text=normalizeSearch(/\b(?:it|them|those|these|both|pair|which first|what order)\b/i.test(message)?`${past} ${message}`:message);
 const washNamed=/\b1 percent\b/.test(text)&&/\bsalicylic\b/.test(text)&&/\bbody wash\b/.test(text);
 const lotionNamed=/\b(?:10 percent\s+)?niacinamide\s+(?:body\s+)?lotion\b/.test(text);
 const knownWash=activeIds.find(id=>id==='1-salicylic-acid-body-wash'||id==='1-salicylic-acid-body-wash-350ml');
 const knownLotion=activeIds.includes('niacinamide-body-lotion');
 const explicitPair=/\b1 percent\b/.test(q)&&/\bsalicylic\b/.test(q)&&/\bbody wash\b/.test(q)&&/\b(?:10 percent\s+)?niacinamide\s+(?:body\s+)?lotion\b/.test(q);
 if(!explicitPair&&activeIds.length&&activeIds.some(id=>!['1-salicylic-acid-body-wash','1-salicylic-acid-body-wash-350ml','niacinamide-body-lotion'].includes(id)))return null;
 if(!(washNamed||knownWash)||!(lotionNamed||knownLotion))return null;
 const explicit375=/\b(?:375|350)\s*(?:ml)?\b/.test(q);const explicit250=/\b250\s*(?:ml)?\b/.test(q);
 const wash=explicit375?'1-salicylic-acid-body-wash-350ml':explicit250?'1-salicylic-acid-body-wash':knownWash??'1-salicylic-acid-body-wash';
 const products=[catalogueById.get(wash),catalogueById.get('niacinamide-body-lotion')];
 if(products.some(p=>!p||!p.storefront_variants.some(v=>v.available)))return null;
 const label=wash==='1-salicylic-acid-body-wash'?'The brand’s Body Acne Pack gives this order':'The stored directions for these products give this order';
 return {products:products as NonNullable<typeof products[number]>[],message:`${label}:\n\n1. Use **${products[0]!.name}** on wet skin, rinse and pat dry.\n\n2. After the shower, apply **${products[1]!.name}** to the body.\n\nThis is the product-use order; the available information does not confirm suitability for every person.`,source:packSource};
}
