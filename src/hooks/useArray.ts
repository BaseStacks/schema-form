import { useMemo, useCallback } from 'react';
import { FieldValues, FieldPath, useFieldArray, FieldArrayPath, UseFieldArrayProps, UseFieldArrayReturn, useFormState } from 'react-hook-form';
import { ArrayFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseArrayReturn<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TItem extends FieldValues = FieldValues
> {
    readonly array: UseFieldArrayReturn<TFormValue>;
    readonly schema: ArrayFieldSchema<TRenderContext, TFormValue, TItem[]>;
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly canAddItem: boolean;
    readonly canRemoveItem: boolean;
    readonly getItemName: (index: number) => FieldPath<TFormValue>;
    readonly renderContext: TRenderContext;
    readonly error?: any;
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
 * @returns An {@link UseArrayReturn} object containing:
 * - `array`: The `useFieldArray` instance for managing array items.
 * - `schema`: The merged schema for the array field.
 * - `name`: The name of the array field.
 * - `title`: The title of the array field from the schema.
 * - `description`: The description of the array field from the schema.
 * - `placeholder`: The placeholder for the array field from the schema.
 * - `canAddItem`: A boolean indicating if more items can be added to the array.
 * - `canRemoveItem`: A boolean indicating if items can be removed from the array.
 * - `getItemName`: A function to get the name of an item in the array by index.
 * - `renderContext`: The render context for the field.
 * - `error`: The error state of the field.
 * - `required`: A boolean indicating if the field is required.
 * - `minLength`: The minimum number of items allowed in the array.
 * - `maxLength`: The maximum number of items allowed in the array.
 */
export const useArray = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TItem extends FieldValues = FieldValues
>(baseSchema?: UseFieldArrayProps<any>['rules']): UseArrayReturn<TRenderContext, TFormValue, TItem> => {
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

    const error = errors[name];

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
