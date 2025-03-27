import { ArrayPath, FieldPath, FieldValues, useFieldArray, UseFieldArrayProps } from 'react-hook-form';
import { WithArrayProps, FieldHocProps, RenderContext, ArrayFieldSchema } from '../../types';
import { SchemaFormField } from '../SchemaFormField';
import { useCallback, useMemo } from 'react';
import { getValidationStats } from '../../utils/fieldUtils';
import { useFieldRules } from '../../hooks/useFieldRules';

export interface WithArrayHocProps<
    TRenderContext extends RenderContext,
    TFormValue extends FieldValues,
    TFieldValue extends FieldValues
> extends Omit<FieldHocProps<TRenderContext, TFormValue, TFieldValue>, 'name'> {
    readonly name: ArrayPath<TFormValue>;
}

export function withArray<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithArrayProps<TRenderContext, any, any>>,
    baseRenderContext?: Partial<TRenderContext>,
    baseSchema?: UseFieldArrayProps<any>['rules']
) {
    return function ArrayFieldHoc<TFieldValue extends FieldValues, TFormValue extends FieldValues>({
        form,
        schema,
        name,
        renderContext,
        error
    }: WithArrayHocProps<TRenderContext, TFormValue, TFieldValue>) {
        const arraySchema = useMemo(() => ({
            ...baseSchema,
            ...schema
        } as ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>), [schema]);

        const rules = useFieldRules(arraySchema);

        // Use fieldArray from react-hook-form to manage the array items
        const array = useFieldArray({
            name,
            control: form.control,
            rules
        });

        const validationStats = useMemo(() => getValidationStats(rules), [rules]);

        const { fields } = array;

        // Get min/max items constraints from field
        const minItems = validationStats?.minLength;
        const maxItems = validationStats?.maxLength;

        // Check if we can add more items
        const canAddItem = !maxItems || fields.length < maxItems;
        // Check if we can remove items
        const canRemoveItem = minItems ? fields.length > minItems : true;

        const renderItem = useCallback((index: number) => {
            const key = `${name}[${index}]` as FieldPath<TFormValue>;
            return <SchemaFormField key={key} name={key} renderContext={renderContext} />;
        }, [name, renderContext]); // Add fields as dependency


        const fieldRenderContext = useMemo(() => Object.assign({}, baseRenderContext, renderContext), [renderContext]);

        return (
            <Component
                array={array}
                schema={arraySchema}
                name={name}
                title={arraySchema.title}
                description={arraySchema.description}
                placeholder={arraySchema.placeholder}
                canAddItem={canAddItem}
                canRemoveItem={canRemoveItem}
                renderItem={renderItem}
                renderContext={fieldRenderContext}
                error={error}
                required={validationStats?.required}
                minLength={minItems}
                maxLength={maxItems}
            />
        );
    };
};

