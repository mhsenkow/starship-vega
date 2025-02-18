export const ChartFilter = ({ 
  filters, 
  onChange 
}: { 
  filters: {
    category?: ChartCategory
    useCase?: ChartUseCase
    complexity?: Complexity
    dataType?: string
    searchTerm?: string
  },
  onChange: (filters: any) => void 
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex gap-4">
        <input
          type="search"
          placeholder="Search charts..."
          className="px-3 py-2 border rounded-md"
          value={filters.searchTerm || ''}
          onChange={e => onChange({ ...filters, searchTerm: e.target.value })}
        />
        <select 
          value={filters.category || ''} 
          onChange={e => onChange({ ...filters, category: e.target.value || undefined })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          <option value="Statistical">Statistical</option>
          <option value="Time Series">Time Series</option>
          <option value="Comparison">Comparison</option>
          <option value="Distribution">Distribution</option>
          <option value="Correlation">Correlation</option>
          <option value="Part-to-Whole">Part-to-Whole</option>
          <option value="Hierarchical">Hierarchical</option>
        </select>
        <select 
          value={filters.useCase || ''} 
          onChange={e => onChange({ ...filters, useCase: e.target.value || undefined })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Use Cases</option>
          <option value="Data Analysis">Data Analysis</option>
          <option value="Business Reporting">Business Reporting</option>
          <option value="Scientific Visualization">Scientific Visualization</option>
          <option value="Dashboard">Dashboard</option>
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Complexity:</span>
          {['Beginner', 'Intermediate', 'Advanced'].map(level => (
            <button
              key={level}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.complexity === level 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100'
              }`}
              onClick={() => onChange({ 
                ...filters, 
                complexity: filters.complexity === level ? undefined : level 
              })}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 