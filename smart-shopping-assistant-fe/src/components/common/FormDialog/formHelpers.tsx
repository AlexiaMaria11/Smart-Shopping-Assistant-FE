// Helper text that shows the field error (if any) on the left and "used / max" on the right
export function counterHelper(value: string, max: number, error?: string) {
  return (
    <>
      <span>{error ?? ""}</span>
      <span>
        {value.length} / {max}
      </span>
    </>
  );
}

export const counterHelperProps = { formHelperText: { className: "form-counter", component: "div" } } as const;

// "technova.ro" -> "https://technova.ro"
export function withScheme(url: string): string {
  const trimmed = url.trim();
  if (trimmed === "" || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Compares the current form values with the ones the dialog opened with
export function isDirty(initial: unknown, current: unknown): boolean {
  return JSON.stringify(initial) !== JSON.stringify(current);
}
