/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.tsx', './src/components/login/Login.tsx','./src/components/register/Register.tsx',
  './src/components/profile/Profile.tsx', './src/components/todo_list/Todo_List.tsx', './src/components/todo_list/list/List.tsx',
  './src/components/todo_list/notices/Notices.tsx', '/src/components/todo_list/Navbar/Navbar.tsx', 
  './src/components/path_error/Path_error.tsx'],
  theme: {
    extend: {},
  },
  plugins: [],
}

