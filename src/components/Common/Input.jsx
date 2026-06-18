import './Input.css'
 
function Input({ label, value, onChange, placeholder, type = 'text', error, disabled = false }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <input
                className={`input-field ${error ? 'input-error' : ''}`}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    )
}
 
export default Input
 