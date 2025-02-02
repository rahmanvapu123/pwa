export default function swDev() {
    let swUrl = `/sw.js`;
    navigator.serviceWorker.register(swUrl)
        .then((res) =>
            console.log('response: ', res))
        .catch((err) =>
            console.error(err))
}