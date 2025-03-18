import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonForm } from '../src/components/JsonForm';
import { JsonFormProps } from '../src/types';
import { FormProvider } from './components/shadcn/json-form';

function Content(props: JsonFormProps) {
    return (
        <FormProvider>
            <JsonForm {...props} />
        </FormProvider>
    );
}

const meta = {
    title: 'UI Templates/Shadcn',
    component: Content,
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<typeof Content>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        fields: {
            name: {
                type: 'string',
                title: 'Name',
                placeholder: 'Enter your name',
            },
            age: {
                type: 'number',
                title: 'Age',
                placeholder: 'Enter your age',
            },
            gender: {
                type: 'select',
                title: 'Gender',
                placeholder: 'Enter your age',
                options: [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                ]
            }
        },
        onSubmit: console.log,
    }
};


export const Array: Story = {
    args: {
        fields: {
            name: {
                type: 'string',
                title: 'Name',
                placeholder: 'Enter your name',
            },
            habits: {
                type: 'array',
                title: 'Habits',
                placeholder: 'Enter your habits',
                items: {
                    type: 'object',
                    properties: {
                        habit: {
                            type: 'string',
                            title: 'Habit',
                            placeholder: 'Enter your habit',
                        }
                    }
                }
            }
        },
        onSubmit: console.log
    }
};
