import { useContext, useMemo } from 'react';
import { FieldPath, FieldValues, get } from 'react-hook-form';
import { SchemaFormContext } from '../contexts';
import { BaseFieldSchema, RenderContext } from '../types';

export const useFieldSchema = <
    TFormValue extends FieldValues,
    TRenderContext extends RenderContext,
    TSchema extends BaseFieldSchema<TRenderContext, TFormValue> = BaseFieldSchema<TRenderContext, TFormValue>
>(name: FieldPath<TFormValue>) => {
    const schemaForm = useContext(SchemaFormContext);

    if (!schemaForm) {
        throw new Error('useFieldSchema must be used within a SchemaForm component');
    }

    const { fields } = schemaForm;

    const field = useMemo(() => {
        const field = get(fields, name);
        return field;
    }, [fields, name]);

    return field as TSchema & { type?: string | null };
};
