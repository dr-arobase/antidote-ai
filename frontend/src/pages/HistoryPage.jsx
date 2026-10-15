import React from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../components/History/History';

/**
 * Page historique — restaure un texte sauvegardé dans l'éditeur.
 */
const HistoryPage = () => {
  const navigate = useNavigate();

  const handleRestore = (item) => {
    // Passe le texte via sessionStorage pour le récupérer dans EditorPage
    sessionStorage.setItem(
      'restoreText',
      JSON.stringify({ text: item.correctedText || item.originalText, language: item.language })
    );
    navigate('/');
  };

  return <History onRestore={handleRestore} />;
};

export default HistoryPage;
