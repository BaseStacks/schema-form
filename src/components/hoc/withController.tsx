import { Controller, FieldValues } from 'react-hook-form';
import { FieldWithControllerProps, FieldWrapperProps, RenderContext } from '../../types';

interface FieldWithControllerWrapperProps<TFormValue extends FieldValues, TRenderContext extends RenderContext> extends FieldWrapperProps<TFormValue, TRenderContext> {
}

export function withController<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<FieldWithControllerProps<TRenderContext, any>>
) {
    return function FieldWithController<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        readOnly,
        disabled,
        error,
        renderContext
    }: FieldWithControllerWrapperProps<TFormValue, TRenderContext>) {
        const { title, description, placeholder } = schema;

        return (
            <Controller
                name={name}
                control={form.control}
                rules={schema}
                shouldUnregister={schema.shouldUnregister}
                disabled={disabled}
                defaultValue={schema.value}
                render={(controller) => (
                    <Component
                        field={controller.field}
                        fieldState={controller.fieldState}
                        formState={controller.formState}
                        name={name}
                        title={title}
                        description={description}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        disabled={disabled}
                        renderContext={renderContext}
                        error={error}
                    />
                )}
            />
        );
    };
};

