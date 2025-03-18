import { useContext, useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { JsonFormContext } from '../contexts';
import objectPath from 'object-path';

export const useFieldSchema = <TFormValue extends FieldValues>(name: FieldPath<TFormValue>) => {
    const schemaForm = useContext(JsonFormContext);

    if (!schemaForm) {
        throw new Error('useFieldSchema must be used within a JsonForm component');
    }

    const { fields } = schemaForm;

    const field = useMemo(() => {
        const field = objectPath.get(fields, name);
        return field;
    }, [fields, name]);

    return field;
};
