import { FieldArrayPath, FieldError, FieldPath, FieldValues, RegisterOptions, SubmitHandler, UseFormReturn } from 'react-hook-form';

export type RenderContext = any;

export type ValidationRules = Pick<RegisterOptions<any>, 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'validate'> & {
    readonly stats: ValidationStats;
};

export interface ValidationStats {
    readonly required?: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: RegExp;
    readonly min?: number;
    readonly max?: number;
}

export type SelectOption<TValue = any, TRenderContext = Record<string, any>> = TRenderContext & {
    readonly value: TValue;
    readonly label: string;
};

export type SchemaFormRenderProps<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues> = {
    readonly form: UseFormReturn<TFormValue>;
    readonly fields: FieldSchemas<TFormValue>;
    readonly onSubmit: SubmitHandler<TFormValue>;
    readonly renderContext: TRenderContext;
    readonly children: React.ReactNode;
};

export type Message = string | React.ReactNode;

export type DefaultMessages = {
    readonly required?: Message;
    readonly minLength?: Message;
    readonly maxLength?: Message;
    readonly pattern?: Message;
    readonly min?: Message;
    readonly max?: Message;
};

export interface SchemaFormComponents<TRenderContext extends RenderContext = RenderContext> {
    /** Form component used to render the form */
    readonly Form: React.ComponentType<SchemaFormRenderProps<TRenderContext, any>>;
    /** Map of field components by field type */
    readonly fields: {
        readonly [key: string]: React.ComponentType;
    };
}

/**
 * Global context for the JSON form configuration
 */
export interface SchemaFormGlobalContextType {
    /** Component overrides for form and fields */
    readonly components: SchemaFormComponents;
    /** Global render context */
    readonly renderContext?: RenderContext;
    /** Function to get default validation messages */
    readonly getDefaultMessages?: (validationStats: ValidationStats, options: FieldSchemaType<any, any>) => DefaultMessages;
}

/**
 * Context type for a specific JSON form instance
 */
export interface SchemaFormContextType<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues> {
    /** Form control object */
    readonly form: UseFormReturn<TFormValue>;
    /** Field schema definitions */
    readonly fields: FieldSchemas<TFormValue, TRenderContext>;
    /** Render context */
    readonly renderContext: TRenderContext;
}

export interface SchemaFieldContextType<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> {
    readonly form: UseFormReturn<TFormValue>;
    readonly schema: GenericFieldSchema<TRenderContext, TFormValue>
    | ArrayFieldSchema<TRenderContext, TFormValue, any[]>
    | ObjectFieldSchema<TRenderContext, TFormValue, any>;
    readonly name: FieldPath<TFormValue> | FieldArrayPath<TFormValue>;
    readonly rules: ValidationRules;
    readonly error?: FieldError;
    readonly renderContext: TRenderContext;
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
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = {
    readonly type?: string;
    // Field information
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;

    /** Field status */
    readonly visible?: ConditionedRule<TFormValue>;

    // Context and component overrides
    readonly renderContext?: Partial<TRenderContext>;
};

export type GenericFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = BaseFieldSchema<TRenderContext, TFormValue> & RegisterOptions<TFormValue> & FieldSchemaWithOption & FieldSchemaWithFormat & {
};

export type CustomFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
> = GenericFieldSchema<TRenderContext, TFormValue> & {
    readonly type?: undefined;
    readonly Component: React.ComponentType<any>;
};

export type ArrayFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues[] = FieldValues[]
> = BaseFieldSchema<TRenderContext, TFormValue> & RegisterOptions<TFormValue> & {
    /** Schema for individual items in the array */
    readonly items: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue[0]>;
};

export type ObjectFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TProperties extends FieldValues = FieldValues
> = BaseFieldSchema<TRenderContext, TFormValue> & {
    readonly properties: ObjectFieldProperties<TRenderContext, TProperties>;
};

export type ObjectFieldProperties<
    TRenderContext extends RenderContext = RenderContext,
    TProperties extends FieldValues = FieldValues
> = {
        readonly [K in keyof TProperties]:
        | CustomFieldSchema<TRenderContext, TProperties>
        | GenericFieldSchema<TRenderContext, TProperties>
        | ObjectFieldSchema<TRenderContext, TProperties, TProperties[K] extends FieldValues ? TProperties[K] : any>
        | ArrayFieldSchema<TRenderContext, TProperties, TProperties[K] extends FieldValues ? TProperties[K] : any>;
    };

export type FieldSchemas<
    TFormValue extends FieldValues = FieldValues,
    TRenderContext extends RenderContext = RenderContext,
> = {
        readonly [K in keyof TFormValue]:
        | CustomFieldSchema<TRenderContext, TFormValue>
        | GenericFieldSchema<TRenderContext, TFormValue>
        | ObjectFieldSchema<TRenderContext, TFormValue, TFormValue[K] extends FieldValues ? TFormValue[K] : any>
        | ArrayFieldSchema<TRenderContext, TFormValue, TFormValue[K] extends FieldValues ? TFormValue[K] : any>;
    };

export type FieldSchemaType<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = | CustomFieldSchema<TRenderContext, TFormValue>
    | GenericFieldSchema<TRenderContext, TFormValue>
    | ObjectFieldSchema<TRenderContext, TFormValue, any>
    | ArrayFieldSchema<TRenderContext, TFormValue, any>;

/**
 * Condition for when a field should be displayed
 */
export type ConditionedRule<T extends FieldValues = FieldValues> =
    | ((formValues: T) => boolean)
    | boolean
    | string;
