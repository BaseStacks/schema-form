import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider } from './components/vanilla/form';
import { SchemaForm, SchemaFormProps } from '@basestacks/schema-form';
import React from 'react';

function Content(props: SchemaFormProps) {
    return (
        <FormProvider>
            <SchemaForm shouldUseNativeValidation={true} {...props} />
        </FormProvider>
    );
}

const meta = {
    title: 'Example/Basic',
    component: Content,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Content>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GettingStarted: Story = {
    args: {
        fields: {
            username: {
                type: 'text',
                title: 'Username',
                placeholder: 'Enter username',
                required: true,
                minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters long',
                },
                maxLength: {
                    value: 20,
                    message: 'Username must be at most 20 characters long',
                },
            },
            password: {
                type: 'text',
                title: 'Password',
                placeholder: '••••••••',
                required: '',
                minLength: 6,
                renderContext: {
                    secureText: true,
                },
            },
            rememberMe: {
                type: 'checkbox',
                title: 'Remember me',
            },
        },
        renderContext: {
            submitLabel: 'Sign in',
        },
        onSubmit: console.log,
    },
};

export const CustomComponent: Story = {
    args: {
        fields: {
            username: {
                type: 'text',
                title: 'Username',
                placeholder: 'Enter username',
                required: true,
                minLength: 3,
                maxLength: 6,
            },
            password: {
                type: 'text',
                title: 'Password',
                placeholder: '••••••••',
                required: true,
                minLength: 6,
                renderContext: {
                    secureText: true,
                },
            },
            repeatPassword: {
                type: 'text',
                title: 'Repeat password',
                placeholder: '••••••••',
                minLength: 6,
                renderContext: {
                    secureText: true,
                },
                validate: (value, formValue) => {
                    return formValue.password === value || 'Passwords do not match';
                },
            },
            agreeTermAndConditions: {
                Component: function CustomCheckboxField({ ref, name, onChange }) {
                    return (
                        <div className="flex items-center col-span-12">
                            <input
                                ref={ref}
                                type="checkbox"
                                name={name}
                                id={name}
                                onChange={onChange}
                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <label
                                htmlFor={name}
                                className="ml-2 block text-sm font-medium text-gray-900"
                            >
                Agree to <a href="https://example.com">terms</a> and{' '}
                                <a href="https://example.com">conditions</a>
                            </label>
                        </div>
                    );
                },
            },
        },
        renderContext: {
            submitLabel: 'Sign up',
        },
        onSubmit: console.log,
    },
};

export const CustomErrorMessage: Story = {
    args: {
        fields: {
            age: {
                type: 'number',
                title: 'Age',
                placeholder: 'Enter age',
                required: true,
                min: {
                    value: 18,
                    message: 'You must be at least 18 years old',
                },
            },
        },
        renderContext: {
            submitLabel: 'View content',
        },
        onSubmit: console.log,
    },
};

export const ConditionalField: Story = {
    args: {
        fields: {
            paymentMethod: {
                type: 'select',
                title: 'Payment method',
                placeholder: 'Select one',
                required: true,
                options: [
                    { value: 'cash', label: 'Cash' },
                    { value: 'creditCard', label: 'Credit card' },
                ],
            },
            creditCard: {
                type: 'object',
                title: 'Credit card details',
                visible: (values) => values.paymentMethod === 'creditCard',
                properties: {
                    cardNumber: {
                        type: 'text',
                        title: 'Card number',
                        placeholder: 'Enter card number',
                        required: true,
                        minLength: 16,
                        maxLength: 16,
                    },
                    expiryDate: {
                        type: 'text',
                        title: 'Expiry date',
                        placeholder: 'MM/YY',
                        required: true,
                        pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: 'Expiry date must be in the format MM/YY',
                        },
                    },
                    cvv: {
                        type: 'text',
                        title: 'CVV',
                        placeholder: '•••',
                        required: true,
                        minLength: 3,
                        maxLength: 3,
                        renderContext: {
                            secureText: true,
                        },
                    },
                },
            },
        },
        onSubmit: console.log,
    },
};

export const ArrayField: Story = {
    args: {
        fields: {
            tags: {
                type: 'array',
                title: 'Tags',
                placeholder: 'Add a tag',
                required: true,
                minLength: 2,
                maxLength: 5,
                items: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'text',
                            placeholder: 'Enter tag',
                            required: true,
                        },
                        color: {
                            type: 'select',
                            placeholder: 'Select color',
                            options: [
                                { value: 'red', label: 'Red' },
                                { value: 'green', label: 'Green' },
                                { value: 'blue', label: 'Blue' },
                            ],
                        },
                    },
                },
            },
        },
        onSubmit: console.log,
    },
};
