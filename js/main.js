// Arreglo de Musicas
const arrayMusic = [
	{
		name: '6 am',
		path: 'http://127.0.0.1:5500/assets/music/6-am.mp3',
		like: false,
		comments: [],
	},
	{
		name: '512',
		path: 'http://127.0.0.1:5500/assets/music/512.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Bombon',
		path: 'http://127.0.0.1:5500/assets/music/bombon.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Ella fuma',
		path: 'http://127.0.0.1:5500/assets/music/ella-fuma.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Envolver',
		path: 'http://127.0.0.1:5500/assets/music/envolver.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Guaya Guaya',
		path: 'http://127.0.0.1:5500/assets/music/guaya-guaya.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'La Toxica',
		path: 'http://127.0.0.1:5500/assets/music/la-toxica.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Sola Remix',
		path: 'http://127.0.0.1:5500/assets/music/sola-remix.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Suave Remix',
		path: 'http://127.0.0.1:5500/assets/music/suave-remix.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Suebete',
		path: 'http://127.0.0.1:5500/assets/music/subete.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'Titi me Pregunto',
		path: 'http://127.0.0.1:5500/assets/music/titi-me-pregunto.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'X Ultima Vez',
		path: 'http://127.0.0.1:5500/assets/music/x-ultima-vez.mp3',
		like: false,
		comments: [],
	},
];

// ---------- ---------- FUNCIONES DE UTILIDAD ---------- ----------
// Funcion formatear segundos a tiempo (Horas:Minutos:Segundos)
const convertSecondsToTime = (seconds) => {
	let h = Math.floor(seconds / 3600);
	let m = Math.floor((seconds - h * 3600) / 60);
	let s = Math.floor(seconds - h * 3600 - m * 60);

	m = m.toString().padStart(2, '0');
	s = s.toString().padStart(2, '0');

	let time = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
	return time;
};

// ---------- ---------- VARIABLES DEL REPRODUCTOR ---------- ----------
// Elementos del Reproductor
const musicList = document.querySelector('#musicList');
const commentsContainer = document.querySelector('#commentsContainer');
const progressBar = document.querySelector('#progressBar');
const currentTime = document.querySelector('#currentTime');
const totalCurrent = document.querySelector('#totalTime');
const audio = document.querySelector('#audio');
const volumeBar = document.querySelector('#volumeBar');
const playButton = document.querySelector('#playButton');

// Iconos de Botones
const playButtonIcon = document.querySelector('#playButton span');
const volumeButtonIcon = document.querySelector('#volumeButton span');
const repeatButtonIcon = document.querySelector('#repeatButton span');

// Variables de control y utilidad
let idInterval;
let currentKey;

// ---------- ---------- FUNCIONES DEL REPRODUCTOR ---------- ----------
// Funcion para obtener la lista de musicas
const getMusic = () => {
	for (const key in arrayMusic) {
		let item = document.createElement('div');
		item.classList.add('player__item');
		item.id = `item${key}`;

		item.innerHTML = `
            <span>${arrayMusic[key].name}</span>
			<div>
				<button class="player__btn player__btn--medium" onclick="giveLike(${key})" id="btn_like${key}"><span class="icon icon--white-like"></span></button>
				<button class="player__btn player__btn--medium" onclick="showComments(${key})"><span class="icon icon--comments"></span></button>
				<button class="player__btn player__btn--medium" onclick="playMusic(${key})"><span class="icon icon--play"></span></button>
			</div>
		`;

		musicList.appendChild(item);
	}
};

// Función para mostrar la ventana de comentarios
const showComments = (key) => {
	commentsContainer.classList.add('player__comments-container--active');
	document.querySelector(
		'#commentsContainer .player__comments-title'
	).innerHTML = `Comentarios de ${arrayMusic[key].name}`;

	document.querySelector('#commentsContainer .player__comments-form').innerHTML = `
		<input type="text" id="inputName" class="player__input" placeholder="Nombre" />
		<textarea id="inputComment" class="player__input" placeholder="Comentario"></textarea>
		<button class="player__btn player__btn--form" onclick="commentMusic(${key})">Comentar</button>
	`;

	const comments = document.querySelector('#commentsContainer .player__comments');
	comments.innerHTML = '';
	for (const comment of arrayMusic[key].comments) {
		let newComment = document.createElement('div');
		newComment.classList.add('player__comment');

		newComment.innerHTML = `
			<span>${comment.name}</span>
			<span>${comment.comment}</span>
		`;

		comments.appendChild(newComment);
	}
};
// Función para ocultar la ventana de los comentarios
const hideComments = () => {
	commentsContainer.classList.remove('player__comments-container--active');
};

