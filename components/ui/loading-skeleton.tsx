export function LoadingSkeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
    );
}

export function StoreCardSkeleton() {
    return (
        <div className="p-4 border border-gray-100 rounded-xl space-y-3">
            <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2 pt-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );
}
