import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Profile from './components/profile/Profile';
import Todo_List from './components/todo_list/Todo_List';
import Path_error from './components/path_error/Path_error';

import './App.css';

function App() {
  return (
    <div className="w-full h-full flex justify-center bg-slate-300">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Todo_list" element={<Todo_List />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Register" element={<Register />} />
          <Route path="*" element={<Path_error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
