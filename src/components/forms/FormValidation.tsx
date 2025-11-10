// Form validation helper component
interface ValidationMessageProps {
  isValid: boolean;
  message: string;
}

export default function ValidationMessage({ isValid, message }: ValidationMessageProps) {
  return (
    <div className={`validation-message ${isValid ? 'valid' : 'invalid'}`}>
      {message}
    </div>
  );
}
