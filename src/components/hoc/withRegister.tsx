import { FieldValues } from 'react-hook-form';
import { FieldWithRegisterProps, FieldHocProps, RenderContext } from '../../types';
import { useFieldRegister } from '../../hooks/useFieldRegister';

interface FieldWithRegisterWrapperProps<TRenderContext extends RenderContext, TFormValue extends FieldValues> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withRegister<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<FieldWithRegisterProps<TRenderContext>>
) {
    return function FieldWithRegister<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: FieldWithRegisterWrapperProps<TRenderContext, TFormValue>) {
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
                renderContext={renderContext}
                error={error}
            />
        );
    };
};

