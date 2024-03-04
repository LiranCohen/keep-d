import { useContext } from 'react'
import { Web5Context } from './context/Web5Context'
import Dashboard from './compontents/dashboard/Dashboard';

import './App.css'
import { NotebooksProvider } from './context/NotebooksContext';

function App() {
  const { identity } = useContext(Web5Context);

  return (
    <NotebooksProvider identity={identity}>
      {!identity && <> Loading... </>}
      {identity && <Dashboard title='Notebooks' identity={identity} />}
    </NotebooksProvider>
  )
}

export default App
