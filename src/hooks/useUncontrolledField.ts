import { useMemo } from 'react';
import { FieldPath, FieldValues, RegisterOptions, UseFormRegisterReturn } from 'react-hook-form';
import { GenericFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseUncontrolledFieldReturn<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues> {
    readonly field: UseFormRegisterReturn;
    readonly schema: GenericFieldSchema<TRenderContext, TFormValue>;
    readonly name: string;
    readonly title?: string | React.ReactNode | null;
    readonly description?: string | React.ReactNode | null;
    readonly placeholder?: string | React.ReactNode | null;
    readonly renderContext: TRenderContext;
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
 * and uses it to field the field with React Hook Form.
 * 
 * @param baseSchema - Optional, which can include validation rules and other properties.
 * 
 * @returns see {@link UseUncontrolledFieldReturn}
 */
export const useUncontrolledField = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(
        baseSchema?: RegisterOptions<TFormValue>
    ): UseUncontrolledFieldReturn<TRenderContext, TFormValue> => {
    const { form, schema, name, rules, renderContext } = useFieldContext<TRenderContext, TFormValue>();

    const genericSchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as GenericFieldSchema<TRenderContext, TFormValue>), [baseSchema, schema]);

    const { title, description, placeholder } = genericSchema;

    const field = useMemo(() => {
        const registerOptions = { ...genericSchema, ...rules } as RegisterOptions<TFormValue>;
        return form.register(name as FieldPath<TFormValue>, registerOptions);
    }, [form, name, rules, genericSchema]);

    return {
        field,
        schema: genericSchema,
        name,
        title,
        description,
        placeholder,
        renderContext,
        required: rules.stats.required,
        min: rules.stats.min,
        max: rules.stats.max,
        minLength: rules.stats.minLength,
        maxLength: rules.stats.maxLength,
        pattern: rules.stats.pattern
    };
};
