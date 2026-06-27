import './Modal.css'

function Modal({ isOpen, title, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal