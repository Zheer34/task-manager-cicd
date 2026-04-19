const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [
	{ id: 1, title: "Learn Jenkins", completed: false },
	{ id: 2, title: "Build Docker image", completed: false },
];

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.get("/tasks", (req, res) => {
	res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
	const { title, completed } = req.body;

	if (!title || title.trim() === "") {
		return res.status(400).json({ error: "Title is required" });
	}

	const newTask = {
		id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
		title,
		completed: completed ?? false,
	};

	tasks.push(newTask);
	res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
	const taskId = parseInt(req.params.id, 10);
	const taskIndex = tasks.findIndex((task) => task.id === taskId);

	if (taskIndex === -1) {
		return res.status(404).json({ error: "Task not found" });
	}

	const deletedTask = tasks.splice(taskIndex, 1);
	res.status(200).json(deletedTask[0]);
});

if (require.main === module) {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

module.exports = app;
