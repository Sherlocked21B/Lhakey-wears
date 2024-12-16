"use client";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  // Select,
  SelectItem,
} from "@nextui-org/react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import { registerAdminUser } from "@/services/auth";
import { toast } from "react-toastify";
import { ProductSchema, RegisterAdminSchema } from "@/lib/schemas";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import { defaultProduct } from "@/lib/default";
import { ProductType } from "@/lib/types";
import { addProduct, updateProduct } from "@/services/product";
import { productForm1, productForm2 } from "@/lib/mapping";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import UploadImage from "../UploadImage";
import { FaPlus } from "react-icons/fa6";
import ProductVariantCard from "../ui/ProductVariantCard";
import ModalButton from "../ModalButton/ModalButton";
import CreateProductVariant from "./CreateProductVariant";
import ProductVariant from "../ModalButton/ProductVariant";
import { slugify } from "@/lib/utils";
import { RadioGroup, Radio } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

type CreateAdminProps = { onClose?: () => void; editForm?: ProductType };
export default function CreateProduct({ onClose, editForm }: CreateAdminProps) {
  const router = useRouter();
  const { isMobile } = useGlobalContext();
  const pathName = usePathname();
  const isCreate = pathName === "/admin/products/create";

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductType>({
    mode: "onChange",
    defaultValues: editForm ? editForm : defaultProduct,
    resolver: zodResolver(ProductSchema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  console.log(errors);

  const onSubmit = async (data: ProductType) => {
    console.log(data);

    let res;
    const slug = slugify(data.name);
    if (isCreate) {
      res = await addProduct({ ...data, slug: slug });
    } else {
      res = await updateProduct({ ...data, slug: slug });
    }

    if (res.success) {
      toast.success(res.message);
      // reset();
      // if (onClose) onClose();
      // router.refresh();
      router.push("/admin/products");
    } else {
      toast.error(res.message);
    }
  };
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {productForm1.map((item) =>
            item.componentType === "input" ? (
              <TextField
                key={item.id}
                required
                error={errors && item.id in errors}
                helperText={
                  errors &&
                  item.id in errors &&
                  errors[item.id as keyof ProductType]?.message
                }
                type={item.formType}
                label={item.label}
                {...register(item.id as keyof ProductType, {
                  valueAsNumber: item.formType === "number",
                })}
              />
            ) : item.componentType === "textArea" ? (
              <TextField
                multiline
                rows={8}
                key={item.id}
                required
                error={errors && item.id in errors}
                helperText={
                  errors &&
                  item.id in errors &&
                  errors[item.id as keyof ProductType]?.message
                }
                fullWidth
                type={item.formType}
                label={item.label}
                {...register(item.id as keyof ProductType, {
                  valueAsNumber: item.formType === "number",
                })}
              />
            ) : null
          )}
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-4 capitalize">
          {productForm2.map((item) =>
            item.componentType === "input" ? (
              <TextField
                key={item.id}
                required
                error={errors && item.id in errors}
                helperText={
                  errors &&
                  item.id in errors &&
                  errors[item.id as keyof ProductType]?.message
                }
                type={item.formType}
                label={item.label}
                {...register(item.id as keyof ProductType, {
                  valueAsNumber: item.formType === "number",
                })}
              />
            ) : item.componentType === "textArea" ? (
              <TextField
                multiline
                rows={5}
                key={item.id}
                required
                error={errors && item.id in errors}
                helperText={
                  errors &&
                  item.id in errors &&
                  errors[item.id as keyof ProductType]?.message
                }
                fullWidth
                type={item.formType}
                label={item.label}
                {...register(item.id as keyof ProductType, {
                  valueAsNumber: item.formType === "number",
                })}
              />
            ) : item.componentType === "select" ? (
              <FormControl
                required
                key={item.id}
                className=""
                error={errors && item.id in errors}>
                <InputLabel id={`${item.id}-label`}>{item.label}</InputLabel>
                <Select
                  {...register(item.id as keyof ProductType)}
                  value={watch(item.id as keyof ProductType)}
                  labelId={`${item.id}-label`}
                  id={`${item.id}-select`}
                  label={item.label}>
                  {item.options?.map((itemOption) => (
                    <MenuItem
                      className="capitalize"
                      key={itemOption}
                      value={itemOption}>
                      {itemOption}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors &&
                    item.id in errors &&
                    errors[item.id as keyof ProductType]?.message}
                </FormHelperText>
              </FormControl>
            ) : null
          )}
        </div>
        <div className="w-full lg:w-1/3">
          <UploadImage
            formName="imageUrl"
            name="Thumbnail"
            gallery={
              editForm ? (editForm.imageUrl ? [editForm.imageUrl] : []) : []
            }
            isMultiple={false}
            setValue={setValue}
          />
        </div>
      </div>
      <div className="flex gap-10 w-full">
        <RadioGroup
          className="w-2/5"
          label="Discount"
          orientation="horizontal"
          value={watch("onSale")}
          onValueChange={(value: string) => {
            setValue("onSale", value);
          }}>
          <Radio value="yes">Yes</Radio>
          <Radio value="no">No</Radio>
        </RadioGroup>

        <AnimatePresence>
          {watch("onSale") === "yes" && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="flex gap-4  w-full">
              <TextField
                label="Discount Percentage"
                type="number"
                {...register("discountPercentage", {
                  valueAsNumber: true,
                })}
              />

              <TextField
                className="flex-grow"
                label="Discount Label"
                type="text"
                {...register("discountLabel")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-6">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <TextField
            error={errors && "metaTitle" in errors}
            fullWidth
            className=""
            label="Meta Title"
            type="text"
            {...register("metaTitle")}
          />
          <TextField
            error={errors && "metaDescription" in errors}
            fullWidth
            multiline
            className=""
            label="Meta Description"
            rows={8}
            type="text"
            {...register("metaDescription")}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <UploadImage
            formName="sizeImageUrl"
            name="Image of Size Description"
            gallery={
              editForm
                ? editForm.sizeImageUrl
                  ? [editForm.sizeImageUrl]
                  : []
                : []
            }
            isMultiple={false}
            setValue={setValue}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-lg">Variants</p>
          <ProductVariant
            icon={<FaPlus />}
            name="Add"
            updateVariant={update}
            index={fields.length}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap justify-center items-center">
          {fields.map((variant, index) => (
            <ProductVariantCard
              key={variant.id}
              removeVariant={remove}
              updateVariant={update}
              index={index}
              variantDetail={variant}
            />
          ))}
        </div>
      </div>
      <Button
        type="submit"
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}>
        {isCreate ? "Create" : "Update"}
      </Button>
    </form>
  );
}
