import { useContext } from 'react';
import { JsonFormContext } from '../contexts';
import { JsonFormContextType } from '../types';

export const useSchemaForm = <TFormValue>() => {
    const schemaForm = useContext(JsonFormContext) as JsonFormContextType<TFormValue>;
    if (!schemaForm) {
        throw new Error('useSchemaForm must be used within a SchemaForm');
    }

    return schemaForm;
};
