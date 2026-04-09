const Loader = () => {
    const placeholders = Array.from({ length: 3 });

    return (
        <div className="space-y-6">
            {placeholders.map((_, index) => (
                <div key={index} className="post-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full skeleton" />
                        <div className="h-3 w-24 rounded-full skeleton" />
                        <div className="h-3 w-16 rounded-full skeleton" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-6 w-3/4 rounded-full skeleton" />
                        <div className="h-4 w-full rounded-full skeleton" />
                        <div className="h-4 w-2/3 rounded-full skeleton" />
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-6 w-24 rounded-full skeleton" />
                        <div className="h-4 w-16 rounded-full skeleton" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Loader;