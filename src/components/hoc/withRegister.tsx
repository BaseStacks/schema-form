import { FieldValues } from 'react-hook-form';
import { FieldWithRegisterProps, FieldWrapperProps, RenderContext } from '../../types';
import { useFieldRegister } from '../../hooks/useFieldRegister';

interface FieldWithRegisterWrapperProps<TFormValue extends FieldValues, TRenderContext extends RenderContext> extends FieldWrapperProps<TFormValue, TRenderContext> {
}

export function withRegister<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<FieldWithRegisterProps<TRenderContext>>
) {
    return function FieldWithRegister<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        readOnly,
        disabled,
        error,
        renderContext
    }: FieldWithRegisterWrapperProps<TFormValue, TRenderContext>) {
        const { title, description, placeholder } = schema;

        // Get only the necessary props from register
        const register = useFieldRegister(form, name, schema);

        return (
            <Component
                register={register}
                name={name}
                title={title}
                description={description}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                renderContext={renderContext}
                error={error}
            />
        );
    };
};

