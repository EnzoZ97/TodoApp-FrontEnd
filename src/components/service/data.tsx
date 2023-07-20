export const getUsers = async () => {
    const url : string = `${process.env.REACT_APP_BACKEND_API}/api`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}