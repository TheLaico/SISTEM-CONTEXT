import React from 'react';
import GenericTable from './GenericTable';

export interface TablaAcademicaProps {
    datos: Record<string, any>[];
    columnas: string[];
    acciones: { name: string; label: string }[];
    onAction: (name: string, item: Record<string, any>) => void;
}

const TablaAcademica: React.FC<TablaAcademicaProps> = ({ datos, columnas, acciones, onAction }) => {
    return (
        <div className="mt-5">
            <GenericTable data={datos} columns={columnas} actions={acciones} onAction={onAction} />
        </div>
    );
};

export default TablaAcademica;
