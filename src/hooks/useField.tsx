import { useMemo } from 'react';
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn, useController } from 'react-hook-form';
import { GenericFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseFieldReturn<
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

/**
 * A custom hook that provides a controller for managing form fields with schema-based validation.
 *
 * @param baseSchema - Optional, which can include validation rules and other properties.
 *
 * @returns see {@link UseFieldReturn}
 */
export const useField = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
        baseSchema?: RegisterOptions<TFormValue>
    ): UseFieldReturn<TRenderContext, TFormValue> => {
    const { schema, name, rules, renderContext } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [baseSchema, schema]);

    const { title, description, placeholder } = genericSchema;

    const { field, fieldState, formState } = useController({
        name: name as FieldPath<TFormValue>,
        rules: {
            ...genericSchema,
            ...rules,
        },
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
        error: fieldState.error,
        required: rules.stats.required,
        min: rules.stats.min,
        max: rules.stats.max,
        minLength: rules.stats.minLength,
        maxLength: rules.stats.maxLength,
        pattern: rules.stats.pattern
    };
};
