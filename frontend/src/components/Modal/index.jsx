export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 font-bold text-lg hover:cursor-pointer" onClick={onClose}>
          x
        </button>
        {/* close button */}
        {children}
      </div>
    </div>
  );
};
