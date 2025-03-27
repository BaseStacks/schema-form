import { useContext, useMemo } from 'react';
import { FieldPath, FieldValues, get } from 'react-hook-form';
import { SchemaFormContext } from '../contexts';
import { BaseFieldSchema, RenderContext } from '../types';

interface PathItem {
    readonly name: string;
}

export const useFieldSchema = <
    TFormValue extends FieldValues,
    TRenderContext extends RenderContext,
    TSchema extends BaseFieldSchema<TRenderContext, TFormValue> = BaseFieldSchema<TRenderContext, TFormValue>
>(name: FieldPath<TFormValue>) => {
    const schemaForm = useContext(SchemaFormContext);

    if (!schemaForm) {
        throw new Error('useFieldSchema must be used within a SchemaForm component');
    }

    const { fields } = schemaForm;

    const field = useMemo(() => {
        const pathParts = name.split('.');

        const pathItems: PathItem[] = [];

        for (const pathPart of pathParts) {
            let name = '';

            const isArrayItem = pathPart.endsWith(']');
            if (isArrayItem) {
                const arrayName = isArrayItem ? pathPart.split('[')[0] : pathPart;
                name += isArrayItem ? `${arrayName}.items` : pathPart;
            }
            else {
                const parent = pathItems[pathItems.length - 1];
                if (parent) {
                    name += 'properties.';
                }

                name += pathPart;
            }

            pathItems.push({
                name
            });
        }

        const path = pathItems.map((part) => part.name).join('.');

        const field = get(fields, path);
        return field;
    }, [fields, name]);

    return field as TSchema;
};
