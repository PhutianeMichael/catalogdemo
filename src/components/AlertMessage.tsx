import React from 'react';

interface AlertMessageProps {
    message: string,
    setBreadcrumbMessage: (message: string | null) => void
}
export const AlertMessage: React.FC<AlertMessageProps> = ({message, setBreadcrumbMessage }) => {
    return (
        <>
        {message ? (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {message}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setBreadcrumbMessage(null)}></button>
                </div>
            ) : null}
        </>
    )
}
