"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import { ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { registerAdminUser } from "@/services/auth";
import { toast } from "react-toastify";
import { RegisterAdminSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";

type CreateAdminProps = { onClose?: () => void };
export default function CreateAdmin({ onClose }: CreateAdminProps) {
  const { updateForm, setUpdateForm } = useGlobalContext();
  console.log(updateForm);

  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  type FormSchema = z.infer<typeof RegisterAdminSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    defaultValues: updateForm
      ? updateForm
      : {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          imageUrl: "",
        },
    resolver: zodResolver(RegisterAdminSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    const res = await registerAdminUser(data);
    console.log(res);

    if (res.success) {
      toast.success(res.message);
      reset();
      if (onClose) onClose();
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {updateForm ? "Update Admin" : "Create Admin"}
      </ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-4">
          <TextField
            required
            error={errors && "name" in errors}
            helperText={errors && "name" in errors && errors["name"]?.message}
            fullWidth
            type="text"
            label="Name"
            {...register("name")}
          />
          <TextField
            required
            error={errors && "email" in errors}
            helperText={errors && "email" in errors && errors["email"]?.message}
            fullWidth
            type="email"
            label="Email"
            {...register("email")}
          />
          <FormControl
            fullWidth
            variant="outlined"
            error={errors && "password" in errors}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <MdOutlineVisibilityOff />
                    ) : (
                      <MdOutlineVisibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <FormHelperText id="confirmPassword">
              {errors &&
                "confirmPassword" in errors &&
                errors["confirmPassword"]?.message}
            </FormHelperText>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            error={errors && "confirmPassword" in errors}
          >
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <MdOutlineVisibilityOff />
                    ) : (
                      <MdOutlineVisibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
            <FormHelperText id="confirmPassword">
              {errors &&
                "confirmPassword" in errors &&
                errors["confirmPassword"]?.message}
            </FormHelperText>
          </FormControl>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          variant="light"
          onPress={() => {
            if (onClose) onClose();
          }}
        >
          Close
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          color="primary"
          onPress={() => {}}
        >
          {updateForm ? "Update" : "Create"}
        </Button>
      </ModalFooter>
    </>
  );
}
