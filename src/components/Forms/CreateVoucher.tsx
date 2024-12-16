"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  DateRangePicker,
} from "@nextui-org/react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { registerAdminUser } from "@/services/auth";
import { toast } from "react-toastify";
import { RegisterAdminSchema, VoucherSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import { now, getLocalTimeZone } from "@internationalized/date";
import { VoucherType } from "@/lib/types";
import { addVoucher } from "@/services/voucher";

type CreateVoucherProps = { onClose?: () => void };
export default function CreateVoucher({ onClose }: CreateVoucherProps) {
  const { updateForm, setUpdateForm } = useGlobalContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VoucherType>({
    defaultValues: updateForm
      ? updateForm
      : {
          code: "",
          discount: 0,
          start: now(getLocalTimeZone()).toDate(),
          expiry: now(getLocalTimeZone()).toDate(),
          minimumAmount: 0,
          maximumDiscount: 0,
          category: "all",
          totalVoucher: 0,
        },
    resolver: zodResolver(VoucherSchema),
  });

  const onSubmit = async (data: any) => {
    const res = await addVoucher(data);
    if (res.success) {
      toast.success(res.message);
      reset();
      if (onClose) onClose();
      router.refresh();
    } else {
      toast.error(res.message);
    }
    console.log(data);
  };
  console.log(errors);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {updateForm ? "Update Voucher" : "Create Voucher"}
      </ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-4">
          <TextField
            required
            error={errors && "code" in errors}
            helperText={errors && "code" in errors && errors["code"]?.message}
            fullWidth
            type="text"
            label="Code"
            {...register("code")}
          />
          <div className="flex justify-between">
            <TextField
              className="w-[49%]"
              required
              error={errors && "discount" in errors}
              helperText={
                errors && "discount" in errors && errors["discount"]?.message
              }
              type="number"
              label="Discount"
              {...register("discount", { valueAsNumber: true })}
            />
            <TextField
              required
              className="w-[49%]"
              error={errors && "maximumDiscount" in errors}
              helperText={
                errors &&
                "maximumDiscount" in errors &&
                errors["maximumDiscount"]?.message
              }
              type="number"
              label="Maximum Discount"
              {...register("maximumDiscount", { valueAsNumber: true })}
            />
          </div>
          <TextField
            required
            error={errors && "category" in errors}
            helperText={
              errors && "category" in errors && errors["category"]?.message
            }
            fullWidth
            type="text"
            label="Category"
            {...register("category")}
          />

          <div className="flex justify-between">
            <TextField
              required
              className="w-[49%]"
              error={errors && "minimumAmount" in errors}
              helperText={
                errors &&
                "minimumAmount" in errors &&
                errors["minimumAmount"]?.message
              }
              type="number"
              label="Minimum Amount"
              {...register("minimumAmount", { valueAsNumber: true })}
            />
            <TextField
              required
              className="w-[49%]"
              error={errors && "totalVoucher" in errors}
              helperText={
                errors &&
                "totalVoucher" in errors &&
                errors["totalVoucher"]?.message
              }
              type="number"
              label="Total Number of Vouchers"
              {...register("totalVoucher", { valueAsNumber: true })}
            />
          </div>

          <DateRangePicker
            variant="bordered"
            onChange={(e) => {
              setValue("start", e.start.toDate());
              setValue("expiry", e.end.toDate());
            }}
            isInvalid={(errors && "expiry" in errors) || "start" in errors}
            errorMessage={
              (errors && "expiry" in errors && errors["expiry"]?.message) ||
              ("start" in errors && errors["start"]?.message)
            }
            label="Voucher duration"
            hideTimeZone
            visibleMonths={2}
            defaultValue={{
              start: now(getLocalTimeZone()),
              end: now(getLocalTimeZone()),
            }}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          variant="light"
          onPress={() => {
            if (onClose) onClose();
          }}>
          Close
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          color="primary"
          onPress={() => {}}>
          {updateForm ? "Update" : "Create"}
        </Button>
      </ModalFooter>
    </>
  );
}
