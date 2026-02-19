export default function Card({ title, description, image, footer, className = "", onClick }) {
    return (
        <div
            onClick={onClick}
            className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:hover:-translate-y-1 hover:shadow-2xl cursor-pointer group ${className}`}
        >
            {image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}

            <div className="p-5">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {description}
                    </p>
                )}

                {footer && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
