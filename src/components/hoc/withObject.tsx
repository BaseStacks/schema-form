import { FieldPath, FieldValues } from 'react-hook-form';
import { WithObjectProps, FieldHocProps, RenderContext, ObjectFieldSchema } from '../../types';
import { SchemaFormField } from '../SchemaFormField';

export interface WithObjectHocProps<
    TRenderContext extends RenderContext,
    TFormValue extends FieldValues,
    TFieldValue extends FieldValues
> extends FieldHocProps<TRenderContext, TFormValue, TFieldValue> {
}

export function withObject<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithObjectProps<TRenderContext, any, any>>
) {
    return function ObjectFieldHoc<
        TFormValue extends FieldValues,
        TFieldValue extends FieldValues
    >({
        name,
        schema,
        renderContext
    }: WithObjectHocProps<TRenderContext, TFormValue, TFieldValue>) {
        const objectSchema = schema as ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;

        const { title, description, placeholder } = objectSchema;

        return (
            <Component
                key={name}
                schema={objectSchema}
                name={name}
                title={title}
                description={description}
                placeholder={placeholder}
                renderContext={renderContext}
            >
                {Object.entries(objectSchema.properties!).map(([key]) => {
                    const childFieldName = `${name}.${key}` as FieldPath<TFormValue>;
                    return <SchemaFormField key={childFieldName} name={childFieldName} renderContext={renderContext} />;
                })}
            </Component>
        );
    };
};

