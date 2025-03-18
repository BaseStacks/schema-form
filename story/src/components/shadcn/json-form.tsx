import React from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';

import { BaseFieldProps, ObjectFieldProps, SchemaFormRenderProps, ArrayFieldProps, SelectFieldProps } from '../../../../src/types';
import { SchemaFormProvider } from '../../../../src/components/SchemaFormProvider';
import { format } from 'date-fns';

import { FormField, FormItem, FormLabel, FormDescription, FormMessage, FormControl } from './form';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { Checkbox } from './checkbox';
import { Icon } from './icon';

import { cn } from '../utils';
import { PropsWithChildren, useMemo, useState } from 'react';

export function FormProvider({ children }: React.PropsWithChildren<{}>) {
    return (
        <SchemaFormProvider
            validationResolver={ajvResolver}
            components={{
                Form: InnerForm,
                fields: {
                    array: ArrayField,
                    boolean: BooleanField,
                    date: StringField,
                    number: NumberField,
                    object: ObjectField,
                    select: SelectField,
                    string: StringField,
                }
            }}
            renderContext={{
                layout: {
                    colSpan: 12,
                    labelColSpan: 12,
                    hideLabel: false
                }
            }}
        >
            {children}
        </ SchemaFormProvider>
    );
};

function InnerForm({ form, children, onSubmit }: SchemaFormRenderProps<ExtendedFieldProps>) {
    return (
        <form onSubmit={onSubmit && form.handleSubmit(onSubmit)} className="grid grid-cols-12 w-[350px]">
            <div className="flex flex-col gap-4 col-span-12">
                {children}
            </div>
            <Button type="submit" className="mt-4 col-span-12">
                Submit
            </Button>
        </form>
    );
};

interface FieldLayoutClx {
    containerClx: string;
    labelClx: string;
    controlClx: string;
}

interface FieldLayout {
    colSpan?: number;
    labelColSpan?: number;
    hideLabel?: boolean;
}

export interface ExtendedFieldProps {
    layout: FieldLayout;
}

const maxColSpan = 12;

// eslint-disable-next-line -- Tailwind classes, DO NOT REMOVE!
const colSpans = ['col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-5', 'col-span-6', 'col-span-7', 'col-span-8', 'col-span-9', 'col-span-10', 'col-span-11', 'col-span-12'];

const calculateLayout = (layout: FieldLayout): FieldLayoutClx => {
    const result: FieldLayoutClx = {
        containerClx: 'grid grid-cols-12',
        labelClx: 'col-span-12',
        controlClx: 'col-span-12'
    };

    for (let i = 1; i <= 12; i++) {
        if (layout.colSpan === i) {
            result.containerClx = `col-span-${i}`;
        }

        if (layout.labelColSpan === 12) {
            continue;
        }

        if (layout.labelColSpan === i) {
            result.labelClx = `col-span-${i}`;
            result.controlClx = `col-span-${maxColSpan - i}`;
        }
    }

    if (layout.hideLabel) {
        result.labelClx = result.labelClx + 'hidden';
    }

    return result;
};

export function StringField({
    form,
    name,
    title,
    description,
    format,
    required,
    placeholder,
    readOnly,
    layout,
}: BaseFieldProps<ExtendedFieldProps>) {
    const { containerClx, labelClx, controlClx } = calculateLayout(layout);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    {title && <FormLabel className={cn(labelClx, 'mt-2')}>{title}{required ? ' *' : ''}</FormLabel>}
                    <FormControl>
                        <Input
                            {...field}
                            className={cn(controlClx)}
                            type={format === 'email' ? 'email' : format === 'uri' ? 'url' : 'text'}
                            placeholder={placeholder || ''}
                            required={required}
                            readOnly={readOnly}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
}

export function DateField({
    form,
    name,
    title,
    description,
    required,
    placeholder,
    readOnly,
    layout
}: BaseFieldProps<ExtendedFieldProps>) {
    // Use provided placeholder or default text
    const datePlaceholder = placeholder || 'Pick a date';

    const { containerClx, labelClx, controlClx } = calculateLayout(layout);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    {title && <FormLabel className={cn(labelClx, 'mt-2')}>{title}{required ? ' *' : ''}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild disabled={readOnly}>
                            <FormControl>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        controlClx,
                                        'w-[240px] pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                        readOnly && 'opacity-50 cursor-not-allowed'
                                    )}
                                    disabled={readOnly}
                                >
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>{datePlaceholder}</span>
                                    )}
                                    <Icon name="Calendar" className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        {!readOnly && (
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date('1900-01-01')
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        )}
                    </Popover>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
}

