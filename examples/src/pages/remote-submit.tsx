import {
    PropsWithChildren,
    useState,
} from 'react';

import {
    FormFields,
    SchemaForm,
    SchemaFormProvider,
    useSubmit,
} from '@basestacks/schema-form';

import {
    CheckboxField,
    FormRenderContext,
    InputField,
} from '../components/fields';

function FormProvider({ children }: PropsWithChildren) {
    return (
        <SchemaFormProvider
            components={{
                Form: ({ children }) => <div className="form-content">{children}</div>,
                fields: {
                    text: InputField,
                    checkbox: CheckboxField,
                },
            }}
        >
            {children}
        </SchemaFormProvider>
    );
}

interface UserFormValues {
    readonly name: string;
    readonly email: string;
    readonly subscribe: boolean;
}

const userFields: FormFields<UserFormValues, FormRenderContext> = {
    name: {
        type: 'text',
        title: 'Name',
        placeholder: 'Enter your name',
        required: 'Name is required',
        minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
        },
    },
    email: {
        type: 'text',
        title: 'Email',
        placeholder: 'Enter your email',
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
        },
    },
    subscribe: {
        type: 'checkbox',
        title: 'Subscribe to newsletter',
    },
};

function RemoteSubmitButton({ formId }: { formId: string }) {
    const submit = useSubmit(formId);

    return (
        <div style={{ marginTop: '20px' }}>
            <button type="button" onClick={submit} className="submit-button">
                Submit Form Remotely
            </button>
        </div>
    );
}

function ModalExample() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState<any>(null);

    const handleSubmit = (data: UserFormValues) => {
        setFormValues(data);
        setIsModalOpen(false);
    };

    return (
        <div>
            <h3>Modal Example</h3>
            <p>Submit button is located in the modal footer, outside the form.</p>
            <button type="button" onClick={() => setIsModalOpen(true)}>
                Open Modal
            </button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>User Information</h4>
                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <SchemaForm
                                id="modalForm"
                                fields={userFields}
                                onSubmit={handleSubmit}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <RemoteSubmitButton formId="modalForm" />
                        </div>
                    </div>
                </div>
            )}

            {formValues && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Submitted Values:</h4>
                    <pre data-testid="form-values">{JSON.stringify(formValues, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

interface StepFormValues {
    readonly firstName: string;
    readonly lastName: string;
    readonly address: string;
    readonly city: string;
}

function MultiStepExample() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<StepFormValues>>({});
    const [completedData, setCompletedData] = useState<StepFormValues | null>(null);

    const step1Fields: FormFields<Pick<StepFormValues, 'firstName' | 'lastName'>, FormRenderContext> = {
        firstName: {
            type: 'text',
            title: 'First Name',
            placeholder: 'Enter your first name',
            required: 'First name is required',
        },
        lastName: {
            type: 'text',
            title: 'Last Name',
            placeholder: 'Enter your last name',
            required: 'Last name is required',
        },
    };

    const step2Fields: FormFields<Pick<StepFormValues, 'address' | 'city'>, FormRenderContext> = {
        address: {
            type: 'text',
            title: 'Address',
            placeholder: 'Enter your address',
            required: 'Address is required',
        },
        city: {
            type: 'text',
            title: 'City',
            placeholder: 'Enter your city',
            required: 'City is required',
        },
    };

    const handleStep1Submit = (data: Pick<StepFormValues, 'firstName' | 'lastName'>) => {
        setFormData({ ...formData, ...data });
        setStep(2);
    };

    const handleStep2Submit = (data: Pick<StepFormValues, 'address' | 'city'>) => {
        const completed = { ...formData, ...data } as StepFormValues;
        setCompletedData(completed);
        setFormData({});
        setStep(1);
    };

    return (
        <div>
            <h3>Multi-Step Form Example</h3>
            <p>Navigation buttons are separate from the form, using useSubmit to trigger validation and submission.</p>

            <div className="steps-indicator">
                <span className={step === 1 ? 'active' : ''}>Step 1: Personal Info</span>
                <span className={step === 2 ? 'active' : ''}>Step 2: Address</span>
            </div>

            <div style={{ marginTop: '20px' }}>
                {step === 1 && (
                    <SchemaForm
                        id="step1Form"
                        fields={step1Fields}
                        defaultValues={formData}
                        onSubmit={handleStep1Submit}
                    />
                )}

                {step === 2 && (
                    <SchemaForm
                        id="step2Form"
                        fields={step2Fields}
                        defaultValues={formData}
                        onSubmit={handleStep2Submit}
                    />
                )}
            </div>

            <div className="navigation-buttons" style={{ marginTop: '20px' }}>
                {step > 1 && (
                    <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                    >
                        Previous
                    </button>
                )}
                {step === 1 ? (
                    <RemoteSubmitButton formId="step1Form" />
                ) : (
                    <RemoteSubmitButton formId="step2Form" />
                )}
            </div>

            {completedData && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Form Completed:</h4>
                    <pre data-testid="form-values">{JSON.stringify(completedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default function RemoteSubmitExample() {
    return (
        <FormProvider>
            <div className="form-container">
                <h2>Remote Form Submission with useSubmit</h2>
                <p>
                    The <code>useSubmit</code> hook allows you to trigger form submission from outside
                    the form component. This is useful for modals, multi-step forms, or custom layouts.
                </p>

                <div style={{ marginTop: '40px' }}>
                    <ModalExample />
                </div>

                <hr style={{ margin: '40px 0' }} />

                <div style={{ marginTop: '40px' }}>
                    <MultiStepExample />
                </div>
            </div>
        </FormProvider>
    );
}
