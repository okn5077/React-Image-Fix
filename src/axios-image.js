import axios from 'axios'

const instance = axios.create({
    baseURL: "https://fix-image.firebaseio.com/"
})

export default instance;