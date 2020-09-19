const socket = io();

const myvideo = document.querySelector("#vd1");
// const video2 = document.querySelector("#vd2");
// const video3 = document.querySelector("#vd3");
// const video4 = document.querySelector("#vd4");
const roomid = params.get("room");
const username = params.get("name");
const chatRoom = document.querySelector('.chat-cont');
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');
const videoContainer = document.querySelector('#vcont');
//const roomIDtext = document.querySelector('.chatroom-id');

//roomIDtext.innerHTML = `Room Code: ${roomid}`;

const configuration = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }] }

const mediaConstraints = { video: true, audio: true };

let connections = {};

//Join the room

socket.emit("join room", roomid, username);

//for da css
socket.on('user count', count =>{
    if(count>1){
        videoContainer.className = 'video-cont';
    }
    else{
        videoContainer.className = 'video-cont-single';
    }
})

let peerConnection;

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            // Do nothing; this is the same as the user canceling the call.
            break;
        default:
            alert("Error opening your camera and/or microphone: " + e.message);
            break;
    }

}

// function handleICECandidateEvent(event) {
//     if (event.candidate) {
//         console.log('icecandidate fired');
//         socket.emit('new icecandidate', event.candidate, roomid);
//     }
// }


// function handleNegotiationNeededEvent() {

//     peerConnection.createOffer()
//         .then(function (offer) {
//             return peerConnection.setLocalDescription(offer);
//         })
//         .then(function () {

//             socket.emit('video-offer', peerConnection.localDescription, roomid);

//         })
//         .catch(reportError);
// }

// function handleTrackEvent(event) {

//     console.log('track event fired')
//     let newvideo = document.createElement('video');
//     newvideo.classList.add('video-dummy');
//     newvideo.autoplay = true;
//     newvideo.playsinline = true;
//     newvideo.srcObject = event.streams[0];

//     videoContainer.appendChild(newvideo);
//     //video2.srcObject = event.streams[0];

// }




// function createPeerConnection() {
//     peerConnection = new RTCPeerConnection(configuration);

//     peerConnection.onicecandidate = handleICECandidateEvent;
//     peerConnection.ontrack = handleTrackEvent;
//     peerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
//     // peerConnection.onremovetrack = handleRemoveTrackEvent;
//     // peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
//     // peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
//     // peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
// }

function reportError(e) {
    console.log(e);
    return;
}


function startCall() {

    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(localStream => {
            myvideo.srcObject = localStream;
            myvideo.muted = true;

            localStream.getTracks().forEach(track => {
                // peerConnection.addTrack(track, localStream);
                for (let key in connections)
                    connections[key].addTrack(track, localStream);
            })


        })
        .catch(handleGetUserMediaError);


}

function handleVideoOffer(offer, sid) {

    console.log('video offered recevied');

    //createPeerConnection();
    connections[sid] = new RTCPeerConnection(configuration);

    connections[sid].onicecandidate = function (event) {
        if (event.candidate) {
            console.log('icecandidate fired');
            socket.emit('new icecandidate', event.candidate, sid);
        }
    };

    connections[sid].ontrack = function (event) {

        if (!document.getElementById(sid)) {
            console.log('track event fired')
            let newvideo = document.createElement('video');
            newvideo.id = sid;
            newvideo.classList.add('video-dummy');
            newvideo.autoplay = true;
            newvideo.playsinline = true;
            newvideo.srcObject = event.streams[0];
            videoContainer.appendChild(newvideo);
        }
        //video2.srcObject = event.streams[0];

    };

    connections[sid].onremovetrack = function(event){
        if (document.getElementById(sid)) {
            document.getElementById(sid).remove();
        }
    };

    connections[sid].onnegotiationneeded = function () {

        connections[sid].createOffer()
            .then(function (offer) {
                return connections[sid].setLocalDescription(offer);
            })
            .then(function () {

                socket.emit('video-offer', connections[sid].localDescription, sid);

            })
            .catch(reportError);
    };

    let desc = new RTCSessionDescription(offer);

    connections[sid].setRemoteDescription(desc)
        .then(() => { return navigator.mediaDevices.getUserMedia(mediaConstraints) })
        .then((localStream) => {
            // myvideo.srcObject = localStream;
            // myvideo.muted = true;s
            localStream.getTracks().forEach(track => {
                connections[sid].addTrack(track, localStream);
                console.log('added local stream to peer')
            })
        })
        .then(() => {
            return connections[sid].createAnswer();
        })
        .then(answer => {
            return connections[sid].setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('video-answer', connections[sid].localDescription, sid);
        })
        .catch(handleGetUserMediaError);


}

function handleNewIceCandidate(candidate, sid) {
    console.log('new candidate recieved')
    var newcandidate = new RTCIceCandidate(candidate);

    connections[sid].addIceCandidate(newcandidate)
        .catch(reportError);
}

function handleVideoAnswer(answer, sid) {
    console.log('answered the offer')
    const ans = new RTCSessionDescription(answer);
    connections[sid].setRemoteDescription(ans);
}

socket.on('video-offer', handleVideoOffer);

socket.on('new icecandidate', handleNewIceCandidate);

socket.on('video-answer', handleVideoAnswer);


socket.on('join room', async (conc) => {
    if (conc) {
        await conc.forEach(sid => {
            connections[sid] = new RTCPeerConnection(configuration);

            connections[sid].onicecandidate = function (event) {
                if (event.candidate) {
                    console.log('icecandidate fired');
                    socket.emit('new icecandidate', event.candidate, sid);
                }
            };

            connections[sid].ontrack = function (event) {

                if (!document.getElementById(sid)) {
                    console.log('track event fired')
                    let newvideo = document.createElement('video');
                    newvideo.id = sid;
                    newvideo.classList.add('video-dummy');
                    newvideo.autoplay = true;
                    newvideo.playsinline = true;
                    newvideo.srcObject = event.streams[0];
                    videoContainer.appendChild(newvideo);
                }
                //video2.srcObject = event.streams[0];

            };

            connections[sid].onremovetrack = function(event){
                if (document.getElementById(sid)) {
                    document.getElementById(sid).remove();
                }
            }

            connections[sid].onnegotiationneeded = function () {

                connections[sid].createOffer()
                    .then(function (offer) {
                        return connections[sid].setLocalDescription(offer);
                    })
                    .then(function () {

                        socket.emit('video-offer', connections[sid].localDescription, sid);

                    })
                    .catch(reportError);
            };

        });

        console.log('added all sockets to connections');
        startCall();

    }
    else {
        console.log('wait for someone to join');
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localStream => {
                myvideo.srcObject = localStream;
                myvideo.muted = true;
            })
            .catch(handleGetUserMediaError);
    }
})

socket.on('remove peer', sid =>{
    if (document.getElementById(sid)) {
        document.getElementById(sid).remove();
    }

    delete connections[sid];
})
//Code for Room Chats go here.

sendButton.addEventListener('click', () => {
    const msg = messageField.value;
    messageField.value = '';
    socket.emit('message', msg, username, roomid);
})

messageField.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendButton.click();
    }
});

socket.on('message', (msg, sendername, time) => {
    chatRoom.scrollTop = chatRoom.scrollHeight * 2;
    chatRoom.innerHTML += `<div class="message">
    <div class="info">
        <div class="username">${sendername}</div>
        <div class="time">${time}</div>
    </div>
    <div class="content">
        ${msg}
    </div>
</div>`
});


