import { useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { ObjectFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

/**
 * Return type for the useObjectField hook which manages object fields in forms.
 * 
 * @property schema - The schema definition for this object field.
 * @property name - The field name in the form.
 * @property title - Optional title to display for the field.
 * @property description - Optional description text for the field.
 * @property placeholder - Optional placeholder text for the field.
 * @property fields - Array of nested field paths contained within this object field.
 * @property renderContext - The context object used for rendering this field.
 */
export interface UseObjectFieldReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues, TFieldValue extends FieldValues = FieldValues> {
    readonly schema: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
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
