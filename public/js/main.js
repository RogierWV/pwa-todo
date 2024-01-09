let items = [
    {title: "learn to PWA", done: false},
    {title: "go offline", done: false},
    {title: "get espresso", done: true}
]

const list = document.getElementById("todo");
items.forEach(item => {
    list.appendChild(createItem(item));
});

function createItem({title, done}) {
    let li = document.createElement("li")
    li.appendChild(document.createTextNode(title))
    if(done) li.classList.add("done");
    return li;
}