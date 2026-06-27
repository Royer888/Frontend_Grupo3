import "./Button.css";

function Button({ label, onClick, disabled = false, variant = "primary" }) {
  return (
    <button
      className={`btn-menu btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;