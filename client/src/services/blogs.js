import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = async() => {
  const response = await axios.get(baseUrl);
  return await response.data;
};

const create = async(newObj) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.post(baseUrl, newObj, config);
  return response.data;
};

const update = async(id, newObject) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.put(`${ baseUrl }/${id}`, newObject, config);
  return response.data;
};

const remove = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.delete(`${ baseUrl }/${id}`, config);
  return response.data;
};
//eslint import/no-anonymous-default-export
export default { getAll, create, update, remove, setToken };