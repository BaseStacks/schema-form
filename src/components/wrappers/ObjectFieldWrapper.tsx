import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { useFieldComponent } from '../../hooks/useFieldComponent';
import { ObjectFieldProps, ObjectFieldSchema } from '../../types';
import { JsonFormFieldProps } from '../JsonFormField';

export interface ObjectFieldWrapperProps<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TContext
> {
    form: UseFormReturn<TFormValues>;
    name: string;
    field: ObjectFieldSchema<TFieldValue, TContext, TFormValues>;
    context?: TContext;
    renderChild: (props: JsonFormFieldProps<TFormValues>) => React.ReactNode;
}

export function ObjectFieldWrapper<
    TFieldValue extends FieldValues,
    TFormValues extends FieldValues,
    TContext
>({
    name,
    field,
    renderChild,
    context
}: ObjectFieldWrapperProps<TFieldValue, TFormValues, TContext>) {
    const FieldComponent = useFieldComponent<ObjectFieldProps<TContext, TFieldValue, TFormValues>>('object');

    return (
        <FieldComponent
            key={name}
            field={field}
            context={context}
            name={name}
        >
            {Object.entries(field.properties!).map(([key]) => {
                const childFieldName = `${name}.${key}` as FieldPath<TFormValues>;
                return renderChild({
                    name: childFieldName,
                    context: context
                });
            })}
        </FieldComponent>
    );
};
