import type { AnyFieldApi } from "@tanstack/react-form";
import FormFieldInfo from "@/components/form-field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function FormField({ field, label, type = "text", placeholder, className = "mt-1" }: FormFieldProps) {
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        className={className}
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
      />
      <FormFieldInfo field={field} />
    </>
  );
}
