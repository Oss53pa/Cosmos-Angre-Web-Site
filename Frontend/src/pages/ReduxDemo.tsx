import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectLanguage,
  selectNotifications,
  selectSidebarOpen,
  setLanguage,
  addNotification,
  removeNotification,
  toggleSidebar,
} from '../features/ui/uiSlice';
import { useAuth } from '../contexts/AuthContext';
import { useStores } from '../hooks/useStores';
import { useEvents } from '../hooks/useEvents';
import { Button, Card, CardHeader, CardBody, Alert, Badge, Spinner } from '../components/common';
import { User, Bell, Globe, Menu } from 'lucide-react';

const ReduxDemo: React.FC = () => {
  const dispatch = useAppDispatch();

  // UI State
  const language = useAppSelector(selectLanguage);
  const notifications = useAppSelector(selectNotifications);
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  // Auth State (Supabase)
  const { user, profile, signIn, signOut } = useAuth();
  const currentUser = profile;
  const isAuthenticated = !!user;

  // Supabase Data
  const { stores, isLoading: storesLoading, error: storesError } = useStores();
  const { isLoading: eventsLoading } = useEvents({ status: 'upcoming' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Connexion via Supabase
  const handleMockLogin = async () => {
    const { error } = await signIn(email || 'demo@cosmosangre.com', password || 'demo1234');
    if (error) {
      dispatch(addNotification({ type: 'error', message: error }));
    } else {
      dispatch(addNotification({ type: 'success', message: 'Connexion réussie !' }));
    }
  };

  const handleLogout = async () => {
    await signOut();
    dispatch(addNotification({ type: 'info', message: 'Déconnexion réussie' }));
  };

  const handleToggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    dispatch(setLanguage(newLang));
    dispatch(
      addNotification({
        type: 'success',
        message: `Langue changée en ${newLang.toUpperCase()}`,
      })
    );
  };

  const handleAddNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    dispatch(
      addNotification({
        type,
        message: `Ceci est une notification de type ${type}`,
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-cosmos py-12">
        <h1 className="text-4xl font-poppins font-bold text-cosmos-blue mb-2">
          Démonstration Redux Toolkit
        </h1>
        <p className="text-gray-600 mb-8">Gestion d'état avec Redux Toolkit & RTK Query</p>

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              variant={notification.type}
              closable
              onClose={() => dispatch(removeNotification(notification.id))}
            >
              {notification.message}
            </Alert>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* UI State Demo */}
          <Card>
            <CardHeader title="UI State Management" />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Langue actuelle</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant={language === 'fr' ? 'primary' : 'info'} icon={Globe}>
                      {language === 'fr' ? 'Français' : 'English'}
                    </Badge>
                    <Button size="sm" onClick={handleToggleLanguage}>
                      Changer de langue
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sidebar State</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant={sidebarOpen ? 'success' : 'warning'} icon={Menu}>
                      {sidebarOpen ? 'Ouverte' : 'Fermée'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => dispatch(toggleSidebar())}>
                      Toggle Sidebar
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleAddNotification('success')}>
                      Success
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleAddNotification('error')}
                    >
                      Error
                    </Button>
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => handleAddNotification('warning')}
                    >
                      Warning
                    </Button>
                    <Button size="sm" variant="dark" onClick={() => handleAddNotification('info')}>
                      Info
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Notifications actives : {notifications.length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Auth State Demo */}
          <Card>
            <CardHeader title="Authentication State" />
            <CardBody>
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <Alert variant="info">Simulation de connexion (pas de vraie API)</Alert>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@cosmosangre.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button isFullWidth onClick={handleMockLogin}>
                    Se connecter (Simulé)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="success">Vous êtes connecté !</Alert>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-cosmos-blue rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{currentUser?.email}</p>
                      <Badge variant="night" size="sm">
                        {currentUser?.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="danger" isFullWidth onClick={handleLogout}>
                    Se déconnecter
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* RTK Query Demo */}
        <Card>
          <CardHeader title="RTK Query - API Calls Demo" />
          <CardBody>
            <Alert variant="warning" className="mb-4">
              Ces requêtes vont échouer car le backend n'est pas encore configuré. C'est normal !
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stores Query */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Boutiques (useGetStoresQuery)
                </h3>
                {storesLoading ? (
                  <Spinner label="Chargement..." />
                ) : storesError ? (
                  <Alert variant="error">
                    Erreur: Backend non disponible (normal pour la démo)
                  </Alert>
                ) : stores ? (
                  <div className="space-y-2">
                    {stores.slice(0, 3).map((store) => (
                      <div key={store.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-gray-600">{store.floor}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune donnée</p>
                )}
              </div>

              {/* Events Query */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Événements (useGetEventsQuery)
                </h3>
                {eventsLoading ? (
                  <Spinner label="Chargement..." />
                ) : (
                  <Alert variant="error">Backend non disponible (normal pour la démo)</Alert>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-cosmos-blue mb-2">Comment utiliser RTK Query ?</h4>
              <code className="text-sm bg-white p-2 rounded block">
                const {'{ data, isLoading, error }'} = useGetStoresQuery();
              </code>
              <p className="text-sm text-gray-600 mt-2">
                RTK Query gère automatiquement le caching, la synchronisation et la mise à jour des
                données !
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Code Examples */}
        <Card className="mt-6">
          <CardHeader title="Exemples de Code" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Utiliser un selector :</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
                  {`import { useAppSelector } from './store/hooks';
import { selectLanguage } from './features/ui/uiSlice';

const language = useAppSelector(selectLanguage);`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dispatch une action :</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
                  {`import { useAppDispatch } from './store/hooks';
import { setLanguage } from './features/ui/uiSlice';

const dispatch = useAppDispatch();
dispatch(setLanguage('en'));`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">RTK Query :</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
                  {`import { useGetStoresQuery } from './services/storesApi';

const { data, isLoading, error } = useGetStoresQuery();`}
                </pre>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ReduxDemo;
