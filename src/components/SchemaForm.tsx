import { useCallback, useMemo } from 'react';
import { FieldValues, FormProvider, SubmitHandler, useForm, UseFormProps, useWatch } from 'react-hook-form';
import { SchemaFormContextType, SchemaFormRenderProps, RenderContext, ValidationSchema, CreateValidationSchema, FieldSchemas } from '../types';
import { SchemaFormField } from './SchemaFormField';
import { useGlobalContext } from '../hooks/useGlobalContext';
import { createResolver } from '../utils/resolverUtils';
import { SchemaFormContext } from '../contexts';

export type SchemaFormProps<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext> = UseFormProps<TFormValue> & {
    readonly schema?: ValidationSchema;
    readonly schemaOptions?: any;
    readonly resolverOptions?: any;
    readonly createSchema?: CreateValidationSchema<TFormValue>;

    readonly fields: FieldSchemas<TFormValue, TRenderContext>;
    readonly renderContext?: TRenderContext;
    readonly onSubmit?: SubmitHandler<TFormValue>;
    readonly children?: (innerProps: SchemaFormRenderProps<TRenderContext, TFormValue>) => React.ReactNode;
};

/**
 * Main Schema Form component
 */
export function SchemaForm<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext>({
    schema,
    schemaOptions,
    createSchema,
    resolverOptions,
    fields,
    renderContext,
    children,
    onSubmit,
    ...formProps
}: SchemaFormProps<TFormValue, TRenderContext>) {
    const {
        components,
        validationResolver: globalResolverType,
        renderContext: globalRenderContext,
    } = useGlobalContext();

    const resolver = useMemo(() => {
        if (formProps.resolver) {
            return formProps.resolver;
        }

        return createResolver<TFormValue>({
            resolverType: globalResolverType,
            resolverOptions,
            schema,
            schemaOptions,
            createSchema
        });
    }, [formProps.resolver, globalResolverType, resolverOptions, schema, schemaOptions, createSchema]);

    // Initialize form with Ajv resolver for direct JSON Schema validation
    const form = useForm({
        ...formProps,
        resolver
    });

    useWatch({ control: form.control });

    const mergedRenderContext = useMemo(() => Object.assign({}, globalRenderContext, renderContext), [globalRenderContext, renderContext]);

    const childrenElements = useMemo(() => {
        return Object.entries(fields).map(([fieldName]) => (
            <SchemaFormField key={fieldName} name={fieldName} />
        ));
    }, [fields]);

    const handleSubmit = useCallback((data: TFormValue, event?: React.BaseSyntheticEvent): unknown | Promise<unknown> => {
        if (onSubmit) {
            return onSubmit(data, event);
        }
    }, [onSubmit]);

    const innerProps: SchemaFormRenderProps<TRenderContext, TFormValue> = {
        form,
        fields,
        onSubmit: handleSubmit,
        children: childrenElements,
        renderContext: mergedRenderContext
    };

    const schemaForm: SchemaFormContextType<TFormValue, TRenderContext> = {
        form,
        fields,
        renderContext: mergedRenderContext,
    };

    return (
        <SchemaFormContext.Provider value={schemaForm}>
            <FormProvider {...form}>
                {children ? children(innerProps) : <components.Form {...innerProps} />}
            </FormProvider>
        </SchemaFormContext.Provider>
    );
}
