import { useMemo } from 'react';
import { FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn } from 'react-hook-form';
import { GenericFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

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

/**
 * A hook that registers a field with the form and provides access to field properties and validation rules.
 * 
 * This hook combines the base schema provided as a parameter with the schema from the field context,
 * and uses it to register the field with React Hook Form.
 * 
 * @template TRenderContext - The render context type, extends RenderContext
 * @template TFormValue - The form values type, extends FieldValues
 * 
 * @param {RegisterOptions<TFormValue>} [baseSchema] - Optional base schema to override or extend the context schema
 * 
 * @returns {WithRegisterReturn<TRenderContext, TFormValue>} An {@link WithRegisterReturn} object containing:
 *   - register: The React Hook Form register function result
 *   - schema: The combined field schema
 *   - name: The field name
 *   - title: The field title
 *   - description: The field description
 *   - placeholder: The field placeholder
 *   - renderContext: The render context
 *   - error: Any validation error
 *   - required: Whether the field is required
 *   - min/max: Minimum and maximum numeric values
 *   - minLength/maxLength: Minimum and maximum string lengths
 *   - pattern: Validation pattern
 */
export const useRegister = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
        baseSchema?: RegisterOptions<TFormValue>
    ): WithRegisterReturn<TRenderContext, TFormValue> => {
    const { form, schema, name, rules, renderContext, error } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [baseSchema, schema]);

    const { title, description, placeholder } = genericSchema;

    const register = useMemo(() => {
        return form.register(name as FieldPath<TFormValue>, Object.assign(genericSchema, rules));
    }, [form, name, rules, genericSchema]);

    return {
        register,
        schema: genericSchema,
        name,
        title,
        description,
        placeholder,
        renderContext,
        error,
        required: !!rules?.required,
        min: rules.stats.min,
        max: rules.stats.max,
        minLength: rules.stats.minLength,
        maxLength: rules.stats.maxLength,
        pattern: rules.stats.pattern
    };
};
