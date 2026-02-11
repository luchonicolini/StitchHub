import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-ink shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-ink hover:bg-[#ffe564] hover:-translate-y-1 hover:shadow-hard",
                neobrutalism: "bg-ink text-white hover:bg-white hover:text-ink hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#2a9d8f]", // The hero "Start Browsing" style
                outline: "bg-white text-ink hover:bg-ink/5 hover:-translate-y-1 hover:shadow-hard",
                ghost: "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                secondary: "bg-white text-ink hover:bg-ink/5 hover:-translate-y-1 hover:shadow-hard", // Similar to outline but semantic
                destructive: "bg-accent-orange text-white hover:bg-accent-orange/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-14 px-8 text-lg", // Matches hero buttons
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
