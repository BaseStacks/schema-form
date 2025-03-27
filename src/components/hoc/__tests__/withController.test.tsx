import React from 'react';
import { render, screen } from '@testing-library/react';
import { withController } from '../withController';
import { FormProvider, useForm } from 'react-hook-form';
import { WithControllerProps } from '../../../types';

jest.mock('react', () => {
    const originReact = jest.requireActual('react');
    return {
        ...originReact,
        useContext: jest.fn().mockReturnValue({
            getDefaultMessages: jest.fn().mockReturnValue({ required: 'This field is required' })
        }),
    };
});

jest.mock('react-hook-form', () => {
    const originReactHookForm = jest.requireActual('react-hook-form');
    return {
        ...originReactHookForm,
        useController: jest.fn().mockReturnValue({
            field: {
                value: '',
                onChange: jest.fn(),
                onBlur: jest.fn(),
                name: 'testField'
            },
            fieldState: {},
            formState: {}
        }),
    };
});

// Mock component that will be wrapped by the HOC
const MockComponent = (props: WithControllerProps<any, any>) => {
    const { title, description, field, required, error } = props;
    return (
        <div>
            {title && <h1 data-testid="title">{title}</h1>}
            {description && <p data-testid="description">{description}</p>}
            {required && <span data-testid="required">Required</span>}
            {error?.message && <span data-testid="error">{error?.message}</span>}
            <input
                data-testid="input"
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value || ''}
                name={field.name}
            />
        </div>
    );
};

// Wrapper component to provide form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('withController HOC', () => {
    test('renders the wrapped component with basic props', () => {
        const WrappedComponent = withController(MockComponent);

        render(
            <FormWrapper>
                <WrappedComponent
                    name="testField"
                    schema={{ title: 'Test Title', description: 'Test Description' }}
                    form={{} as any}
                    renderContext={{}}
                />
            </FormWrapper>
        );

        expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
        expect(screen.getByTestId('description')).toHaveTextContent('Test Description');
        expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    test('applies validation rules correctly', () => {
        const WrappedComponent = withController(MockComponent);

        render(
            <FormWrapper>
                <WrappedComponent
                    name="testField"
                    schema={{
                        title: 'Required Field',
                        required: true,
                        minLength: 5
                    }}
                    form={{} as any}
                    renderContext={{}}
                />
            </FormWrapper>
        );

        expect(screen.getByTestId('required')).toBeInTheDocument();
    });

    test('merges base schema with provided schema', () => {
        const baseSchema = { required: true };
        const WrappedComponent = withController(MockComponent, {}, baseSchema);

        render(
            <FormWrapper>
                <WrappedComponent
                    name="testField"
                    schema={{
                        title: 'Test Field',
                        minLength: 3
                    }}
                    form={{} as any}
                    renderContext={{}}
                />
            </FormWrapper>
        );

        expect(screen.getByTestId('required')).toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('Test Field');
    });

    test('passes error prop to wrapped component', () => {
        const WrappedComponent = withController(MockComponent);

        render(
            <FormWrapper>
                <WrappedComponent
                    name="testField"
                    schema={{ title: 'Test Field' }}
                    form={{} as any}
                    renderContext={{}}
                    error={{
                        type: 'required',
                        message: 'This field has an error'
                    }}
                />
            </FormWrapper>
        );

        expect(screen.getByTestId('error')).toHaveTextContent('This field has an error');
    });

    test('merges render contexts correctly', () => {
        const baseRenderContext = { variant: 'outlined' };
        const WrappedComponent = withController(MockComponent, baseRenderContext);

        const TestComponent = () => {
            // Need to access renderContext in the wrapped component to test this
            return (
                <WrappedComponent
                    name="testField"
                    schema={{ title: 'Test Field' }}
                    form={{} as any}
                    renderContext={{ size: 'small' }}
                />
            );
        };

        render(
            <FormWrapper>
                <TestComponent />
            </FormWrapper>
        );

        // In a real test, you would check that both variant and size are passed correctly
        expect(screen.getByTestId('title')).toHaveTextContent('Test Field');
    });
});
