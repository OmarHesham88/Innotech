import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useContext } from 'react';
import ScrollableContainer from './views/formsdata/components/scroller/ScrollableContainer';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);
  return (
    <ThemeProvider theme={theme}>
      <RTL direction={activeDir}>
        <CssBaseline />
        <ScrollableContainer maxHeight="100vh">
          <RouterProvider router={router} />
        </ScrollableContainer>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
