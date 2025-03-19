import type { Meta, StoryObj } from '@storybook/react';
import {
    FieldSchemas,
    SchemaForm,
    SchemaFormProps,
} from '@basestacks/schema-form';
import {
    AdvanceFormProvider,
    FormSubmitBtn,
} from './components/vanilla/form-advance';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaFormField } from '../../src/components/SchemaFormField';
import React from 'react';

interface ContentProps extends SchemaFormProps {
  readonly showLanguageSwitcher?: boolean;
}

function Content({ showLanguageSwitcher, ...props }: ContentProps) {
    const [language, setLanguage] = useState('en');
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    return (
        <AdvanceFormProvider>
            <div>
                <SchemaForm shouldUseNativeValidation={true} {...props} />
                {showLanguageSwitcher && (
                    <div className="border-t mt-4 pt-4 flex gap-2 text-sm text-gray-500">
                        <span
                            className={language === 'en' ? 'text-primary' : ''}
                            onClick={() => setLanguage('en')}
                        >
              English
                        </span>
            |
                        <span
                            className={language === 'fr' ? 'text-primary' : ''}
                            onClick={() => setLanguage('fr')}
                        >
              Français
                        </span>
                    </div>
                )}
            </div>
        </AdvanceFormProvider>
    );
}

const meta = {
    title: 'Example/Advance',
    component: Content,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'None',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Content>;

export default meta;

type Story = StoryObj<typeof meta>;

export const I18n: Story = {
    name: 'I18n',
    args: {
        showLanguageSwitcher: true,
        fields: {
            username: {
                type: 'text',
                title: 'auth.username.label',
                placeholder: 'auth.username.placeholder',
                required: true,
                minLength: 3,
                maxLength: 20,
            },
            password: {
                type: 'text',
                title: 'auth.password.label',
                placeholder: '••••••••',
                required: true,
                minLength: 6,
                renderContext: {
                    secureText: true,
                },
            },
            rememberMe: {
                type: 'checkbox',
                title: 'auth.rememberMe',
            },
        } satisfies FieldSchemas,
        renderContext: {
            submitLabel: 'auth.login',
        },
        onSubmit: console.log,
    },
};

export const CustomLayout: Story = {
    name: 'Layout Customization',
    args: {
        fields: {
            task: {
                type: 'text',
                title: 'Task',
                placeholder: 'Enter task name',
                required: true,
                maxLength: 255,
            },
            description: {
                type: 'textarea',
                title: 'Description',
                placeholder: 'Enter description',
            },
            assignee: {
                type: 'select',
                title: 'Assignee',
                placeholder: 'Select assignee',
                options: [
                    { value: '1', label: 'John Doe' },
                    { value: '2', label: 'Jane Doe' },
                    { value: '3', label: 'John Smith' },
                ],
            },
        } satisfies FieldSchemas,
        children: ({ form, onSubmit }) => {
            return (
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-[550px]">
                    <div className="gap-4 grid grid-cols-12 mb-4">
                        <div className="col-span-8 flex flex-col gap-4">
                            <SchemaFormField name="task" />
                            <SchemaFormField name="description" />
                        </div>
                        <div className="col-span-4">
                            <SchemaFormField name="assignee" />
                        </div>
                    </div>
                    <FormSubmitBtn>Save</FormSubmitBtn>
                </form>
            );
        },
        onSubmit: console.log,
    },
};
