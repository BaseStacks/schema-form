import { useContext } from 'react';
import { SchemaFormContext } from '../contexts';
import { RenderContext, SchemaFormContextType } from '../types';
import { FieldValues } from 'react-hook-form';

export const useSchemaForm = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>() => {
    const schemaForm = useContext(SchemaFormContext) as SchemaFormContextType<TRenderContext, TFormValue>;
    if (!schemaForm) {
        throw new Error('useSchemaForm must be used within a SchemaForm');
    }

    return schemaForm;
};
