import '../styles/welcome.css';

type Props = { hasSession: boolean; onStart: () => void; onResume: () => void };

export function RoutineWelcome({hasSession,onStart,onResume}:Props) {
 const begin=hasSession?onResume:onStart;
 return <section className="routine-welcome" aria-labelledby="welcome-title">
  <div className="routine-hero">
   <div className="routine-copy">
    <div className="routine-eyebrow"><span/> YOUR ROUTINE STARTS HERE</div>
    <h1 id="welcome-title">A little care,<br/><em>made for you.</em></h1>
    <p>Good care starts with understanding you. Tell us about your concerns and discover a routine made around your answers.</p>
    <button className="routine-cta" onClick={begin}>{hasSession?'Continue assessment':'Find my routine'} <span aria-hidden="true">↗</span></button>
    {hasSession&&<button className="routine-restart" onClick={onStart}>Start a new assessment</button>}
    <div className="routine-caption"><span className="caption-sparkle" aria-hidden="true">✳</span> Thoughtful care, one step at a time</div>
   </div>
   <div className="routine-visual" aria-hidden="true">
    <div className="visual-ring visual-ring-one"/><div className="visual-ring visual-ring-two"/>
    <div className="visual-main"><img src="/storefront/category-face.webp" alt=""/></div>
    <div className="visual-product"><img src="/storefront/catalogue/10-urea-lotion-300ml.jpg" alt=""/></div>
    <div className="visual-note"><span className="visual-note-star">✳</span><span>Care that feels<br/><strong>like you.</strong></span></div>
    <div className="visual-sparkle visual-sparkle-one">✳</div><div className="visual-sparkle visual-sparkle-two">✦</div>
    <div className="visual-tag">YOUR SKIN. YOUR STORY.</div>
   </div>
  </div>
  <div className="routine-how">
   <div className="how-heading"><div><p className="how-kicker">SIMPLE & PERSONAL</p><h2>Your care, in 3 steps<span>.</span></h2></div><span className="how-mark" aria-hidden="true">✳</span></div>
   <div className="how-cards">
    <article className="how-card"><span className="how-number">01</span><span className="how-icon" aria-hidden="true">♡</span><h3>Tell us your concerns</h3><p>Choose what you’d like help with.</p></article>
    <article className="how-card"><span className="how-number">02</span><span className="how-icon" aria-hidden="true">✎</span><h3>Answer a few questions</h3><p>Share what you’re experiencing.</p></article>
    <article className="how-card"><span className="how-number">03</span><span className="how-icon" aria-hidden="true">✳</span><h3>Explore your routine</h3><p>See your personalised sample kit.</p></article>
   </div>
   <button className="routine-cta routine-cta-bottom" onClick={begin}>{hasSession?'Continue assessment':'Get started'} <span aria-hidden="true">→</span></button>
  </div>
  <div className="routine-explore"><div><p className="how-kicker">MADE AROUND YOUR CONCERNS</p><h2>A little something for <em>every you.</em></h2></div><div className="routine-categories"><div><img src="/storefront/category-body.webp" alt=""/><span>Body care</span></div><div><img src="/storefront/category-face.webp" alt=""/><span>Skin care</span></div><div><img src="/storefront/category-hair.webp" alt=""/><span>Hair care</span></div></div></div>
 </section>;
}
