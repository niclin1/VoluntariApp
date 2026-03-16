import { AppProvider } from '../src/context/AppContext';
import App from '../src/App';
import '../src/styles/global.css';
export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
