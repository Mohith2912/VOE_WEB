import "./VOEContinuousLogo.css";
import voeLogoImg from "../voe-logo.png";

export default function VOEContinuousLogo({ onClick }) {
  return (
    <button type="button" className="voe-continuous-wrapper" onClick={onClick} aria-label="VOE Home">
      <img src={voeLogoImg} alt="" className="voe-continuous-img" width="44" height="44" />
      <span className="voe-continuous-text">VOE</span>
    </button>
  );
}
