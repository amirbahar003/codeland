export default function SiteContainer({ children, className = "" }) {
    return (
        <main
            className={`mx-auto w-[92%] max-w-7xl overflow-x-hidden bg-transparent ${className}`}
        >
            {children}
        </main>
    );
}