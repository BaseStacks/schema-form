import { Controller, FieldValues } from 'react-hook-form';
import { WithControllerProps, FieldHocProps, RenderContext } from '../../types';

interface WithControllerHocProps<TFormValue extends FieldValues, TRenderContext extends RenderContext> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withController<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithControllerProps<TRenderContext, any>>
) {
    return function ControllerFieldHoc<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: WithControllerHocProps<TFormValue, TRenderContext>) {
        const { title, description, placeholder } = schema;

        return (
            <Controller
                name={name}
                control={form.control}
                rules={schema}
                shouldUnregister={schema.shouldUnregister}
                defaultValue={schema.value}
                render={(controller) => (
                    <Component
                        schema={schema}
                        field={controller.field}
                        fieldState={controller.fieldState}
                        formState={controller.formState}
                        name={name}
                        title={title}
                        description={description}
                        placeholder={placeholder}
                        renderContext={renderContext}
                        error={error}
                    />
                )}
            />
        );
    };
};

