import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyPageProps {
    title: string;
}

export const EmptyPage: React.FC<EmptyPageProps> = ({title}) => {
    return (
        <div className="row d-flex justify-content-center gap-2"><h2 className="text-center col-12 text-capitalize">{title}</h2> <h5
            className="text-center col-12">{`Your ${title} is empty`}</h5>
            <Link to='/' className="btn btn-primary col-xs-12 col-sm-12 col-md-6 col-lg-3">Browse Catalog</Link>
        </div>
    )
}
