import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

type FieldWrapperProps = {
  children: ReactNode
  helperText?: string
  id: string
  label: string
}

function FieldWrapper({ children, helperText, id, label }: FieldWrapperProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {helperText ? <span className="field__hint">{helperText}</span> : null}
    </div>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  helperText?: string
  id: string
  label: string
}

export function TextField({ helperText, id, label, ...props }: TextFieldProps) {
  return (
    <FieldWrapper helperText={helperText} id={id} label={label}>
      <input id={id} {...props} />
    </FieldWrapper>
  )
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  helperText?: string
  id: string
  label: string
}

export function TextAreaField({
  helperText,
  id,
  label,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldWrapper helperText={helperText} id={id} label={label}>
      <textarea id={id} {...props} />
    </FieldWrapper>
  )
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  helperText?: string
  id: string
  label: string
}

export function SelectField({
  children,
  helperText,
  id,
  label,
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrapper helperText={helperText} id={id} label={label}>
      <select id={id} {...props}>
        {children}
      </select>
    </FieldWrapper>
  )
}
