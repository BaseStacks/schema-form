import { useContext } from 'react';
import { SchemaFormContext } from '../contexts';
import { SchemaFormContextType } from '../types';
import { FieldValues } from 'react-hook-form';

export const useSchemaForm = <TFormValue extends FieldValues>() => {
    const schemaForm = useContext(SchemaFormContext) as SchemaFormContextType<TFormValue>;
    if (!schemaForm) {
        throw new Error('useSchemaForm must be used within a SchemaForm');
    }

    return schemaForm;
};
