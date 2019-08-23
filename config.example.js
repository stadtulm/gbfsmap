TITLE = "camp gbfs"
SYSTEM_URL = "http://localhost:8000"
API_ROOT = SYSTEM_URL + "/api"
GBFS_URL = SYSTEM_URL + "/gbfs/gbfs.json"
AUTH_USER = SYSTEM_URL + "/rest-auth/user/"
AUTH_LOGIN = SYSTEM_URL + "/auth/{provider}/login/"

AUTH_PROVIDER = [
  {
    id: 'github',
    name: 'GitHub',
    icon: require("./img/octocat.jpg"),
  },
  {
    id: 'stackexchange',
    name: 'StackOverflow',
    icon: require("./img/so-icon.png"),
  },
  {
    id: 'fragdenstaat',
    name: 'FragDenStaat.de',
    icon: require("./img/fds-icon.png"),
  },
]
