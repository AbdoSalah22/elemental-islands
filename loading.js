


// Loading Screen
const preloader = document.getElementById('preloader');
const appContainer = document.getElementById('app');

export function loadingScreen() {
    setTimeout(() => {
        preloader.style.display = 'none';
        appContainer.style.display = 'block';
        requestAnimationFrame(animate);
    }, 2000);
}
