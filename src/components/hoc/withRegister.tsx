import { FieldValues } from 'react-hook-form';
import { WithRegisterProps, FieldHocProps, RenderContext } from '../../types';
import { useFieldRegister } from '../../hooks/useFieldRegister';

interface WithRegisterHocProps<TRenderContext extends RenderContext, TFormValue extends FieldValues> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withRegister<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithRegisterProps<TRenderContext>>
) {
    return function WithRegisterHoc<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: WithRegisterHocProps<TRenderContext, TFormValue>) {
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

