import web_logo from "../../assets/web_logo.png";

function MobileHeader({ onMenuToggle }) {
  return (
    <div className="mobile-header">
      <button className="menu-toggle" onClick={onMenuToggle}>☰</button>
      <div className="mobile-brand">
        <img src={web_logo} alt={"Vartija."} height={'30px'}/>
      </div>
    </div>
  );
}

export default MobileHeader;