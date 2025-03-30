import { useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { ObjectFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseObjectFieldReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues, TFieldValue extends FieldValues = FieldValues> {
    readonly schema: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly renderContext: TRenderContext;
    readonly fields: FieldPath<TFormValue>[];
}

/**
 * A custom hook that provides utilities for working with an object field schema
 * in a form context. This hook extracts schema details, field names, and other
 * metadata for rendering and managing object fields.
 *
 * @returns An {@link UseObjectFieldReturn} object containing:
 * - `schema`: The object field schema.
 * - `name`: The name of the field.
 * - `title`: The title of the object field.
 * - `description`: The description of the object field.
 * - `placeholder`: The placeholder for the object field.
 * - `renderContext`: The render context for the field.
 * - `fields`: An array of field paths for the properties of the object field.
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
