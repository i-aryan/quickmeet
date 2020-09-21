const createButton = document.querySelector("#createroom");
const videoCont = document.querySelector('.video-self');
const codeCont = document.querySelector('#roomcode');
const joinBut = document.querySelector('#joinroom');
const mic = document.querySelector('#mic');
const cam = document.querySelector('#webcam');

let micAllowed = 1;
let camAllowed = 1;

let mediaConstraints = { video: true, audio: true };

navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then(localstream => {
        videoCont.srcObject = localstream;
    })

function uuidv4() {
    return 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const createroomtext = 'Creating Room...';

createButton.addEventListener('click', (e) => {
    e.preventDefault();
    createButton.disabled = true;
    createButton.innerHTML = 'Creating Room';
    createButton.classList = 'createroom-clicked';

    setInterval(() => {
        if (createButton.innerHTML < createroomtext) {
            createButton.innerHTML = createroomtext.substring(0, createButton.innerHTML.length + 1);
        }
        else {
            createButton.innerHTML = createroomtext.substring(0, createButton.innerHTML.length - 3);
        }
    }, 500);

    //const name = nameField.value;
    location.href = `/room.html?room=${uuidv4()}`;
});

joinBut.addEventListener('click', (e) => {
    e.preventDefault();
    if (codeCont.value.trim() == "") {
        codeCont.classList.add('roomcode-error');
        return;
    }
    const code = codeCont.value;
    location.href = `/room.html?room=${code}`;
})

codeCont.addEventListener('change', (e) => {
    e.preventDefault();
    if (codeCont.value.trim() !== "") {
        codeCont.classList.remove('roomcode-error');
        return;
    }
})

cam.addEventListener('click', () => {
    if (camAllowed) {
        mediaConstraints = { video: false, audio: micAllowed ? true : false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        cam.classList = "nodevice";
        cam.innerHTML = `<i class="fas fa-video-slash"></i>`;
        camAllowed = 0;
    }
    else {
        mediaConstraints = { video: true, audio: micAllowed ? true : false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        cam.classList = "device";
        cam.innerHTML = `<i class="fas fa-video"></i>`;
        camAllowed = 1;
    }
})

mic.addEventListener('click', () => {
    if (micAllowed) {
        mediaConstraints = { video: camAllowed ? true : false, audio: false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.classList = "nodevice";
        mic.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        micAllowed = 0;
    }
    else {
        mediaConstraints = { video: camAllowed ? true : false, audio: true };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.innerHTML = `<i class="fas fa-microphone"></i>`;
        mic.classList = "device";
        micAllowed = 1;
    }
})
