import { useMemo } from "react";
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn, useController as _useController } from "react-hook-form";
import { GenericFieldSchema, RenderContext } from "../types";
import { getValidationStats } from "../utils/fieldUtils";
import { useFieldContext } from "./useFieldContext";
import { useFieldRules } from "./useFieldRules";

interface UseControllerReturn<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> {
    readonly field: ControllerRenderProps<TFormValue>;
    readonly fieldState: ControllerFieldState;
    readonly formState: UseFormStateReturn<TFormValue>;
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

export const useController = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
    baseSchema?: RegisterOptions<TFormValue>
): UseControllerReturn<TRenderContext, TFormValue> => {
    const { schema, name, renderContext, error } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [schema]);

    const { title, description, placeholder } = genericSchema;

    const rules = useFieldRules(genericSchema);
    const validationStats = useMemo(() => getValidationStats(rules), [rules]);


    const { field, fieldState, formState } = _useController({
        name: name as FieldPath<TFormValue>,
        rules,
        shouldUnregister: genericSchema.shouldUnregister,
        defaultValue: genericSchema.value
    });

    return {
        field,
        fieldState,
        formState,
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