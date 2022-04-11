import * as React from 'react';

import {
  ValidatorConfigType,
  ErrorType,
  ValidatorType,
  ValueType,
} from './types';
import { compareObjectKeys } from './compareObjectKeys';

export function useFormInput<T>(
  fields: T,
  handleSubmit?: (data: T) => void,
  validation?: (data: T) => any
): [
  T,
  {
    setValue: (
      name?: keyof T,
      value?: ValueType | ((previousValue: ValueType) => any)
    ) => void;
    onChange: (event?: React.ChangeEvent<any>) => void;
    onSubmit: (e: React.FormEvent) => void;
    validator: ValidatorType<T>;
    isValid: (errors: ErrorType<T> | {}) => boolean;
    errors: ErrorType<T>;
    setErrors: React.Dispatch<React.SetStateAction<{}>>;
    clear: () => void;
    modified: T;
  }
] {
  const [data, setData] = React.useState<T>({
    ...fields,
  });
  const [errors, setErrors] = React.useState<any>({});
  const [modified, setModified] = React.useState<any>({});

  // called every time data is changed
  React.useEffect(() => {
    if (validation) {
      const catchedErrors = validation(data);

      setErrors(catchedErrors);
    }
  }, [data]);

  // checks whether the data is modified or not
  React.useEffect(() => {
    const compared = compareObjectKeys(fields, data);
    const newlyModified = { ...modified, ...compared };
    setModified(newlyModified);
  }, [data]);

  // setValue to set the individual items
  const setValue = (
    name: keyof T,
    value: ValueType | ((previousValue: ValueType) => any)
  ) => {
    setData((prev) => {
      if (typeof value === 'function') {
        const functionReturnValue = value(prev[name] as any);
        return { ...prev, [name]: functionReturnValue };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  // onChange for `named` form fields
  const onChange = function (event?: React.ChangeEvent<any>) {
    // for previous version of react ( pooling )
    event?.persist();

    const fieldName = event?.target.name;

    if (!fieldName) {
      throw new Error(`'name' attribute is missing in props`);
    }

    setData((prev) => {
      return { ...prev, [fieldName]: event?.target?.value };
    });
  };

  // validator
  const validator = (errors: any) => {
    return function (name: keyof T, config: ValidatorConfigType) {
      const { condition, message, onMatch } = config;

      if (condition) {
        errors[name] = errors[name] ?? [];

        const hasErrorMessage = message !== null && message !== undefined;

        if (Object.prototype.hasOwnProperty.call(errors, name)) {
          if (hasErrorMessage) {
            errors[name] = [...errors[name], message];
          }
        } else {
          if (hasErrorMessage) {
            errors[name] = [message];
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

  // checks whether the errors is empty or not
  const isValid = (errors: ErrorType<T> | {}) => {
    return Object.keys(errors).length === 0;
  };

  // clears the form
  const clear = () => {
    const formData = Object.keys(data).map((val) => {
      const field = data[val];

      return {
        key: val,
        value: field,
        valueType: typeof field,
      };
    });

    const emptyData = formData.reduce(
      (acc, curr) => {
        let resetValue;
        if (curr.valueType === 'boolean') {
          resetValue = false;
        } else {
          resetValue = '';
        }

        return { ...acc, [curr.key]: resetValue };
      },
      { ...data }
    );

    setData(emptyData);
  };

  // handle the submit
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const modifiedData = Object.keys(fields).reduce((acc, curr) => {
      return { ...acc, [curr]: true };
    }, {});

    setModified(modifiedData);

    if (!isValid(errors)) {
      return;
    }

    if (handleSubmit) {
      handleSubmit(data);
    }
  };

  return [
    data,
    React.useMemo(
      () => ({
        setValue,
        onChange,
        validator,
        isValid,
        errors,
        setErrors,
        clear,
        modified,
        onSubmit,
      }),
      [errors, modified]
    ),
  ];
}
