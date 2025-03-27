import { useMemo } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { ObjectFieldSchema, RenderContext } from "../types";
import { useFieldContext } from "./useFieldContext";

export interface WithObjectReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues, TFieldValue extends FieldValues = FieldValues> {
    readonly schema: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly renderContext: TRenderContext;
    readonly fields: FieldPath<TFormValue>[];
}

export const useObject = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues = FieldValues
>(): WithObjectReturn<TRenderContext, TFormValue, TFieldValue> => {
    const { schema, name, renderContext } = useFieldContext<TRenderContext, TFormValue>();

    const objectSchema = schema as ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;

    const { title, description, placeholder } = objectSchema;

    const fields = useMemo(() => {
        return Object.keys(objectSchema.properties!).map((key) => {
            return `${name}.${key}` as FieldPath<TFormValue>;
        });
    }, [objectSchema]);

    return {
        schema: objectSchema,
        name,
        title,
        description,
        placeholder,
        renderContext,
        fields,
    }
}