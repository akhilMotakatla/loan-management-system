import { Suspense } from 'react';
import AppRouter from './routes/AppRouter.jsx';
import Spinner from './components/ui/Spinner.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import LuxuryCursor from './components/ui/LuxuryCursor.jsx';
import ScrollProgress from './components/ui/ScrollProgress.jsx';

export default function App() {
  return (
    <>
      <LoadingScreen />
      <LuxuryCursor />
      <ScrollProgress />
      <Suspense fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <AppRouter />
      </Suspense>
    </>
  );
}
