import * as React from 'react';

type ErrorType<T> = {
  [key in keyof T]: { error: boolean; messages: Array<string> };
};

type ValueType = object | [] | string | boolean | number;

type ValidatorConfigType = {
  condition: boolean;
  message?: string;
  onMatch?: (messages?: string) => void;
};

type ValidatorType<T> = (
  errors: any
) => (name: keyof T, config: ValidatorConfigType) => void;

export function useFormInput<T>(fields: T): [
  T,
  {
    onChange: (
      name: keyof T,
      value?: ValueType | ((previousValue: ValueType) => any)
    ) => (event?: React.ChangeEvent<any>) => void;
    validator: ValidatorType<T>;
    isValid: (errors: ErrorType<T> | {}) => boolean;
    errors: ErrorType<T>;
    setErrors: React.Dispatch<React.SetStateAction<{}>>;
  }
] {
  const [data, setData] = React.useState<T>({
    ...fields,
  });
  const [errors, setErrors] = React.useState<any>({});

  const onChange = (
    name: keyof T,
    value?: ValueType | ((previousValue: ValueType) => any)
  ) => {
    return function (event?: React.ChangeEvent<any>) {
      event?.persist();

      setData((prev) => {
        if (value === undefined || value === null) {
          return { ...prev, [name]: event?.target?.value };
        } else {
          if (typeof value === 'function') {
            const functionReturnValue = value(prev[name] as any);
            return { ...prev, [name]: functionReturnValue };
          } else {
            return { ...prev, [name]: value };
          }
        }
      });
    };
  };

  const validator = (errors: any) => {
    return function (name: keyof T, config: ValidatorConfigType) {
      const { condition, message, onMatch } = config;

      if (condition) {
        errors[name] = {
          error: true,
          messages: errors[name]?.messages ?? [],
        };

        const hasErrorMessage = message !== null && message !== undefined;

        if (Object.prototype.hasOwnProperty.call(errors, name)) {
          if (hasErrorMessage) {
            errors[name].messages = [...errors[name].messages, message];
          }
        } else {
          if (hasErrorMessage) {
            errors[name].messages = [message];
          }
        }

        if (onMatch) {
          onMatch(message);
        }
      } else {
        delete errors[name];
      }
    };
  };

  const isValid = (errors: ErrorType<T> | {}) => {
    return Object.keys(errors).length === 0;
  };

  return [
    data,
    React.useMemo(
      () => ({ onChange, validator, isValid, errors, setErrors }),
      [errors]
    ),
  ];
}
