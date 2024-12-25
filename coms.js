
let LOCAL_MODE = true;
let endpoint = "https://zubatomic.com/projects/erudite/server.php";

async function getServerKey(key) {

  let data = await axios.get(`${endpoint}?key=${key}`, {
    transformResponse: (res) => {
      return res
    },
  });

  if (data.data === "N/A") {
    return null;
  } else {
    return JSON.parse(data.data);
  }

}

async function setServerKey(key, value) {
  try {
    await fetch(endpoint + '?key=' + key, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
  } catch (e) {
    console.error(e);
    alert("Changes not saved, there is no network connection :( Please reconnect and reload the site.");
  }
}
