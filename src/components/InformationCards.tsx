import { useEffect, useMemo, useState } from 'react';
import type { RecommendationResult } from '../shared/recommendations';
import type { ConcernId } from '../data/concerns';
import { informationCards } from '../utils/informationCards';
export function InformationCards({selected,result}:{selected:ConcernId[];result:RecommendationResult|null}) {
 const cards=useMemo(()=>informationCards(selected,result),[selected,result]); const [index,setIndex]=useState(0); const [focused,setFocused]=useState(false); const [hovered,setHovered]=useState(false); const [visible,setVisible]=useState(!document.hidden);
 useEffect(()=>{const change=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
 useEffect(()=>{if(cards.length<2 || (focused || hovered) || !visible)return;const id=window.setInterval(()=>setIndex(i=>(i+1)%cards.length),6000);return()=>clearInterval(id);},[cards.length,focused,hovered,visible]);
 const card=cards[index%cards.length];
 return <div className="info-card" onFocus={()=>setFocused(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}><h2>{card.title}</h2><p>{card.body}</p>{cards.length>1 && <div className="card-nav"><button onClick={()=>setIndex(i=>(i-1+cards.length)%cards.length)}>Previous</button><span>{index%cards.length+1} / {cards.length}</span><button onClick={()=>setIndex(i=>(i+1)%cards.length)}>Next</button></div>}</div>;
}
