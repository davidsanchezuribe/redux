// import { createSelector } from '@reduxjs/toolkit';
import { createAction, createEntityAdapter, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlicev2';
// import { AppDispatch, RootState } from './store';

const notificationsReceived = createAction<Array<{ date: string }>>('notifications/notificationsReceived');

export const notificationsApiExtension = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Array<{ date: string }>, void>({
      query: () => '/notifications',
      // Operacion que se corre la primera vez que se ingresan datos
      async onCacheEntryAdded(
        arg,
        {
          updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch,
        },
      ) {
        // Se crea una conexión al socket
        const ws = new WebSocket('ws://localhost');
        try {
          // Se espera que se termine el primer query antes de proceder
          await cacheDataLoaded;
          // Se crea un listener que actualiza los datos cada que
          // vez que se reciben desde el servidor mirar propiedades en:
          // https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent
          const listener = (event : MessageEvent) => {
            const message = JSON.parse(event.data);
            // data tiene tipo y payload
            switch (message.type) {
              // Un websocket puede tener diferentes tipos de mensajes
              case 'notifications': {
                // Este draft corresponde al elemento que tiene el query cuando
                // lo recibe me imagino que cada vez que recibe un elemento lo va actualizando
                // resumen: 1 - Recibe un array con x elementos 2 - El socket lo va llenando
                updateCachedData((draft) => {
                  draft.push(...message.payload);
                  draft.sort((a, b) => b.date.localeCompare(a.date));
                });
                // Se lanza una accion para poder rastrear que mensajes se han leido
                dispatch(notificationsReceived(message.payload));
                break;
              }
              default:
                break;
            }
          };
          ws.addEventListener('message', listener);
        } catch {
          // Si cacheEntryRemoved resuelve antes que cacheDataLoaded
        }
        // Resuelve cuando la suscripción no está más activa
        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApiExtension;

// Sección de selectors

export const selectNotificationsResult = notificationsApiExtension
  .endpoints.getNotifications.select();

const notificationsAdapter = createEntityAdapter<string>();

const matchNotificationsReceived = isAnyOf(
  // Recibidas mediante el websocket
  notificationsReceived,
  // Recibidas normalmente mediante el query
  // O sea que matchFullfilled tiene las notificaciones?
  notificationsApiExtension.endpoints.getNotifications.matchFulfilled,
);
 const notificationsSlice = createSlice({

 });


// Métodos para forzar llamado al websocket quemado en fakeApi
/* const emptyNotifications: Array<{ date: string }> = [];
const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => (notificationsResult.data ?? emptyNotifications),
);

export const fetchNotificationsWebsocket = () => (
  dispatch: AppDispatch,
  getState: () => RootState,
) => {
  const allNotifications = selectNotificationsData(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification?.date ?? '';

  //forceGenerateNotifications(latestTimestamp);
}; */
