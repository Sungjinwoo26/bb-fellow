/** A compact, conservative view of customer-provided conversation details. */
export function conversationContext(message:string, history:{role:'user'|'assistant';text:string}[], selectedProductIds:string[]) {
 const userTurns=history.filter(turn=>turn.role==='user').map(turn=>turn.text);
 const text=[...userTurns,message].join(' ').toLowerCase();
 const areas=[['face',/\b(face|facial)\b/],['body',/\b(body|back|chest|legs?|arms?)\b/],['scalp',/\b(scalp|hair)\b/],['underarms',/\b(underarms?|armpits?)\b/]] as const;
 const concerns=[['dryness',/\b(dry|dryness|flaky|flaking)\b/],['acne',/\b(acne|pimples?|whiteheads?|blackheads?)\b/],['hair_fall',/\b(hair\s*fall|hair\s*loss|thinning)\b/],['dandruff',/\b(dandruff|flakes?)\b/],['odour',/\b(odou?r|smell)\b/]] as const;
 const productType=[...userTurns,message].reverse().map(turn=>/\b(body\s*wash|face\s*wash|shampoo|conditioner|lotion|serum|scrub|moisturi[sz]er|sunscreen|roll[ -]?on)\b/i.exec(turn)?.[1]?.toLowerCase()).find(Boolean)??null;
 const comparison=/\b(compare|comparison|versus|vs|difference)\b/i.test(message);
 const intents=[['price',/\b(prices?|costs?|mrp|how much)\b/i],['ingredients',/\b(ingredients?|contains?|contain|formulation)\b/i],['usage',/\b(how (?:do|should|can) i use|how to use|how often|apply|application)\b/i],['purpose',/\b(?:what (?:is|are) (?:this product|that product|these products|those products|this|that|it|these|those|the product|the products) (?:used )?for|what (?:does|do) (?:it|this|that|these|those|the product|the products) do|benefits?)\b/i],['timeline',/\b(results?|how long|how soon)\b/i],['comparison',/\b(compare|comparison|versus|vs|difference)\b/i]] as const;
 const reference=/\b(it|its|this|that|they|them|these|those|both|either)\b/i.test(message);
 const newSearch=/\b(another|other|alternative|different|find|search|show me|looking for)\b/i.test(message);
 const isLikelyAnswer=(text:string)=>!text.includes('?')&&text.trim().split(/\s+/).length<=8;
 const answeredQuestions=history.flatMap((turn,index)=>turn.role==='assistant'&&turn.text.includes('?')&&history[index+1]?.role==='user'&&isLikelyAnswer(history[index+1].text)?[{question:turn.text.slice(0,500),answer:history[index+1].text.slice(0,500)}]:[]).slice(-20);
 const last=history.at(-1);
 if(last?.role==='assistant'&&last.text.includes('?')&&isLikelyAnswer(message))answeredQuestions.push({question:last.text.slice(0,500),answer:message.slice(0,500)});
 return {active_product_ids:selectedProductIds,action:comparison?'comparison':newSearch?'product_search':reference?'product_follow_up':/\b(body\s*wash|face\s*wash|shampoo|conditioner|lotion|serum|scrub|moisturi[sz]er|sunscreen|roll[ -]?on)\b/i.test(message)?'product_search':'unspecified',intents:intents.filter(([,pattern])=>pattern.test(message)).map(([name])=>name),requested_product_type:productType,areas:areas.filter(([,pattern])=>pattern.test(text)).map(([name])=>name),concerns:concerns.filter(([,pattern])=>pattern.test(text)).map(([name])=>name),answered_questions:answeredQuestions.slice(-20),recent_user_turns:userTurns.slice(-12)};
}