export function SelectField({
    form,
    name,
    title,
    description,
    options,
    required,
    placeholder,
    readOnly,
    layout
}: SelectFieldProps<ExtendedFieldProps>) {
    // Use provided placeholder or default text
    const selectPlaceholder = placeholder || 'Select an option';

    const { containerClx, labelClx, controlClx } = calculateLayout(layout);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    {title && <FormLabel className={cn(labelClx, 'mt-2')}>{title}{required ? ' *' : ''}</FormLabel>}
                    <FormControl>
                        <Select value={field.value} onValueChange={field.onChange} disabled={readOnly} >
                            <SelectTrigger className={cn(controlClx)}>
                                <SelectValue placeholder={selectPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option, index) => (
                                    <SelectItem key={index} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
}

export function NumberField({
    form,
    name,
    title,
    description,
    minimum,
    maximum,
    required,
    placeholder,
    readOnly,
    layout
}: BaseFieldProps<ExtendedFieldProps>) {

    const { containerClx, labelClx, controlClx } = calculateLayout(layout);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    {title && <FormLabel className={cn(labelClx, 'mt-2')}>{title}{required ? ' *' : ''}</FormLabel>}
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            min={minimum}
                            max={maximum}
                            placeholder={placeholder || ''}
                            readOnly={readOnly}
                            className={cn(controlClx)}
                            onChange={(e) => {
                                const value = e.target.valueAsNumber;
                                field.onChange(isNaN(value) ? '' : value);
                            }}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
}

export function BooleanField({
    form,
    name,
    title,
    description,
    required,
    readOnly,
    layout
}: BaseFieldProps<ExtendedFieldProps>) {

    const { containerClx, labelClx } = calculateLayout(layout);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={readOnly}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        {title && <FormLabel className={cn(labelClx, 'mt-2')}>{title}{required ? ' *' : ''}</FormLabel>}
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
}

export function ObjectField({ children, layout }: ObjectFieldProps<ExtendedFieldProps>) {
    const { containerClx, } = calculateLayout(layout);

    return (
        <div className={cn('flex flex-col gap-4', containerClx)}>
            {children}
        </div>
    );
}

export function ArrayField({
    name,
    title,
    required,
    description,
    placeholder,
    layout,
    form,
    // fieldArray
    fields,
    append,
    remove,
    canAddItem,
    canRemoveItem,
    items: itemSchema,
    renderItem
}: ArrayFieldProps<ExtendedFieldProps>) {
    const { containerClx, labelClx, controlClx } = calculateLayout(layout);

    const defaultPropertyKey = useMemo(() => {
        if (itemSchema.type === 'object') {
            return Object.keys(itemSchema.properties)[0];
        }
    }, [itemSchema]);

    const handleAddItem = (defaultValue: string): void => append(defaultPropertyKey ? { [defaultPropertyKey]: defaultValue } : defaultValue);
    const itemHasLabel = !!itemSchema.title;

    return (
        <FormField
            control={form.control}
            name={name}
            render={() => (
                <FormItem className={cn('grid grid-cols-12', containerClx)} >
                    {title && <FormLabel className={cn(labelClx)}>{title}{required ? ' *' : ''}</FormLabel>}
                    <FormControl className={cn(controlClx)}>
                        <div className="space-y-2">
                            {fields.length === 0 ? (
                                <div className="text-center p-4 border rounded-md border-dashed">
                                    No items added yet
                                </div>
                            ) : (
                                <div>
                                    {fields.map((field, index) => (
                                        <ArrayFieldItem key={field.id} itemIndex={index} canRemoveItem={canRemoveItem} hasLabel={itemHasLabel} onRemove={remove}>
                                            {renderItem(index)}
                                        </ArrayFieldItem>
                                    ))}
                                </div>
                            )}
                            {canAddItem && (
                                <ArrayAddField onItemAdd={handleAddItem} placeholder={placeholder} />
                            )}
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="col-span-12" />
                </FormItem>
            )}
        />
    );
};

interface ArrayFieldItemProps {
    canRemoveItem: boolean;
    itemIndex: number;
    hasLabel: boolean;
    onRemove: (index: number) => void;
}

function ArrayFieldItem({ children, canRemoveItem, itemIndex, hasLabel, onRemove }: PropsWithChildren<ArrayFieldItemProps>) {
    return (
        <div className="flex flex-row w-full gap-1">
            <div className="grow border-b mb-2 mt-1">
                {children}
            </div>
            <Button
                size="icon"
                variant="ghost"
                type="button"
                className={cn('opacity-50 hover:opacity-100', hasLabel ? 'mt-9' : 'mt-1')}
                disabled={!canRemoveItem} onClick={() => onRemove(itemIndex)}
            >
                <Icon name="Trash" className="h-4 w-4" />
            </Button>
        </div>
    );
};

interface ArrayAddFieldProps {
    placeholder?: string;
    onItemAdd: (values: string) => void;
}

function ArrayAddField({ placeholder, onItemAdd }: ArrayAddFieldProps) {
    const [value, setValue] = useState('');

    const submit = () => {
        onItemAdd(value);
        setValue('');
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submit();
            e.preventDefault();
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="grow">
                <Input value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} onKeyDown={onInputKeyDown} />
            </div>
            <Button type="button" variant="ghost" size="icon" disabled={!value} onClick={submit} >
                <Icon name="Plus" />
            </Button>
        </div>
    );
};
