import React from "react";
import { useField } from "formik";
import "./InputText.css";

function InputText({ label, required, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className="input-component">
      <label htmlFor={props.id || props.name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default InputText;
