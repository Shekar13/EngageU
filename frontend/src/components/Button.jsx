import { Link } from "react-router-dom";

export default function Button({
    children,
    to,
    onClick,
    variant = "primary",
    className = "",
    type = "button"
}) {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 hover:-translate-y-0.5";

    const variants = {
        primary: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 focus:ring-primary-500 border border-transparent",
        secondary: "bg-white text-primary-700 hover:bg-gray-50 border border-gray-200 hover:border-primary-200 hover:shadow-md focus:ring-primary-500",
        ghost: "text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus:ring-gray-500",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 hover:shadow-lg hover:shadow-red-500/30",
    };

    const selectedVariant = variants[variant] || variants.primary;

    if (to) {
        return (
            <Link to={to} className={`${baseStyles} ${selectedVariant} ${className}`}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${selectedVariant} ${className}`}
        >
            {children}
        </button>
    );
}
