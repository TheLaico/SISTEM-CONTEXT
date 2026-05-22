import React from 'react';

interface FormularioModalProps {
    titulo: string;
    abierto: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
}

const FormularioModal: React.FC<FormularioModalProps> = ({ titulo, abierto, onClose, onSubmit, children }) => {
    if (!abierto) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl dark:bg-boxdark">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{titulo}</h3>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="space-y-4">{children}</div>
                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-md border border-stroke bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioModal;
