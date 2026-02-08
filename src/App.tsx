import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/useSheetStore';
import { SheetPage } from './pages/SheetPage';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SheetPage />
    </Provider>
  );
};

export default App;
