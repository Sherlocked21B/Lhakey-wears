"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  SelectItem,
  Select,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { LuEye, LuTrash2 } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { capitalize, getTotalStock } from "@/lib/utils";
import ModalButton from "../ModalButton/ModalButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { updateProgressStatus } from "@/services/order";
import { revalidatePath } from "next/cache";

const statusColorMap: Record<string, ChipProps["color"]> = {
  delivered: "success",
  shipped: "primary",
  pending: "warning",
  cancelled: "danger",
};

// const INITIAL_VISIBLE_COLUMNS = ["name", "email", "actions"];
const statusOptions = [
  { name: "Delivered", uid: "delivered" },
  { name: "Shipped", uid: "shipped" },
  { name: "Processing", uid: "pending" },
  { name: "Cancelled", uid: "cancelled" },
];
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string | undefined;
  imageUrl?: string;
};

type TableProps = {
  columns: { name: string; uid: string; sortable?: boolean }[];
  users: any;
  actions?: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  modal?: React.FC;
  deleteItem?: (id: string) => Promise<any>;
  createPage?: string;
};

export default function MyTable({
  deleteItem,
  columns,
  users,
  actions,
  modal,
  createPage,
}: TableProps) {
  console.log("users: ", users);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>("all");
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [statusValue, setStatusValue] = useState("");
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const [page, setPage] = React.useState(1);
  const [isMobile, setIsMobile] = React.useState(true);
  const router = useRouter();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  function handleSelectionChange(e: any, user: any) {
    console.log("row value: ", user);
    setCurrentOrder(user);

    onOpen();
    setStatusValue(e.currentKey);
    console.log(e.currentKey);
  }
  async function handleStatusChangeConfirmation() {
    const res = await updateProgressStatus(
      statusValue,
      currentOrder.user._id,
      currentOrder._id
    );
    if (res.success) {
      toast.success("Order Status Updated Successfully");
      router.refresh();
      onClose();
    } else {
      toast.error(res.message);
    }
  }

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      users &&
      Array.isArray(users) &&
      users.length > 0 &&
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.currentProgress &&
          Array.from(statusFilter).includes(user.currentProgress)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as unknown as number;
      const second = b[
        sortDescriptor.column as keyof User
      ] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  async function handleDelete(id: string) {
    if (deleteItem) {
      const res = await deleteItem(id);

      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    }
  }

  const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user?.imageUrl || user?.image || "/default-avatar.png",
            }}
            // description={user.email}
            name={cellValue}
            className="capitalize"
          >
            {user.email}
          </User>
        );
      case "userEmail":
        return <p>{user.user.email}</p>;
      case "stock":
        return <p>{getTotalStock(user.variants)}</p>;
      // case "role":
      //   return (
      //     <div className="flex flex-col">
      //       <p className="text-bold text-small capitalize">{cellValue}</p>
      //       <p className="text-bold text-tiny capitalize text-default-400">
      //         {user.team}
      //       </p>
      //     </div>
      //   );
      case "discount":
        return <p>{cellValue}%</p>;
      case "category":
        return <p className="capitalize">{cellValue}</p>;

      case "status":
        return (
          <>
            {user.currentProgress && (
              // <Chip
              //   className="capitalize"
              //   color={statusColorMap[user.currentProgress]}
              //   size="sm"
              //   variant="flat"
              // >
              //   {user.currentProgress}
              // </Chip>
              // <Dropdown>
              //   <DropdownTrigger className="hidden sm:flex">
              //     <Button
              //       size={isMobile ? "sm" : "md"}
              //       endContent={<FaChevronDown className="text-small" />}
              //       variant="flat"
              //     >
              //       {user.currentProgress}
              //     </Button>
              //   </DropdownTrigger>
              <Select
                radius="full"
                aria-label="Select status"
                selectedKeys={[user.currentProgress]}
                className="min-w-xs"
                onSelectionChange={(e) => handleSelectionChange(e, user)}
                color={
                  statusColorMap[
                    user.currentProgress as keyof typeof statusColorMap
                  ]
                }
              >
                {statusOptions.map((status) => (
                  <SelectItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </SelectItem>
                ))}
              </Select>
            )}
          </>
        );

      case "paymentMethod":
        return <p className="uppercase">{cellValue}</p>;
      case "start":
      case "expiry":
      case "createdAt":
        return (
          <p>
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "short",
              timeStyle: "short",
              timeZone: "Asia/Kathmandu",
            }).format(new Date(cellValue))}
          </p>
        );
      case "actions":
        return (
          <>
            {actions && (
              <div className="relative flex items-center gap-4">
                {actions.view && (
                  <Tooltip content="View">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Link
                        href={`/products/${user.category}/${user.slug}`}
                        target="_blank"
                      >
                        <LuEye />
                      </Link>
                    </span>
                  </Tooltip>
                )}
                {actions.edit && (
                  <Tooltip content="Edit">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() =>
                        user.slug &&
                        router.push(`/admin/products/edit/${user.slug}`)
                      }
                    >
                      <BiEditAlt />
                    </span>
                  </Tooltip>
                )}
                {actions.delete && (
                  <Tooltip color="danger" content="Delete">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleDelete(user._id)}
                    >
                      <LuTrash2 />
                    </span>
                  </Tooltip>
                )}
              </div>
            )}
          </>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setIsMobile(false);
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<FiSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 justify-between ">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size={isMobile ? "sm" : "md"}
                  endContent={<FaChevronDown className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size={isMobile ? "sm" : "md"}
                  endContent={<FaChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {createPage && (
              <Link href={createPage}>
                <Button
                  size={isMobile ? "sm" : "md"}
                  color="primary"
                  endContent={<FaPlus />}
                >
                  Add
                </Button>
              </Link>
            )}
            {modal && (
              <ModalButton
                name="Add new"
                icon={<FaPlus />}
                isMobile={isMobile}
                MyModal={modal}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total: {users.length}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:&nbsp;{rowsPerPage}
            {/* <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select> */}
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Your Change</ModalHeader>
              <ModalBody>
                <p className="text-danger">
                  Change the Status to {statusValue}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleStatusChangeConfirmation}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table
        isStriped
        className="max-w-[calc(100vw-6rem)]  mx-auto pt-6 lg:pt-8"
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "h-[385px]",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No Data found"} items={sortedItems}>
          {(item) => (
            <TableRow className="h-[61.6px]" key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
