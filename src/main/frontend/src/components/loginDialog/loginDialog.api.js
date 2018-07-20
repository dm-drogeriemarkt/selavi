const loginApi = async (options) => fetch('selavi/user', { credentials: 'same-origin', headers: {}, ...options }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export default loginApi;
