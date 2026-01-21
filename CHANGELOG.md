# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **useSubmit Hook**: New hook for remote form submission that allows triggering form validation and submission from outside the form component
  - Enables form submission from modal footers, external navigation buttons, and custom layouts
  - Returns a callback function that invokes form submission with validation
  - Throws descriptive errors when form ID is not registered or used outside provider context
- **Comprehensive Tests**: Added 7 test cases for useSubmit hook covering various scenarios
  - Form registration and submission
  - Multiple forms with different IDs
  - Error handling for non-existent forms
  - Context requirements validation
  - Dynamic form registration
  - Callback stability across re-renders
- **Documentation**: Complete API documentation for useSubmit hook
  - Usage examples for basic, modal, and multi-step forms
  - Requirements and error handling guidelines
  - Added to hooks documentation index
- **Example Page**: New interactive example page demonstrating useSubmit hook
  - Modal form example with submit button in footer
  - Multi-step form wizard with external navigation
  - Visual feedback and form state management

### Changed
- **useSubmit Implementation**: Hook now returns a memoized callback function using `useCallback` instead of returning the submit function directly
  - Improves performance by preventing unnecessary re-renders
  - Allows lazy form registration checking
- **SchemaFormProvider**: Now includes `formMap` and `registerForm` in context value
  - Enables form registration and remote submission functionality
- **Type System**: Added `FormSchema` type alias for backward compatibility
  - Deprecated in favor of `FormFields` but maintains compatibility with existing examples

### Fixed
- **Multi-Step Form Example**: Fixed form registration timing issues by using ternary operator for conditional rendering instead of logical AND operator

## [0.6.0] - Previous Release

[Full Changelog](https://github.com/BaseStacks/schema-form/compare/v0.5.0...v0.6.0)
