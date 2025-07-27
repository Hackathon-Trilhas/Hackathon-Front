import { useState, useEffect, useCallback } from 'react';
import { fetchHealthUnits, fetchMunicipios } from '../../api';
import GoogleMap from "../Googlemap";
import  userLocation  from "../Googlemap";
import MessageModal from "../MessageModal";
import Footer from "../Footer/Footer";
import './HealthUnitsSearch.css';

interface HealthUnit {
    id: string;
    displayName?: {
        text: string;
    };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
}

interface HealthUnitSearchProps {
    onClose?: () => void;
}

const HealthUnitsSearch = ({ onClose }: HealthUnitSearchProps) => {
    
    const [category, setCategory] = useState<string>('');
    const [municipio, setMunicipio] = useState<string>('todos');
    const [municipios, setMunicipios] = useState<string[]>([]);
    
   
    const [healthUnits, setHealthUnits] = useState<Record<string, HealthUnit[]>>({});
    const [totalResults, setTotalResults] = useState<number>(0);
    
   
    const [loading, setLoading] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    
    
    const [selectedDestination, setSelectedDestination] = useState<{
        place_id: string;
        name: string;
        formatted_address: string;
    } | null>(null);

  
    const categories = [
        { value: "Clínica Geral", label: "Clínica Geral" },
        { value: "Hospital", label: "Hospital" },
        { value: "Farmácia", label: "Farmácia" },
        { value: "Posto de Saúde", label: "Posto de Saúde" },
        { value: "Laboratório", label: "Laboratório" }
    ];
    useEffect(() => {
        if (!onClose) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    const showMessageModal = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
    };
    const populateMunicipios = useCallback(async () => {
        try {
            const municipiosData = await fetchMunicipios();
            setMunicipios(municipiosData.sort());
        } catch (e) {
            showMessageModal("");
        }
    }, []);
    const fetchUnits = useCallback(async () => {
        if (category && municipio) {
            setLoading(true);
            try {
                const dataByMunicipality = await fetchHealthUnits(category, municipio);
                setHealthUnits(dataByMunicipality);
                const total = (Object.values(dataByMunicipality) as HealthUnit[][])
                    .reduce((sum, unitsArray) => sum + unitsArray.length, 0);
                setTotalResults(total);
            } catch (e) {
                console.error("Erro ao buscar unidades:", e);
                showMessageModal("Ocorreu um erro ao buscar os dados.");
                setHealthUnits({});
                setTotalResults(0);
            } finally {
                setLoading(false);
            }
        }
        if (!category && !municipio) {return}

    }, [category, municipio]);
    const handleTraceRoute = (unit: HealthUnit) => {
        setSelectedDestination({
            place_id: unit.id,
            name: unit.displayName?.text || "Nome não disponível",
            formatted_address: unit.formattedAddress || "Não informado",
        });
    };
    useEffect(() => {
        populateMunicipios();
    }, [populateMunicipios]);
    useEffect(() => {
        if (category) {
            fetchUnits();
        }
    }, [category, municipio, fetchUnits]);
    const renderResults = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Buscando unidades de saúde...</p>
                </div>
            );
        }

        if (!category) {
            return (
                <div className="empty-container">
                    <div className="empty-icon">📋</div>
                    <p className="empty-text">Selecione uma categoria para começar a busca.</p>
                </div>
            );
        }

        if (Object.keys(healthUnits).length === 0) {
            return (
                <div className="empty-container">
                    <div className="empty-icon">❌</div>
                    <p className="empty-text">Nenhuma unidade encontrada para os filtros selecionados.</p>
                    <p className="empty-subtext">Tente selecionar uma categoria diferente ou ampliar a área de busca.</p>
                </div>
            );
        }

        return (
            <div className="results-list">
                {/* Total de resultados */}
                <div className="results-summary">
                    <p className="results-summary-text">
                        ✅ Encontradas {totalResults} unidade{totalResults !== 1 ? 's' : ''} de saúde
                    </p>
                </div>

                {/* Lista de municípios e unidades */}
                {Object.keys(healthUnits).map((municipioName) => (
                    <div key={municipioName} className="municipio-section">
                        <h3 className="municipio-title">
                            📍 {municipioName} ({healthUnits[municipioName].length} unidade{healthUnits[municipioName].length !== 1 ? 's' : ''})
                        </h3>
                        
                        <div className="units-list">
                            {healthUnits[municipioName].map((unit) => (
                                <div key={unit.id} className="unit-card">
                                    <h4 className="unit-name">
                                        🏥 {unit.displayName?.text || "Unidade de Saúde"}
                                    </h4>
                                    <p className="unit-address">
                                        📍 {unit.formattedAddress || "Endereço não disponível"}
                                    </p>
                                    {unit.nationalPhoneNumber && (
                                        <p className="unit-phone">
                                            📞 {unit.nationalPhoneNumber}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => handleTraceRoute(unit)}
                                        className="route-button"
                                        aria-label={`Traçar rota para ${unit.displayName?.text || 'unidade de saúde'}`}>
                                        🗺️ Traçar Rota
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    return (
        <div className="health-search-container">
            {/* Botão de fechar */}
            {onClose && (
                <button 
                    className="close-button"
                    onClick={onClose}
                    aria-label="Fechar busca de unidades de saúde"
                    title="Fechar">
                    ✕
                </button>
            )}

            {/* Header */}
            <div className="search-header">
                <h1 className="search-title">
                    🏥 Buscar Unidades de Saúde
                </h1>
                <p className="search-subtitle">
                    Encontre unidades de saúde próximas a você
                </p>
            </div>

            {/* Layout principal - Duas colunas */}
            <div className="main-layout">
                {/* Coluna esquerda - Filtros e Resultados */}
                <div className="left-column">
                    {/* Card de filtros */}
                    <div className="filters-card">
                        <h2 className="filters-title">
                            🔍 Filtros de Busca
                        </h2>
                        
                        <div>
                            {/* Categoria */}
                            <div className="form-group">
                                <label htmlFor="category-select" className="form-label">
                                    Selecione a Categoria:
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-select"
                                    id="category-select">
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                <small className="form-help">
                                    Escolha o tipo de unidade de saúde que você está procurando
                                </small>
                            </div>

                        </div>
                    </div>

                    {/* Resultados */}
                    <div className="results-card">
                        <div className="results-header">
                            <h2 className="results-title">
                                📋 Resultados da Busca
                            </h2>
                        </div>
                        <div className="results-content">
                            {renderResults()}
                        </div>
                    </div>
                </div>

                {/* Coluna direita - Mapa */}
                <div className="right-column">
                    <div className="map-card">
                        <div className="map-header">
                            <h2 className="map-title">
                                🗺️ Localização no Mapa
                            </h2>
                        </div>
                        <div className="map-content">
                            <GoogleMap
                                destination={selectedDestination}
                                onRouteCleared={() => setSelectedDestination(null)}
                                showMessage={showMessageModal}
                                onAddressConfirmed={(city) => setMunicipio(city)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de mensagem */}
            <MessageModal
                message={modalMessage}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
};
export default HealthUnitsSearch;