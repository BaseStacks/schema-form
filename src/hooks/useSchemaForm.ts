import { useContext } from 'react';
import { JsonFormContext } from '../contexts';
import { JsonFormContextType } from '../types';
import { FieldValues } from 'react-hook-form';

export const useSchemaForm = <TFormValue extends FieldValues>() => {
    const schemaForm = useContext(JsonFormContext) as JsonFormContextType<TFormValue>;
    if (!schemaForm) {
        throw new Error('useSchemaForm must be used within a SchemaForm');
    }

    return schemaForm;
};
