import { FieldValues } from 'react-hook-form';
import { RenderContext, SchemaFieldContextType } from '../types';
import { useContext } from 'react';
import { SchemaFieldContext } from '../contexts';

export const useFieldContext = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>() => {
    const fieldContext = useContext<SchemaFieldContextType<TRenderContext, TFormValue>>(SchemaFieldContext);
    if (!fieldContext) {
        throw new Error('useFieldContext must be used within a SchemaFieldContext.Provider');
    }

    return fieldContext;
};
