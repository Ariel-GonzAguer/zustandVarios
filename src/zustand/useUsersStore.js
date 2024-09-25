import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useUsersStore = create(
    // para persistir datos en el localStorage usamos el middleware persist.
    // todo el estado debe estar dentro de persist, icluyendo immer

    // para usar las devtools de REDUX, usamos el middleware devtools
    //todo el estado debe estar dentro de devtools, incluido el persist
    devtools(
        persist(
            immer((set) => ({
                usuarios: [],
                cats: ['rojizo'],
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
                storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
                onRehydrateStorage: (state) => {
                    console.log('hydration starts')

                    // optional
                    return (state, error) => {
                        if (error) {
                            console.log('an error happened during hydration', error)
                        } else {
                            console.log('hydration finished')
                        }
                    }
                },
            },
            //para devtools
            { name: 'usuario-storageZ' }
        )
    )
)

// seletores
export const selectUsersCount = (state) => state.usuarios.length;
export const selectCats = (state) => state.cats;

export default useUsersStore