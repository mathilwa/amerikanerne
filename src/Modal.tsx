import ReactModal from 'react-modal';
import './App.css';

ReactModal.setAppElement('#root');

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => (
    <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnEsc={true}
        className="modal"
        shouldCloseOnOverlayClick={true}
    >
        <div>{children}</div>
    </ReactModal>
);

export default Modal;