// Función para cometar una canción
const commentMusic = (key) => {
	const inputName = document.querySelector('#inputName');
	const inputComment = document.querySelector('#inputComment');

	let name = inputName.value.trim();
	let comment = inputComment.value.trim();

	if (name !== '' && comment !== '') {
		arrayMusic[key].comments.push({ name: name, comment: comment });
		inputName.value = '';
		inputComment.value = '';
	}

	const comments = document.querySelector('#commentsContainer .player__comments');
	comments.innerHTML = '';
	for (const comment of arrayMusic[key].comments) {
		let newComment = document.createElement('div');
		newComment.classList.add('player__comment');

		newComment.innerHTML = `
			<span>${comment.name}</span>
			<span>${comment.comment}</span>
		`;

		comments.appendChild(newComment);
	}
};

// Función para seleccionar y reproducir una canción
const playMusic = (key) => {
	audio.src = arrayMusic[key].path;
	audio
		.play()
		.then(() => {
			totalTime.innerHTML = convertSecondsToTime(audio.duration);
			clearInterval(idInterval);
			idInterval = setInterval(updateTimeAndProgressBar, 250);
		})
		.catch((error) => {
			console.log(error);
		});

	if (currentKey !== undefined) document.querySelector(`#item${currentKey}`).classList.remove('player__item--active');
	currentKey = key;
	document.querySelector(`#item${key}`).classList.add('player__item--active');

	playButton.classList.add('player__btn--active');
	playButtonIcon.classList.replace('icon--play', 'icon--pause');
};

// Función para dar like
const giveLike = (key) => {
	arrayMusic[key].like = !arrayMusic[key].like;
	document.querySelector(`#btn_like${key} span`).classList.toggle('icon--red-like');
};

// Función para actualizar el tiempo y la barra de reproducción
const updateTimeAndProgressBar = () => {
	currentTime.innerHTML = convertSecondsToTime(audio.currentTime);
	let value = (audio.currentTime * 100) / audio.duration;
	progressBar.value = value >= 0 ? value : 0;
};

// Función para mover la barra de progreso
const moveProgressBar = () => {
	if (audio.src !== '') {
		audio.pause();
		clearInterval(idInterval);
	}
};
// Función para reanudar el progreso de la musica
const reanudeProgress = () => {
	if (audio.src !== '') {
		audio.currentTime = (audio.duration * progressBar.value) / 100;
		audio
			.play()
			.then(() => {
				idInterval = setInterval(updateTimeAndProgressBar, 250);
			})
			.catch((error) => {
				console.log(error);
			});
	}
};

// Función para reproducir o pausar
const playOrPause = () => {
	if (audio.src !== '') {
		if (audio.paused || audio.ended) {
			audio
				.play()
				.then(() => {
					clearInterval(idInterval);
					idInterval = setInterval(updateTimeAndProgressBar, 250);
				})
				.catch((error) => {
					console.log(error);
				});
			playButton.classList.add('player__btn--active');
			playButtonIcon.classList.replace('icon--play', 'icon--pause');
		} else {
			audio.pause();
			clearInterval(idInterval);
			playButton.classList.remove('player__btn--active');
			playButtonIcon.classList.replace('icon--pause', 'icon--play');
		}
	}
};

// Función para activar la repetición o no de canción.
const repeatOrNoRepeat = () => {
	if (audio.loop) {
		audio.loop = false;
		repeatButtonIcon.classList.replace('icon--repeat', 'icon--no-repeat');
	} else {
		audio.loop = true;
		repeatButtonIcon.classList.replace('icon--no-repeat', 'icon--repeat');
	}
};

// Funcion para mostrar el Volumne
const showVolume = () => {
	volumeBar.classList.toggle('visible');
};

// Funcion para controlar el Volumn
const controlVolume = () => {
	audio.volume = volumeBar.value / 100;
	if (audio.volume > 0) volumeButtonIcon.classList.replace('icon--mute-volume', 'icon--volume');
	else volumeButtonIcon.classList.replace('icon--volume', 'icon--mute-volume');
};

// Función para cambiar de musica
const changeMusic = (change, isButton) => {
	if (!audio.loop || isButton) {
		for (let i = 0; i < arrayMusic.length; i++) {
			if (audio.src === arrayMusic[i].path) {
				document.querySelector(`#item${currentKey}`).classList.remove('player__item--active');
				if (i + change === arrayMusic.length) {
					audio.src = arrayMusic[0].path;
					currentKey = 0;
					document.querySelector(`#item${currentKey}`).classList.add('player__item--active');
				} else if (i + change === -1) {
					audio.src = arrayMusic[arrayMusic.length - 1].path;
					currentKey = arrayMusic.length - 1;
					document.querySelector(`#item${currentKey}`).classList.add('player__item--active');
				} else {
					audio.src = arrayMusic[i + change].path;
					currentKey = i + change;
					document.querySelector(`#item${currentKey}`).classList.add('player__item--active');
				}
				playOrPause();
				break;
			}
		}
	}
};
