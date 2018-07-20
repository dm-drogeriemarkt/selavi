

export const fetchAvailableStagesApi = async () => fetch('/selavi/services/stages', { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export const loginApi = async () => fetch('URL', { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});

export const fetchMicroservicesApi = async () => fetch('URL', { credentials: 'same-origin', headers: {} }).then(response => {
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`${response.statusText}: ${response.status}`);
});
