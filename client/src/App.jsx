import { Suspense } from 'react';
import AppRouter from './routes/AppRouter.jsx';
import Spinner from './components/ui/Spinner.jsx';

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-deep flex items-center justify-center"><Spinner size="lg" /></div>}>
      <AppRouter />
    </Suspense>
  );
}
