function FormContainer({ children }: { children: JSX.Element }) {
  return (
    <div className="h-full w-full max-w-md mx-auto my-auto">{children}</div>
  );
}
export default FormContainer;
