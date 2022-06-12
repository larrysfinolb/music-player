const arrayMusic = [
	{
		name: 'Guaya Guaya',
		path: './assets/music/guaya-guaya.mp3',
		like: false,
		comments: [],
	},
	{
		name: 'La Tóxica',
		path: './assets/music/la-toxica.mp3',
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

// Iconos de Botones
const playButtonIcon = document.querySelector('#playButton span');
const volumeButtonIcon = document.querySelector('#volumeButton span');
const repeatButtonIcon = document.querySelector('#repeatButton span');

// Variables de control y utilidad
let idInterval;

// ---------- ---------- FUNCIONES DEL REPRODUCTOR ---------- ----------
const getMusic = () => {
	for (const key in arrayMusic) {
		let item = document.createElement('div');
		item.classList.add('player__item');

		item.innerHTML = `
            <span>${arrayMusic[key].name}</span>
			<div>
				<button class="player__btn" onclick="giveLike(${key})" id="btn_like${key}"><span class="icon icon--white-like"></span></button>
				<button class="player__btn" onclick="showComments(${key})"><span class="icon icon--comments"></span></button>
				<button class="player__btn" onclick="playMusic(${key})"><span class="icon icon--play"></span></button>
			</div>
		`;

		musicList.appendChild(item);
	}
};

// Función para mostrar la ventana de comentarios
const showComments = (key) => {
	commentsContainer.classList.add('player__comments-container--active');
	document.querySelector("#commentsContainer .player__comments-title").innerHTML = arrayMusic[key].name;

	document.querySelector("#commentsContainer .player__comments-form").innerHTML = `
		<input type="text" id="inputName" placeholder="Nombre" />
		<textarea id="inputComment" placeholder="Comentario"></textarea>
		<button onclick="commentMusic(${key})">Commentar</button>
	`;

	const comments = document.querySelector("#commentsContainer .player__comments");
	comments.innerHTML = "";
	for(const comment of arrayMusic[key].comments) {
		let newComment = document.createElement("div");
		newComment.classList.add("player__comment");
		
		newComment.innerHTML = `
			<span>${comment.name}</span>
			<span>${comment.comment}</span>
		`
		
		comments.appendChild(newComment);
	}
	
};
// Función para ocultar la ventana de los comentarios
const hideComments = ()=>{
	commentsContainer.classList.remove("player__comments-container--active");
}

// Función para cometar una canción
const commentMusic = (key) => {
	const inputName = document.querySelector("#inputName");
	const inputComment = document.querySelector("#inputComment");
	
	let name = inputName.value.trim();
	let comment = inputComment.value.trim();

	if (name !== '' && comment !== '') {
		arrayMusic[key].comments.push({name: name, comment: comment});
		inputName.value = '';
		inputComment.value = '';
	}

	const comments = document.querySelector("#commentsContainer .player__comments");
	comments.innerHTML = "";
	for(const comment of arrayMusic[key].comments) {
		let newComment = document.createElement("div");
		newComment.classList.add("player__comment");
		
		newComment.innerHTML = `
			<span>${comment.name}</span>
			<span>${comment.comment}</span>
		`
		
		comments.appendChild(newComment);
	}
};

// Función para seleccionar y reproducir una canción
const playMusic = (key) => {
	audio.src = arrayMusic[key].path;
	audio.play().then(() => {
		totalTime.innerHTML = convertSecondsToTime(audio.duration);
		clearInterval(idInterval);
		idInterval = setInterval(updateTimeAndProgressBar, 250);
	});
	playButtonIcon.classList.replace('icon--play', 'icon--pause');
};

// Función para dar like
const giveLike = (key) => {
	arrayMusic[key].like = !arrayMusic[key].like;
	// document.querySelector(`#btn_like${key} span`).classList.toggle('icon--white-like');
	document.querySelector(`#btn_like${key} span`).classList.toggle('icon--red-like');
};

// Función para actualizar el tiempo y la barra de reproducción
const updateTimeAndProgressBar = () => {
	currentTime.innerHTML = convertSecondsToTime(audio.currentTime);
	progressBar.value = (audio.currentTime * 100) / audio.duration;
};

// Función para mover la barra de progreso
const moveProgressBar = () => {
	audio.pause();
	clearInterval(idInterval);
};
// Función para reanudar el progreso de la musica
const reanudeProgress = () => {
	audio.currentTime = (audio.duration * progressBar.value) / 100;
	audio.play().then(() => {
		idInterval = setInterval(updateTimeAndProgressBar, 250);
	});
};

// Función para reproducir o pausar
const playOrPause = () => {
	if (audio.src !== '') {
		if (audio.paused || audio.ended) {
			audio.play().then(() => {
				clearInterval(idInterval);
				idInterval = setInterval(updateTimeAndProgressBar, 250);
			});
			playButtonIcon.classList.replace('icon--play', 'icon--pause');
		} else {
			audio.pause();
			clearInterval(idInterval);
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
