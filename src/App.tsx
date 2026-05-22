import { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';

import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import routes from './routes';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleRoute from './components/Auth/RoleRoute';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />

      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />

            {routes.map((route, index) => {
              const { path, component: Component, allowedRoles } = route;

              const pageElement = (
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              );

              if (allowedRoles && allowedRoles.length > 0) {
                return (
                  <Route
                    key={index}
                    element={<RoleRoute allowedRoles={allowedRoles} />}
                  >
                    <Route path={path} element={pageElement} />
                  </Route>
                );
              }

              return <Route key={index} path={path} element={pageElement} />;
            })}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
