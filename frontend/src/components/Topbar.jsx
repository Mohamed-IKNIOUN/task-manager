function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <h2 className="text-lg font-semibold text-gray-800">
        Task Manager
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
          M
        </div>

        <span className="text-sm font-medium text-gray-700">
          Mohamed
        </span>
      </div>
    </header>
  );
}

export default Topbar;