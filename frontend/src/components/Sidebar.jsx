const Sidebar = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
        <h3 className="text-xl font-brand font-bold text-[var(--ink)] mb-4">Discover more</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium pill ${
              selectedCategory === null ? 'pill-active' : ''
            }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium pill ${
                selectedCategory === category._id ? 'pill-active' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
