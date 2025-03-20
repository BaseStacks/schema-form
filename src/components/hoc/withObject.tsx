import { FieldPath, FieldValues } from 'react-hook-form';
import { FieldWithObjectProps, FieldWrapperProps, ObjectFieldSchema, RenderContext } from '../../types';
import { SchemaFormField } from '../SchemaFormField';

export interface FieldWithObjectWrapperProps<
    TFieldValue extends FieldValues,
    TFormValue extends FieldValues,
    TRenderContext extends RenderContext
> extends FieldWrapperProps<TFormValue, TRenderContext> {
    readonly schema: ObjectFieldSchema<TFieldValue, TRenderContext, TFormValue>;
}

export function withObject<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<FieldWithObjectProps<TRenderContext, any, any>>
) {
    return function ObjectFieldWrapper<
        TFieldValue extends FieldValues,
        TFormValue extends FieldValues
    >({
        name,
        schema,
        renderContext
    }: FieldWithObjectWrapperProps<TFieldValue, TFormValue, TRenderContext>) {
        const { title, description, placeholder } = schema;

        return (
            <Component
                key={name}
                schema={schema}
                name={name}
                title={title}
                description={description}
                placeholder={placeholder}
                renderContext={renderContext}
            >
                {Object.entries(schema.properties!).map(([key]) => {
                    const childFieldName = `${name}.${key}` as FieldPath<TFormValue>;
                    return <SchemaFormField key={childFieldName} name={childFieldName} renderContext={renderContext} />;
                })}
            </Component>
        );
    };
};

