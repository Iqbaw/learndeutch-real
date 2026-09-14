import { ArrowUpRight, AudioLines } from "lucide-react";

export function LanguagePostcard({ compact = false }: { compact?: boolean }) {
  return <div className={`language-scene ${compact ? "is-compact" : ""}`} aria-hidden="true">
    <div className="postcard-back" />
    <div className="language-postcard">
      <div className="postcard-top"><span>DEUTSCH, TAG FÜR TAG</span><span className="german-flag"><i /><i /><i /></span></div>
      <span className="postcard-word">Hallo<span>!</span></span>
      <div className="postcard-bottom"><span>Semua dimulai dari halo.</span><AudioLines size={23} /></div>
    </div>
    <div className="postcard-stamp"><ArrowUpRight size={19} /><span>Ein kleiner Schritt.<br /><b>Satu langkah kecil.</b></span></div>
  </div>;
}
