import { FieldValues } from 'react-hook-form';
import { BaseFieldSchema, RenderContext } from '../types';
import { useMemo } from 'react';
import { useSchemaForm } from './useSchemaForm';

export const useFieldContext = <TFormValue extends FieldValues>(field: BaseFieldSchema<RenderContext, TFormValue>) => {
    const { renderContext: formContext } = useSchemaForm();
    const fieldContext = useMemo(() => Object.assign({}, formContext, field.renderContext), [formContext, field.renderContext]);
    return fieldContext;
};
