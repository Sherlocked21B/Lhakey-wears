"use client";
import React from "react";
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  UseFormSetValue,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";
import { ProductVariantSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { ProductType, ProductVariantType } from "@/lib/types";
import { defaultProductVariant } from "@/lib/default";
// import { MenuItem, Select } from "@mui/material";
import { colorMapping, sizeMapping } from "@/lib/mapping";
import UploadGallery from "../UploadImage";
import { FaPlus } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

type CreateAdminProps = {
  onClose: () => void;
  updateVariant: UseFieldArrayUpdate<ProductType, "variants">;
  index: number;
  updateProductVariant?: ProductVariantType;
};
export default function CreateProductVariant({
  onClose,
  updateVariant,
  index,
  updateProductVariant,
}: CreateAdminProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductVariantType>({
    defaultValues: updateProductVariant
      ? updateProductVariant
      : defaultProductVariant,
    // resolver: zodResolver(ProductVariantSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });
  console.log("product detail:", updateProductVariant);
  console.log(watch("color"));
  console.log(watch("sizes"));
  console.log(watch("imageGallery"));

  const onSubmit = (data: ProductVariantType) => {
    console.log(data);

    updateVariant(index, data);
    onClose();
  };
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {updateProductVariant
          ? "Update Product Variant"
          : "Create Product Variant"}
      </ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-4">
          {/* <FormControl
            onClick={(e) => e.preventDefault()}
            required
            className=""
            error={errors && "color" in errors}
          >
            <InputLabel id={`color-label`}>Color</InputLabel>
            <Select
              {...register("color")}
              value={watch("color")}
              labelId={`color-label`}
              id={`color-select`}
              label={"Color"}
            >
              {Object.keys(colorMapping).map((itemOption) => (
                <option
                  className="capitalize"
                  key={itemOption}
                  value={itemOption}
                >
                  {itemOption}
                </option>
              ))}
            </Select>
            <FormHelperText>
              {errors && "color" in errors && errors.color?.message}
            </FormHelperText>
          </FormControl> */}
          {/* <Select
            value={"black"}
            className="capitalize"
            isRequired
            isInvalid={errors && "color" in errors}
            errorMessage={errors && "color" in errors && errors.color?.message}
            variant="bordered"
            label="Color"
            selectedKeys={[watch("color")]}
            {...register("color")}>
            {Object.keys(colorMapping).map((color) => (
              <SelectItem className="capitalize" key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </Select> */}
          <Input
            className="w-full"
            type="text"
            variant={"bordered"}
            label="Color"
            isRequired
            {...register("color")}
          />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3>Sizes</h3>
              <Button
                size="sm"
                isIconOnly
                radius="full"
                endContent={<FaPlus />}
                onClick={() => append({ name: "", stock: 0 })}></Button>
            </div>
            <ul className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <AnimatePresence key={field.id}>
                  <motion.li
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="flex justify-between">
                    <Select
                      className="w-3/5"
                      isRequired
                      // isInvalid={errors && `sizes.${index}.name` in errors}
                      // errorMessage={
                      //   errors && `sizes.${index}.name` in errors && errors.`sizes.${index}.name`.message
                      // }
                      variant="bordered"
                      label="Name"
                      selectedKeys={[watch(`sizes.${index}.name`)]}
                      {...register(`sizes.${index}.name`)}>
                      {Object.keys(sizeMapping).map((name) => (
                        <SelectItem
                          className="capitalize"
                          key={name}
                          value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      className="w-[25%]"
                      type="number"
                      variant={"bordered"}
                      label="Stock"
                      isRequired
                      value={watch(`sizes.${index}.stock`).toString()}
                      {...register(`sizes.${index}.stock`, {
                        valueAsNumber: true,
                      })}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}>
                      <IoIosRemoveCircle className="text-danger text-3xl" />
                    </button>
                    {/* <TextField
                    className="w-1/5"
                    required
                    // error={errors && `sizes.${index}.stock` in errors}
                    // helperText={
                    //   errors && `sizes.${index}.stock` in errors && errors[`sizes.${index}.stock`]?.message
                    // }

                    type="number"
                    label="Stock"
                    {...register(`sizes.${index}.stock`, {
                      valueAsNumber: true,
                    })}
                  /> */}
                  </motion.li>
                </AnimatePresence>
              ))}
            </ul>
          </div>
          <motion.div layout>
            <UploadGallery
              isMultiple={true}
              formName="imageGallery"
              setValue={setValue}
              name="Upload Gallery"
              gallery={
                updateProductVariant ? updateProductVariant.imageGallery : []
              }
            />
          </motion.div>
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
          {updateProductVariant ? "Update" : "Create"}
        </Button>
      </ModalFooter>
    </>
  );
}
