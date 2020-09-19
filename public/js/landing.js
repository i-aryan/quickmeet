const createButton = document.querySelector("#createroom");
const nameField = document.querySelector("#username");

function uuidv4() {
    return 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

createButton.addEventListener('click', (e) => {
    e.preventDefault();
    const name = nameField.value;
    location.href = `/room.html?name=${name}&room=${uuidv4()}`;
});
