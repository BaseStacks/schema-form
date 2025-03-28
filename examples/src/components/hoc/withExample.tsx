import React from 'react';

export interface ExampleFormProps {
    readonly onSubmit: (values: any) => void;
}

export function withExample(Provider: React.ComponentType<React.PropsWithChildren>, Form: React.ComponentType<ExampleFormProps>) {
    return function Example() {
        const [formValues, setFormValues] = React.useState<any>(null);

        return (
            <Provider>
                <div className="form-container">
                    <Form onSubmit={setFormValues} />
                    {
                        formValues && (
                            <div>
                                <pre data-testid="form-values">
                                    {JSON.stringify(formValues, null, 2)}
                                </pre>
                            </div>
                        )
                    }
                </div>
            </Provider>
        );
    };
}
