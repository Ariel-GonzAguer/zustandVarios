
# Tutorial de varios temas de Zustand

## 1. Uso de Persist
Para mantener el estado de la tienda incluso después de recargar la página, puedes usar la funcionalidad de persistencia. Esto se hace usando el middleware persist.

Uso:
~~~
// store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
        {
      name: 'counter-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  )
);

export default useStore;
~~~

## 2. Selectores
Los selectores permiten acceder a partes del estado sin tener que volver a renderizar el componente cada vez que se actualiza el estado completo.

Ejemplo:
~~~
// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'counter-storage',
    }
  )
);

// Selector
export const useCount = () => {
  return useStore((state) => state.count);
};

export default useStore;
~~~
Uso en el Componente:
~~~
// Counter.js
import React from 'react';
import useStore, { useCount } from './store';

const Counter = () => {
  const count = useCount();
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);

  return (
    <div>
      <h1>Contador: {count}</h1>
      <button onClick={increment}>Incrementar</button>
      <button onClick={decrement}>Decrementar</button>
    </div>
  );
};

export default Counter;
~~~

## 3. Uso de DevTools
Zustand tiene soporte para DevTools, lo que facilita la depuración. Puedes habilitarlo usando el middleware devtools.
~~~
// store.js
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }),
      {
        name: 'counter-storage',
      }
    ),
    { name: 'Counter Store' } // nombre para las DevTools
  )
);

export default useStore;
~~~

## 4. Testing
Para probar tu tienda Zustand, puedes usar `jest` y `@testing-library/react`. A continuación, un ejemplo básico de prueba.

Instalación de Dependencias de Prueba:
~~~
npm install --save-dev @testing-library/react jest
~~~
Ejemplo de Test:
~~~
// Counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Counter from './Counter';

// Mock de la tienda
const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'counter-storage',
    }
  )
);

test('incrementa el contador', () => {
  render(<Counter />);

  const incrementButton = screen.getByText(/incrementar/i);
  fireEvent.click(incrementButton);

  expect(screen.getByText(/contador: 1/i)).toBeInTheDocument();
});
~~~