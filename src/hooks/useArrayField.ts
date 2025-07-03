import { useMemo, useCallback } from 'react';
import { FieldValues, FieldPath, useFieldArray, FieldArrayPath, UseFieldArrayProps, UseFieldArrayReturn, useFormState } from 'react-hook-form';
import { ArrayFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';
import { FieldError } from 'react-hook-form';

export interface UseArrayFieldReturn<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TItem extends FieldValues = FieldValues
> {
    readonly array: UseFieldArrayReturn<TFormValue>;
    readonly schema: ArrayFieldSchema<TRenderContext, TFormValue, TItem[]>;
    readonly name: string;
    readonly title?: string | React.ReactNode | null;
    readonly description?: string | React.ReactNode | null;
    readonly placeholder?: string | React.ReactNode | null;
    readonly canAddItem: boolean;
    readonly canRemoveItem: boolean;
    readonly getItemName: (index: number) => FieldPath<TFormValue>;
    readonly renderContext: TRenderContext;
    readonly error?: FieldError;
    readonly required?: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
}

/**
 * A custom hook for managing array fields in a form using `react-hook-form`.
 * This hook provides utilities for handling array-based form fields, including
 * schema merging, validation rules, and dynamic item management.
 *
 * @param baseSchema - Optional object that contains validation rules
 * for the array field, which will be merged with the schema from the field context.
 *
 * @returns an {@link UseArrayFieldReturn}
 */
export const useArrayField = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TItem extends FieldValues = FieldValues
>(baseSchema?: UseFieldArrayProps<TFormValue>['rules']): UseArrayFieldReturn<TRenderContext, TFormValue, TItem> => {
    const { schema, name, rules, renderContext } = useFieldContext<TRenderContext, TFormValue>();

    const arraySchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as ArrayFieldSchema<TRenderContext, TFormValue, TItem[]>), [baseSchema, schema]);

    // Use fieldArray from react-hook-form to manage the array items
    const array = useFieldArray<TFormValue>({
        name: name as FieldArrayPath<TFormValue>,
        rules
    });

    const { errors } = useFormState({
        name: name as FieldPath<TFormValue>
    });

    const error = errors[name] as FieldError;

    const { fields } = array;

    // Get min/max items constraints from field
    const minItems = rules.stats?.minLength;
    const maxItems = rules.stats?.maxLength;

    // Check if we can add more items
    const canAddItem = !maxItems || fields.length < maxItems;
    // Check if we can remove items
    const canRemoveItem = minItems ? fields.length > minItems : true;

    const getItemName = useCallback((index: number) => {
        return `${name}[${index}]` as FieldPath<TFormValue>;
    }, [name]);

    return {
        array,
        schema: arraySchema,
        name,
        title: arraySchema.title,
        description: arraySchema.description,
        placeholder: arraySchema.placeholder,
        canAddItem,
        canRemoveItem,
        getItemName,
        renderContext,
        error,
        required: rules.stats?.required,
        minLength: minItems,
        maxLength: maxItems
    };
};
