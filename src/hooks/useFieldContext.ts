import { FieldValues } from 'react-hook-form';
import { BaseFieldSchema } from '../types';
import { useMemo } from 'react';
import { useSchemaForm } from './useSchemaForm';

export const useFieldContext = <TFormValue extends FieldValues>(field: BaseFieldSchema<unknown, TFormValue>) => {
    const { context: formContext } = useSchemaForm();
    const fieldContext = useMemo(() => Object.assign({}, formContext, field.context), [formContext, field.context]);
    return fieldContext;
};
