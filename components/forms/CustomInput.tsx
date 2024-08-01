import { Control, FieldPath } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { authFormSchema } from "@/lib/utils";

const formSchema = authFormSchema("sign-up");

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder: string;
  label: string;
}
const CustomInput = ({ control, name, placeholder, label }: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-4 w-full">
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <Input type={name === "password" ? "password" : "text"} placeholder={placeholder} {...field} className="w-full" />
          </FormControl>
          <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  );
};

export default CustomInput;
