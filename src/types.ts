import { FieldArrayPath, FieldError, FieldPath, FieldValues, RegisterOptions, Resolver, ResolverOptions, SubmitHandler, UseFieldArrayProps, UseFieldArrayReturn, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';

export type RenderContext = Record<string, any>;

export type ValidationSchema = unknown;

export type ResolverType<T extends FieldValues = FieldValues> = (schema: any, schemaOptions?: any, resolverOptions?: any) => Resolver<T>;

export type CreateValidationSchema<T extends FieldValues = FieldValues> = (values: T, renderContext: RenderContext, options: ResolverOptions<T>) => ValidationSchema;

export type SelectOption<TValue = any, TRenderContext = RenderContext> = TRenderContext & {
    readonly value: TValue;
    readonly label: string;
};

export type SchemaFormRenderProps<TRenderContext = RenderContext, TFormValues extends FieldValues = FieldValues> = {
    readonly form: UseFormReturn<TFormValues>;
    readonly fields: FieldSchemas<TFormValues>;
    readonly onSubmit: SubmitHandler<TFormValues>;
    readonly defaultValues?: Partial<TFormValues>;
    readonly renderContext?: TRenderContext;
    readonly children: React.ReactNode;
};

export interface ValidationStats {
    readonly required?: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: string;
    readonly min?: number;
    readonly max?: number;
}

export type Message = string | React.ReactNode;

export type DefaultMessages = {
    readonly required?: Message;
    readonly minLength?: Message;
    readonly maxLength?: Message;
    readonly pattern?: Message;
    readonly min?: Message;
    readonly max?: Message;
};

export interface SchemaFormComponents {
    /** Form component used to render the form */
    readonly Form: React.ComponentType<SchemaFormRenderProps<RenderContext, GenericFieldProps>>;
    /** Map of field components by field type */
    readonly fields: {
        readonly [key: string]: React.ComponentType<GenericFieldProps<any> | ArrayFieldProps<any> | ObjectFieldProps<any>>;
    };
}

/**
 * Global context for the JSON form configuration
 */
export interface SchemaFormGlobalContextType {
    /** Component overrides for form and fields */
    readonly components?: SchemaFormComponents;
    /** Global render context */
    readonly renderContext?: RenderContext;
    /** Resolver type to use for schema validation */
    readonly validationResolver?: ResolverType<any>;
    /** Function to get default validation messages */
    readonly getDefaultMessages?: (validationStats: ValidationStats, field: BaseFieldSchema) => DefaultMessages;
}

/**
 * Context type for a specific JSON form instance
 */
export interface SchemaFormContextType<TFormValues extends FieldValues = FieldValues> {
    /** Form control object */
    readonly form: UseFormReturn<TFormValues>;
    /** Field schema definitions */
    readonly fields: FieldSchemas;
    /** Render context */
    readonly renderContext: unknown;
}

/**
 * Schema extension for fields with select options
 */
export interface FieldSchemaWithOption {
    /** Available options for selection */
    readonly options?: SelectOption[];
}

export interface FieldSchemaWithFormat {
    readonly format?: string;
};

export type BaseFieldSchema<
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues
> = {
    // Field information
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;

    /** Field status */
    readonly visible?: ConditionedRule<TFormValues>;
    readonly readOnly?: ConditionedRule<TFormValues>;
    readonly disabled?: ConditionedRule<TFormValues>;

    // Context and component overrides
    readonly renderContext?: TRenderContext;
};

export type GenericFieldSchema<
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues
> = RegisterOptions<TFormValues> & BaseFieldSchema<TRenderContext, TFormValues> & FieldSchemaWithOption & FieldSchemaWithFormat & {
    readonly type: string;
};

export type CustomFieldSchema<
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues
> = RegisterOptions<TFormValues> & BaseFieldSchema<TRenderContext, TFormValues> & FieldSchemaWithOption & FieldSchemaWithFormat & {
    readonly type?: null;
    readonly Component: React.ComponentType<GenericFieldProps<TRenderContext, TFormValues>>;
};

export type ArrayFieldSchema<
    TFieldValue extends FieldValues = FieldValues,
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues,
> = BaseFieldSchema<TRenderContext, TFormValues> & UseFieldArrayProps<TFormValues>['rules'] & {
    /** Field type */
    readonly type: 'array';
    /** Schema for individual items in the array */
    readonly items: ObjectFieldSchema<TFieldValue, TRenderContext, TFormValues>;
    readonly uniqueItems?: true;
};

export type ObjectFieldProperties<
    TProperties extends FieldValues = FieldValues,
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues,
> = {
        readonly [K in keyof TProperties]:
        | GenericFieldSchema<TRenderContext, TFormValues>
        | ObjectFieldSchema<TProperties[K] extends FieldValues ? TProperties[K] : any, TRenderContext, TFormValues>
        | ArrayFieldSchema<TProperties[K] extends FieldValues ? TProperties[K] : any, TRenderContext, TFormValues>;
    };

export type ObjectFieldSchema<
    TFieldValue extends FieldValues = FieldValues,
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues
> = BaseFieldSchema<TRenderContext, TFormValues> & {
    readonly type: 'object';
    readonly properties: ObjectFieldProperties<TFieldValue>;
};

export type FieldSchemas<
    TFormValues extends FieldValues = FieldValues,
    TRenderContext = RenderContext
> = {
        readonly [K in keyof TFormValues]:
        | CustomFieldSchema<TRenderContext, TFormValues>
        | GenericFieldSchema<TRenderContext, TFormValues>
        | ObjectFieldSchema<TFormValues[K] extends FieldValues ? TFormValues[K] : any, TRenderContext, TFormValues>
        | ArrayFieldSchema<TFormValues[K] extends FieldValues ? TFormValues[K] : any, TRenderContext, TFormValues>;
    };

export interface BaseFieldProps<TRenderContext> {
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly renderContext: TRenderContext;
    readonly error?: FieldError;
};

export type GenericFieldProps<
    TRenderContext = RenderContext,
    TFormValues extends FieldValues = FieldValues
> = BaseFieldProps<TRenderContext> & UseFormRegisterReturn<FieldPath<TFormValues>> & {
    // Field options
    readonly options?: SelectOption[];
};

export type ArrayFieldProps<
    TRenderContext = unknown,
    TFieldValue extends FieldValues = FieldValues,
    TFormValues extends FieldValues = FieldValues,
    TFieldPath extends FieldArrayPath<TFormValues> = FieldArrayPath<TFormValues>,
    TFieldKey extends string = 'id',
> = BaseFieldProps<TRenderContext>
    & {
        readonly field: ArrayFieldSchema<TFieldValue, TRenderContext, TFormValues>;
        readonly array: UseFieldArrayReturn<TFormValues, TFieldPath, TFieldKey>;
        /** Whether items can be removed from the array */
        readonly canRemoveItem: boolean;
        /** Whether new items can be added to the array */
        readonly canAddItem: boolean;
        /** Function to render an array item at the given index */
        readonly renderItem: (index: number) => React.ReactNode;
    };

export type ObjectFieldProps<
    TRenderContext = unknown,
    TFieldValue extends FieldValues = FieldValues,
    TFormValues extends FieldValues = FieldValues,
> = BaseFieldProps<TRenderContext>
    & {
        readonly field: ObjectFieldSchema<TFieldValue, TRenderContext, TFormValues>;
        /** Child elements to render within the object field */
        readonly children: React.ReactNode;
    };

/**
 * Condition for when a field should be displayed
 */
export type ConditionedRule<T extends FieldValues = FieldValues> =
    | ((formValues: T) => boolean)
    | boolean
    | string;

export interface FieldWrapperProps<
    TFormValues extends FieldValues,
    TRenderContext = unknown,
> {
    readonly form: UseFormReturn<TFormValues>;
    readonly name: FieldPath<TFormValues>;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly validationStats?: ValidationStats;
    readonly error?: FieldError;
    readonly renderContext?: TRenderContext;
};
