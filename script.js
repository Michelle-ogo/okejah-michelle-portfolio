const toggle = document.querySelector(".menu");
const nav = document.querySelector(".nav");
if (toggle && nav)
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach((a) => {
  if (a.href === location.href) a.classList.add("active");
});
const form = document.querySelector("#contactForm");
if (form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    document.querySelector("#notice").textContent =
      "Thank you. This demo form does not send messages.";
    form.reset();
  });
const input = document.querySelector("#taskInput"),
  add = document.querySelector("#addTask"),
  list = document.querySelector("#taskList");
if (input && add && list) {
  let tasks = JSON.parse(localStorage.getItem("michelleTasks") || "[]"),
    filter = "all",
    editId = null;
  const save = () =>
    localStorage.setItem("michelleTasks", JSON.stringify(tasks));
  function render() {
    list.innerHTML = "";
    tasks
      .filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done))
      .forEach((t) => {
        const row = document.createElement("div");
        row.className = "task" + (t.done ? " done" : "");
        const c = document.createElement("input");
        c.type = "checkbox";
        c.checked = t.done;
        c.addEventListener("change", () => {
          t.done = c.checked;
          save();
          render();
        });
        const s = document.createElement("span");
        s.textContent = t.text;
        const e = document.createElement("button");
        e.textContent = "Edit";
        e.onclick = () => {
          input.value = t.text;
          editId = t.id;
          add.textContent = "Save";
        };
        const d = document.createElement("button");
        d.textContent = "Delete";
        d.onclick = () => {
          tasks = tasks.filter((x) => x.id !== t.id);
          save();
          render();
        };
        row.append(c, s, e, d);
        list.append(row);
      });
    if (!list.children.length) list.textContent = "No tasks here yet.";
  }
  function submit() {
    let v = input.value.trim();
    if (!v) return;
    if (editId !== null) {
      let t = tasks.find((x) => x.id === editId);
      if (t) t.text = v;
      editId = null;
      add.textContent = "Add task";
    } else tasks.unshift({ id: Date.now(), text: v, done: false });
    input.value = "";
    save();
    render();
  }
  add.onclick = submit;
  input.onkeydown = (e) => {
    if (e.key === "Enter") submit();
  };
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        document
          .querySelectorAll("[data-filter]")
          .forEach((x) => x.classList.toggle("active", x === b));
        render();
      }),
  );
  render();
}
