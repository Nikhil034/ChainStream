export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-dark-gray">
                    &copy; {new Date().getFullYear()} ChainStream. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-xs text-primary-blue font-semibold">Trust & Tech</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <span className="text-xs text-vibrant-orange font-semibold">Energy & Flow</span>
                </div>
            </div>
        </footer>
    )
}
