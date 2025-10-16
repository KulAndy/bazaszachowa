import { Button, CircularProgress } from "@mui/material";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ text }: { readonly text: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? <CircularProgress size={24} /> : text}
    </Button>
  );
};

export default SubmitButton;
