import StudentRegistrationForm from './components/StudentRegistrationForm';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <>
      <StudentRegistrationForm />
      <Toaster />
    </>
  );
}

export default App;