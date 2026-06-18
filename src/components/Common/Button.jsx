import "./Button.css";

function Button({ label }) {
  return (
    <button className="btn-menu">
      {label}
    </button>
  );
}

export default Button;