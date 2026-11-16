import '../styles/welcome.css';

type Props = { hasSession: boolean; onStart: () => void; onResume: () => void };

export function RoutineWelcome({hasSession,onStart,onResume}:Props) {
 const begin=hasSession?onResume:onStart;
 return <section className="routine-welcome" aria-labelledby="welcome-title">
  <div className="routine-intro">
   <div className="routine-copy">
    <p className="routine-eyebrow"><span/> YOUR PERSONALISED KIT</p>
    <h1 id="welcome-title">Your kit,<br/><em>made for you.</em></h1>
    <p className="routine-description">Good care starts with understanding you. Discover products for your needs.</p>
   </div>
   <div className="routine-portrait" aria-hidden="true"><img src="/storefront/routine-portrait.webp" alt=""/></div>
  </div>
  <div className="routine-steps-heading"><span>YOUR KIT IN 3 STEPS</span><span aria-hidden="true">✦</span></div>
  <div className="routine-steps">
   <article className="routine-step"><span className="routine-step-icon" aria-hidden="true">♡</span><div><span className="routine-step-number">01</span><h2>Tell us your concerns</h2><p>Choose what you need help with.</p></div></article>
   <article className="routine-step"><span className="routine-step-icon" aria-hidden="true">✎</span><div><span className="routine-step-number">02</span><h2>Answer a few questions</h2><p>Share what you’re experiencing.</p></div></article>
   <article className="routine-step"><span className="routine-step-icon" aria-hidden="true">✳</span><div><span className="routine-step-number">03</span><h2>Get your personalised kit</h2><p>Discover products for your needs.</p></div></article>
  </div>
  <div className="routine-actions"><button className="routine-cta" onClick={begin}>{hasSession?'Continue assessment':'Find my kit'} <span aria-hidden="true">↗</span></button>{hasSession&&<button className="routine-restart" onClick={onStart}>Start a new assessment</button>}<p className="routine-caption"><span aria-hidden="true">✦</span> Thoughtful care, made personal</p></div>
 </section>;
}
