const selectMicroserviceNodeApi = async (params) => fetch(`/selavi/bitbucket/${params.stage}/${params.nodes[0]}`, { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export default selectMicroserviceNodeApi;
