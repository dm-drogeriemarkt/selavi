

export const fetchAvailableStagesApi = async () => fetch('/selavi/services/stages', { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export const loginApi = async () => fetch('selavi/user', { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export const fetchMicroservicesApi = async (stage) => fetch(`/selavi/services/${stage}`, { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});
