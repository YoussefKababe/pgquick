import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('app'));
root.render(<h2 className='text-red-500'>Hello from React!</h2>);