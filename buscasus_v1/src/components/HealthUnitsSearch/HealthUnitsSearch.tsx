import { useState, useEffect, useCallback } from 'react';
import { fetchHealthUnits, fetchMunicipios } from '../../api';
import GoogleMap from "../Googlemap";
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
    const [userPlaceId, setUserPlaceId] = useState<string>('');
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
    const [isAddressConfirmed, setIsAddressConfirmed] = useState<boolean>(false);
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
    const handleAddressConfirmed = (city: string, place_id: string) => {
        setUserPlaceId(place_id);
        setIsAddressConfirmed(true);
    };
    const handleSearch = useCallback(async () => {
        if (!category || !userPlaceId) {
            showMessageModal("Por favor, selecione uma categoria e confirme seu endereço.");
            return;
        }
        setLoading(true);
        try {
            const dataByMunicipality = await fetchHealthUnits(category, "cidade-mock");
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
    }, [category, userPlaceId]);
    const handleTraceRoute = (unit: HealthUnit) => {
        setSelectedDestination({
            place_id: unit.id,
            name: unit.displayName?.text || "Nome não disponível",
            formatted_address: unit.formattedAddress || "Não informado",
        });
       
    };
    const handleClearRoute = () => {
        setSelectedDestination(null);
    }
    const renderResults = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Buscando unidades de saúde...</p>
                </div>
            );
        }
        if (!isAddressConfirmed) {
            return (
                <div className="empty-container">
                    <div className="empty-icon">📋</div>
                    <p className="empty-text">Confirme seu endereço para começar a busca.</p>
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
        if (Object.keys(healthUnits).length === 0 && !loading) {
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
                <div className="results-summary">
                    <p className="results-summary-text">
                        ✅ Encontradas {totalResults} unidade{totalResults !== 1 ? 's' : ''} de saúde
                    </p>
                </div>
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
                                    <p>
                                        🕒 Horário de Funcionamento: 8:00 às 17:00
                                    </p>
                                    <div className='tag-container'>
                                        <h4 className='tag-tipo'>Estadual</h4>
                                        <h4 className='tag-tipo'>Público</h4>
                                        <h4 className='tag-tipo'>Pronto Atendimento</h4>
                                    </div>
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
            {onClose && (
                <button
                    className="health-search-close-button"
                    onClick={onClose}
                    aria-label="Fechar busca de unidades de saúde"
                    title="Fechar">
                    ✕
                </button>
            )}
            
            <div className="main-layout">
                <div className="left-column">
                    <div className="filters-card">
                        <h2 className="filters-title">
                            🔍 Filtros de Busca
                        </h2>
                        <div>
                            <div className="form-group">
                                <label htmlFor="category-select" className="form-label">
                                    Selecione a Categoria:
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-select"
                                    id="category-select"
                                    disabled={!isAddressConfirmed}>
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
                            {isAddressConfirmed && (
                                <button
                                    onClick={handleSearch}
                                    className="search-button"
                                    disabled={!category}>
                                    Buscar Unidades
                                </button>
                            )}
                        </div>
                    </div>
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
                                onRouteCleared={handleClearRoute}
                                showMessage={showMessageModal}
                                onAddressConfirmed={handleAddressConfirmed}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <MessageModal
                message={modalMessage}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
            <Footer />
        </div>
    );
};
export default HealthUnitsSearch;