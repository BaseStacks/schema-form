import { useMemo, useCallback } from 'react';
import { FieldValues, FieldPath, useFieldArray, FieldArrayPath, UseFieldArrayProps, UseFieldArrayReturn } from 'react-hook-form';
import { ArrayFieldSchema, RenderContext } from '../types';
import { useFieldContext } from './useFieldContext';

export interface UseArrayReturn<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues = FieldValues
> {
    readonly array: UseFieldArrayReturn<TFormValue>;
    readonly schema: ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>;
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

export const useArray = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues = FieldValues
>(baseSchema?: UseFieldArrayProps<any>['rules']): UseArrayReturn<TRenderContext, TFormValue, TFieldValue> => {
    const { schema, name, rules, renderContext, error } = useFieldContext<TRenderContext, TFormValue>();

    const arraySchema = useMemo(() => ({
        ...baseSchema,
        ...schema
    } as ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>), [baseSchema, schema]);

    // Use fieldArray from react-hook-form to manage the array items
    const array = useFieldArray<TFormValue>({
        name: name as FieldArrayPath<TFormValue>,
        rules
    });

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
