const createButton = document.querySelector("#createroom");
const videoCont = document.querySelector('.video-self');

const mediaConstraints = { video: true};

navigator.mediaDevices.getUserMedia(mediaConstraints)
.then(localstream=>{
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
    createButton.innerHTML ='Creating Room';
    createButton.classList = 'createroom-clicked';

    setInterval(()=>{
        if(createButton.innerHTML < createroomtext){
            createButton.innerHTML = createroomtext.substring(0, createButton.innerHTML.length+1);
        }
        else{
            createButton.innerHTML = createroomtext.substring(0, createButton.innerHTML.length - 3);
        }
    }, 500);

    //const name = nameField.value;
    //location.href = `/room.html?name=${name}&room=${uuidv4()}`;
});

