import React from 'react';

interface ConfirmationClearProps {
    title: string;
    message: string;
    showAlert: (message: string) => void;
    setConfirmOpen: (open: boolean) => void;
    clearItems?: () => void;
}
export const ConfirmationClear: React.FC<ConfirmationClearProps> = ({title, message, setConfirmOpen, showAlert,  clearItems}) => {

    return (
        <>
            <div className="modal fade show" role="dialog" style={{display:'block'}} aria-modal="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm clear {title}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setConfirmOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>{`Are you sure you want to remove all items from your ${title}?`}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={() => {
                                if (clearItems) clearItems();
                                setConfirmOpen(false);
                                showAlert(message);
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    )
}// 'Favorite List cleared'
