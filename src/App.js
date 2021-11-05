
import { useState, useEffect, createContext } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import { supabase } from './supabaseClient';
import Home from './Home';
import Header from './components/header/Header';
import Auth from './components/auth/Auth';
import Account from './components/auth/Account';

export const SessionContext = createContext(null);

function App() {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setSession(supabase.auth.session());

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	useEffect(() => {
		setLoading(false);
	}, [session]);

	if (loading) {
		return <div>loading...</div>;
	}

	const isAuth = () => {
		if (session) {
			return true;
		}
		else {
			return false;
		}
	}

	return (
		<SessionContext.Provider value={session}>
			<Router>
				<Header />
				<main>
					<Switch>
						<Route path="/login" component={() => Auth(session)} />
						<PrivateRoute authed={isAuth()} exact path="/" component={Home} />
						<PrivateRoute authed={isAuth()} path="/profile" component={Account} />
					</Switch>
				</main>
			</Router>
		</SessionContext.Provider>
	);
}

export default App;
