import { useMemo } from 'react';
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, RegisterOptions, UseFormStateReturn, useController as _useController } from 'react-hook-form';
import { GenericFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

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

/**
 * A custom hook that provides a controller for managing form fields with schema-based validation.
 *
 * @template TRenderContext - The type of the render context, extending `RenderContext`.
 * @template TFormValue - The type of the form values, extending `FieldValues`.
 *
 * @param {RegisterOptions<TFormValue>} [baseSchema] - Optional base schema for the field, which can include validation rules and other properties.
 *
 * @returns {UseControllerReturn<TRenderContext, TFormValue>} An {@link UseControllerReturn} object containing the field controller, schema, and various field-related properties:
 * - `field`: The field's input props and methods for managing its state.
 * - `fieldState`: The state of the field, including validation errors.
 * - `formState`: The state of the entire form.
 * - `schema`: The merged schema combining `baseSchema` and the schema from the field context.
 * - `name`: The name of the field.
 * - `title`: The title of the field, derived from the schema.
 * - `description`: The description of the field, derived from the schema.
 * - `placeholder`: The placeholder text for the field, derived from the schema.
 * - `renderContext`: The render context for the field.
 * - `error`: The error message for the field, if any.
 * - `required`: Whether the field is required, derived from the validation rules.
 * - `min`: The minimum value for the field, derived from the validation rules.
 * - `max`: The maximum value for the field, derived from the validation rules.
 * - `minLength`: The minimum length for the field, derived from the validation rules.
 * - `maxLength`: The maximum length for the field, derived from the validation rules.
 * - `pattern`: The regex pattern for the field, derived from the validation rules.
 */
export const useController = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
        baseSchema?: RegisterOptions<TFormValue>
    ): UseControllerReturn<TRenderContext, TFormValue> => {
    const { schema, name, rules, renderContext, error } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [baseSchema, schema]);

    const { title, description, placeholder } = genericSchema;

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
        required: rules.stats.required,
        min: rules.stats.min,
        max: rules.stats.max,
        minLength: rules.stats.minLength,
        maxLength: rules.stats.maxLength,
        pattern: rules.stats.pattern
    };
};
