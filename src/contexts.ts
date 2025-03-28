import React from 'react';
import { SchemaFieldContextType, SchemaFormContextType, SchemaFormGlobalContextType } from './types';

export const SchemaFormGlobalContext = React.createContext<SchemaFormGlobalContextType>(null!);

export const SchemaFormContext = React.createContext<SchemaFormContextType<any, any>>(null!);

export const SchemaFieldContext = React.createContext<SchemaFieldContextType<any, any>>(null!);
