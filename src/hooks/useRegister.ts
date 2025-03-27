import { useMemo } from "react";
import { FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn, useController as _useController } from "react-hook-form";
import { GenericFieldSchema, RenderContext } from "../types";
import { getValidationStats } from "../utils/fieldUtils";
import { useFieldContext } from "./useFieldContext";
import { useFieldRules } from "./useFieldRules";

export interface WithRegisterReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues> {
    readonly register: UseFormRegisterReturn;
    readonly schema: GenericFieldSchema<TRenderContext, TFormValue>;
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly renderContext: TRenderContext;
    readonly error?: any;
    readonly required?: boolean;
    readonly min?: number;
    readonly max?: number;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: RegExp;
}

export const useRegister = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
    baseSchema?: RegisterOptions<TFormValue>
): WithRegisterReturn<TRenderContext, TFormValue> => {
    const { form, schema, name, renderContext, error } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [schema]);

    const { title, description, placeholder } = genericSchema;

    const rules = useFieldRules(genericSchema);

    const register = useMemo(() => {
        return form.register(name as FieldPath<TFormValue>, Object.assign(genericSchema, rules));
    }, [form, name, rules, genericSchema]);

    const validationStats = useMemo(() => getValidationStats(rules), [rules]);

    return {
        register,
        schema: genericSchema,
        name,
        title,
        description,
        placeholder,
        renderContext,
        error,
        required: !!validationStats?.required,
        min: validationStats?.min,
        max: validationStats?.max,
        minLength: validationStats?.minLength,
        maxLength: validationStats?.maxLength,
        pattern: validationStats?.pattern
    }
}