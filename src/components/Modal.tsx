interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 sm:pl-48">
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ animation: 'bubbleGrow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl">
            ✕
          </button>
        </div>
        {children}
      </div>

      <style>{`
        @keyframes bubbleGrow {
          from { transform: scale(0.3); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
