
# Tutorial de varios temas de Zustand

## 1. Uso de Persist (e Immer)
Para mantener el estado de la tienda incluso después de recargar la página, puedes usar la funcionalidad de persistencia. Esto se hace usando el middleware `persist`.
~~~
// useUsersStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useUsersStore = create(
  persist(
    immer((set) => ({
      usuarios: [],
      agregarUsuario: (usuario) =>
        set((state) => {
          state.usuarios.push(usuario)
        }),
      eliminarUsuario: (id) =>
        set((state) => {
          const index = state.usuarios.findIndex((u) => u.id === id)
          if (index !== -1) {
            state.usuarios.splice(index, 1)
          }
        }),
      actualizarUsuario: (id, datosActualizados) =>
        set((state) => {
          const usuario = state.usuarios.find((u) => u.id === id)
          if (usuario) {
            Object.assign(usuario, datosActualizados)
          }
        }),
    })),
    {
      name: 'usuario-storage',
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useUsersStore
~~~
Ejemplo de Uso:
~~~
import React, { useState } from 'react'
import useUsersStore from './useUsersStore'

const UserManager = () => {
  const { usuarios, agregarUsuario, eliminarUsuario, actualizarUsuario } = useUsersStore()
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoUsuario(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    agregarUsuario({ id: Date.now(), ...nuevoUsuario })
    setNuevoUsuario({ nombre: '', email: '' })
  }

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          value={nuevoUsuario.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
        />
        <input
          name="email"
          value={nuevoUsuario.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <button type="submit">Agregar Usuario</button>
      </form>

      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>
            {usuario.nombre} ({usuario.email})
            <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
            <button onClick={() => actualizarUsuario(usuario.id, { nombre: usuario.nombre + ' (Actualizado)' })}>
              Actualizar Nombre
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserManager
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
export const useCount = (state) => state.count;

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
    { name: 'Counter Store' } // nombre para las DevTools. opcional?
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
