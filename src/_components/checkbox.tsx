import { cva, type VariantProps } from "class-variance-authority"
import {
  Checkbox as ReactAriaCheckbox,
  type CheckboxProps as ReactAriaCheckboxProps,
} from "react-aria-components"
import { cn } from "../lib/utils"

const variants = cva(
  "group flex w-fit items-center gap-2 cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        lg: "text-lg",
        md: "text-base",
        sm: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

const innerVariants = cva(
  [
    "flex items-center justify-center rounded border-2 transition-colors",
    "group-focus:ring-1 group-focus:ring-gray-500 group-focus:ring-offset-1",
    "group-selected:border-gray-500 group-selected:bg-gray-500",
    "group-disabled:border-gray-300 group-disabled:bg-gray-300",
    "group-indeterminate:border-gray-500 group-indeterminate:bg-gray-500",
    "group-invalid:border-red-500",
    "group-selected:group-disabled:border-gray-300 group-selected:group-disabled:bg-gray-300 group-selected:group-disabled:text-gray-500",
    "group-indeterminate:group-disabled:border-gray-300 group-indeterminate:group-disabled:bg-gray-300 group-indeterminate:group-disabled:text-gray-500",
    "group-selected:group-invalid:border-red-500 group-selected:group-invalid:bg-red-500 group-selected:group-invalid:text-red-500",
  ],
  {
    variants: {
      size: {
        lg: "size-5",
        md: "size-4",
        sm: "size-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

export type Props = ReactAriaCheckboxProps &
  VariantProps<typeof variants> &
  VariantProps<typeof innerVariants> & {
    className?: string
    children?: React.ReactNode
    size?: "lg" | "md" | "sm"
  }

export function Checkbox({ className, size, children, ...props }: Props) {
  return (
    <ReactAriaCheckbox className={cn(variants({ size }), className)} {...props}>
      <div className={innerVariants({ size })}>
        <svg
          viewBox="0 0 12 10"
          className="fill-none stroke-current stroke-2 transition-all duration-300 [stroke-dasharray:22] [stroke-dashoffset:66] group-indeterminate:hidden group-selected:block group-selected:[stroke-dasharray:28]"
          color="currentColor"
        >
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="hidden stroke-current stroke-[4] group-indeterminate:block"
          color="currentColor"
        >
          <line x1="21" x2="3" y1="12" y2="12" />
        </svg>
      </div>
      {children && (
        <span className="text-black group-invalid:text-red-500 group-disabled:opacity-40">
          {children}
        </span>
      )}
    </ReactAriaCheckbox>
  )
}
