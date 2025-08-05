import { useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { ObjectFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseObjectFieldReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues, TFieldValue extends FieldValues = FieldValues> {
    readonly schema: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;
    readonly name: string;
    readonly title?: string | React.ReactNode | null;
    readonly description?: string | React.ReactNode | null;
    readonly placeholder?: string;
    
    // The nested field names of the object schema
    readonly fields: FieldPath<TFormValue>[];
    readonly renderContext: TRenderContext;
}

/**
 * A custom hook that provides utilities for working with an object field schema
 * in a form context. This hook extracts schema details, field names, and other
 * metadata for rendering and managing object fields.
 *
 * @returns see {@link UseObjectFieldReturn}
 */
export const useObjectField = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues = FieldValues
>(): UseObjectFieldReturn<TRenderContext, TFormValue, TFieldValue> => {
    const { schema, name, renderContext } = useFieldContext<TRenderContext, TFormValue>();

    const objectSchema = schema as ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;

    const { title, description, placeholder } = objectSchema;

    const fields = useMemo(() => {
        if(!objectSchema.properties) {
            return [];
        }
        
        return Object.keys(objectSchema.properties).map((key) => {
            return `${name}.${key}` as FieldPath<TFormValue>;
        });
    }, [name, objectSchema.properties]);

    return {
        schema: objectSchema,
        name,
        title,
        description,
        placeholder,
        renderContext,
        fields,
    };
};
