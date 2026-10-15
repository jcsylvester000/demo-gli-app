/** Inline field error, referenced by the input's aria-describedby. */
export function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.9375rem] font-semibold text-danger">
      {msg}
    </p>
  );
}
