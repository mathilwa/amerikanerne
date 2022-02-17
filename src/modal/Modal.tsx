import ReactModal from 'react-modal';
import './modal.css';

ReactModal.setAppElement('#root');

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => (
    <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnEsc={false}
        className="modal"
        overlayClassName="modalOverlay"
        shouldCloseOnOverlayClick={false}
    >
        <div>{children}</div>
    </ReactModal>
);

export default Modal;
