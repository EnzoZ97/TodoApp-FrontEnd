export const getUsers = async () => {
    const url : string = 'todoapp-backend-production.up.railway.app/api';
    const response = await fetch(url);
    const data = await response.json();
    return data;
}