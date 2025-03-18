import { FieldPath, FieldValues } from 'react-hook-form';
import { useFieldComponent } from '../../hooks/useFieldComponent';
import { FieldWrapperProps, ObjectFieldProps, ObjectFieldSchema } from '../../types';
import { SchemaFormFieldProps } from '../SchemaFormField';

export interface ObjectFieldWrapperProps<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TRenderContext
> extends FieldWrapperProps<TFormValues, TRenderContext> {
    readonly field: ObjectFieldSchema<TFieldValue, TRenderContext, TFormValues>;
    readonly renderChild: (props: SchemaFormFieldProps<TFormValues>) => React.ReactNode;
}

export function ObjectFieldWrapper<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TRenderContext
>({
    name,
    field,
    renderChild,
    renderContext
}: ObjectFieldWrapperProps<TFieldValue, TFormValues, TRenderContext>) {
    const FieldComponent = useFieldComponent<ObjectFieldProps<TRenderContext, TFieldValue, TFormValues>>('object');

    return (
        <FieldComponent
            key={name}
            field={field}
            renderContext={renderContext}
            name={name}
        >
            {Object.entries(field.properties!).map(([key]) => {
                const childFieldName = `${name}.${key}` as FieldPath<TFormValues>;
                return renderChild({
                    name: childFieldName,
                    renderContext
                });
            })}
        </FieldComponent>
    );
};
