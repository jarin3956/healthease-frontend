import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store, persistor } from './Redux- toolkit/store'
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider } from './Context/SocketProvider';
import { Auth0Provider } from '@auth0/auth0-react';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Auth0Provider 
      domain="dev-cjjjzlmy4wvrwmzq.us.auth0.com"
      clientId="Lj9DMlAPKr2Yh3qZNNe4MZGS3sHAeHrL"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
     >
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor} >
          <SocketProvider>
            <App />
          </SocketProvider>
        </PersistGate>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>


);

reportWebVitals();
