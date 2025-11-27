import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { userService } from '../../Service/userService';

interface UserSearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export default function UserSearchBar({ 
  placeholder = 'Buscar usuarios...', 
  autoFocus = false 
}: UserSearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar sugerencias
  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const results = await userService.getUsernameSuggestions(query.trim());
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/members/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (username: string) => {
    navigate(`/profile/${username}`);
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-80 overflow-y-auto">
          {suggestions.map((username) => (
            <button
              key={username}
              onClick={() => handleSuggestionClick(username)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">@{username}</span>
              </div>
            </button>
          ))}
          
          {/* Botón para ver todos los resultados */}
          <div className="border-t border-gray-200 mt-2 pt-2 px-4">
            <button
              onClick={() => handleSearch()}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Ver todos los resultados para "{query}"
            </button>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showSuggestions && query.length >= 2 && !loading && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 text-center">
            No se encontraron usuarios
          </p>
        </div>
      )}
    </div>
  );
}